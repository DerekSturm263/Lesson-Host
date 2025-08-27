import * as types from "./types";

export function getChapter(elementID: types.ElementID): types.Chapter {
  return elementID.learn.chapters[elementID.chapterIndex];
}

export function getElement(elementID: types.ElementID): types.Element {
  return getChapter(elementID).elements[elementID.elementIndex];
}

export function getAbsoluteIndex(elementID: types.ElementID): number {
  let index = 0;

  for (let i = 0; i < elementID.chapterIndex; ++i) {
    index += elementID.learn.chapters[i].elements.length;
  }

  return index + elementID.elementIndex;
}

export function getIsLastElement(elementID: types.ElementID): boolean {
  return getChapter(elementID).elements.length - 1 == elementID.elementIndex;
}

// Gets the last non-thinking text.
export function getText(elementID: types.ElementID): string {
  const parent = document.getElementById(`text${getAbsoluteIndex(elementID)}`);

  return parent?.dataset.lastnonthinkingtext ?? "";
}

// Sets text and doesn't update non-thinking text.
export function startThinking(elementID: types.ElementID) {
  const parent = document.getElementById(`text${getAbsoluteIndex(elementID)}`);
  const element = parent?.firstElementChild?.firstElementChild;
  if (!element)
    return;

  element.textContent = "*Thinking...*";
}

// Sets text and updates the non-thinking text.
export function setText(elementID: types.ElementID, text: string) {
  const parent = document.getElementById(`text${getAbsoluteIndex(elementID)}`);
  const element = parent?.firstElementChild?.firstElementChild;
  if (!element)
    return;

  element.innerHTML = text;
  parent.dataset.lastnonthinkingtext = text;
}

// Resets to the original text.
export function resetText(elementID: types.ElementID) {
  setText(elementID, getElement(elementID).text);
}

export function getInteractionElement<T>(elementID: types.ElementID, func: (value: T) => void) {
  func(document.getElementById(`interaction${getAbsoluteIndex(elementID)}`) as T);
}

export function getInteractionValue<T>(elementID: types.ElementID): T {
  return getElement(elementID).value as T;
}
