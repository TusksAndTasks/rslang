import { IWordsData } from "./../../types/types";
import { model, view } from "../../ts";
import { api } from "../../ts/api";
import { EPage } from "../../types/types";

export class SprintDifficulty {
  public getHTML(): string {
    return `
    <div class="sprint-diff mt-10">
      <h2 class="sprint-title">Мини-игра спринт</h2>
      <div class="sprint-diff__icon"></div>
      <p> Выберите сложность игры </p>
      <div class="sprint-difficulty">
        <button class="btn btn-blue" id="sd0">1</button>
        <button class="btn btn-blue" id="sd1">2</button>
        <button class="btn btn-blue" id="sd2">3</button>
        <button class="btn btn-blue" id="sd3">4</button>
        <button class="btn btn-blue" id="sd4">5</button>
        <button class="btn btn-blue" id="sd5">6</button>
      </div>
      `;
  }

  public setDifficultyListeners() {
    const buttonsContainer = document.querySelector(
      ".sprint-difficulty"
    ) as HTMLElement;
    buttonsContainer.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).classList.contains("btn-blue")) {
        this.startSprintGame(
          +((e.target as HTMLElement).id.slice(2) as string)
        );
      }
    });

    document.onkeyup = (e) => {
      if (+e.key >= 1 && +e.key <= 6) {
        this.startSprintGame(+(e.key as string) - 1);
      }
    };
  }

  private getRandomPage() {
    const pageAmount = 30;
    return Math.floor(Math.random() * pageAmount);
  }

  private async setWordsArray(group: number) {
    try {
      const page = this.getRandomPage();
      const response = await api.getWords(group, page);
      model.sprintWordsArray = response as IWordsData;
    } catch (err) {
      throw err;
    }
  }

  private async startSprintGame(group: number) {
    try {
      this.setWordsArray(group).then(() => {
        model.previousPage = model.activePage;
        model.activePage = EPage.sprint;
        view.renderContent(model.activePage);
      });
    } catch (err) {
      throw err;
    }
  }
}
