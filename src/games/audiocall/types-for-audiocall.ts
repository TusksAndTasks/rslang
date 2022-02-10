import { IWordsData } from "../../types/types";

export enum KeysLS {
  index = "indexWord",
  progress = "progress",
  textProgress = "textProgress",
  checkAnswers = "checkAnswers",
}
export enum ValueButtonNext {
  dontKnow = "Не знаю",
  next = "Дальше",
  last = "Результат",
}
export interface IDataListenerNext {
  words: IWordsData;
  buttonNext: HTMLButtonElement;
  circle: SVGCircleElement;
  contentProgress: HTMLElement;
  answers: HTMLElement;
  imageWord: HTMLElement;
  correctWord: HTMLElement;
  audioButton: HTMLButtonElement;
  audio: HTMLAudioElement;
}
export interface IDataRenderGame {
  words: IWordsData;
  answers: HTMLElement;
  imageWord: HTMLElement;
  buttonNext: HTMLButtonElement;
  correctWord: HTMLElement;
  audioButton: HTMLButtonElement;
  audio: HTMLAudioElement;
}
