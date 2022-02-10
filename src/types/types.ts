export interface ITemplate {
  getHTML: () => string;
}

export interface ISprint extends ITemplate {
  startSprint: () => void;
}

export interface ISprintStat extends ITemplate {
  showStatWords: () => void;
}

export interface ISprintDifficulty extends ITemplate {
  setDifficultyListeners: () => void;
}

export interface IHeader {
  getHTML: (auth: IAuthObject | null) => string;
}

export interface IAuth {
  getHTML: () => string;
  init: () => void;
  openAuthModal: () => void;
  registrateUser: (name: string, email: string, password: string) => void;
  loginUser: (email: string, password: string) => void;
  validateEmail: (email: string) => RegExpMatchArray | null;
  showError: (input: HTMLInputElement) => void;
  backToMainPage: () => void;
  showAuthStatusMessage: (status: string, isSuccess: boolean) => void;
  setLogoutButton: () => void;
  setLoginButton: () => void;
  logoutUser: () => void;
}


export interface IView {
  renderApp: () => void;
  renderHeader: () => void;
  renderFooter: () => void;
  renderContent: (content: string) => void;
}

export interface IModel {
  activePage: string
  auth: IAuthObject | null
  sprintTimer: number;
  sprintStatData: ISprintStatObj;
  updateSprintStatData: (correctWord: IWordData | null, incorrectWord: IWordData | null, learnedWord: IWordData | null, streak: number) => void;
}

export enum EPage {
  auth = 'auth',
  main = 'main',
  electronBook = 'electronBook',
  audiocall = 'audiocall',
  sprint = 'sprint',
  sprintStat = 'sprint-stat',
  sprintDifficulty = 'sprint-difficulty', 
  statistics = 'statistics',
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
  wordTranslate: string,
  correct: boolean
}

export interface IUser {
  name: string,
  email: string,
  password: string
}

export interface IAuthObject {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}

export interface ISprintStatObj {
  correctWords: Array<IWordData>,
  incorrectWords: Array<IWordData>,
  learnedWords: Array<IWordData>,
  maxStreak: number
}

export type IWordsData = IWordData[];