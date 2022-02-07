export interface ITemplate {
  getHTML: () => string;
}
export interface IAudiocall {
  getHTML: () => string;
  initAudiocall: () => void;
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
  activePage: string;
  auth: IAuthObject | null;
}

export interface IWordData {
  id: string;
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

export type IWordsData = IWordData[];

export enum EPage {
  auth = "auth",
  main = "main",
  electronBook = "electronBook",
  audiocall = "audiocall",
  sprint = "sprint",
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
