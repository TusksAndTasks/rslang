import { model } from ".";
import { EPage, IAuth, IElectronBook, IHeader, ISprint, ISprintDifficulty, ISprintStat, ITemplate, IAudiocall, IMain } from "../types/types";

export class View {
  private header: IHeader;
  private footer: ITemplate;
  private auth: IAuth;
  private main: IMain;
  private electronBook: IElectronBook;
  private audiocall: IAudiocall;
  private sprint: ISprint;
  private sprintStat: ISprintStat;
  private sprintDifficulty: ISprintDifficulty;
  private statistics: ITemplate;

  constructor(header: IHeader, footer: ITemplate, auth: IAuth, main: IMain, electronBook: IElectronBook, audiocall: IAudiocall, sprint: ISprint, sprintStat: ISprintStat, sprintDifficulty: ISprintDifficulty, statistics: ITemplate) {
    this.header = header;
    this.footer = footer;
    this.auth = auth;
    this.main = main;
    this.electronBook = electronBook;
    this.audiocall = audiocall;
    this.sprint = sprint;
    this.sprintStat = sprintStat;
    this.sprintDifficulty = sprintDifficulty;
    this.statistics = statistics;
  }

  public renderApp(): void {
    const body = document.body;
    const app = document.createElement("div");

    app.setAttribute("id", "app");
    app.classList.add("app");

    app.innerHTML = /*html*/ `
      <header id="header" class="header"></header>
      <main id="content" class="content"></main>
      <footer id="footer" class="footer"></foot>
    `;

    body.innerHTML = "";
    body.append(app);
  }

  public renderHeader(): void {
    const headerEl = document.querySelector("#header") as HTMLElement;
    headerEl!.innerHTML = this.header.getHTML(model.auth);
  }

  public renderFooter(): void {
    const footerEl = document.querySelector("#footer") as HTMLElement;
    footerEl!.innerHTML = this.footer.getHTML();
  }

  public renderContent(activePage: string = EPage.main): void {
    const contentEl = document.querySelector("#content") as HTMLElement;

    switch (activePage) {
      case EPage.auth:
        this.auth.init();
        break;

      case EPage.main:
        this.main.init();
        break;

      case EPage.electronBook:
        this.electronBook.init();
        break;

      case EPage.audiocall:
        this.audiocall.initAudiocall();
        break;

      case EPage.sprint:
        contentEl!.innerHTML = this.sprint.getHTML();
        this.sprint.startSprint();
        break;

      case EPage.sprintStat: 
        contentEl!.innerHTML = this.sprintStat.getHTML();
        this.sprintStat.showStatWords();
        break;

      case EPage.sprintDifficulty: 
        contentEl!.innerHTML = this.sprintDifficulty.getHTML();
        this.sprintDifficulty.setDifficultyListeners();
        break;

      case EPage.statistics:
        contentEl!.innerHTML = this.statistics.getHTML();
        break;

      default:
        contentEl!.innerHTML = this.main.getHTML();

        break;
    }
  }
}
