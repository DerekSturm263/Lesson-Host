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

  return parent?.firstChild?.firstChild?.textContent ?? '';
}

// Sets text and doesn't update non-thinking text.
export function setThinking(elementID: types.ElementID, isThinking: boolean) {
  window.dispatchEvent(new CustomEvent(`updateThinking${getAbsoluteIndex(elementID)}`, { detail: isThinking }));
}

// Sets text and updates the non-thinking text.
export function setText(elementID: types.ElementID, text: string) {
  window.dispatchEvent(new CustomEvent(`updateText${getAbsoluteIndex(elementID)}`, { detail: text }));
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

export function getLessonProgress(elementID: types.ElementID) {
  const elementCount = elementID.learn.chapters.reduce((sum, chapter) => sum += chapter.elements.length, 0);
  const elementsCompleted = elementID.learn.chapters.reduce((sum, chapter) => sum += chapter.elements.filter(element => element.isComplete).length, 0);

  return elementsCompleted / elementCount;
}

export function getChapterProgress(elementID: types.ElementID) {
  const elementCount = elementID.learn.chapters[elementID.chapterIndex].elements.length;
  const elementsCompleted = elementID.learn.chapters[elementID.chapterIndex].elements.filter(element => element.isComplete).length;

  return elementsCompleted / elementCount;
}
