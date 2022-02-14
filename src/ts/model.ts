import { EPage, IAuthObject, ISprintStatObj, IWordData, IWordsData } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _previousPage: string | null = null;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage();
  private _electronBookPage: number = this.getElectronBookPageFromLocalStorage();
  private _electronBookGroup: number = this.getElectronBookGroupFromLocalStorage();
  private _sprintTimer: number = 59;
  private _sprintStatData: ISprintStatObj = {
    correctWords: [],
    incorrectWords: [],
    learnedWords: [],
    maxStreak: 0
};
  private _sprintWordsArray: IWordsData = [];
  private _sprintScore: string = '0';

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

  set sprintWordsArray(arr: IWordsData){
    this._sprintWordsArray = arr;
  }

  get sprintScore(){
    return this._sprintScore;
  }

  set sprintScore(score: string){
    this._sprintScore = score;
  }

  public updateSprintStatData(correctWord: IWordData | null = null, incorrectWord: IWordData | null = null, learnedWord: IWordData | null = null, streak: number = 0) {
    if (correctWord) { this._sprintStatData.correctWords.push(correctWord) };
    if (incorrectWord) { this._sprintStatData.incorrectWords.push(incorrectWord) };
    if (learnedWord) { this._sprintStatData.learnedWords.push(learnedWord) };
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
