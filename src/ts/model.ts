import { EPage, IAuthObject } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage() || null;
  private _electronBookPage: number = 0;
  private _electronBookGroup: number = 0;

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

  get electronBookPage() {
    return this._electronBookPage;
  }

  set electronBookPage(page: number) {
    this._electronBookPage = page;
  }

  get electronBookGroup() {
    return this._electronBookGroup;
  }

  set electronBookGroup(group: number) {
    this._electronBookGroup = group;
  }

  private getAuthObjectFromLocalStorage() {
    if (localStorage.getItem('authObject')) {
      return JSON.parse(localStorage.getItem('authObject') as string) as IAuthObject;
    }

    return null;
  }
}
