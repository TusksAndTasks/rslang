import { model } from "../../ts";
import { changeLevel } from "./change-level";
import { gamePage } from "./game-page";

export class Audiocall {
  public initAudiocall(): void {
    const contentEl = document.getElementById("content") as HTMLElement;
    contentEl.innerHTML = changeLevel.getHTML();
    const levels = document.getElementById("levels") as HTMLElement;
    document.onkeyup = (e: KeyboardEvent) => {
      const group = Number(e.code.slice(-1)) - 1;
      if (group >= 0 && group < 6) {
        const page = Math.floor(Math.random() * (model.numberOfPages + 1));
        gamePage.startGame(page, group);
      }
    };
    const header = document.getElementById("header") as HTMLElement;
    header.addEventListener("click", (e: Event) => {
      if (
        ((e.target as HTMLElement).id !== "audio-call-btn" &&
          (e.target as HTMLElement).tagName === "LI") ||
        (e.target as HTMLElement).id === "login-btn"
      ) {
        document.onkeyup = null;
      }
    });
    levels.addEventListener("click", (e: Event): void => {
      const group = Number((e.target as HTMLElement).dataset.level);
      const page = Math.floor(Math.random() * (model.numberOfPages + 1));
      gamePage.startGame(page, group);
    });
  }
}
