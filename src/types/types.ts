export interface ITemplate {
  getHTML: () => string;
}
export interface IAudiocall {
  initAudiocall: () => void;
}

export enum NameBtnAudiocall {
  dontKnow = "Не знаю",
  next = "Дальше",
  last = "Результат",
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
  backToActivePage: () => void;
  showAuthStatusMessage: (status: string, isSuccess: boolean) => void;
  setLogoutButton: () => void;
  setLoginButton: () => void;
  logoutUser: () => void;
}

export interface IElectronBook {
  getHTML: () => string;
  init: () => void;
  initPagination: () => void;
  initPrevBtn(): void;
  initNextBtn(): void;
  initPageNumber(): void;
  switchPage(): void;
  validatePageNumber(paginationInput: HTMLInputElement, switchPageBtn: HTMLElement): void;
  initWords(group: number, page: number): void
  renderWordsList(): void;
  getWordCard(word: IWord): HTMLElement;
  getWordImage(word: IWord): Promise<HTMLImageElement>;
  getWordAudio(src: string): Promise<HTMLAudioElement>;
  initAudioPlayerBtn(wordCard: HTMLElement, word: IWord): void;
  sortWordsByNumber(arr: IWord[]): void;
  initGroups(): void;
  switchGroup(group: number): void;
  initGamesButtons(): void;
  checkEasyWordsCount(): void;
  hidePagination(): void;
  showPagination(): void
}

export interface IMain {
  getHTML: () => string;
  init: () => void;
  initStartBtn: () => void;
}

export interface IView {
  renderApp: () => void;
  renderHeader: () => void;
  renderFooter: () => void;
  renderContent: (content: string) => void;
  showFooter: () => void;
  hideFooter: () => void;
}

export interface IModel {
  activePage: string
  previousPage: string | null;
  auth: IAuthObject | null
  electronBookPage: number;
  electronBookGroup: number;
}

export interface IWordData {
  id: string;
  sprintTimer: number;
  sprintStatData: ISprintStatObj;
  updateSprintStatData: (
    correctWord: IWordData | IWord | null,
    incorrectWord: IWordData | IWord | null,
    learnedWord: IWordData | IWord | null,
    streak: number
  ) => void;
  sprintScore: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export enum EPage {
  auth = "auth",
  main = "main",
  electronBook = "electronBook",
  audiocall = "audiocall",
  sprint = "sprint",
  statistics = "statistics",
  sprintStat = "sprint-stat",
  sprintDifficulty = "sprint-difficulty",
}

export interface ISprintWord {
  word: string;
  wordTranslate: string;
  correct: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IAuthObject {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IWord {
  id: string;
  _id?: string;
  group: 0;
  page: 0;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  userWord?: IUserWord;
}

export interface IUserWord{
  difficulty: string
  optional: {
    correctCount: number;
    totalIncorrectCount: number;
    totalCorrectCount: number;
}
}


export interface INewWord {
  difficulty: string;
  optional: object;
}

export interface ISprintStatObj {
  correctWords: Array<IWordData | IWord>;
  incorrectWords: Array<IWordData | IWord>;
  learnedWords: number;
  maxStreak: number;
}

export interface IStatisticsObj {
  id?: string;
  learnedWords: number;
  optional: {
    sprint: {
      correctWords: number;
      incorrectWords: number;
      streak: number;
      newWords: number;
    }
    audiocall: {
      correctWords: number;
      incorrectWords: number;
      streak: number;
      newWords: number;
    }
  }
}

export interface IAggResponse {
  paginatedResults: Array<IWord>, totalCount: Array<any>;
}

export interface ISettings {
  id?: string;
  wordsPerDay: number;
  optional?: {
    dayStats: {[key: string] : IStatisticsObj,};
    dayLearnWords: {[key: string] : number};
  }
}


export type IWordsData = IWordData[];
