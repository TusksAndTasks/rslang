import { EPage } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;

  get activePage() {
    return this._activePage;
  }

  set activePage(page: string) {
    this._activePage = page;
  }
}
