import { EPage, IAuthObject } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage() || null;

  get activePage() {
    return this._activePage;
  }

  set activePage(page: string) {
    this._activePage = page;
  }

  get auth() {
    return this._auth;
  }

  set auth(loginObj: IAuthObject | null) {
    this._auth = loginObj;
  }

  private getAuthObjectFromLocalStorage() {
    if (localStorage.getItem('authObject')) {
      return JSON.parse(localStorage.getItem('auth') as string) as IAuthObject;
    }

    return null;
  }
}
