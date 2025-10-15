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
import LinearProgress from '@mui/material/LinearProgress';
import PlayArrow from '@mui/icons-material/PlayArrow';
import verify, { CodeResult } from './functions';
import { Editor } from '@monaco-editor/react';
import { ComponentMode, InteractionPackage, InteractionProps } from '@/app/lib/types';
import { Fragment, useState } from 'react';
import { Type } from '@google/genai';
import * as helpers from '@/app/lib/helpers';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export type InteractionType = {
  language: CodespaceLanguage,
  content: CodespaceFile[],
  isSimplified: boolean,
  allowNewFiles: boolean,
  correctOutput: string | undefined
};

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

export type CodespaceFile = {
  name: string,
  content: string
}

const defaultValue: InteractionType = {
  language: CodespaceLanguage.JavaScript,
  content: [
    {
      name: 'Main.js',
      content: 'console.log("Hello, world!");'
    }
  ],
  isSimplified: false,
  allowNewFiles: false,
  correctOutput: undefined
}

const schema = {
  type: Type.OBJECT,
  properties: {
    language: {
      type: Type.STRING,
      enum: [
        "csharp",
        "javascript",
        "python",
        "c",
        "cpp",
        "java",
        "php",
        "html",
        "ruby",
        "react",
        "nodejs",
        "assembly",
        "lua",
        "haskell",
        "perl",
        "fortran",
        "go",
        "scala",
        "typescript",
        "swift",
        "rust",
        "kotlin",
        "cobol",
        "mysql",
        "jquery",
        "angular"
      ]
    },
    content: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING
          },
          content: {
            type: Type.STRING
          }
        },
        required: [
          "name",
          "content"
        ],
        propertyOrdering: [
          "name",
          "content"
        ]
      },
      minItems: 1
    },
    isSimplified: {
      type: Type.BOOLEAN
    },
    correctOutput: {
      type: Type.STRING
    }
  },
  required: [
    "language",
    "content",
    "isSimplified"
  ],
  propertyOrdering: [
    "language",
    "content",
    "isSimplified",
    "correctOutput"
  ]
};

function Component(props: InteractionProps) {
  const [ language, setLanguage ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).language);
  const [ content, setContent ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).content);
  const [ isSimplified, setIsSimplified ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).isSimplified);
  const [ correctOutput, setCorrectOutput ] = useState(helpers.getInteractionValue<InteractionType>(props.elementID).correctOutput);
  const [ output, setOutput ] = useState("");
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ isRunning, setIsRunning ] = useState(false);
  
  const file = content[tabIndex];

  async function submit() {
    setIsRunning(true);
    props.setIsThinking(true);

    const response = await ky.post('https://onecompiler-apis.p.rapidapi.com/api/v1/run', {
      headers: {
        'x-rapidapi-key': props.elementID.keys[0],
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
    setIsRunning(false);

    const feedback = await verify(helpers.getElement(props.elementID).text, content, response, helpers.getInteractionValue<InteractionType>(props.elementID));
    props.setText(feedback.feedback);
    props.setIsThinking(false);

    if (feedback.isValid) {
      props.setComplete(true);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1 }}
      direction='row'
    >
      {props.mode == ComponentMode.Edit && (
        <FormControl
          size="small"
        >
          <InputLabel id="mode-label">Language</InputLabel>

          <Select
            labelId="language-label"
            value={language}
            label="Language"
            onChange={(e) => {
              setLanguage(e.target.value as CodespaceLanguage);
              helpers.getInteractionValue<InteractionType>(props.elementID).language = e.target.value as CodespaceLanguage;
            }}
          >
            {(Object.values(CodespaceLanguage).map((item, index) => (
              <MenuItem
                value={item}
                key={index}
              >
                {item}
              </MenuItem>
            )))}
          </Select>
        </FormControl>
      )}

      {props.mode == ComponentMode.Edit && (
        <FormControlLabel label="Is Simplified" control={
          <Checkbox
            name="isSimplified"
            id="isSimplified"
            checked={isSimplified}
            onChange={(e) => {
              setIsSimplified(e.target.checked);
              helpers.getInteractionValue<InteractionType>(props.elementID).isSimplified = e.target.checked;
            }}
          />}
        />
      )}

      <Stack
        sx={{ flexGrow: 1, width: '60%' }}
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

            if (props.mode == ComponentMode.Edit) {
              helpers.getInteractionValue<InteractionType>(props.elementID).content[tabIndex].content = e ?? '';
            }
          }}
        />
      </Stack>

      <Box
        sx={{ flexGrow: 1 }}
      >
        {props.mode == ComponentMode.Edit ? (
          <TextField
            label="Correct Output"
            name="correctOutput"
            value={correctOutput}
            multiline
            onChange={(e) => {
              setCorrectOutput(e.target.value);
              helpers.getInteractionValue<InteractionType>(props.elementID).correctOutput = e.target.value;
            }}
          />
        ) : (
          <Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ height: '48px' }}
            >
              <Typography
                variant="body2"
                sx={{ textAlign: 'center', flexGrow: 1 }}
                style={{ margin: 'auto' }}
              >
                Press Run to execute your code
                <br />
                All output and errors will be printed below
              </Typography>

              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={submit}
                sx={{ width: '120px' }}
                disabled={isRunning}
              >
                Run
              </Button>
            </Stack>

            <Typography
              variant="body2"
              sx={{ margin: '16px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
            >
              {isRunning && (
                <Fragment>
                  <LinearProgress />
                  <br />
                </Fragment>
              )}

              {isRunning ? 'Running...' : output}
            </Typography>
          </Stack>
        )}
      </Box>
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

const interaction: InteractionPackage = {
  id: "codespace",
  prettyName: "Codespace",
  defaultValue: defaultValue,
  schema: schema,
  Component: Component
};

export default interaction;
