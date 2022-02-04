import { EPage, IModel, IView } from "../types/types";

export class Controller {
  private view: IView;
  private model: IModel;

  constructor(view: IView, model: IModel) {
    this.view = view;
    this.model = model;
  }

  public initApp(): void {
    this.view.renderApp();
    this.view.renderHeader();
    this.view.renderFooter();
    this.view.renderContent(EPage.main);
    this.addHeaderListeners();
  }

  // Header
  private addHeaderListeners(): void {
    const authBtn = document.querySelector("#auth-btn") as HTMLElement;
    const mainBtn = document.querySelector("#main-btn") as HTMLElement;
    const electronBookBtn = document.querySelector(
      "#electron-book-btn"
    ) as HTMLElement;
    const audioCallBtn = document.querySelector(
      "#audio-call-btn"
    ) as HTMLElement;
    const sprintBtn = document.querySelector("#sprint-btn") as HTMLElement;

    authBtn.addEventListener("click", (): void => {
      this.model.activePage = EPage.auth;
      this.view.renderContent(this.model.activePage);
    });

    mainBtn.addEventListener("click", (): void => {
      this.model.activePage = EPage.main;
      this.view.renderContent(this.model.activePage);
    });

    electronBookBtn.addEventListener("click", (): void => {
      this.model.activePage = EPage.electronBook;
      this.view.renderContent(this.model.activePage);
    });

    audioCallBtn.addEventListener("click", (): void => {
      this.model.activePage = EPage.audiocall;
      this.view.renderContent(this.model.activePage);
    });

    sprintBtn.addEventListener("click", (): void => {
      this.model.activePage = EPage.sprint;
      this.view.renderContent(this.model.activePage);
    });
  }
}
