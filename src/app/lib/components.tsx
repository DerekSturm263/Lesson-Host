'use client'

import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX, MouseEventHandler, useEffect } from 'react';
import { saveSkillLearn, createSkill, createProject, createCourse } from '@/app/lib/database';
import { ElementID, ComponentMode, InteractionPackage, Skill, Learn, InteractionProps } from '@/app/lib/types';
import { ModelType } from './ai/types';
import Markdown from 'react-markdown';
import generateText from './ai/functions';
import textToSpeech from '@google-cloud/text-to-speech';
import * as helpers from '@/app/lib/helpers';

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
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import VoiceOverOff from '@mui/icons-material/VoiceOverOff';
import PaginationItem from '@mui/material/PaginationItem';



// Core.

const client = new textToSpeech.TextToSpeechClient();
const interactionMap: Record<string, InteractionPackage> = {
  "shortAnswer": ShortAnswer,
  "multipleChoice": MultipleChoice,
  "trueOrFalse": TrueOrFalse,
  "matching": Matching,
  "ordering": Ordering,
  "files": Files,
  "drawing": Drawing,
  "graph": Graph,
  "daw": DAW,
  "codespace": Codespace,
  "engine": Engine,
  "iframe": IFrame
};

export function Header({ title, mode, type, progress }: { title: string, mode: ComponentMode, type: string, progress: number }) {
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

          <Stack
            direction="row"
            spacing={2}
          >
            <Typography
              variant="h6"
            >
              {title}
            </Typography>

            {mode == ComponentMode.View && (
              <Box>
                <LinearProgressWithLabel
                  variant="determinate"
                  value={progress * 100}
                  sx={{ width: '150px' }}
                />
              </Box>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
          >
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
                {Object.values(ComponentMode).map((item, index) => (
                  <MenuItem
                    key={index}
                    value={item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {mode == ComponentMode.Edit && (
              <Button
                variant="contained"
                onClick={async (e) => { 
                  //await saveSkillLearn(slug, skill.learn);
                }}
              >
                Save
              </Button>
            )}
          </Stack>
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
          sx={{ margin: 'auto', textAlign: 'center', height: '48px', alignContent: 'center' }}
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

function ChapterButton({ selected, elementID, isDisabled, mode, onClick }: { selected: boolean, elementID: ElementID, isDisabled: boolean, mode: ComponentMode, onClick: MouseEventHandler<HTMLDivElement> | undefined }) {
  const [ title, setTitle ] = useState(helpers.getChapter(elementID).title);
  const [ completedElements, setCompletedElements ] = useState(Array<boolean>(helpers.getChapter(elementID).elements.length));

  useEffect(() => {
    window.addEventListener(`updateChapterProgress${elementID.chapterIndex}`, (e: Event) => {
      const newCompletedElements = completedElements;
      newCompletedElements[(e as CustomEvent).detail] = true;
      setCompletedElements(newCompletedElements);
    });
  }, []);

  return (
    <ListItem
      secondaryAction={ mode == ComponentMode.Edit ? <IconButton><MoreVert /></IconButton> : null }
    >
      <ListItemButton
        disabled={isDisabled}
        selected={selected}
        onClick={onClick}
      >
        <ListItemText
          primary={title}
          secondary={mode == ComponentMode.View ? <LinearProgress variant="determinate" value={(completedElements.filter(item => item).length / helpers.getChapter(elementID).elements.length) * 100} /> : <Fragment></Fragment> }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function LearnPageContent({ slug, title, learn, mode, apiKey }: { slug: string, title: string, learn: Learn, mode: ComponentMode, apiKey: string }) {
  const [ chapters, setChapters ] = useState(learn.chapters);
  const [ currentElement, setCurrentElement ] = useState({ learn: learn, chapterIndex: 0, elementIndex: 0, keys: [ apiKey ] });
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  // TODO: Change to mark completed instead of unlocked
  const [ elementsUnlocked, setElementsUnlocked ] = useState(learn.chapters.map((chapter, cIndex) => chapter.elements.map((element, eIndex) => (cIndex == 0 && eIndex == 0) || mode != ComponentMode.View)).flat());
  const [ texts, setTexts ] = useState(learn.chapters.map((chapter) => chapter.elements.map((element) => element.text)).flat());
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");

  function setText(value: string) {
    const newTexts = texts;
    newTexts[helpers.getAbsoluteIndex(currentElement)] = value;
    setTexts(newTexts);
  }

  useEffect(() => {
    console.log(currentElement);
    console.log(JSON.stringify(elementsUnlocked));

    window.addEventListener(`updateElement`, (e: Event) => {
      const newElementsUnlocked = elementsUnlocked;
      newElementsUnlocked[helpers.getAbsoluteIndex(currentElement) + 1] = (e as CustomEvent).detail;
      setElementsUnlocked(newElementsUnlocked);

      if (mode == ComponentMode.View) {
        setSnackbarText("Good job! You can now move onto the next page");
        setIsSnackbarOpen(true);
      }

      console.log(currentElement);
      console.log(JSON.stringify(newElementsUnlocked));
    });

    window.addEventListener('updatePagination', (e: Event) => {
      setIsNavigationEnabled((e as CustomEvent).detail);
    });
    
    window.addEventListener(`updateText`, (e: Event) => {
      const newTexts = texts;
      newTexts[helpers.getAbsoluteIndex(currentElement)] = (e as CustomEvent).detail;
      setTexts((e as CustomEvent).detail);
    });
  }, []);

  return (
    <Fragment>
      <Header title={title} mode={mode as ComponentMode} type="Learn" progress={1} />

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Chapters"
        >
          {chapters.map((chapter, index) => {
            const chapterFirstElement = { learn: learn, chapterIndex: index, elementIndex: 0, keys: [ apiKey ] };

            return (
              <ChapterButton
                isDisabled={!isNavigationEnabled || !elementsUnlocked[helpers.getAbsoluteIndex(chapterFirstElement)]}
                selected={currentElement.chapterIndex == index}
                key={index}
                elementID={chapterFirstElement}
                mode={mode}
                onClick={(e) => {
                  setCurrentElement(chapterFirstElement);
                }}
              />
            );
          })}

          {mode == ComponentMode.Edit && (
            <Button
              variant="contained"
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
            elementID={currentElement}
            isDisabled={mode == ComponentMode.View && elementsUnlocked[helpers.getAbsoluteIndex(currentElement) - 1]}
            setText={setText}
            mode={mode}
          />

          {/*chapters.map((chapter, cIndex) => chapter.elements.map((element, eIndex) => {
            const elementID = { learn: learn, chapterIndex: cIndex, elementIndex: eIndex, keys: [ apiKey ] };

            return (
              <Box
                sx={{ display: cIndex == currentChapter && eIndex == currentElement ? 'block' : 'none' }}
                key={helpers.getAbsoluteIndex(elementID)}
              >
                <Interaction
                  elementID={elementID}
                  isDisabled={!interactionsEnabled[helpers.getAbsoluteIndex(elementID)]}
                  setText={setText}
                  mode={mode}
                />
              </Box>
            );
          }))*/}
      
          <Text
            elementID={currentElement}
            text={texts[helpers.getAbsoluteIndex(currentElement)]}
            setText={setText}
            mode={mode}
          />
      
          <Pagination
            count={helpers.getChapter(currentElement).elements.length}
            page={currentElement.elementIndex + 1}
            disabled={!isNavigationEnabled}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                disabled={!isNavigationEnabled || (item.page ?? 0) < 1 || (item.page ?? 0) > helpers.getChapter(currentElement).elements.length || !elementsUnlocked[(item.page ?? 0) - 1]}
                onClick={() => setCurrentElement({ learn: learn, chapterIndex: currentElement.chapterIndex, elementIndex: (item.page ?? 0) - 1, keys: [ apiKey ] })}
              />
            )}
            sx={{ position: 'fixed', bottom: '8px', alignSelf: 'left' }}
          />

          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={3000}
            open={isSnackbarOpen}
            message={snackbarText}
            onClose={(e, reason?) => {
              if (reason === 'clickaway') {
                return;
              }

              setIsSnackbarOpen(false);
            }}
          />
        
          {mode == ComponentMode.Edit && (
            <Tooltip title="Delete this element">
              <Chip
                icon={<Delete />}
                label="Delete"
              />
            </Tooltip>
          )}
        </Stack>
      </Box>
    </Fragment>
  );
}

function Interaction(props: InteractionProps) {
  const Component = interactionMap[helpers.getElement(props.elementID).type].Component;

  return (
    <Component
      {...props}
    />
  );
}

function Text({ elementID, text, setText, mode }: { elementID: ElementID, text: string, setText: (val: string) => void, mode: ComponentMode }) {
  const [ isThinking, setIsThinking ] = useState(false);
  const [ doAutoReadAloud, setDoAutoReadAloud ] = useState(true);

  useEffect(() => {
    window.addEventListener(`updateThinking`, (e: Event) => {
      setIsThinking((e as CustomEvent).detail);
    });
    
    window.addEventListener(`updateText`, (e: Event) => {
      readAloud();
    });
  }, []);

  async function rephrase() {
    setIsThinking(true);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: false }));

    const newText = await generateText({
      model: ModelType.Quick,
      prompt:
      `TASK:
      Rephrase a given TEXT. 
      
      TEXT:
      ${text}`,
      systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
    });
    
    setText(newText);
    setIsThinking(false);
    window.dispatchEvent(new CustomEvent('updatePagination', { detail: true }));
  
    if (doAutoReadAloud)
      readAloud();
  }

  async function readAloud() {
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    }

    const stream = client.streamingSynthesize();

    stream.on('data', (response) => { console.log(response) });
    stream.on('error', (err) => { throw(err) });
    stream.on('end', () => { });
    stream.write(request);
    stream.end();
  }

  async function toggleAutoReadAloud() {
    setDoAutoReadAloud(!doAutoReadAloud);
  }

  async function reset() {
    setText(helpers.getElement(elementID).text);
  }

  globalIndex = 0;

  return (
    <Card
      id={`text${helpers.getAbsoluteIndex(elementID)}`}
    >
      <CardContent
        style={{ height: '20vh', overflowY: 'auto' }}
      >
        {isThinking && <LinearProgress />}

        {(mode == ComponentMode.Edit ? (
          <TextField
            label="Text"
            multiline
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              helpers.getElement(elementID).text = e.target.value;
            }}
          />
        ) : (
          <Markdown>
            {isThinking ? "Thinking..." : text}
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
          <Tooltip title="Rephrase this text in simpler terms">
            <Chip
              icon={<AutoAwesome />}
              label="Rephrase"
              onClick={(e) => rephrase()}
              disabled={isThinking}
            />
          </Tooltip>

          <Tooltip title="Read this text out loud">
            <Chip
              icon={<VolumeUp />}
              label="Read Aloud"
              onClick={(e) => readAloud()}
              disabled={isThinking}
            />
          </Tooltip>

          <Tooltip title={`Turn ${doAutoReadAloud ? "off" : "on"} immediately reading new text aloud`}>
            <Chip
              icon={doAutoReadAloud ? <VoiceOverOff /> : <RecordVoiceOver />}
              label={`Turn ${doAutoReadAloud ? "Off" : "On"} Auto Read`}
              onClick={(e) => toggleAutoReadAloud()}
              disabled={isThinking}
            />
          </Tooltip>

          <Tooltip title="Reset this element back to its original state">
            <Chip
              icon={<Refresh />}
              label="Reset"
              onClick={(e) => reset()}
              disabled={isThinking}
            />
          </Tooltip>

          <Tooltip title="Bring this text to the main focus">
            <Chip
              icon={<Fullscreen />}
              label="Fullscreen"
              onClick={(e) => {}}
              disabled={isThinking}
            />
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}

function TypeSwitcher({ elementID }: { elementID: ElementID }) {
  const [ type, setType ] = useState(helpers.getElement(elementID).type);

  function setTypeAndUpdate(type: string) {
    setType(type);
    helpers.getElement(elementID).type = type;
    helpers.getElement(elementID).value = interactionMap[type].defaultValue;
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
        onChange={(e) => setTypeAndUpdate(e.target.value)}
      >
        {(Object.values(interactionMap).map((item, index) => (
          <MenuItem
            key={index}
            value={item.id}
          >
            {item.prettyName}
          </MenuItem>
        )))}
      </Select>
    </FormControl>
  );
}



// Miscellaneous.

let globalIndex = 0;

function WordWrapper({ children }: { children?: React.ReactNode }) {
  async function define(word: string) {
    const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  
    if (!response.ok) {
      console.error(`Could not define ${word}`);
    }

    const data = JSON.parse(await response.json());
    // Todo: Return defintion in dialog box
  }

  return (
    <Fragment>
      {/*{text.split(/\s+/).map((word, i) => (
        <span
          key={i}
          className="word"
          onDoubleClick={(e) => define(word)}
          title="Double click to define this word"
          style={{"--index": `${globalIndex++ / 8}s`} as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}*/}
    </Fragment>
  );
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center' }}
      style={{ margin: 'auto' }}
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

export function SkillTitle({ skill, mode }: { skill: Skill, mode: ComponentMode }) {
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

  return mode == ComponentMode.Edit ? input : header;
}

export function SkillDescription({ skill, mode }: { skill: Skill, mode: ComponentMode }) {
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

  return mode == ComponentMode.Edit ? input : header;
}
