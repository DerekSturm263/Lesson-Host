import { SyntheticEvent, MouseEvent } from 'react';
import { verifyShortAnswer, verifyCodespace, rephraseText } from './generate';

export function wordByWordify(text: string): string {
  const words = text.split(' ');
  const wrappedWords = words.map((word, index) => `<span class="word" ondblclick="define('${word.replace(/\W/g, '')}')" title="Double click to define this word" style="--index:${index / 8}s;">${word}</span>`);
  const rejoinedWords = wrappedWords.join(' ');

  return rejoinedWords;
}

function setThinkingText(textElement: HTMLDivElement) {
  const thinkingText = wordByWordify("<i>Thinking...</i>");

  if (textElement.innerHTML != thinkingText)
    textElement.innerHTML = thinkingText;
}

async function define(word: string) {
  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  if (!response.ok) {
    console.error(`Could not define ${word}`);
  }

  const data = JSON.parse(await response.json());
}

function complete(element: HTMLDivElement) {
  let dots = document.getElementsByClassName(`dot${elementIndex}`);
  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.iscomplete = true;
  }

  if (isLastElement) {
    let thisButton = document.getElementById(`chapterButton${chapterIndex}`);
    thisButton.dataset.iscomplete = true;
      
    let thisCheckmark = document.getElementById(`chapterCheckmark${chapterIndex}`);
    thisCheckmark.dataset.iscomplete = true;
  }

  unlock(chapterIndex, elementIndex + 1, isLastElement);
}

function unlock(element: HTMLDivElement) {
  let dots = document.getElementsByClassName(`dot${elementIndex}`);
  for (let i = 0; i < dots.length; ++i) {
    dots[i].disabled = false;
  }

  if (isLastElement) {
    let nextButton = document.getElementById(`chapterButton${chapterIndex + 1}`);
    nextButton.disabled = false;
  }
}

export function load(e: MouseEvent<HTMLButtonElement>) {
  let content = document.getElementsByClassName("chapterContent");
  let thisContent = document.getElementById(`chapterContent${elementIndex}`);
    
  for (let i = 0; i < content.length; ++i) {
    content[i].style.display = "none";
  }

  thisContent.style.display = "block";

  let buttons = document.getElementsByClassName("chapterButton");
  let thisButton = document.getElementById(`chapterButton${chapterIndex}`);

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].dataset.isselected = false;
  }

  thisButton.dataset.isselected = true;

  let dots = document.getElementsByClassName(`dot`);
  let theseDots = document.getElementsByClassName(`dot${elementIndex}`);

  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.isselected = false;
  }
  for (let i = 0; i < theseDots.length; ++i) {
    theseDots[i].dataset.isselected = true;
  }

  currentChapter = chapterIndex;
  currentElement = elementIndex;
  currentIsLastElement = isLastElement;
}

export function loadGraph(e: SyntheticEvent<HTMLDivElement, Event>) {
  const params = {
    "appName": e.currentTarget.dataset.type,
    "width": 1067,
    "height": 600,
    "showToolBar": false,
    "showAlgebraInput": true,
    "showMenuBar": false,
    "filename": e.currentTarget.dataset.filename,
    "scaleContainerClass": "interaction"
  };

  //const applet = new GGBApplet(params, true);
  //applet.inject(`interaction${elementIndex}`);
}

export function loadCodespace(e: SyntheticEvent<HTMLIFrameElement, Event>) {
  e.currentTarget.contentWindow?.postMessage({
    eventType: 'populateCode',
    language: e.currentTarget.dataset.language,
    files: JSON.parse(e.currentTarget.dataset.files ?? '')
  }, "*");
}

export async function rephrase(e: MouseEvent<HTMLButtonElement>) {
  let text = e.currentTarget.parentElement?.parentElement?.previousElementSibling as HTMLDivElement;

  setThinkingText(text);
  const newText = await rephraseText(text.dataset.lastnonthinkingtext ?? '');

  text.innerHTML = wordByWordify(newText);
  text.dataset.lastnonthinkingtext = newText;
}

export function readAloud(e: MouseEvent<HTMLButtonElement>) {
  let text = e.currentTarget.parentElement?.parentElement?.previousElementSibling as HTMLDivElement;
}

export function reset(e: MouseEvent<HTMLButtonElement>) {
  let text = e.currentTarget.parentElement?.parentElement?.previousElementSibling as HTMLDivElement;
  text.innerHTML = wordByWordify(text.dataset.originaltext ?? '');

  let interaction = e.currentTarget.parentElement?.parentElement?.parentElement?.previousElementSibling?.firstChild?.firstChild as HTMLElement;
  
  switch (interaction.parentElement?.dataset.type) {
    case 'graph':
      loadGraph({ currentTarget: interaction as HTMLDivElement } as SyntheticEvent<HTMLDivElement, Event>);
      break;

    case 'codespace':
      loadCodespace({ currentTarget: interaction as HTMLIFrameElement } as SyntheticEvent<HTMLIFrameElement, Event>);
      break;
  }
}

export async function submitShortAnswer(formData: FormData) { // TODO: FINISH
  let text = formData.??.parentElement?.parentElement?.nextElementSibling.firstChild;
  let interaction = formData.;

  setThinkingText(text);
  const feedback = await verifyShortAnswer(text.dataset.originaltext, formData.get('response')?.toString() ?? '');

  text.innerHTML = wordByWordify(feedback.feedback);
  text.dataset.lastnonthinkingtext = feedback.feedback;

  if (feedback.isValid) {
    interaction.value = "";
    interaction.disabled = true;

    complete(chapterIndex, elementIndex, isLastElement);
  }
}

// Submit Codespace
window.onmessage = function(e) {
  if (!e.data)
    return;

  if (e.data.action == 'runStart') {
    setThinkingText(currentChapter, currentElement, currentIsLastElement);
    
    actualCurrentChapter = currentChapter;
    actualCurrentElement = currentElement;
    actualCurrentIsLastElement = currentIsLastElement;
  } else if (e.data.action == 'runComplete') {
    let text = document.getElementById(`text${actualCurrentElement}`);
    let iframe = document.getElementById(`interaction${actualCurrentElement}`);

    const feedback = await verifyCodespace(text.dataset.originaltext, e.data.files, e.data.result, iframe.dataset.correctoutput, e.data.language);
    
    text.innerHTML = wordByWordify(feedback.feedback);
    text.dataset.lastnonthinkingtext = feedback.feedback;
          
    if (feedback.isValid) {
      complete(actualCurrentChapter, actualCurrentElement, actualCurrentIsLastElement);
    }
  }
};
