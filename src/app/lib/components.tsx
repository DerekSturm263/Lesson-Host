'use client'

import { Fragment, Children, isValidElement, cloneElement, useRef, ReactNode, useState, ReactElement, JSX, MouseEventHandler, useEffect } from 'react';
import { save, createSkill, createProject, createCourse } from '@/app/lib/database';
import { ElementID, ComponentMode, InteractionPackage, Skill, Learn, InteractionProps, Project, Course, Practice, TextProps, Sharable } from '@/app/lib/types';
import { ModelType } from '@/app/lib/ai/types';
import { CookiesProvider, useCookies } from 'react-cookie';

import Markdown from 'react-markdown';
import generateText from '@/app/lib/ai/functions';
import speakText from '@/app/lib/tts/functions'
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
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Pagination from '@mui/material/Pagination';
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
import PaginationItem from '@mui/material/PaginationItem';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import CardActionArea from '@mui/material/CardActionArea';
import Rating from '@mui/material/Rating';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Breadcrumbs from '@mui/material/Breadcrumbs'

import Refresh from '@mui/icons-material/Refresh';
import VolumeUp from '@mui/icons-material/VolumeUp';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Menu from '@mui/icons-material/Menu';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Delete from '@mui/icons-material/Delete';
import MoreVert from '@mui/icons-material/MoreVert';
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver';
import VoiceOverOff from '@mui/icons-material/VoiceOverOff';
import Psychology from '@mui/icons-material/Psychology';
import Assignment from '@mui/icons-material/Assignment';
import Book from '@mui/icons-material/Book';
import Save from '@mui/icons-material/Save';
import Launch from '@mui/icons-material/Launch';
import Share from '@mui/icons-material/Share';
import Add from '@mui/icons-material/Add';
import Quiz from '@mui/icons-material/Quiz';
import { ObjectId } from 'mongodb';



// Core.

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

export function Header({ title, slug, mode, type, progress, showProgress, hideLogo, value, showSave, linkType }: { title: string, slug: string, mode: ComponentMode, type: string, progress: number, showProgress: boolean, hideLogo: boolean, value: Learn | Practice | Project | Course | undefined, showSave: boolean, linkType: string }) {
  const [ headerTitle, setHeaderTitle ] = useState(title);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ hideLogoState, setHideLogoState ] = useState(true);
  const [ width, setWidth ] = useState(800);
  const [ height, setHeight ] = useState(600);

  const link = `https://myskillstudy.com/${linkType}/${slug}?mode=view&hideLogo=${hideLogoState}`;
  const iframe = `<iframe src="https://myskillstudy.com/${linkType}/${slug}?mode=view&hideLogo=${hideLogoState}" width=${width} height=${height}></iframe>`;

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={(e) => setIsOpen(false)}
      >
        <DialogTitle>
          {`Select ${mode == ComponentMode.Edit ? "Export" : "Share"} Settings`}
        </DialogTitle>

        <DialogContent>
          <Tabs
            value={tabIndex}
            onChange={(e, value) => { setTabIndex(value); }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {["Link", "IFrame"].map((label, index) => (
              <Tab
                key={index}
                label={label}
              />
            ))}
          </Tabs>

          <br />

          <DialogContentText>
            <Typography
              variant="h6"
            >
              Settings
            </Typography>
          </DialogContentText>
      
          <Stack>
            <FormControlLabel control={
              <Switch
                defaultChecked={true}
                value={hideLogoState}
                onChange={(e, value) => setHideLogoState(value)}
              />}
              label="Hide MySkillStudy.com Logo"
            />

            {tabIndex == 1 && (
              <>
                <TextField
                  id="width"
                  label="Width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              
                <TextField
                  id="height"
                  label="Height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </>
            )}
          </Stack>
          
          <br />
              
          {tabIndex == 0 ? (
            <>
              <DialogContentText>
                {"Copy the link below and send it to give anyone access this skill."}
              </DialogContentText>
              
              <br />

              <DialogContentText>
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </Link>
              </DialogContentText>
            </>
          ) : (
            <>
              <DialogContentText>
                {"Copy the code below and paste it into your website/LMS to give users access to this skill."}
              </DialogContentText>

              <br />

              <DialogContentText
                sx={{ backgroundColor: "#1c1c1c", padding: "10px", overflow: "auto", borderRadius: "5px" }}
              >
                <code>
                  {iframe}
                </code>
              </DialogContentText>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={(e) => {
              navigator.clipboard.writeText(tabIndex == 0 ? link : iframe);

              setSnackbarText("Copied to clipboard");
              setIsSnackbarOpen(true);
            }}
          >
            Copy to Clipboard
          </Button>

          <Button
            onClick={(e) => setIsOpen(false)}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          {!hideLogo && (
            <Link
              variant="h6"
              sx={{ width: '400px', textDecoration: 'none' }}
              href="/"
            >
              MySkillStudy.com
            </Link>
          )}

          <Stack
            spacing={2}
          >
            {mode == ComponentMode.Edit ? (
              <TextField
                label="Title"
                autoComplete="off"
                value={headerTitle}
                onChange={(e) => {
                  setHeaderTitle(e.target.value);
                  // TODO: Add code to actually set it.
                }}
              />
            ) : (
              <Link
                variant="h6"
                sx={{ textAlign: 'center', textDecoration: 'none' }}
                href={`./?mode=${mode}&hideLogo=${hideLogo}`}
              >
                {title}
              </Link>
            )}

            {showProgress && mode == ComponentMode.View && (
              <LinearProgress
                variant="determinate"
                value={progress * 100}
                sx={{ width: '200px' }}
                style={{ marginTop: '6px' }}
              />
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: '400px', justifyContent: 'flex-end' }}
          >
            {type != "" && (
              <FormControl
                size="small"
              >
                <InputLabel id="mode-label">Mode</InputLabel>

                <Select
                  labelId="mode-label"
                  value={type}
                  label="Mode"
                >
                  <MenuItem
                    value="Learn"
                  >
                    <ListItemButton
                      href={`./learn?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <School />
                      </ListItemIcon>

                      <ListItemText>
                        Learn
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>

                  <MenuItem
                    value="Practice"
                  >
                    <ListItemButton
                      href={`./practice?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <LocalLibrary />
                      </ListItemIcon>

                      <ListItemText>
                        Practice
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>

                  <MenuItem
                    value="Quiz"
                  >
                    <ListItemButton
                      href={`./quiz?mode=${mode}&hideLogo=${hideLogo}`}
                      sx={{ padding: '0px' }}
                    >
                      <ListItemIcon>
                        <Quiz />
                      </ListItemIcon>

                      <ListItemText>
                        Quiz
                      </ListItemText>
                    </ListItemButton>
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {slug != "" && hideLogo == false && (
              <Button
                variant="contained"
                startIcon={mode == ComponentMode.Edit ? <Launch /> : <Share />}
                onClick={async (e) => {
                  setIsOpen(true);
                  setTabIndex(0);
                  setHideLogoState(true);
                  setWidth(800);
                  setHeight(600);
                }}
              >
                {mode == ComponentMode.Edit ? "Export" : "Share"}
              </Button>
            )}

            {(mode == ComponentMode.Edit) && (
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
                onClick={async (e) => {
                  
                }}
              >
                Generate
              </Button>
            )}

            {(showSave || mode == ComponentMode.Edit) && (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={async (e) => {
                  await save(slug, value);

                  setSnackbarText("Saved");
                  setIsSnackbarOpen(true);
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

function Sidebar({ children, label }: { children?: React.ReactNode, label: string }) {
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

function SidebarButton({ selected, ogTitle, isDisabled, mode, progress, onClick }: { selected: boolean, ogTitle: string, isDisabled: boolean, mode: ComponentMode, progress: number, onClick: MouseEventHandler<HTMLDivElement> | undefined }) {
  const [ title, setTitle ] = useState(ogTitle);

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
          secondary={mode == ComponentMode.View ? <LinearProgress variant="determinate" value={progress * 100} /> : <Fragment></Fragment> }
        />
      </ListItemButton>
    </ListItem>
  );
}

export function LearnContent({ slug, title, learn, mode, apiKey, hideLogo }: { slug: string, title: string, learn: Learn, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  return (
    <CookiesProvider
      defaultSetOptions={{ path: '/' }}
    >
      <LearnContentNoCookies
        slug={slug}
        title={title}
        learn={learn}
        mode={mode}
        apiKey={apiKey}
        hideLogo={hideLogo}
      ></LearnContentNoCookies>
    </CookiesProvider>
  );
}

function LearnContentNoCookies({ slug, title, learn, mode, apiKey, hideLogo }: { slug: string, title: string, learn: Learn, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  const originalTexts = learn.chapters.map((chapter) => chapter.elements.map((element) => element.text)).flat();

  const [ chapters, setChapters ] = useState(learn.chapters);
  const [ currentElement, setCurrentElement ] = useState({ learn: learn, chapterIndex: 0, elementIndex: 0, keys: [ apiKey ] } as ElementID);
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  const [ elementsCompleted, setElementsCompleted ] = useState(Array<boolean>(learn.chapters.reduce((sum, chapter) => sum + chapter.elements.length, 0)).fill(mode != ComponentMode.View));
  const [ texts, setTexts ] = useState(originalTexts);
  const [ isSnackbarOpen, setIsSnackbarOpen ] = useState(false);
  const [ snackbarText, setSnackbarText ] = useState("");
  const [ isThinking, setIsThinking ] = useState(false);
  const [ cookies, setCookie ] = useCookies(['autoReadAloud']);

  function setText(value: string) {
    const newTexts = texts;
    newTexts[helpers.getAbsoluteIndex(currentElement)] = value;
    setTexts(newTexts);
    
    if (cookies.autoReadAloud)
      readAloud();
  }

  function setIsThinkingSmart(isThinking: boolean) {
    setIsThinking(isThinking);
    setIsNavigationEnabled(!isThinking);
  }

  async function readAloud() {
    const request = {
      input: { text: texts[helpers.getAbsoluteIndex(currentElement)] },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' }
    };

    const stream = await speakText();

    stream.on('data', (response) => { console.log(response) });
    stream.on('error', (err) => { throw(err) });
    stream.on('end', () => { });
    stream.write(request);
    stream.end();
  }

  async function toggleAutoReadAloud() {
    setCookie('autoReadAloud', !cookies.autoReadAloud, { path: '/' });
  }

  async function reset() {
    setText(originalTexts[helpers.getAbsoluteIndex(currentElement)]);
  }

  function complete(isComplete: boolean) {
    if (mode == ComponentMode.View && !elementsCompleted[helpers.getAbsoluteIndex(currentElement)]) {
      setSnackbarText("Good job! Click the next page to continue");
      setIsSnackbarOpen(true);
    }

    const newElementsCompleted = elementsCompleted;
    newElementsCompleted[helpers.getAbsoluteIndex(currentElement)] = isComplete;
    setElementsCompleted(newElementsCompleted);
  }

  function addChapter() {
    const newChapters = chapters;
    newChapters.push();

    setChapters(newChapters);
  }

  function removeChapter(index: number) {
    const newChapters = chapters;
    newChapters.splice(index, 1);

    setChapters(newChapters);
  }

  return (
    <Fragment>
      <Dialog
        open={mode == ComponentMode.View && elementsCompleted.filter(element => element).length == elementsCompleted.length}
      >
        <DialogTitle>
          Lesson Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {"Take a screenshot of this dialogue and upload it to the assignment page on your school's LMS."}
          </DialogContentText>
          
          <DialogContentText>
            {"Next up: Practice this skill to earn a higher score on the rubric."}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            href="./practice"
          >
            Practice Skill
          </Button>
        </DialogActions>
      </Dialog>

      <Header
        title={title}
        slug={slug}
        mode={mode as ComponentMode}
        type="Learn"
        progress={elementsCompleted.filter((element) => element).length / elementsCompleted.length}
        showProgress={true}
        hideLogo={hideLogo}
        value={learn}
        showSave={false}
        linkType="skills"
      />

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
              <SidebarButton
                key={index}
                isDisabled={!isNavigationEnabled || (index != 0 && !elementsCompleted[helpers.getAbsoluteIndex(chapterFirstElement) - 1])}
                selected={currentElement.chapterIndex == index}
                ogTitle={chapter.title}
                mode={mode}
                progress={elementsCompleted.reduce((sum, element, index) => sum += element && (index >= helpers.getAbsoluteIndex(chapterFirstElement) && index < helpers.getAbsoluteIndex(chapterFirstElement) + chapter.elements.length) ? 1 : 0, 0) / chapter.elements.length}
                onClick={(e) => {
                  setCurrentElement(chapterFirstElement);
                }}
              />
            );
          })}

          {mode == ComponentMode.Edit && (
            <Button
              variant="contained"
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

          <Stack
            sx={{ flexGrow: 1 }}
          >
            {mode == ComponentMode.Edit && (
              <TypeSwitcher
                elementID={currentElement}
              />
            )}

            <Interaction
              elementID={currentElement}
              isDisabled={mode == ComponentMode.View && elementsCompleted[helpers.getAbsoluteIndex(currentElement)]}
              mode={mode}
              originalText={originalTexts[helpers.getAbsoluteIndex(currentElement)]}
              setText={setText}
              setIsThinking={setIsThinkingSmart}
              setComplete={complete}
            />
          </Stack>

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
            mode={mode}
            isThinking={isThinking}
            setText={setText}
            setIsThinking={setIsThinkingSmart}
            readAloud={readAloud}
            toggleAutoReadAloud={toggleAutoReadAloud}
            reset={reset}
            isNavigationEnabled={isNavigationEnabled}
            elementsCompleted={elementsCompleted}
            setCurrentElement={setCurrentElement}
            doReadAloud={cookies.autoReadAloud}
            deleteElement={() => learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex, 1)}
            insertElementBefore={() => learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex + 1, 0, { type: "shortAnswer", text: "", value: ShortAnswer.defaultValue })}
            insertElementAfter={() => learn.chapters[currentElement.chapterIndex].elements.splice(currentElement.elementIndex, 0, { type: "shortAnswer", text: "", value: ShortAnswer.defaultValue })}
          />

          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
        </Stack>
      </Box>
    </Fragment>
  );
}

export function PracticeContent({ slug, title, practice, mode, apiKey, hideLogo }: { slug: string, title: string, practice: Practice, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  return (
    <CookiesProvider
      defaultSetOptions={{ path: '/' }}
    >
      <PracticeContentNoCookies
        slug={slug}
        title={title}
        practice={practice}
        mode={mode}
        apiKey={apiKey}
        hideLogo={hideLogo}
      ></PracticeContentNoCookies>
    </CookiesProvider>
  );
}

function PracticeContentNoCookies({ slug, title, practice, mode, apiKey, hideLogo }: { slug: string, title: string, practice: Practice, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  const [ subSkills, setSubSkills ] = useState(practice.subSkills);
  const [ isNavigationEnabled, setIsNavigationEnabled ] = useState(true);
  const [ currentSubSkillIndex, setCurrentSubSkillIndex ] = useState(0);

  return (
    <Fragment>
      <Dialog
        open={false}
      >
        <DialogTitle>
          Practice Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {"Take a screenshot of this dialogue and upload it to the assignment page on your school's LMS."}
          </DialogContentText>
          
          <DialogContentText>
            {"Next up: Work on the next skill."}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            href="./implement"
          >
            Implement Skill
          </Button>
        </DialogActions>
      </Dialog>

      <Header
        title={title}
        slug={slug}
        mode={mode as ComponentMode}
        type="Practice"
        progress={0}
        showProgress={true}
        hideLogo={hideLogo}
        value={practice}
        showSave={false}
        linkType="skills"
      />

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        <Sidebar
          label="Sub-Skills"
        >
          {subSkills.map((subSkill, index) => (
            <SidebarButton
              isDisabled={!isNavigationEnabled}
              selected={currentSubSkillIndex == index}
              key={index}
              ogTitle={subSkill.title}
              mode={mode}
              progress={0}
              onClick={(e) => {
                setCurrentSubSkillIndex(index);
              }}
            />
          ))}
        </Sidebar>

        <Stack
          sx={{ flexGrow: 1 }}
        >
          <Toolbar />
          
        </Stack>
      </Box>
    </Fragment>
  );
}

export function OpenContent({ slug, title, project, mode, apiKey, hideLogo }: { slug: string, title: string, project: Project, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  return (
    <CookiesProvider
      defaultSetOptions={{ path: '/' }}
    >
      <OpenContentNoCookies
        slug={slug}
        title={title}
        project={project}
        mode={mode}
        apiKey={apiKey}
        hideLogo={hideLogo}
      ></OpenContentNoCookies>
    </CookiesProvider>
  );
}

function OpenContentNoCookies({ slug, title, project, mode, apiKey, hideLogo }: { slug: string, title: string, project: Project, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  const [ checklist, setChecklist ] = useState(project.checklist);

  const learn = { chapters: [ { title: "", elements: [ project.value ] } ] };
  const element = { learn: learn , chapterIndex: 0, elementIndex: 0, keys: [ apiKey ] };

  return (
    <Fragment>
      <Dialog
        open={false}
      >
        <DialogTitle>
          Project Complete!
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {"Take a screenshot of this dialogue and upload it to the assignment page on your school's LMS."}
          </DialogContentText>
          
          <DialogContentText>
            {"Next up: Pick another project to start working on."}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Header
        title={title}
        slug={slug}
        mode={mode as ComponentMode}
        type=""
        progress={0}
        showProgress={true}
        hideLogo={hideLogo}
        value={project}
        showSave={true}
        linkType="projects"
      />

      <Box
        display='flex'
        sx={{ height: '100vh' }}
      >
        {/*<Sidebar
          label="Checklist"
        >
          {checklist.map((item, index) => (
            <SidebarButton
              key={index}
              isDisabled={false}
              selected={false}
              ogTitle={item.title}
              mode={mode}
              progress={0}
              onClick={(e) => { }}
            />
          ))}
        </Sidebar>*/}

        <Stack
          sx={{ flexGrow: 1 }}
        >
          <Toolbar />
          
          <Stack
            sx={{ flexGrow: 1 }}
          >
            {mode == ComponentMode.Edit && (
              <TypeSwitcher
                elementID={element}
              />
            )}

            <Interaction
              elementID={element}
              isDisabled={false}
              mode={mode}
              originalText=""
              setText={(text) => {}}
              setIsThinking={(isThinking) => {}}
              setComplete={(isComplete) => {}}
            />
          </Stack>
        </Stack>
      </Box>
    </Fragment>
  );
}

export function CourseContent({ slug, title, course, mode, apiKey, hideLogo }: { slug: string, title: string, course: Course, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  return (
    <CookiesProvider
      defaultSetOptions={{ path: '/' }}
    >
      <CourseContentNoCookies
        slug={slug}
        title={title}
        course={course}
        mode={mode}
        apiKey={apiKey}
        hideLogo={hideLogo}
      ></CourseContentNoCookies>
    </CookiesProvider>
  );
}

function CourseContentNoCookies({ slug, title, course, mode, apiKey, hideLogo }: { slug: string, title: string, course: Course, mode: ComponentMode, apiKey: string, hideLogo: boolean }) {
  return (
    <></>
  );
}

function Interaction(props: InteractionProps) {
  const Component = interactionMap[props.elementID.learn.chapters[props.elementID.chapterIndex].elements[props.elementID.elementIndex].type].Component;

  return (
    <Component
      {...props}
    />
  );
}

function Text(props: TextProps) {
  async function rephrase() {
    props.setIsThinking(true);

    const newText = await generateText({
      model: ModelType.Quick,
      prompt:
      `TASK:
      Rephrase a given TEXT. 
      
      TEXT:
      ${props.text}`,
      systemInstruction: `You are an expert at rephrasing things in a more understandable way. When you rephrase things, it should become easier to understand, but not much longer. If it's possible to make it easier to understand while keeping it short, do so. Use new examples and friendlier language than the original text.`
    });
    
    props.setText(newText);
    props.setIsThinking(false);
  }

  globalIndex = 0;

  return (
    <Card
      id={`text${helpers.getAbsoluteIndex(props.elementID)}`}
    >
      <CardContent
        style={{ height: '20vh', overflowY: 'auto' }}
      >
        {props.isThinking && <LinearProgress />}

        {(props.mode == ComponentMode.Edit ? (
          <TextField
            hiddenLabel={true}
            multiline
            defaultValue={props.text}
            rows={4}
            onChange={(e) => {
              props.setText(e.target.value);
              props.elementID.learn.chapters[props.elementID.chapterIndex].elements[props.elementID.elementIndex].text = e.target.value;
            }}
            fullWidth={true}
          />
        ) : (
          <Markdown>
            {props.isThinking ? "Thinking..." : props.text}
          </Markdown>
        ))}
      </CardContent>

      <CardActions
        sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Pagination
          count={helpers.getChapterLength(props.elementID)}
          page={props.elementID.elementIndex + 1}
          disabled={!props.isNavigationEnabled}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              disabled={!props.isNavigationEnabled || (item.page ?? 0) <= 0 || (item.page ?? 0) > helpers.getChapterLength(props.elementID) || (!props.elementsCompleted[helpers.getAbsoluteIndex({ learn: props.elementID.learn, chapterIndex: props.elementID.chapterIndex, elementIndex: 0, keys: props.elementID.keys }) + (item.page ?? 0) - 2] && (item.page ?? 0) != 1)}
              onClick={() => props.setCurrentElement({ learn: props.elementID.learn, chapterIndex: props.elementID.chapterIndex, elementIndex: (item.page ?? 0) - 1, keys: props.elementID.keys })}
            />
          )}
        />

        <Stack
          direction="row"
          spacing={1}
        >
          {props.mode == ComponentMode.Edit ? (
            <>
              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element Before"
                  onClick={props.insertElementBefore.call}
                />
              </Tooltip>

              <Tooltip
                title="Insert a new element after this one"
              >
                <Chip
                  icon={<Add />}
                  label="Insert Element After"
                  onClick={props.insertElementAfter.call}
                />
              </Tooltip>

              <Tooltip
                title="Delete this element"
              >
                <Chip
                  icon={<Delete />}
                  label="Delete"
                  onClick={props.deleteElement.call}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip
                title="Rephrase this text in simpler terms"
              >
                <Chip
                  icon={<AutoAwesome />}
                  label="Rephrase"
                  onClick={(e) => rephrase()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Read this text out loud"
              >
                <Chip
                  icon={<VolumeUp />}
                  label="Read Aloud"
                  onClick={(e) => props.readAloud()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title={`Turn ${props.doReadAloud ? "off" : "on"} immediately reading new text aloud`}
              >
                <Chip
                  icon={props.doReadAloud ? <VoiceOverOff /> : <RecordVoiceOver />}
                  label={`Turn ${props.doReadAloud ? "Off" : "On"} Auto Read`}
                  onClick={(e) => props.toggleAutoReadAloud()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Reset this element back to its original state"
              >
                <Chip
                  icon={<Refresh />}
                  label="Reset"
                  onClick={(e) => props.reset()}
                  disabled={props.isThinking}
                />
              </Tooltip>

              <Tooltip
                title="Bring this text to the main focus"
              >
                <Chip
                  icon={<Fullscreen />}
                  label="Fullscreen"
                  onClick={(e) => {}}
                  disabled={props.isThinking}
                />
              </Tooltip>
            </>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}

function TypeSwitcher({ elementID }: { elementID: ElementID }) {
  const [ type, setType ] = useState(elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].type);

  function setTypeAndUpdate(type: string) {
    setType(type);
    
    elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].type = type;
    elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].value = interactionMap[type].defaultValue;
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
    // TODO: Return defintion in dialog box
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
    <Stack
      sx={{ display: 'flex', alignItems: 'center' }}
      style={{ margin: 'auto' }}
    >
      <LinearProgress
        {...props}
      />

      <Typography
        variant="body2"
      >
        {`${Math.round(props.value)}% Complete`}
      </Typography>
    </Stack>
  );
}



// Sharables

export function CreateSharableButton({ create, type, path }: { create: () => Promise<[ sharable: Sharable, id: ObjectId ]>, type: string, path: string }) {
  return (
    <Button
      variant="contained"
      startIcon={<Psychology />}
      onClick={async (e) => {
        const newSharable = await create();
        window.open(`./${path}/${newSharable[1]}?mode=edit`);
      }}
    >
      {type}
    </Button>
  );
}

export function SharableContent({ slug, title, sharable, mode, apiKey, hideLogo, children }: { slug: string, title: string, sharable: Sharable, mode: ComponentMode, apiKey: string, hideLogo: boolean, children?: React.ReactNode }) {
  return (
    <CookiesProvider
      defaultSetOptions={{ path: '/' }}
    >
      <SharableContentNoCookies
        slug={slug}
        title={title}
        sharable={sharable}
        mode={mode}
        apiKey={apiKey}
        hideLogo={hideLogo}
      >
        {children}
      </SharableContentNoCookies>
    </CookiesProvider>
  );
}

function SharableContentNoCookies({ slug, title, sharable, mode, apiKey, hideLogo, children }: { slug: string, title: string, sharable: Sharable, mode: ComponentMode, apiKey: string, hideLogo: boolean, children?: React.ReactNode }) {
  const [ tabIndex, setTabIndex ] = useState(0);

  return (
    <Stack
      sx={{ height: '100vh' }}
    >
      <Header
        title={title}
        slug={slug}
        mode={mode as ComponentMode}
        type=""
        progress={0}
        showProgress={true}
        hideLogo={hideLogo}
        value={undefined}
        showSave={false}
        linkType="skills"
      />
      <Toolbar />

      <Breadcrumbs>
        <Link
          href="./"
        >
          Skills
        </Link>
        
        <Typography>
          {sharable.title}
        </Typography>
      </Breadcrumbs>

      <Stack
        spacing={2}
        sx={{ height: 300, justifyContent: 'center' }}
      >
        <SharableTitle
          sharable={sharable}
          mode={mode as ComponentMode}
        />

        <SharableTagline
          sharable={sharable}
          mode={mode as ComponentMode}
        />

        <Rating
          name="skill-rating"
          value={sharable.rating}
          precision={0.5}
          readOnly={true}
        />

        <Stack
          direction="row"
          spacing={2}
        >
          {children}
        </Stack>
      </Stack>

      <Tabs
        value={tabIndex}
        onChange={(e, value) => { setTabIndex(value); }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {["About", "Recommended", "Reviews"].map((label, index) => (
          <Tab
            key={index}
            label={label}
          />
        ))}
      </Tabs>

      {tabIndex == 0 ? (
        <SharableDescription
          sharable={sharable}
          mode={mode as ComponentMode}
        />
      ) : (
        <></>
      )}
    </Stack>
  );
}

function SharableTitle({ sharable, mode }: { sharable: Sharable, mode: ComponentMode }) {
  const [ title, setTitle ] = useState(sharable.title);
  
  const header = (
    <Typography
      variant='h4'
    >
      {title}
    </Typography>
  );

  const input = (
    <TextField
      label="Title"
      autoComplete="off"
      value={title}
      onChange={(e) => {
        setTitle(e.target.value)
        sharable.title = e.target.value;
      }}
    />
  );

  return mode == ComponentMode.Edit ? input : header;
}

function SharableTagline({ sharable, mode }: { sharable: Sharable, mode: ComponentMode }) {
  const [ tagLine, setTagLine ] = useState(sharable.tagLine);
  
  const header = (
    <Typography
      variant='body1'
    >
      {tagLine}
    </Typography>
  );

  const input = (
    <TextField
      label="Tagline"
      autoComplete="off"
      value={tagLine}
      onChange={(e) => {
        setTagLine(e.target.value)
        sharable.tagLine = e.target.value;
      }}
    />
  );

  return mode == ComponentMode.Edit ? input : header;
}

function SharableDescription({ sharable, mode }: { sharable: Sharable, mode: ComponentMode }) {
  const [ description, setDescription ] = useState(sharable.description);
  
  const header = (
    <Typography
      variant='body1'
    >
      {description}
    </Typography>
  );

  const input = (
    <TextField
      label="Description"
      autoComplete="off"
      rows={4}
      multiline
      fullWidth={true}
      value={description}
      onChange={(e) => {
        setDescription(e.target.value)
        sharable.description = e.target.value;
      }}
    />
  );

  return mode == ComponentMode.Edit ? input : header;
}

export function SharableCard({ sharable, id, type }: { sharable: Sharable, id: string, type: string }) {
  return (
    <Card
      sx={{ width: '300px' }}
    >
      <CardActionArea
        href={`https://myskillstudy.com/${type}/${id}`}
      >
        <CardContent>
          <Typography
            variant="h6"
          >
            {sharable.title}
          </Typography>

          <Rating
            name="skill-rating"
            value={sharable.rating}
            precision={0.5}
            readOnly={true}
          />

          <Typography>
            {sharable.description}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={0}
          />
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Chip
          label="Save For Later"
        />
      </CardActions>
    </Card>
  );
}
