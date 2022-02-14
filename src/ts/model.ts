import { EPage, IAuthObject, ISprintStatObj, IWordData, IWordsData } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _sprintTimer: number = 59;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage() || null;
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

  private getAuthObjectFromLocalStorage() {
    if (localStorage.getItem('authObject')) {
      return JSON.parse(localStorage.getItem('authObject') as string) as IAuthObject;
    }

    return null;
  }
}
