'use client'

import ky from 'ky';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import PlayArrow from '@mui/icons-material/PlayArrow';
import verify from './functions';
import { Editor } from '@monaco-editor/react';
import { ComponentMode, InteractionProps } from '@/app/lib/types';
import { useState } from 'react';
import { readAloud, complete } from '@/app/lib/functions';
import * as helpers from '@/app/lib/helpers';

enum CodespaceLanguage {
  Java = 'java',
  Python = 'python',
  C = 'c',
  CPP = 'cpp',
  NodeJS = 'nodejs',
  JavaScript = 'javascript',
  Groovy = 'groovy',
  JShell = 'jshell',
  Haskell = 'haskell',
  TCL = 'tcl',
  Lua = 'lua',
  Ada = 'ada',
  CommonLisp = 'commonlisp',
  D = 'd',
  Elixir = 'elixir',
  Erlang = 'erlang',
  FSharp = 'fsharp',
  Fortran = 'fortran',
  Assembly = 'assembly',
  Scala = 'scala',
  PHP = 'php',
  Python2 = 'python2',
  CSharp = 'csharp',
  Perl = 'perl',
  Ruby = 'ruby',
  Go = 'go',
  R = 'r',
  Racket = 'racket',
  OCaml = 'ocaml',
  VB = 'vb',
  Basic = 'basic',
  Bash = 'bash',
  Clojure = 'clojure',
  TypeScript = 'typescript',
  Cobol = 'cobol',
  Kotlin = 'kotlin',
  Pascal = 'pascal',
  Prolog = 'prolog',
  Rust = 'rust',
  Swift = 'swift',
  ObjectiveC = 'objectivec',
  Octave = 'octave',
  Text = 'text',
  BrainFK = 'brainfk',
  CoffeeScript = 'coffeescript',
  EJS = 'ejs',
  Dart = 'dart',
  Deno = 'deno',
  Bun = 'bun',
  MySQL = 'mysql',
  Oracle = 'oracle',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  SQLite = 'sqlite',
  Redis = 'redis',
  MariaDB = 'mariadb',
  PLSQL = 'plsql',
  SQLServer = 'sqlserver'
};

type Codespace = {
  language: CodespaceLanguage,
  content: CodespaceFile[],
  isSimplified: boolean,
  correctOutput: string | undefined
};

type CodespaceFile = {
  name: string,
  content: string
}

enum CodeStatus {
  Success = 'success',
  Failed = 'failed'
};

type CodeResult = {
  stdout: string | undefined,
  stderr: string | undefined,
  exception: string | undefined,
  executionTime: number,
  limitPerMonthRemaining: number,
  status: CodeStatus,
  error: string | undefined
};

export default function Codespace({ elementID, isDisabled, mode }: InteractionProps) {
  const [ language, setLanguage ] = useState(helpers.getInteractionValue<Codespace>(elementID).language);
  const [ content, setContent ] = useState(helpers.getInteractionValue<Codespace>(elementID).content);
  const [ isSimplified, setIsSimplified ] = useState(helpers.getInteractionValue<Codespace>(elementID).isSimplified);
  const [ correctOutput, setCorrectOutput ] = useState(helpers.getInteractionValue<Codespace>(elementID).correctOutput);
  const [ output, setOutput ] = useState("");
  const [ tabIndex, setTabIndex ] = useState(0);
  const file = content[tabIndex];

  async function executeCode() {
    setOutput("Running...");
    helpers.setThinking(elementID, true);

    const response = await ky.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
      headers: {
        'x-rapidapi-key': elementID.keys[0],
        'x-rapidapi-host': 'onecompiler-apis.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      json: {
        language: language,
        stdin: "",
        files: content.map(file => isSimplified ? unsimplify(file) : file)
      }
    }).json() as CodeResult;

    const output = `${response.stdout ?? ''}\n${response.stderr ?? ''}`;
    setOutput(output.trim() == '' ? 'Program did not output anything' : output);

    const feedback = await verify(helpers.getElement(elementID).text, content, response, helpers.getInteractionValue<Codespace>(elementID));
    helpers.setText(elementID, feedback.feedback);
    helpers.setThinking(elementID, false);

    readAloud(elementID);

    if (feedback.isValid) {
      complete(elementID);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
      direction='row'
    >
      {mode == ComponentMode.Edit && (
        <label>
          Language:

          <select
            name="selectType"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as CodespaceLanguage);
              helpers.getInteractionValue<Codespace>(elementID).language = e.target.value as CodespaceLanguage;
            }}
          >
            {(Object.values(CodespaceLanguage).map((item, index) => (
              <option
                key={index}
                value={item}
              >
                {item}
              </option>
            )))}
          </select>
        </label>
      )}

      {mode == ComponentMode.Edit && (
        <FormControlLabel label="Is Simplified" control={
          <Checkbox
            name="isSimplified"
            id="isSimplified"
            checked={isSimplified}
            onChange={(e) => {
              setIsSimplified(e.target.checked);
              helpers.getInteractionValue<Codespace>(elementID).isSimplified = e.target.checked;
            }}
          />}
        />
      )}

      <Stack
        sx={{ flexGrow: 1, width: '65%' }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, value) => { setTabIndex(value); }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {content.map((file, index) => (
            <Tab
              key={index}
              label={file.name}
            />
          ))}
        </Tabs>

        <Editor
          path={file.name}
          defaultLanguage={language}
          defaultValue={file.content}
          theme="vs-dark"
          onChange={(e) => {
            const newContent = content;
            newContent[tabIndex].content = e ?? '';
            setContent(newContent);

            if (mode == ComponentMode.Edit) {
              helpers.getInteractionValue<Codespace>(elementID).content[tabIndex].content = e ?? '';
            }
          }}
        />
      </Stack>

      <Box
        sx={{ flexGrow: 1 }}
      >
        <Stack
          direction="row"
          spacing={1}
        >
          <Typography
            variant="body1"
          >
            Press Run to execute your code. Any outputs or errors will be printed below
          </Typography>

          <Button
            startIcon={<PlayArrow />}
            onClick={executeCode}
          >
            Run
          </Button>
        </Stack>

        <Typography
          variant="body1"
        >
          {output}
        </Typography>
      </Box>

      
      {mode == ComponentMode.Edit && (
        <TextField
          label="Correct Output"
          name="correctOutput"
          value={correctOutput}
          multiline
          onChange={(e) => {
            setCorrectOutput(e.target.value);
            helpers.getInteractionValue<Codespace>(elementID).correctOutput = e.target.value;
          }}
        />
      )}
    </Stack>
  );
}

function unsimplify(file: CodespaceFile) {
  return {
    name: file.name,
    content: `using System;

    public class Program
    {
      public static void Main(string[] args)
      {
        ${file.content}
      }
    }`
  };
}
