import { EPage, IAutocall, ITemplate } from "../types/types";
import { model } from ".";
import { EPage, IAuth, IHeader, ITemplate } from "../types/types";

export class View {
  private header: IHeader;
  private footer: ITemplate;
  private auth: IAuth;
  private main: ITemplate;
  private electronBook: ITemplate;
  private audiocall: IAutocall;
  private sprint: ITemplate;

  constructor(header: IHeader, footer: ITemplate, auth: IAuth, main: ITemplate, electronBook: ITemplate, audiocall: ITemplate, sprint: ITemplate) {
    header: ITemplate,
    footer: ITemplate,
    auth: ITemplate,
    main: ITemplate,
    electronBook: ITemplate,
    audiocall: IAutocall,
    sprint: ITemplate
  ) {
    this.header = header;
    this.footer = footer;
    this.auth = auth;
    this.main = main;
    this.electronBook = electronBook;
    this.audiocall = audiocall;
    this.sprint = sprint;
  }

  public renderApp(): void {
    const body = document.body;
    const app = document.createElement("div");

    app.setAttribute("id", "app");
    app.classList.add("app");

    app.innerHTML = /*html*/ `
      <div id="header" class="header"></div>
      <div id="content" class="content"></div>
      <div id="footer" class="footer"></div>
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
        contentEl!.innerHTML = this.main.getHTML();
        break;

      case EPage.electronBook:
        contentEl!.innerHTML = this.electronBook.getHTML();
        break;

      case EPage.audiocall:
        contentEl!.innerHTML = this.audiocall.getHTML();
        this.audiocall.addListeners();
        break;

      case EPage.sprint:
        contentEl!.innerHTML = this.sprint.getHTML();
        break;

      default:
        contentEl!.innerHTML = this.main.getHTML();

        break;
    }
  }
}
