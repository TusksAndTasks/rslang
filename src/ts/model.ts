import { EPage, IAuthObject } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _previousPage: string | null = null;
  private _auth: IAuthObject | null = this.getAuthObjectFromLocalStorage();
  private _electronBookPage: number = this.getElectronBookPageFromLocalStorage();
  private _electronBookGroup: number = this.getElectronBookGroupFromLocalStorage();

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
      const electronBookGroup = +JSON.parse(localStorage.getItem('electronBookGroup') as string) as number;

      if (this.auth || !this.auth && electronBookGroup < 7) {
        return electronBookGroup;
      }
    }

    return 0;
  }
}
