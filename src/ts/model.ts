import { EPage, IAuthObject, ISprintStatObj, IWord, IWordData, IWordsData } from "../types/types";

export class Model {
  public numberOfPages = 30;
  public numberOfQuestion = 20;
  private _activePage: string = EPage.main;
  private _previousPage: string | null = null;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage();
  private _electronBookPage: number = this.getElectronBookPageFromLocalStorage();
  private _electronBookGroup: number = this.getElectronBookGroupFromLocalStorage();
  private _sprintTimer: number = 59;
  private _sprintStatData: ISprintStatObj = {
    correctWords: [],
    incorrectWords: [],
    learnedWords: 0,
    maxStreak: 0
};
  private _audiocallStatData: number = 0;
  private _sprintWordsArray: Array<IWordData | IWord> = [] ;
  private _audiocallWordsArray: Array<IWordData | IWord> = [] ;
  private _sprintScore: string = '0';
  private _sprintNewWords: number = 0;
  private _audiocallNewWords: number = 0;
  private _audiocallCurrent: IWord | null = null;
  private _audiocallBackupArray: IWord[] = [];
  public electronBookLearnedWords: number = 0;

  get audiocallBackupArray() {
    return this._audiocallBackupArray as IWord[];
  }

  set audiocallBackupArray(words: IWord[]) {
    this._audiocallBackupArray= words;
  }

  get audiocallCurrent() {
    return this._audiocallCurrent as IWord;
  }

  set audiocallCurrent(word: IWord) {
    this._audiocallCurrent = word;
  }

  get activePage() {
    return this._activePage;
  }

  set activePage(page: string) {
    this._activePage = page;
  }

  get previousPage() {
    return this._previousPage;
  }

  set previousPage(page: string | null) {
    this._previousPage = page;
  }
  
  get sprintTimer() {
    return this._sprintTimer;
  }

  set sprintTimer(time: number) {
    this._sprintTimer = time;
  }

  get sprintStatData() {
    return this._sprintStatData;
  }

  set sprintStatData(stat: ISprintStatObj) {
    this._sprintStatData = stat;
  }

  get sprintWordsArray(){
    return this._sprintWordsArray;
  }

  set sprintWordsArray(arr: Array<IWordData | IWord>){
    this._sprintWordsArray = arr;
  }

  get sprintNewWords() {
    return this._sprintNewWords;
  }

  set sprintNewWords(stat: number) {
    this._sprintNewWords = stat;
  }


  get audiocallNewWords() {
    return this._audiocallNewWords;
  }

  set audiocallNewWords(stat: number) {
    this._audiocallNewWords = stat;
  }


  get audiocallWordsArray(){
    return this._audiocallWordsArray;
  }

  set audiocallWordsArray(arr: Array<IWordData | IWord>){
    this._audiocallWordsArray = arr;
  }

  get audiocallStatData() {
    return this._audiocallStatData;
  }

  set audiocallStatData(stat: number) {
    this._audiocallStatData = stat;
  }


  get sprintScore(){
    return this._sprintScore;
  }

  set sprintScore(score: string){
    this._sprintScore = score;
  }

 public updateSprintStatData(correctWord: IWordData | IWord | null = null, incorrectWord: IWordData | IWord | null = null, learnedWord: number = 0, streak: number = 0) {
    if (correctWord) { this._sprintStatData.correctWords.push(correctWord) };
    if (incorrectWord) { this._sprintStatData.incorrectWords.push(incorrectWord) };
    if (learnedWord) { this._sprintStatData.learnedWords = learnedWord };
    this._sprintStatData.maxStreak = streak > this._sprintStatData.maxStreak ? streak : this._sprintStatData.maxStreak
  }

  get auth() {
    return this._auth;
  }

  set auth(loginObj: IAuthObject | null) {
    this._auth = loginObj;
  }

  get electronBookPage() {
    return this._electronBookPage;
  }

  set electronBookPage(page: number) {
    this._electronBookPage = page;
    localStorage.setItem('electronBookPage', JSON.stringify(this._electronBookPage));
  }

  get electronBookGroup() {
    return this._electronBookGroup;
  }

  set electronBookGroup(group: number) {
    this._electronBookGroup = group;
    localStorage.setItem('electronBookGroup', JSON.stringify(this._electronBookGroup));
  }

  private getAuthObjectFromLocalStorage(): IAuthObject | null {
    if (localStorage.getItem('authObject')) {
      return JSON.parse(localStorage.getItem('authObject') as string) as IAuthObject;
    }

    return null;
  }

  private getElectronBookPageFromLocalStorage(): number {
    if (localStorage.getItem('electronBookPage')) {
      return +JSON.parse(localStorage.getItem('electronBookPage') as string) as number;
    }

    return 0;
  }

  private getElectronBookGroupFromLocalStorage(): number {
    if (localStorage.getItem('electronBookGroup')) {
      return +JSON.parse(localStorage.getItem('electronBookGroup') as string) as number;
    }

    return 0;
  }
}
