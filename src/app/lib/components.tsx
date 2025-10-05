'use client'

import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX, MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { verifyCodespace } from './generate';
import { saveSkillLearn, createSkill, createProject, createCourse } from './database';
import Image from 'next/image';
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
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
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
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Refresh from '@mui/icons-material/Refresh';
import VolumeUp from '@mui/icons-material/VolumeUp';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Menu from '@mui/icons-material/Menu';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Create from '@mui/icons-material/Create';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Delete from '@mui/icons-material/Delete';
import MoreVert from '@mui/icons-material/MoreVert';



// Core.

export function Header({ title, mode, type }: { title: string, mode: types.ComponentMode, type: string }) {
  const [ progress, setProgress ] = useState(0);

  useEffect(() => {
    window.addEventListener(`updateLessonProgress`, (e: Event) => {
      setProgress((e as CustomEvent).detail);
    });
  }, []);

  return (
    <Fragment>
      <AppBar
        position="sticky"
      >
        <Toolbar>
          <Typography
            variant="h6"
          >
            MySkillStudy.com
          </Typography>

          <Typography
            variant="h6"
          >
            {title}
          </Typography>

          {mode == types.ComponentMode.View && (
            <Box>
              <LinearProgressWithLabel
                variant="determinate"
                value={progress * 100}
              />
            </Box>
          )}

          <FormControl
            size="small"
          >
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
          
          <FormControl
            size="small"
          >
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

          {mode == types.ComponentMode.Edit && (
            <Button
              onClick={async (e) => { 
                //await saveSkillLearn(slug, skill.learn);
              }}
            >
              Save
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

export function Sidebar({ children, label }: { children?: React.ReactNode, label: string }) {
  const [ isOpen, setIsOpen ] = useState(true);

  return (
    <Drawer
      sx={{ width: '15vw' }}
      variant="persistent"
      open={isOpen}
    >
      <Typography
        variant='h6'
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

export function ChapterButton({ selected, elementID, mode, onClick, removeChapter }: { selected: boolean, elementID: types.ElementID, mode: types.ComponentMode, onClick: MouseEventHandler<HTMLDivElement> | undefined, removeChapter: (index: number) => void }) {
  const [ title, setTitle ] = useState(helpers.getChapter(elementID).title);
  const [ progress, setProgress ] = useState(0);

  useEffect(() => {
    window.addEventListener(`updateChapterProgress${elementID.chapterIndex}`, (e: Event) => {
      setProgress((e as CustomEvent).detail);
    });
  }, []);

  return (
    <ListItem
      secondaryAction={ mode == types.ComponentMode.Edit ? <IconButton><MoreVert /></IconButton> : <Fragment></Fragment> }
    >
      <ListItemButton
        disabled={helpers.getChapterProgress({ learn: elementID.learn, chapterIndex: elementID.chapterIndex - 1, elementIndex: 0, keys: elementID.keys }) < 1}
        selected={selected}
        onClick={onClick}
      >
        <ListItemText
          primary={title}
          secondary={mode == types.ComponentMode.View ? <LinearProgress variant="determinate" value={progress * 100} /> : <Fragment></Fragment> }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function LearnPageContent({ slug, skill, mode, apiKey }: { slug: string, skill: types.Skill, mode: types.ComponentMode, apiKey: string }) {
  const [ chapters, setChapters ] = useState(skill.learn.chapters);
  const [ currentChapter, setCurrentChapter ] = useState(0);
  const [ currentElement, setCurrentElement ] = useState(0);
  const [ canTravel, setCanTravel ] = useState(true);

  function addChapter() {
    const newChapters = chapters;

    newChapters.push({
      title: "New Chapter",
      elements: [
        {
          type: types.ElementType.ShortAnswer,
          text: "New element",
          value: { correctAnswer: "" },
          isComplete: true
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

  for (let i = 0; i < chapters.length; ++i) {
    for (let j = 0; j < chapters[i].elements.length; ++j) {
      chapters[i].elements[j].isComplete = mode != types.ComponentMode.View;
    }
  }

  const thisElement = { learn: skill.learn, chapterIndex: currentChapter, elementIndex: currentElement, keys: [ apiKey ] };
  const [ elements, setElements ] = useState(helpers.getChapter(thisElement).elements);

  function addElement() {
    const newElements = elements;
    newElements.push({
      type: types.ElementType.ShortAnswer,
      text: "New element",
      value: { correctAnswer: "" },
      isComplete: true
    });
    setElements(newElements);
  }

  function removeElement(index: number) {
    const newElements = elements;
    newElements.splice(index, 1);
    setElements(newElements);
  }

  useEffect(() => {
    window.addEventListener(`updatePagination`, (e: Event) => {
      setCanTravel((e as CustomEvent).detail);
    });
  }, []);

  return (
    <Stack
      direction='row'
      sx={{ flexGrow: 1, width: '100vw' }}
    >
      <Sidebar
        label="Chapters"
      >
        {chapters.map((chapter, index) => (
          <ChapterButton
            selected={currentChapter == index}
            key={index}
            elementID={{ learn: skill.learn, chapterIndex: index, elementIndex: 0, keys: [ apiKey ] }}
            mode={mode}
            removeChapter={removeChapter}
            onClick={(e) => {
              setCurrentChapter(index);
              setCurrentElement(0);
            }}
          />
        ))}

        {mode == types.ComponentMode.Edit && (
          <Button
            onClick={(e) => addChapter()}
          >
            New Chapter
          </Button>
        )}
      </Sidebar>

      <Stack
        sx={{ flexGrow: 1, height: '100%' }}
      >
        <Interaction
          elementID={thisElement}
          mode={mode}
        />
      
        <Text
          elementID={thisElement}
          mode={mode}
        />
      
        <Pagination
          count={skill.learn.chapters[currentChapter].elements.length}
          page={currentElement + 1}
          disabled={!canTravel}
          onChange={(e, value) => setCurrentElement(value - 1)}
        />
        
        {mode == types.ComponentMode.Edit && (
          <Tooltip title="Delete this element">
            <Chip
              icon={<Delete />}
              label="Delete"
              onClick={(e) => removeElement(thisElement.elementIndex)}
            />
          </Tooltip>
        )}
      </Stack>
    </Stack>
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
    <FormControl
      size="small"
    >
      <InputLabel id="type-label">Type</InputLabel>

      <Select
        labelId="type-label"
        value={type}
        label="Type"
        onChange={(e) => setTypeAndUpdate(e.target.value as types.ElementType)}
      >
        {(Object.values(types.ElementType).map((item, index) => (
          <MenuItem
            key={index}
            value={item}
          >
            {item}
          </MenuItem>
        )))}
      </Select>
    </FormControl>
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



// Interactions.

function ShortAnswer({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  const [ correctAnswer, setCorrectAnswer ] = useState(helpers.getInteractionValue<types.ShortAnswer>(elementID).correctAnswer);

  return (
    <Box
      sx={{ flexGrow: 1, height: '70vh' }}
    >
      <TextField
        label="Write your response here. Press enter to submit"
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        name="response"
        autoComplete="off"
        disabled={isDisabled}
        onSubmit={(e) => functions.submitShortAnswer(e, elementID)}
      />

      <Button>
        Submit
      </Button>

      {mode == types.ComponentMode.Edit && (
        <TextField
          label="Correct Answer"
          name="correctAnswer"
          autoComplete="off"
          disabled={isDisabled}
          value={correctAnswer}
          onChange={(e) => {
            setCorrectAnswer(e.target.value)
            helpers.getInteractionValue<types.ShortAnswer>(elementID).correctAnswer = e.target.value;
          }}
        />
      )}
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
      sx={{ flexGrow: 1, height: '70vh' }}
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
              onChange={(e) => setType(e.target.value as types.MultipleChoiceType)}
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
          <FormControlLabel label="Needs All Correct" control={
            <Checkbox
              name="needsAllCorrect"
              id="needsAllCorrect"
              checked={needsAllCorrect}
              onChange={(e) => {
                setNeedsAllCorrect(e.target.checked);
                helpers.getInteractionValue<types.MultipleChoice>(elementID).needsAllCorrect = e.target.checked;
              }}
            />}
          />
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
          <FormControlLabel label="Is Correct" control={
            <Checkbox
              name="isCorrect"
              checked={isCorrect}
              onChange={(e) => {
                setIsCorrect(e.target.checked);

                if (mode == types.ComponentMode.Edit) {
                  helpers.getInteractionValue<types.MultipleChoice>(elementID).items[index].isCorrect = e.target.checked;
                }
              }}
            />}
          />
          
          <TextField
            label="Value"
            name="value"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              
              if (mode == types.ComponentMode.Edit) {
                helpers.getInteractionValue<types.MultipleChoice>(elementID).items[index].value = e.target.value;
              }
            }}
          />
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
      sx={{ flexGrow: 1, height: '70vh' }}
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
      sx={{ flexGrow: 1, height: '70vh' }}
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
      sx={{ flexGrow: 1, height: '70vh' }}
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
      sx={{ flexGrow: 1, height: '70vh' }}
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
      sx={{ flexGrow: 1, height: '70vh' }}
    >
      
    </Box>
  );
}

function Graph({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <Box
      sx={{ flexGrow: 1, height: '70vh' }}
      onLoad={(e) => functions.loadGraph(elementID)}
    ></Box>
  );
}

function DAW({ elementID, isDisabled, mode }: { elementID: types.ElementID, isDisabled: boolean, mode: types.ComponentMode }) {
  return (
    <Box
      sx={{ flexGrow: 1, height: '70vh' }}
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
      sx={{ flexGrow: 1, height: '70vh' }}
      direction='row'
    >
      {mode == types.ComponentMode.Edit && (
        <label>
          Language:

          <select
            name="selectType"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as types.CodespaceLanguage);
              helpers.getInteractionValue<types.Codespace>(elementID).language = e.target.value as types.CodespaceLanguage;
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
        <FormControlLabel label="Is Simplified" control={
          <Checkbox
            name="isSimplified"
            id="isSimplified"
            checked={isSimplified}
            onChange={(e) => {
              setIsSimplified(e.target.checked);
              helpers.getInteractionValue<types.Codespace>(elementID).isSimplified = e.target.checked;
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

            if (mode == types.ComponentMode.Edit) {
              helpers.getInteractionValue<types.Codespace>(elementID).content[tabIndex].content = e ?? '';
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

      
      {mode == types.ComponentMode.Edit && (
        <TextField
          label="Correct Output"
          name="correctOutput"
          value={correctOutput}
          multiline
          onChange={(e) => {
            setCorrectOutput(e.target.value);
            helpers.getInteractionValue<types.Codespace>(elementID).correctOutput = e.target.value;
          }}
        />
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
      sx={{ flexGrow: 1, height: '70vh' }}
    >
      <iframe
        id={`interaction${helpers.getAbsoluteIndex(elementID)}`}
        className="fullscreenInteraction"
        src={source}
      ></iframe>

      {mode == types.ComponentMode.Edit && (
        <TextField
          label="Source"
          name="source"
          autoComplete="off"
          disabled={isDisabled}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            helpers.getInteractionValue<types.IFrame>(elementID).source = e.target.value;
          }}
        />
      )}
    </Box>
  );
}



// Text.

let globalIndex = 0;

function Text({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ text, setText ] = useState(elementID.learn.chapters.map(chapter => chapter.elements.map(element => element.text)).flat());
  const [ isThinking, setIsThinking ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateText`, (e: Event) => {
      setText((e as CustomEvent).detail);
    });
    
    window.addEventListener(`updateThinking`, (e: Event) => {
      setIsThinking((e as CustomEvent).detail);
    });
  }, []);

  globalIndex = 0;

  return (
    <Card
      id={`text${helpers.getAbsoluteIndex(elementID)}`}
      sx={{ flexGrow: 1 }}
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
              const newText = text;
              newText[helpers.getAbsoluteIndex(elementID)] = e.target.value;
              setText(newText);

              helpers.getElement(elementID).text = e.target.value;
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
            {isThinking ? "Thinking..." : text[helpers.getAbsoluteIndex(elementID)]}
          </Markdown>
        ))}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'end' }}
      >
        <Stack
          direction="row"
          spacing={1}
        >
          <Tooltip title="Rephrase the text in simpler terms">
            <Chip
              icon={<AutoAwesome />}
              label="Rephrase"
              onClick={(e) => functions.rephrase(elementID)}
            />
          </Tooltip>

          <Tooltip title="Read the text out loud">
            <Chip
              icon={<VolumeUp />}
              label="Read Aloud"
              onClick={(e) => functions.readAloud(elementID)}
            />
          </Tooltip>

          <Tooltip title="Reset text back to its original state">
            <Chip
              icon={<Refresh />}
              label="Reset"
              onClick={(e) => functions.reset(elementID)}
            />
          </Tooltip>

          <Tooltip title="Bring the text to the main focus">
            <Chip
              icon={<Fullscreen />}
              label="Fullscreen"
              onClick={(e) => {}}
            />
          </Tooltip>
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



// Miscellaneous.

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      <Box
        sx={{ width: '100%', mr: 1 }}
      >
        <LinearProgress
          {...props}
        />
      </Box>

      <Box
        sx={{ minWidth: 35 }}
      >
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >
          {`${Math.round(props.value)}% Complete`}
        </Typography>
      </Box>
    </Box>
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
    <TextField
      label="Title"
      name="title"
      autoComplete="off"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value)
        skill.title = e.target.value;
      }}
    />
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
    <TextField
      label="Description"
      autoComplete="off"
      value={description}
      onChange={(e) => {
        setDescription(e.target.value)
        skill.description = e.target.value;
      }}
    />
  );

  return mode == types.ComponentMode.Edit ? input : header;
}
