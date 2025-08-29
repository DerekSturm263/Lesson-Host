import { verifyShortAnswer, rephraseText } from './generate';
import * as types from '../lib/types';
import * as helpers from '../lib/helpers';

export function complete(elementID: types.ElementID) {
  const dots = document.getElementsByClassName(`dot${helpers.getAbsoluteIndex(elementID)}`) as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.iscomplete = "true";
  }

  if (helpers.getIsLastElement(elementID)) {
    const thisButton = document.getElementById(`chapterButton${elementID.chapterIndex}`);

    if (thisButton)
      thisButton.dataset.iscomplete = "true";
      
    const thisCheckmark = document.getElementById(`chapterCheckmark${elementID.chapterIndex}`);

    if (thisCheckmark)
      thisCheckmark.dataset.iscomplete = "true";
  }

  const nextElement: types.ElementID = helpers.getIsLastElement(elementID) ?
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex + 1, elementIndex: 0, keys: elementID.keys } :
    { learn: elementID.learn, chapterIndex: elementID.chapterIndex, elementIndex: elementID.elementIndex + 1, keys: elementID.keys };
  
  unlock(nextElement);
}

export function unlock(elementID: types.ElementID) {
  const dots = document.getElementsByClassName(`dot${helpers.getAbsoluteIndex(elementID)}`) as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < dots.length; ++i) {
    dots[i].disabled = false;
  }

  const chapterButton = document.getElementById(`chapterButton${elementID.chapterIndex}`) as HTMLButtonElement;
  chapterButton.disabled = false;
}

export function load(elementID: types.ElementID) {
  console.log(`loading ${JSON.stringify(elementID)}`);

  const content = document.getElementsByClassName('element') as HTMLCollectionOf<HTMLElement>;
  const thisContent = document.getElementById(`element${helpers.getAbsoluteIndex(elementID)}`);
    
  for (let i = 0; i < content.length; ++i) {
    content[i].style.display = "none";
  }

  if (thisContent)
    thisContent.style.display = "flex";

  const buttons = document.getElementsByClassName('chapterButton') as HTMLCollectionOf<HTMLButtonElement>;
  const thisButton = document.getElementById(`chapterButton${elementID.chapterIndex}`);

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].dataset.isselected = "false";
  }

  if (thisButton)
    thisButton.dataset.isselected = "true";

  const dots = document.getElementsByClassName(`dot`) as HTMLCollectionOf<HTMLButtonElement>;
  const theseDots = document.getElementsByClassName(`dot${helpers.getAbsoluteIndex(elementID)}`) as HTMLCollectionOf<HTMLButtonElement>;

  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.isselected = "false";
  }
  for (let i = 0; i < theseDots.length; ++i) {
    theseDots[i].dataset.isselected = "true";
  }

  readAloud(elementID);
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
  helpers.startThinking(elementID);
  const newText = await rephraseText(helpers.getText(elementID));
  helpers.setText(elementID, newText);

  readAloud(elementID);
}

export function readAloud(elementID: types.ElementID) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(helpers.getText(elementID));
  //utterance.voice = synth.getVoices()[0];

  synth.speak(utterance);
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

export async function submitShortAnswer(formData: FormData, elementID: types.ElementID) {
  helpers.startThinking(elementID);
  const feedback = await verifyShortAnswer(helpers.getElement(elementID).text, formData.get('response')?.toString() ?? '');
  helpers.setText(elementID, feedback.feedback);

  readAloud(elementID);

  if (feedback.isValid) {
    helpers.getInteractionElement<HTMLInputElement>(elementID, (interaction) => {
      interaction.value = "";
      interaction.disabled = true;
    });

    complete(elementID);
  }
}

export async function submitMultipleChoice(formData: FormData, elementID: types.ElementID) {

}

export async function submitTrueOrFalse(formData: FormData, elementID: types.ElementID) {

}
