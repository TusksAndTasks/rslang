export interface ITemplate {
  getHTML: () => string;
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
}

export interface IView {
  renderApp: () => void;
  renderHeader: () => void;
  renderFooter: () => void;
  renderContent: (content: string) => void;
}

export interface IModel {
  activePage: string
  previousPage: string | null;
  auth: IAuthObject | null
  electronBookPage: number;
  electronBookGroup: number;
}

export enum EPage {
  auth = 'auth',
  main = 'main',
  electronBook = 'electronBook',
  audiocall = 'audiocall',
  sprint = 'sprint',
  statistics = 'statistics'
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
}

export interface INewWord {
  difficulty: string,
  optional: object
}