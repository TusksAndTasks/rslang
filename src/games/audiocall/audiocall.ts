import { model } from "../../ts";
import { api } from "../../ts/api";
import { changeLevel } from "./change-level";
import { gamePage } from "./game-page";

export class Audiocall {
  public initAudiocall(): void {
    const contentEl = document.getElementById("content") as HTMLElement;
    contentEl.innerHTML = changeLevel.getHTML();
    const levels = document.getElementById("levels") as HTMLElement;
    document.onkeyup = (e: KeyboardEvent) => {
      const group = Number(e.key) - 1;
      if (group >= 0 && group < 6) {
        const page = Math.floor(Math.random() * (model.numberOfPages + 1));
        if (model.auth) {
          api
            .getAggregatedWords(
              model.auth.userId,
              20,
              `%7B%22%24and%22%3A%5B%7B%22group%22%3A${group}%2C%20%22page%22%3A${page}%7D%5D%7D`
            )
            .then((resp) => {
              model.audiocallWordsArray = resp;
              gamePage.startGame(page, group);
            });
        } else {
          gamePage.startGame(page, group);
        }
      }
    };
    levels.addEventListener("click", (e: Event): void => {
      const element = e.target as HTMLElement;
      if (Number(element.dataset.level) >= 0) {
        const group = Number(element.dataset.level);
        const page = Math.floor(Math.random() * (model.numberOfPages + 1));
        if (model.auth) {
          api
            .getAggregatedWords(
              model.auth.userId,
              20,
              `%7B%22%24and%22%3A%5B%7B%22group%22%3A${group}%2C%20%22page%22%3A${page}%7D%5D%7D`
            )
            .then((resp) => {
              model.audiocallWordsArray = resp;
              gamePage.startGame(page, group);
            });
        } else {
          gamePage.startGame(page, group);
        }
      }
    });
  }
}
