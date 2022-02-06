import { IWordsData, IWordData } from "../../types/types";
import { api } from "../../ts/api";
import { getPageLevel, getPageGame } from "./html-for-audiocall";
import {
  getArrOfAnswers,
  getRandomNumber,
  getSrc,
  createOffset,
  changeValFromLS,
} from "./secondary-functions";

const numberOfPages = 30;
const numberOfQuestion = 20;

export class Audiocall {
  public getHTML(): string {
    return /*html*/ getPageLevel();
  }

  public initAudiocall(): void {
    this.addListeners();
  }

  private playAudio(src: string): void {
    const audio = new Audio(src);
    audio.play();
    const audioAnimateElement = document.getElementById(
      "animation"
    ) as HTMLElement;
    const audioAnimate = audioAnimateElement.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.4)", opacity: 0.1 },
      ],
      { duration: 600, iterations: Infinity }
    );
    audio.addEventListener("ended", () => audioAnimate.cancel());
  }

  private addListeners(): void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    const levels = document.querySelector("#levels") as HTMLElement;
    levels.addEventListener("click", (e: Event): void => {
      const group = Number((e.target as HTMLElement).dataset.level);
      const page = getRandomNumber(numberOfPages);

      api.getWords(group, page).then((words) => {
        localStorage.setItem("indexWord", "0");
        localStorage.setItem("progress", "0");
        localStorage.setItem("textProgress", "0");
        const url = `${getSrc(
          words[Number(localStorage.getItem("index"))].image
        )}`;
        const backImg = `background-image:url(${url})`;
        const audioSrc = `${getSrc(
          words[Number(localStorage.getItem("index"))].audio
        )}`;
        contentEl.innerHTML = getPageGame(
          backImg,
          words[Number(localStorage.getItem("index"))]
        );

        this.playAudio(audioSrc);
        const audioButton = document.getElementById(
          "sound-btn"
        ) as HTMLButtonElement;
        audioButton.addEventListener("click", () => {
          this.playAudio(audioSrc);
        });

        const circle = document.getElementById(
          "circle"
        ) as unknown as SVGCircleElement;
        const length = 2 * Math.PI * circle.r.baseVal.value;
        circle.style.strokeDasharray = `${length} ${length}`;
        circle.style.strokeDashoffset = `${length}`;

        const arrayAnswers = getArrOfAnswers(
          words[Number(localStorage.getItem("index"))],
          words
        );
        const answers = document.getElementById("answers") as HTMLElement;
        const arrButtonAnswers = this.renderAnswers(arrayAnswers, answers);
        const contentProgress = document.getElementById(
          "textProgress"
        ) as HTMLElement;
        const buttonNext = document.getElementById("next") as HTMLButtonElement;
        const correctWord = document.getElementById(
          "correct-word"
        ) as HTMLElement;

        arrButtonAnswers.forEach((button) => {
          button.addEventListener("click", () => {
            changeValFromLS("progress");
            changeValFromLS("textProgress");
            const newProgress = localStorage.getItem("progress") || 0;
            const newTextProgress =
              Number(localStorage.getItem("textProgress")) || 0;
            circle.style.strokeDashoffset = createOffset(
              Number(newProgress),
              length
            );

            contentProgress.textContent = `${newTextProgress}/20`;
            buttonNext.textContent = "Дальше";
            audioButton.classList.add("after-select");
            correctWord.classList.remove("hide");

            arrButtonAnswers.forEach((btn) => {
              btn.disabled = true;
              btn.style.cursor = "default";
            });

            if (
              button.textContent ===
              words[Number(localStorage.getItem("index"))].wordTranslate
            ) {
              button.style.background = "#00FF7F";
            } else {
              button.style.background = "#CD5C5C";
            }
          });
        });
      });
    });
  }

  private renderAnswers(
    arrAnswers: IWordsData,
    answers: HTMLElement
  ): HTMLButtonElement[] {
    const arrButtons: HTMLButtonElement[] = [];
    arrAnswers.forEach((wordData: IWordData) => {
      const button = document.createElement("button");
      button.textContent = wordData.wordTranslate;
      button.className = "btn button-answers";
      answers.append(button);
      arrButtons.push(button);
    });
    return arrButtons;
  }
}
