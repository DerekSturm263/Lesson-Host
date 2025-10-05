'use client'

import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX } from 'react';
import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { verifyCodespace } from './generate';
import { saveSkillLearn, createSkill, createProject, createCourse } from './database';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import ky from 'ky';
import * as functions from '../lib/functions';
import * as types from '../lib/types';
import * as helpers from '../lib/helpers';

import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Backdrop from '@mui/material/Backdrop';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuComponent from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';

import Refresh from '@mui/icons-material/Refresh';
import VolumeUp from '@mui/icons-material/VolumeUp';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Menu from '@mui/icons-material/Menu';
import CheckCircle from '@mui/icons-material/CheckCircle';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Create from '@mui/icons-material/Create';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Delete from '@mui/icons-material/Delete';

export function Header({ title, mode, type }: { title: string, mode: types.ComponentMode, type: string }) {
  return (
    <Box
      sx={{ flexGrow: 1 }}
    >
      <AppBar
        position="static"
      >
        <Toolbar
          variant="dense"
        >
          <Typography
            variant="h2"
            sx={{ flexGrow: 1 }}
          >
            MySkillStudy.com
          </Typography>

          <Typography
            variant="h2"
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
          >
            <FormControl>
              <InputLabel id="type-label">Type</InputLabel>

              <Select
                labelId="type-label"
                value={type}
                label="Type"
              >
                <MenuItem value="Learn">Learn</MenuItem>
                <MenuItem value="Practice">Practice</MenuItem>
                <MenuItem value="Implement">Implement</MenuItem>
                <MenuItem value="Study">Study</MenuItem>
              </Select>
            </FormControl>
          
            <FormControl>
              <InputLabel id="mode-label">Mode</InputLabel>

              <Select
                labelId="mode-label"
                value={mode}
                label="Mode"
              >
                {Object.values(types.ComponentMode).map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <LinearProgress
                variant="determinate"
                value={0}
              />

              <Typography
                variant="body2"
              >
                {`${0}% Complete`}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export function Sidebar({ children, label }: { children?: React.ReactNode, label: string }) {
  const [ isOpen, setIsOpen ] = useState(true);

  return (
    <Drawer
      sx={{ width: '15vw', flexShrink: 0 }}
      variant="persistent"
      open={isOpen}
    >
      <Typography
        variant='h3'
      >
        {label}
      </Typography>

      <Divider />

      <List>
        {Children.map(children, child => 
          <Fragment>
            {child}
          </Fragment>
        )}
      </List>
    </Drawer>
  );
}

export function Element({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  return (
    <Stack
      id={`element${helpers.getAbsoluteIndex(elementID)}`}
      sx={{ flexGrow: 1 }}
    >
      <Interaction elementID={elementID} mode={mode} />
      <Text elementID={elementID} mode={mode} />
    </Stack>
  );
}

export function ChapterButton({ elementID, mode, removeChapter }: { elementID: types.ElementID, mode: types.ComponentMode, removeChapter: (index: number) => void }) {
  const [ title, setTitle ] = useState(helpers.getChapter(elementID).title);
  const [ state, setState ] = useState(helpers.getElement(elementID).state);

  useEffect(() => {
    functions.load({ learn: elementID.learn, chapterIndex: 0, elementIndex: 0, keys: elementID.keys });

    window.addEventListener(`updateChapter${elementID.chapterIndex}`, (e: Event) => {
      setState((e as CustomEvent).detail);
    });
  }, []);

  return (
    <ListItem
      secondaryAction={<CheckCircle />}
    >
      <ListItemButton
        id={`chapterButton${elementID.chapterIndex}`}
        className='chapterButton'
        title={`Load chapter ${elementID.chapterIndex + 1}`}
        onClick={(e) => functions.load(elementID)}
        disabled={state == types.ElementState.Locked}
        data-iscomplete="false"
        data-isselected="false"
      >
        {(mode == types.ComponentMode.Edit ? (
          <input
            type="text"
            name="chapterTitle"
            value={title}
            onInput={(e) => {
              setTitle(e.currentTarget.value);
              helpers.getChapter(elementID).title = e.currentTarget.value;
            }}
          />
        ) : (
          <ListItemText primary={title} />
        ))}

        {mode == types.ComponentMode.Edit && (
          <button
            onClick={(e) => {
              removeChapter(elementID.chapterIndex);
            }}
          >
            Delete
          </button>
        )}
      </ListItemButton>
    </ListItem>
  );
}

export function LearnPageContent({ slug, skill, mode, apiKey }: { slug: string, skill: types.Skill, mode: types.ComponentMode, apiKey: string }) {
  const [ chapters, setChapters ] = useState(skill.learn.chapters);

  function addChapter() {
    const newChapters = chapters;

    newChapters.push({
      title: "New Chapter",
      elements: [
        {
          type: types.ElementType.ShortAnswer,
          text: "New element",
          value: { correctAnswer: "" },
          state: types.ElementState.Complete
        }
      ]
    });
    setChapters(newChapters);

    skill.learn.chapters = newChapters;
  }

  function removeChapter(index: number) {
    const newChapters = chapters;
    
    chapters.splice(index, 1);
    setChapters(newChapters);

    skill.learn.chapters = newChapters;
  }

  if (mode == types.ComponentMode.View) {
    for (let i = 0; i < chapters.length; ++i) {
      for (let j = 0; j < chapters[i].elements.length; ++j) {
        if (i != 0 || j != 0) {
          chapters[i].elements[j].state = types.ElementState.Locked;
        }
      }
    }
  }

  return (
    <Box
      className="content"
    >
      <Sidebar
        label="Chapters"
      >
        {chapters.map((chapter, index) => (
          <ChapterButton
            key={index}
            elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ apiKey ] }}
            mode={mode}
            removeChapter={removeChapter}
          />
        ))}

        {mode == types.ComponentMode.Edit && (
          <button
            onClick={(e) => addChapter()}
          >
            New Chapter
          </button>
        )}

        {mode == types.ComponentMode.Edit && (
          <button
            onClick={async (e) => { 
              await saveSkillLearn(slug, skill.learn);
            }}
          >
            Save
          </button>
        )}
      </Sidebar>

      <Box
        sx={{ flexGrow: 1, height: '100vh' }}
      >
        {chapters.map((chapter, cIndex) => (
          chapter.elements.map((element, eIndex) => (
            <Element
              key={`${cIndex}:${eIndex}`}
              elementID={{ learn: skill.learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ apiKey ] }}
              mode={mode}
            />
          ))
        ))}
      </Box>
    </Box>
  );
}

function Interaction({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ type, setType ] = useState(helpers.getElement(elementID).type);
  const [ isDisabled, setIsDisabled ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

  function setTypeAndUpdate(type: types.ElementType) {
    setType(type);
    helpers.getElement(elementID).type = type;

    switch (type) {
      case types.ElementType.ShortAnswer:
        helpers.getElement(elementID).value = {
          correctAnswer: ""
        };
        break;
        
      case types.ElementType.MultipleChoice:
        helpers.getElement(elementID).value = {
          items: [],
          type: types.MultipleChoiceType.Radio,
          needsAllCorrect: false
        };
        break;
    }
  }

  const typeSwitcher = (
    <label>
      Type:

      <select
        name="selectType"
        value={type}
        onChange={(e) => setTypeAndUpdate(e.currentTarget.value as types.ElementType)}
      >
        {(Object.values(types.ElementType).map((item, index) => (
          <option
            key={index}
            value={item}
          >
            {item}
          </option>
        )))}
      </select>
    </label>
  );

  let interaction: JSX.Element = <></>;

  switch (type) {
    case types.ElementType.ShortAnswer:
      interaction = <ShortAnswer elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.MultipleChoice:
      interaction = <MultipleChoice elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.TrueOrFalse:
      interaction = <TrueOrFalse elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Matching:
      interaction = <Matching elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Ordering:
      interaction = <Ordering elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Files:
      interaction = <Files elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Drawing:
      interaction = <Drawing elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Graph:
      interaction = <Graph elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.DAW:
      interaction = <DAW elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Codespace:
      interaction = <Codespace elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.Engine:
      interaction = <Engine elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;

    case types.ElementType.IFrame:
      interaction = <IFrame elementID={elementID} isDisabled={isDisabled} mode={mode} />;
      break;
  }

  return (
    <Box
      data-type={type}
      sx={{ flexGrow: 1, height: '75h' }}
    >
      {mode == types.ComponentMode.Edit && typeSwitcher}

      {interaction}
    </Box>
  )
}

function ShortAnswer({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ correctAnswer, setCorrectAnswer ] = useState(helpers.getInteractionValue<types.ShortAnswer>(elementID).correctAnswer);

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      <form
        action={(e) => functions.submitShortAnswer(e, elementID)}
      >
        <input
          id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
          type="text"
          name="response"
          placeholder="Write your response here. Press enter to submit"
          autoComplete="off"
          disabled={isDisabled}
        />

        {mode == types.ComponentMode.Edit && (
          <label>
            Correct Answer:

            <input
              type="text"
              name="correctAnswer"
              autoComplete="off"
              disabled={isDisabled}
              value={correctAnswer}
              onInput={(e) => {
                setCorrectAnswer(e.currentTarget.value)
                helpers.getInteractionValue<types.ShortAnswer>(elementID).correctAnswer = e.currentTarget.value;
              }}
            />
          </label>
        )}
      </form>
    </Box>
  );
}

function MultipleChoice({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ type, setType ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).type);
  const [ needsAllCorrect, setNeedsAllCorrect ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).needsAllCorrect);

  const [ items, setItems ] = useState(helpers.getInteractionValue<types.MultipleChoice>(elementID).items);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  function addItem() {
    const newItems = items;
    newItems.push({
      value: "New Multiple Choice Item",
      isCorrect: false
    });
    setItems(newItems);
  }

  function removeItem(index: number) {
    const newItems = items;
    newItems.splice(index, 1);
    setItems(newItems);
  }

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
        action={(e) => functions.submitMultipleChoice(e, elementID)}
      >
        {items.map((item, index) => (
          <MultipleChoiceItem
            key={index}
            elementID={elementID}
            isDisabled={isDisabled}
            mode={mode}
            item={item}
            index={index}
            type={type}
          />
        ))}

        {mode == types.ComponentMode.Edit && (
          <label>
            Type:

            <select
              name="selectType"
              value={type}
              onChange={(e) => setType(e.currentTarget.value as types.MultipleChoiceType)}
            >
              {(Object.values(types.MultipleChoiceType).map((item, index) => (
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
        
        {mode == types.ComponentMode.Edit && (
          <label>
            Needs All Correct:

            <input
              type="checkbox"
              name="needsAllCorrect"
              id="needsAllCorrect"
              checked={needsAllCorrect}
              onInput={(e) => {
                setNeedsAllCorrect(e.currentTarget.checked);
                helpers.getInteractionValue<types.MultipleChoice>(elementID).needsAllCorrect = e.currentTarget.checked;
              }}
            />
          </label>
        )}

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </Box>
  );
}

function MultipleChoiceItem({ elementID, isDisabled, mode, item, index, type }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode, item: types.MultipleChoiceItem, index: number, type: types.MultipleChoiceType }) {
  const [ value, setValue ] = useState(item.value);
  const [ isCorrect, setIsCorrect ] = useState(item.isCorrect);

  return (
    <label>
      <input
        type={type}
        name="response"
        id={value}
        value={isCorrect.toString()}
        disabled={isDisabled}
      />

      {(mode == types.ComponentMode.Edit ? (
        <Box>
          <label>
            Is Correct:
            
            <input
              type="checkbox"
              name="isCorrect"
              checked={isCorrect}
              onInput={(e) => {
                setIsCorrect(e.currentTarget.checked);

                if (mode == types.ComponentMode.Edit) {
                  helpers.getInteractionValue<types.MultipleChoice>(elementID).items[index].isCorrect = e.currentTarget.checked;
                }
              }}
            />
          </label>
          
          <label>
            Value:

            <input
              type="text"
              name="value"
              value={value}
              onInput={(e) => {
                setValue(e.currentTarget.value);
                
                if (mode == types.ComponentMode.Edit) {
                  helpers.getInteractionValue<types.MultipleChoice>(elementID).items[index].value = e.currentTarget.value;
                }
              }}
            />
          </label>
        </Box>
      ) : (
        <Markdown>
          {value}
        </Markdown>
      ))}
    </label>
  );
}

function TrueOrFalse({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ isCorrect, setIsCorrect ] = useState(helpers.getInteractionValue<types.TrueOrFalse>(elementID).isCorrect);

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      <form
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className='multipleOptions'
        action={(e) => functions.submitTrueOrFalse(e, elementID)}
      >
        <label>
          <input
            type="radio"
            name="response"
            id="true"
            value="true"
            disabled={isDisabled}
            checked={mode == types.ComponentMode.Edit && isCorrect}
            onChange={(e) => {
              setIsCorrect(true);

              if (mode == types.ComponentMode.Edit) {
                helpers.getInteractionValue<types.TrueOrFalse>(elementID).isCorrect = true;
              }
            }}
          />

          True
        </label>

        <label>
          <input
            type="radio"
            name="response"
            id="false"
            value="false"
            disabled={isDisabled}
            checked={mode == types.ComponentMode.Edit && !isCorrect}
            onChange={(e) => {
              setIsCorrect(false);
              
              if (mode == types.ComponentMode.Edit) {
                helpers.getInteractionValue<types.TrueOrFalse>(elementID).isCorrect = false;
              }
            }}
          />

          False
        </label>

        <input
          type="submit"
          name="submit"
          disabled={isDisabled}
        />
      </form>
    </Box>
  );
}

function Matching({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<types.Matching>(elementID).items);
  
  //const shuffledItemsLeft = useState(items.map(item => item.leftSide).sort(item => Math.random() - 0.5))[0];
  //const shuffledItemsRight = useState(items.map(item => item.rightSide).sort(item => Math.random() - 0.5))[0];
  
  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      {/*<Reorder>
        {shuffledItemsLeft.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>

      <Reorder>
        {shuffledItemsRight.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>*/}
    </Box>
  );
}

function Ordering({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ items, setItems ] = useState(helpers.getInteractionValue<types.Ordering>(elementID).correctOrder);

  /*if (mode != types.ComponentMode.Edit) {
    setItems(items.sort(item => Math.random() - 0.5));
  }*/

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      {/*<Reorder>
        {items.map((item, index) => (
          <li
            key={index}
          >
            {item}
          </li>
        ))}
      </Reorder>*/}
    </Box>
  );
}

function Files({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ files, setFiles ] = useState(helpers.getInteractionValue<types.Files>(elementID).files);

  function addFile() {
    const newFiles = files;
    newFiles.push({
      source: "",
      isDownloadable: false
    });
    setFiles(newFiles);
  }

  function removeFile(index: number) {
    const newFiles = files;
    newFiles.splice(index, 1);
    setFiles(newFiles);
  }

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      {files.map((item, index) => (
        <FileItem
          key={index}
          elementID={elementID}
          isDisabled={isDisabled}
          mode={mode}
          item={item}
          index={index}
        />
      ))}
    </Box>
  );
}

function FileItem({ elementID, isDisabled, mode, item, index }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode, item: types.File, index: number }) {
  const [ source, setSource ] = useState(item.source);
  const [ isDownloadable, setIsDownloadable ] = useState(item.isDownloadable);
  
  const fileType = source.substring(source.length - 3) == "png" ? ("png") :
  source.substring(source.length - 3) == "mp4" ? ("mp4") :
  source.substring(source.length - 3) == "mp3" ? ("mp3") : "other";

  switch (fileType) {
    case "png":
      return (
        <Image
          src={item.source}
          alt={item.source}
        />
      );

    case "mp4":
      return (
        <video
          src={item.source}
          controls
        ></video>
      );

    case "mp3":
      return (
        <audio
          src={item.source}
          controls
        ></audio>
      );

    case "other":
      return (
        <></>
      );
  }
}

function Drawing({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      
    </Box>
  );
}

function Graph({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
      onLoad={(e) => functions.loadGraph(elementID)}
    ></Box>
  );
}

function DAW({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      
    </Box>
  );
}

function unsimplify(file: types.CodespaceFile) {
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

function Codespace({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ language, setLanguage ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).language);
  const [ content, setContent ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).content);
  const [ isSimplified, setIsSimplified ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).isSimplified);
  const [ correctOutput, setCorrectOutput ] = useState(helpers.getInteractionValue<types.Codespace>(elementID).correctOutput);
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
    }).json() as types.CodeResult;

    const output = `${response.stdout ?? ''}\n${response.stderr ?? ''}`;
    setOutput(output.trim() == '' ? 'Program did not output anything' : output);

    const feedback = await verifyCodespace(helpers.getElement(elementID).text, content, response, helpers.getInteractionValue<types.Codespace>(elementID));
    helpers.setText(elementID, feedback.feedback);
    helpers.setThinking(elementID, false);

    functions.readAloud(elementID);

    if (feedback.isValid) {
      functions.complete(elementID);
    }
  }

  return (
    <Stack
      sx={{ flexGrow: 1, height: '75vh' }}
      direction='row'
    >
      {mode == types.ComponentMode.Edit && (
        <label>
          Language:

          <select
            name="selectType"
            value={language}
            onChange={(e) => {
              setLanguage(e.currentTarget.value as types.CodespaceLanguage);
              helpers.getInteractionValue<types.Codespace>(elementID).language = e.currentTarget.value as types.CodespaceLanguage;
            }}
          >
            {(Object.values(types.CodespaceLanguage).map((item, index) => (
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

      {mode == types.ComponentMode.Edit && (
        <label>
          Is Simplified:

          <input
            type="checkbox"
            name="isSimplified"
            id="isSimplified"
            checked={isSimplified}
            onInput={(e) => {
              setIsSimplified(e.currentTarget.checked);
              helpers.getInteractionValue<types.Codespace>(elementID).isSimplified = e.currentTarget.checked;
            }}
          />
        </label>
      )}

      <Box
        sx={{ flexGrow: 1, width: '70%' }}
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

            if (mode == types.ComponentMode.Edit) {
              helpers.getInteractionValue<types.Codespace>(elementID).content[tabIndex].content = e ?? '';
            }
          }}
        />
      </Box>

      <Box
        sx={{ flexGrow: 1, width: '30%' }}
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

        <p>
          {output}
        </p>
      </Box>

      
      {mode == types.ComponentMode.Edit && (
        <label>
          Correct Output:

          <textarea
            name="correctOutput"
            value={correctOutput}
            rows={20}
            cols={30}
            onChange={(e) => {
              setCorrectOutput(e.currentTarget.value);
              helpers.getInteractionValue<types.Codespace>(elementID).correctOutput = e.currentTarget.value;
            }}
          />
        </label>
      )}
    </Stack>
  );
}

function Engine({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <iframe
      className="fullscreenInteraction"
      src="https://editor.godotengine.org/releases/latest/"
    ></iframe>
  );
}

function IFrame({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ source, setSource ] = useState(helpers.getInteractionValue<types.IFrame>(elementID).source);

  return (
    <Box
      sx={{ flexGrow: 1, height: '75vh' }}
    >
      <iframe
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className="fullscreenInteraction"
        src={source}
      ></iframe>

      {mode == types.ComponentMode.Edit && (
        <label>
          Source:

          <input
            type="text"
            name="source"
            autoComplete="off"
            disabled={isDisabled}
            value={source}
            onInput={(e) => {
              setSource(e.currentTarget.value);
              helpers.getInteractionValue<types.IFrame>(elementID).source = e.currentTarget.value;
            }}
          />
        </label>
      )}
    </Box>
  );
}

let globalIndex = 0;

function Text({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ text, setText ] = useState(helpers.getElement(elementID).text);
  const [ elements, setElements ] = useState(helpers.getChapter(elementID).elements);
  const [ isThinking, setIsThinking ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateText${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setText((e as CustomEvent).detail);
    });
    
    window.addEventListener(`updateThinking${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsThinking((e as CustomEvent).detail);
    });
  }, []);

  function addElement() {
    const newElements = elements;
    newElements.push({
      type: types.ElementType.ShortAnswer,
      text: "New element",
      value: { correctAnswer: "" },
      state: types.ElementState.Complete
    });
    setElements(newElements);
  }

  function removeElement(index: number) {
    const newElements = elements;
    newElements.splice(index, 1);
    setElements(newElements);
  }

  globalIndex = 0;

  return (
    <Card
      id={`text${helpers.getAbsoluteIndex(elementID)}`}
      sx={{ flexGrow: 1, height: '25h' }}
    >
      <CardContent
        style={{ overflowY: 'auto' }}
      >
        {isThinking && <LinearProgress />}

        {(mode == types.ComponentMode.Edit ? (
          <TextField
            label="Text"
            multiline
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value);
              helpers.getElement(elementID).text = e.currentTarget.value;
            }}
          />
        ) : (
          <Markdown
            /*components={{
              strong({ node, children }) {
                return <strong><WordWrapper text={String(children)} /></strong>
              },
              i({ node, children }) {
                return <i><WordWrapper text={String(children)} /></i>
              },
              p({ node, children }) {
                return <WordWrapper text={String(children)} />
              },
              li({ node, children }) {
                return <li><WordWrapper text={String(children)} /></li>
              },
              code({ node, children }) {
                return <code><WordWrapper text={String(children)} /></code>
              }
            }}*/
          >
            {isThinking ? "Thinking..." : text}
          </Markdown>
        ))}
      </CardContent>

      <CardActions>
        <Pagination
          count={elements.length}
          onChange={(e, value) => functions.load({ learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: value, keys: elementID.keys })}
        />

        <Stack
          direction="row"
          spacing={1}
        >
          <Chip
            icon={<AutoAwesome />}
            label="Rephrase"
            onClick={(e) => functions.rephrase(elementID)}
          />

          <Chip
            icon={<VolumeUp />}
            label="Read Aloud"
            onClick={(e) => functions.readAloud(elementID)}
          />

          <Chip
            icon={<Refresh />}
            label="Reset"
            onClick={(e) => functions.reset(elementID)}
          />

          <Chip
            icon={<Fullscreen />}
            label="Fullscreen"
            onClick={(e) => {}}
          />

          {mode == types.ComponentMode.Edit && (
            <Chip
              icon={<Delete />}
              label="Delete"
              onClick={(e) => removeElement(elementID.elementIndex)}
            />
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}

function WordWrapper({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <span
          key={i}
          className="word"
          onDoubleClick={(e) => functions.define(word)}
          title="Double click to define this word"
          style={{"--index": `${globalIndex++ / 8}s`} as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </>
  );
}

export function CreateSkillButton() {
  return (
    <button
      onClick={async (e) => {
        const newSkill = await createSkill();
        window.open(`https://www.myskillstudy.com/learn/skills/${newSkill[1]}?mode=edit`);
      }}
    >
      Skill
    </button>
  );
}

export function CreateProjectButton() {
  return (
    <button
      onClick={async (e) => {
        const newProject = await createProject();
        window.open(`https://www.myskillstudy.com/learn/projects/${newProject[1]}?mode=edit`);
      }}
    >
      Project
    </button>
  );
}

export function CreateCourseButton() {
  return (
    <button
      onClick={async (e) => {
        const newCourse = await createCourse();
        window.open(`https://www.myskillstudy.com/learn/courses/${newCourse[1]}?mode=edit`);
      }}
    >
      Course
    </button>
  );
}

export function SkillTitle({ skill, mode }: { skill: types.Skill, mode: types.ComponentMode }) {
  const [ title, setTitle ] = useState(skill.title);

  const header = (
    <h1
      className="mainHeader"
    >
      {title}
    </h1>
  );

  const input = (
    <label>
      Title:

      <input
        type="text"
        name="title"
        autoComplete="off"
        value={title}
        onInput={(e) => {
          setTitle(e.currentTarget.value)
          skill.title = e.currentTarget.value;
        }}
      />
    </label>
  );

  return mode == types.ComponentMode.Edit ? input : header;
}

export function SkillDescription({ skill, mode }: { skill: types.Skill, mode: types.ComponentMode }) {
  const [ description, setDescription ] = useState(skill.description);
  
  const header = (
    <h1
      className="subHeader"
    >
      {description}
    </h1>
  );

  const input = (
    <label>
      Description:

      <input
        type="text"
        name="description"
        autoComplete="off"
        value={description}
        onInput={(e) => {
          setDescription(e.currentTarget.value)
          skill.description = e.currentTarget.value;
        }}
      />
    </label>
  );

  return mode == types.ComponentMode.Edit ? input : header;
}
