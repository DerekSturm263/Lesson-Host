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

export function getInteractionValue<T>(elementID: ElementID): T {
  return getElement(elementID).value as T;
}
