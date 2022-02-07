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
import { KeysLS, ValueButtonNext } from "./types-for-audiocall";

const numberOfPages = 30;
const numberOfQuestion = 20;

export class Audiocall {
  public getHTML(): string {
    return /*html*/ getPageLevel();
  }

  public initAudiocall(): void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    const levels = document.querySelector("#levels") as HTMLElement;
    levels.addEventListener("click", (e: Event): void => {
      const group = Number((e.target as HTMLElement).dataset.level);
      const page = getRandomNumber(numberOfPages);
      api.getWords(group, page).then((words) => {
        const defaultValue = "0";
        localStorage.setItem(KeysLS.index, defaultValue);
        localStorage.setItem(KeysLS.progress, defaultValue);
        localStorage.setItem(KeysLS.textProgress, defaultValue);
        contentEl.innerHTML = getPageGame();

        /*create progress element*/
        const circle = document.getElementById(
          "circle"
        ) as unknown as SVGCircleElement;
        const length = 2 * Math.PI * circle.r.baseVal.value;
        circle.style.strokeDasharray = `${length} ${length}`;
        circle.style.strokeDashoffset = `${length}`;

        const audio = new Audio();
        const imageWord = document.getElementById("image") as HTMLElement;
        const buttonNext = document.getElementById("next") as HTMLButtonElement;
        const answers = document.getElementById("answers") as HTMLElement;
        const correctWord = document.getElementById(
          "correct-word"
        ) as HTMLElement;
        this.renderGame(
          words,
          answers,
          imageWord,
          buttonNext,
          correctWord,
          audio
        );

        const contentProgress = document.getElementById(
          "textProgress"
        ) as HTMLElement;
        buttonNext.addEventListener("click", () => {
          changeValFromLS(KeysLS.index);
          changeValFromLS(KeysLS.progress);
          changeValFromLS(KeysLS.textProgress);
          const newProgress = localStorage.getItem(KeysLS.progress) || 0;
          const newTextProgress =
            Number(localStorage.getItem(KeysLS.textProgress)) || 0;
          circle.style.strokeDashoffset = createOffset(
            Number(newProgress),
            length
          );
          contentProgress.textContent = `${newTextProgress}/20`;
          buttonNext.textContent = ValueButtonNext.dontKnow;
          answers.innerHTML = "";
          const audioButton = document.getElementById(
            "sound-btn"
          ) as HTMLButtonElement;
          audioButton.classList.remove("after-select");
          correctWord.classList.add("hide");
          this.renderGame(
            words,
            answers,
            imageWord,
            buttonNext,
            correctWord,
            audio
          );
        });
      });
    });
  }

  private playAudio(audio: HTMLAudioElement, src: string): void {
    audio.src = src;
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

  private renderAnswers(
    arrAnswers: IWordsData,
    answers: HTMLElement
  ): HTMLButtonElement[] {
    const buttonsAnswers: HTMLButtonElement[] = [];
    arrAnswers.forEach((wordData: IWordData) => {
      const button = document.createElement("button");
      button.textContent = wordData.wordTranslate;
      button.className = "btn button-answers";
      answers.append(button);
      buttonsAnswers.push(button);
    });
    return buttonsAnswers;
  }

  private renderGame(
    words: IWordsData,
    answers: HTMLElement,
    imageWord: HTMLElement,
    buttonNext: HTMLButtonElement,
    correctWord: HTMLElement,
    audio: HTMLAudioElement
  ): void {
    const currentIndex = Number(localStorage.getItem(KeysLS.index));
    const currentWord = words[currentIndex];
    const url = `${getSrc(currentWord.image)}`;
    const backImg = `url(${url})`;
    const audioSrc = `${getSrc(currentWord.audio)}`;
    imageWord.style.backgroundImage = backImg;
    this.playAudio(audio, audioSrc);

    /*button play audio for current word*/
    const audioButton = document.getElementById(
      "sound-btn"
    ) as HTMLButtonElement;
    audioButton.addEventListener("click", () => {
      this.playAudio(audio, audioSrc);
    });

    /*get random answer + valid answer*/
    const arrayAnswers = getArrOfAnswers(currentWord, words);
    const arrButtonAnswers = this.renderAnswers(arrayAnswers, answers);
    arrButtonAnswers.forEach((button) => {
      button.addEventListener("click", () => {
        arrButtonAnswers.forEach((btn) => {
          btn.disabled = true;
          btn.style.cursor = "default";
        });
        buttonNext.textContent = ValueButtonNext.next;
        audioButton.classList.add("after-select");
        correctWord.classList.remove("hide");
        correctWord.innerText = `${currentWord.word}  ${currentWord.transcription}`;

        /*check answer*/
        if (button.textContent === currentWord.wordTranslate) {
          button.style.background = "#00FF7F";
        } else {
          button.style.background = "#CD5C5C";
        }
      });
    });
  }
}
