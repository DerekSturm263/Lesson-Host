'use client'

import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX, MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { saveSkillLearn, createSkill, createProject, createCourse } from './database';
import Markdown from 'react-markdown';
import * as functions from '@/app/lib/functions';
import * as types from '@/app/lib/types';
import * as helpers from '@/app/lib/helpers';

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

let globalIndex = 0;

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
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
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
                sx={{ width: '150px' }}
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
      variant="permanent"
      open={isOpen}
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box' }
      }}
    >
      <Toolbar />

      <Box
        sx={{  overflow: 'auto' }}
      >
        <Typography
          variant='h6'
          sx={{ marginTop: '8px', marginBottom: '8px', textAlign: 'center' }}
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
      </Box>
    </Drawer>
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
    <Box
      display='flex'
      sx={{ height: '100vh' }}
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
        sx={{ flexGrow: 1 }}
      >
        <Toolbar />

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
          sx={{ position: 'fixed', bottom: '8px', alignSelf: 'left' }}
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
    </Box>
  );
}

function ChapterButton({ selected, elementID, mode, onClick, removeChapter }: { selected: boolean, elementID: types.ElementID, mode: types.ComponentMode, onClick: MouseEventHandler<HTMLDivElement> | undefined, removeChapter: (index: number) => void }) {
  const [ title, setTitle ] = useState(helpers.getChapter(elementID).title);
  const [ progress, setProgress ] = useState(0);

  useEffect(() => {
    window.addEventListener(`updateChapterProgress${elementID.chapterIndex}`, (e: Event) => {
      setProgress((e as CustomEvent).detail);
    });
  }, []);

  return (
    <ListItem
      secondaryAction={ mode == types.ComponentMode.Edit ? <IconButton><MoreVert /></IconButton> : null }
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

function TypeSwitcher({ elementID }: { elementID: types.ElementID }) {
  const [ type, setType ] = useState(helpers.getElement(elementID).type);

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

  return (
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
}

import ShortAnswer from './interactions/short_answer/elements';
import MultipleChoice from './interactions/multiple_choice/elements';
import TrueOrFalse from './interactions/true_or_false/elements';
import Matching from './interactions/matching/elements';
import Ordering from './interactions/ordering/elements';
import Files from './interactions/files/elements';
import Drawing from './interactions/drawing/elements';
import Graph from './interactions/graph/elements';
import DAW from './interactions/daw/elements';
import Codespace from './interactions/codespace/elements';
import Engine from './interactions/engine/elements';
import IFrame from './interactions/iframe/elements';

const interactionMap = (props: types.InteractionProps): Element | undefined => {
  return {
    "shortAnswer": <ShortAnswer {...props} />,
    "multipleChoice": <MultipleChoice {...props} />,
    "trueOrFalse": <TrueOrFalse {...props} />,
    "matching": <Matching {...props} />,
    "ordering": <Ordering {...props} />,
    "files": <Files {...props} />,
    "drawing": <Drawing {...props} />,
    "graph": <Graph {...props} />,
    "daw": <DAW {...props} />,
    "codespace": <Codespace {...props} />,
    "engine": <Engine {...props} />,
    "iframe": <IFrame {...props} />
  }[helpers.getElement(props.elementID).type];
}

function Interaction({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ type, setType ] = useState(helpers.getElement(elementID).type);
  const [ isDisabled, setIsDisabled ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateAssessment${helpers.getAbsoluteIndex(elementID)}`, (e: Event) => {
      setIsDisabled((e as CustomEvent).detail);
    });
  }, []);

  return interactionMap({ elementID: elementID, isDisabled: isDisabled, mode: mode });
}

function Text({ elementID, mode }: { elementID: types.ElementID, mode: types.ComponentMode }) {
  const [ text, setText ] = useState(elementID.learn.chapters.map(chapter => chapter.elements.map(element => element.text)).flat());
  const [ isThinking, setIsThinking ] = useState(false);

  useEffect(() => {
    window.addEventListener(`updateText`, (e: Event) => {
      const newText = text;
      newText[helpers.getAbsoluteIndex((e as CustomEvent).detail['id'])] = (e as CustomEvent).detail['text'];
      setText(newText);
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
        style={{ height: '20vh', overflowY: 'auto' }}
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
        sx={{ width: '60%', mr: 1 }}
      >
        <LinearProgress
          {...props}
        />
      </Box>

      <Box
        sx={{ flex: 1 }}
      >
        <Typography
          variant="body2"
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
