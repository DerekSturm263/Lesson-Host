import { rephraseText } from '@/app/lib/ai/functions';
import { ElementID } from '@/app/lib/types';
import * as helpers from '@/app/lib/helpers';

export function complete(elementID: ElementID) {
  elementID.learn.chapters[elementID.chapterIndex].elements[elementID.elementIndex].isComplete = true;

  const nextElement: ElementID = helpers.getIsLastElement(elementID) ?
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex + 1, elementIndex: 0, keys: elementID.keys } :
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: elementID.elementIndex + 1, keys: elementID.keys };

  window.dispatchEvent(new CustomEvent(`updateChapterProgress${elementID.chapterIndex}`, { detail: helpers.getChapterProgress(elementID) }));
  window.dispatchEvent(new CustomEvent(`updateLessonProgress`, { detail: helpers.getLessonProgress(elementID) }));

  window.dispatchEvent(new CustomEvent(`updateChapterProgress${nextElement.chapterIndex}`, { detail: helpers.getChapterProgress(nextElement) }));
}

export async function rephrase(elementID: ElementID) {
  helpers.setThinking(elementID, true);
  const newText = await rephraseText(helpers.getText(elementID));
  helpers.setText(elementID, newText);
  helpers.setThinking(elementID, false);

  readAloud(elementID);
}

export function readAloud(elementID: ElementID) {
  // Todo: Add better audio integration/UX

  //const synth = window.speechSynthesis;
  //const utterance = new SpeechSynthesisUtterance(helpers.getText(elementID));
  //utterance.voice = synth.getVoices()[0];

  //synth.speak(utterance);
}

export function reset(elementID: ElementID) {
  helpers.resetText(elementID);

  // Todo: Reset interaction value too
}

export async function define(word: string) {
  const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
  if (!response.ok) {
    console.error(`Could not define ${word}`);
  }

  const data = JSON.parse(await response.json());
  // Todo: Return defintion in dialog box
}
