import { verifyShortAnswer, verifyCodespace, rephraseText } from './generate';
import * as types from '../lib/types';

function complete(elementID: types.ElementID) {
  const dots = document.getElementsByClassName(`dot${elementID.elementIndex}`) as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.iscomplete = "true";
  }

  if (elementID.getIsLastElement()) {
    const thisButton = document.getElementById(`chapterButton${elementID.chapterIndex}`);

    if (thisButton)
      thisButton.dataset.iscomplete = "true";
      
    const thisCheckmark = document.getElementById(`chapterCheckmark${elementID.chapterIndex}`);

    if (thisCheckmark)
      thisCheckmark.dataset.iscomplete = "true";
  }

  unlock(elementID);
}

function unlock(elementID: types.ElementID) {
  const dots = document.getElementsByClassName(`dot${elementID.elementIndex}`) as HTMLCollectionOf<HTMLButtonElement>;
  for (let i = 0; i < dots.length; ++i) {
    dots[i].disabled = false;
  }

  if (elementID.getIsLastElement()) {
    const nextButton = document.getElementById(`chapterButton${elementID.chapterIndex + 1}`) as HTMLButtonElement;
    nextButton.disabled = false;
  }
}

export function load(elementID: types.ElementID) {
  const content = document.getElementsByClassName("element") as HTMLCollectionOf<HTMLElement>;
  const thisContent = document.getElementById(`element${elementID.elementIndex}`);
    
  for (let i = 0; i < content.length; ++i) {
    content[i].style.display = "none";
  }

  if (thisContent)
    thisContent.style.display = "block";

  const buttons = document.getElementsByClassName("chapterButton") as HTMLCollectionOf<HTMLButtonElement>;
  const thisButton = document.getElementById(`chapterButton${elementID.chapterIndex}`);

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].dataset.isselected = "false";
  }

  if (thisButton)
    thisButton.dataset.isselected = "true";

  const dots = document.getElementsByClassName(`dot`) as HTMLCollectionOf<HTMLButtonElement>;
  const theseDots = document.getElementsByClassName(`dot${elementID.elementIndex}`) as HTMLCollectionOf<HTMLButtonElement>;

  for (let i = 0; i < dots.length; ++i) {
    dots[i].dataset.isselected = "false";
  }
  for (let i = 0; i < theseDots.length; ++i) {
    theseDots[i].dataset.isselected = "true";
  }
}

export function loadGraph(elementID: types.ElementID) {
  const params = {
    "appName": elementID.getInteractionValue<types.Graph>().type,
    "width": 1067,
    "height": 600,
    "showToolBar": false,
    "showAlgebraInput": true,
    "showMenuBar": false,
    "filename": elementID.getInteractionValue<types.Graph>().fileName,
    "scaleContainerClass": "interaction"
  };

  //const applet = new GGBApplet(params, true);
  //applet.inject(`interaction${elementIndex}`);
}

export function loadCodespace(elementID: types.ElementID) {
  elementID.getInteractionElement<HTMLIFrameElement>((interaction) => {
    if (!interaction.contentWindow)
      return;

    interaction.contentWindow.postMessage({
      eventType: 'populateCode',
      language: elementID.getInteractionValue<types.Codespace>().language,
      files: elementID.getInteractionValue<types.Codespace>().files
    }, "*");

    // Submit Codespace
    interaction.contentWindow.onmessage = async function(e) {
      if (!e.data)
        return;

      if (e.data.action == 'runStart') {
        elementID.startThinking();
      } else if (e.data.action == 'runComplete') {
        const feedback = await verifyCodespace(elementID.getElement().text, e.data.files, e.data.result, elementID.getInteractionValue<types.Codespace>().correctOutput ?? '', e.data.language);
    
        elementID.setText(feedback.feedback);
    
        if (feedback.isValid) {
          complete(elementID);
        }
      }
    }
  });
}

export async function rephrase(elementID: types.ElementID) {
  elementID.startThinking();
  const newText = await rephraseText(elementID.getText());
  elementID.setText(newText);
}

export function readAloud(elementID: types.ElementID) {

}

export function reset(elementID: types.ElementID) {
  elementID.resetText();

  switch (elementID.getElement().type) {
    case types.ElementType.Graph:
      loadGraph(elementID);
      break;

    case types.ElementType.Codespace:
      loadCodespace(elementID);
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
  elementID.startThinking();
  const feedback = await verifyShortAnswer(elementID.getElement().text, formData.get('response')?.toString() ?? '');
  elementID.setText(feedback.feedback);

  if (feedback.isValid) {
    elementID.getInteractionElement<HTMLInputElement>((interaction) =>{
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
