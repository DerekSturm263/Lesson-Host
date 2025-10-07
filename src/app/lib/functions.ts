import { verifyShortAnswer, verifyMultipleChoice, verifyTrueOrFalse, rephraseText } from './generate';
import * as types from '../lib/types';
import * as helpers from '../lib/helpers';
import { FormEvent } from 'react';

export function complete(elementID: types.ElementID) {
  elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].isComplete = true;

  const nextElement: types.ElementID = helpers.getIsLastElement(elementID) ?
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex + 1, elementIndex: 0, keys: elementID.keys } :
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: elementID.elementIndex + 1, keys: elementID.keys };

  window.dispatchEvent(new CustomEvent(`updateChapterProgress${elementID.chapterIndex}`, { detail: helpers.getChapterProgress(elementID) }));
  window.dispatchEvent(new CustomEvent(`updateLessonProgress`, { detail: helpers.getLessonProgress(elementID) }));
}

export function loadGraph(elementID: types.ElementID) {
  const params = {
    "appName": helpers.getInteractionValue<types.Graph>(elementID).type,
    "width": 1067,
    "height": 600,
    "showToolBar": false,
    "showAlgebraInput": true,
    "showMenuBar": false,
    "filename": helpers.getInteractionValue<types.Graph>(elementID).fileName,
    "scaleContainerClass": "interaction"
  };

  //const applet = new GGBApplet(params, true);
  //applet.inject(`interaction${elementIndex}`);
}

export async function rephrase(elementID: types.ElementID) {
  helpers.setThinking(elementID, true);
  const newText = await rephraseText(helpers.getText(elementID));
  helpers.setText(elementID, newText);
  helpers.setThinking(elementID, false);

  readAloud(elementID);
}

export function readAloud(elementID: types.ElementID) {
  //const synth = window.speechSynthesis;
  //const utterance = new SpeechSynthesisUtterance(helpers.getText(elementID));
  //utterance.voice = synth.getVoices()[0];

  //synth.speak(utterance);
}

export function reset(elementID: types.ElementID) {
  helpers.resetText(elementID);

  switch (helpers.getElement(elementID).type) {
    case types.ElementType.Graph:
      loadGraph(elementID);
      break;
  }
}

export async function define(word: string) {
  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  if (!response.ok) {
    console.error(`Could not define ${word}`);
  }

  const data = JSON.parse(await response.json());
}
