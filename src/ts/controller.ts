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
    const mainBtn = document.getElementById('main-btn') as HTMLElement;
    const electronBookBtn = document.getElementById('electron-book-btn') as HTMLElement;
    const audioCallBtn = document.getElementById('audio-call-btn') as HTMLElement;
    const sprintBtn = document.getElementById('sprint-btn') as HTMLElement;
    const autBtn = document.getElementById('logout-btn') || document.getElementById('login-btn') as HTMLElement;
    const statisticsBtn = document.getElementById('statistics-btn') as HTMLElement;
    const iconMenu = document.getElementById('icon-menu') as HTMLElement;

    this.setActiveMenuItem(mainBtn);

    iconMenu.addEventListener('click', () => {
      if (iconMenu.classList.contains('icon-menu--active')) {
        this.toggleHeaderMenu('close');
      } else {
        this.toggleHeaderMenu('open');
      }
    });

      
    autBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.auth;
      this.view.renderContent(this.model.activePage);
    });

    mainBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.main;
      this.view.renderContent(this.model.activePage);
      this.toggleHeaderMenu('close');
      this.setActiveMenuItem(mainBtn);
    });

    electronBookBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.electronBook;
      this.view.renderContent(this.model.activePage);
      this.toggleHeaderMenu('close');
      this.setActiveMenuItem(electronBookBtn);
    });

    audioCallBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.audiocall;
      this.view.renderContent(this.model.activePage);
      this.toggleHeaderMenu('close');
      this.setActiveMenuItem(audioCallBtn);
    });

    sprintBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.sprintDifficulty;
      this.view.renderContent(this.model.activePage);
      this.toggleHeaderMenu('close');
      this.setActiveMenuItem(sprintBtn);
    });

    statisticsBtn.addEventListener('click', (): void => {
      this.model.previousPage = this.model.activePage;
      this.model.activePage = EPage.statistics;
      this.view.renderContent(this.model.activePage);
      this.toggleHeaderMenu('close');
      this.setActiveMenuItem(statisticsBtn);
    });
  }

  public setActiveMenuItem(menuItem: HTMLElement): void {
    const bodyMenu = document.querySelector('.body-menu') as HTMLElement;
    const menuItems = [...bodyMenu.children] as HTMLElement[];

    menuItems.forEach(li => li.classList.remove('menu-item-active'));
    menuItem.classList.add('menu-item-active');
  }

  public toggleHeaderMenu(action: string) {
    const iconMenu = document.getElementById('icon-menu') as HTMLElement;
    const bodyMenu = document.getElementById('body-menu') as HTMLElement;

    if (action === 'close') {
      iconMenu.classList.remove('icon-menu--active');
      bodyMenu.classList.remove('body-menu--active');
    } else {
      iconMenu.classList.add('icon-menu--active');
      bodyMenu.classList.add('body-menu--active');
    }
  }
}
