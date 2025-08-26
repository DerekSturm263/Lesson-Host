import { SyntheticEvent, MouseEvent } from 'react';
import { verifyShortAnswer, verifyCodespace, rephraseText } from './generate';
import * as types from '../lib/types';

type ElementID = {
  chapterIndex: number,
  elementIndex: number,
  chapter: types.Chapter,
  element: types.Element,
  isLastElement: boolean
};

function setThinkingText(textElement: HTMLDivElement) {
  if (textElement.textContent != "*Thinking...*")
    textElement.textContent = "*Thinking...*";
}

function complete(element: HTMLDivElement) {
  /*const dots = document.getElementsByClassName(`dot${elementIndex}`);
  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.iscomplete = true;
  }

  if (isLastElement) {
    const thisButton = document.getElementById(`chapterButton${chapterIndex}`);
    thisButton.dataset.iscomplete = true;
      
    const thisCheckmark = document.getElementById(`chapterCheckmark${chapterIndex}`);
    thisCheckmark.dataset.iscomplete = true;
  }

  unlock(chapterIndex, elementIndex + 1, isLastElement);*/
}

function unlock(element: HTMLDivElement) {
  /*const dots = document.getElementsByClassName(`dot${elementIndex}`);
  for (let i = 0; i < dots.length; ++i) {
    dots[i].disabled = false;
  }

  if (isLastElement) {
    const nextButton = document.getElementById(`chapterButton${chapterIndex + 1}`);
    nextButton.disabled = false;
  }*/
}

export function load(e: MouseEvent<HTMLButtonElement>) {
  /*const content = document.getElementsByClassName("chapterContent");
  const thisContent = document.getElementById(`chapterContent${elementIndex}`);
    
  for (let i = 0; i < content.length; ++i) {
    content[i].style.display = "none";
  }

  thisContent.style.display = "block";

  const buttons = document.getElementsByClassName("chapterButton");
  const thisButton = document.getElementById(`chapterButton${chapterIndex}`);

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].dataset.isselected = false;
  }

  thisButton.dataset.isselected = true;

  const dots = document.getElementsByClassName(`dot`);
  const theseDots = document.getElementsByClassName(`dot${elementIndex}`);

  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.isselected = false;
  }
  for (let i = 0; i < theseDots.length; ++i) {
    theseDots[i].dataset.isselected = true;
  }

  currentChapter = chapterIndex;
  currentElement = elementIndex;
  currentIsLastElement = isLastElement;*/
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

  // Submit Codespace
  if (e.currentTarget.contentWindow) {
    e.currentTarget.contentWindow.onmessage = function(e) {
      if (!e.data)
        return;

      console.log(e);

      /*if (e.data.action == 'runStart') {
        const text = e.source as HTMLDivElement;

        setThinkingText(text);
      } else if (e.data.action == 'runComplete') {
        const text = document.getElementById(`text${actualCurrentElement}`);
        const iframe = document.getElementById(`interaction${actualCurrentElement}`);

        const feedback = await verifyCodespace(text?.dataset.originaltext ?? '', e.data.files, e.data.result, iframe.dataset.correctoutput, e.data.language);
    
        text.textContent = feedback.feedback;
        text.dataset.lastnonthinkingtext = feedback.feedback;
    
        if (feedback.isValid) {
          complete(currentChapter, currentElement, currentIsLastElement);
        }
      }*/
    }
  }
}

export async function rephrase(e: MouseEvent<HTMLButtonElement>) {
  const text = e.currentTarget.parentElement?.parentElement?.previousElementSibling?.firstChild?.firstChild as HTMLDivElement;

  setThinkingText(text);
  const newText = await rephraseText(text.dataset.lastnonthinkingtext ?? '');

  text.textContent = newText;
  text.dataset.lastnonthinkingtext = newText;
}

export function readAloud(e: MouseEvent<HTMLButtonElement>) {
  const text = e.currentTarget.parentElement?.parentElement?.previousElementSibling?.firstChild?.firstChild as HTMLDivElement;
}

export function reset(e: MouseEvent<HTMLButtonElement>) {
  const text = e.currentTarget.parentElement?.parentElement?.previousElementSibling?.firstChild?.firstChild as HTMLDivElement;
  const interaction = e.currentTarget.parentElement?.parentElement?.parentElement?.previousElementSibling?.firstChild?.firstChild as HTMLElement;

  text.textContent = text.dataset.originaltext ?? '';
  
  switch (interaction.parentElement?.dataset.type) {
    case 'graph':
      loadGraph({ currentTarget: interaction as HTMLDivElement } as SyntheticEvent<HTMLDivElement, Event>);
      break;

    case 'codespace':
      loadCodespace({ currentTarget: interaction as HTMLIFrameElement } as SyntheticEvent<HTMLIFrameElement, Event>);
      break;
  }
}

export async function define(e: MouseEvent<HTMLButtonElement>) {
  const word = e.currentTarget.textContent;

  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  if (!response.ok) {
    console.error(`Could not define ${word}`);
  }

  const data = JSON.parse(await response.json());
}

export async function submitShortAnswer(formData: FormData) { // TODO: FINISH
  /*console.log(formData);

  const textElement = formData.??.parentElement?.parentElement?.nextElementSibling.firstChild;
  const interactionElement = formData.;

  setThinkingText(text);
  const feedback = await verifyShortAnswer(element.text, formData.get('response')?.toString() ?? '');

  textElement.textContent = feedback.feedback;
  textElement.dataset.lastnonthinkingtext = feedback.feedback;

  if (feedback.isValid) {
    interactionElement.value = "";
    interactionElement.disabled = true;

    complete(chapterIndex, elementIndex, isLastElement);
  }*/
}
