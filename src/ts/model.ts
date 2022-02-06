import { EPage } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _sprintTimer: number = 59;

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
}
