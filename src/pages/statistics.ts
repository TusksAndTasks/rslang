import { model, view } from "../ts";
import { EPage } from "../types/types";

export class Statistics {
  public initStatistics() {
    const contentEl = document.getElementById("content") as HTMLElement;
    if (model.auth) {
      contentEl.innerHTML = this.getHTMLFotAuth();
    } else {
      contentEl.innerHTML = this.getHTMLFotNoAuth();
      const btnBack = document.getElementById(
        "statistic-btn-back"
      ) as HTMLElement;
      btnBack.onclick = () => {
        view.renderContent(EPage.main);
      };
    }
  }
  private getHTMLFotNoAuth(): string {
    return /*html*/ `
    <div class="statistics mt-10">
    <h2> Cтатистика </h2>
    <div class="statistics__icon"></div>
    <p>  Страница недоступна для неавторизованного пользователя </p>
    <button id="statistic-btn-back" class="btn btn-blue"> На главную </button>
    </div>
    `;
  }
  private getHTMLFotAuth(): string {
    return /*html*/ `
    <div class="statistics mt-10">
    <h2> Cтатистика </h2>
    <div class="statistics__icon"></div>
    <p> s </p>

    </div>
    `;
  }
}
