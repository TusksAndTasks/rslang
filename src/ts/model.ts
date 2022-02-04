import { EPage } from "../types/types";

export class Model {
  private _activePage: string = EPage.main;
  private _actualGroup: number | null = null;

  get activePage() {
    return this._activePage;
  }

  set activePage(page: string) {
    this._activePage = page;
  }

  get actualGroup() {
    return this._actualGroup;
  }

  set actualGroup(group: number | null) {
    this._actualGroup = group;
  }
}
