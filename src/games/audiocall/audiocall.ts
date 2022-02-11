import { numberOfPages } from "../../types/types";
import { changeLevel } from "./change-level";
import { gamePage } from "./game-page";

export class Audiocall {
  public initAudiocall(): void {
    const contentEl = document.getElementById("content") as HTMLElement;
    contentEl.innerHTML = changeLevel.getHTML();
    const levels = document.getElementById("levels") as HTMLElement;

    levels.addEventListener("click", (e: Event): void => {
      const group = Number((e.target as HTMLElement).dataset.level);
      const page = Math.floor(Math.random() * (numberOfPages + 1));
      gamePage.startGame(page, group);
    });
  }
}
