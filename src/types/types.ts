export interface ITemplate {
  getHTML: () => string;
}

export interface ISprint extends ITemplate {
  startSprint: () => void;
}


export interface IView {
  renderApp: () => void;
  renderHeader: () => void;
  renderFooter: () => void;
  renderContent: (content: string) => void;
}

export interface IModel {
  activePage: string;
  sprintTimer: number
}

export enum EPage {
  auth = 'auth',
  main = 'main',
  electronBook = 'electronBook',
  audiocall = 'audiocall',
  sprint = 'sprint'
}

export interface IWordData {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export interface ISprintWord {
  word: string,
  wordTranslate: string;
  correct: boolean;
}