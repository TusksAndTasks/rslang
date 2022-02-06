import { EPage, IAuthObject } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _sprintTimer: number = 59;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage() || null;

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
