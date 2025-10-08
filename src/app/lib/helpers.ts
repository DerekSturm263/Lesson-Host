import { ElementID, Chapter, Element } from "./types";

export function getChapter(elementID: ElementID): Chapter {
  return elementID.learn.chapters[elementID.chapterIndex];
}

export function getElement(elementID: ElementID): Element {
  return getChapter(elementID).elements[elementID.elementIndex];
}

export function getAbsoluteIndex(elementID: ElementID): number {
  let index = 0;

  for (let i = 0; i < elementID.chapterIndex; ++i) {
    index += elementID.learn.chapters[i].elements.length;
  }

  return index + elementID.elementIndex;
}

export function getIsLastElement(elementID: ElementID): boolean {
  return getChapter(elementID).elements.length - 1 == elementID.elementIndex;
}

export function setThinking(elementID: ElementID, isThinking: boolean) {
  window.dispatchEvent(new CustomEvent('updateThinking', { detail: isThinking }));
}

export function getInteractionValue<T>(elementID: ElementID): T {
  return getElement(elementID).value as T;
}

export function completeElement(elementID: ElementID) {
  const lessonAmount = 0.2;

  window.dispatchEvent(new CustomEvent(`updateChapterProgress${elementID.chapterIndex}`, { detail: elementID.elementIndex }));
  window.dispatchEvent(new CustomEvent('updateLessonProgress', { detail: lessonAmount }));
  window.dispatchEvent(new CustomEvent('updateElement', { detail: true }));
}
