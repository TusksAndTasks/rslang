import { EPage } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _isAuth: boolean = false;

  get activePage() {
    return this._activePage;
  }

  set activePage(page: string) {
    this._activePage = page;
  }

  get isAuth() {
    return this._isAuth;
  }

  set isAuth(status: boolean) {
    this._isAuth = status;
  }
}
