import { IWordsData, IWordData } from "../../types/types";
import { api } from "../../ts/api";
import {
  getPageGame,
  getPageLevel,
  getPageStatistic,
} from "./html-for-audiocall";
import {
  addAnswer,
  changeValFromLS,
  createOffset,
  getArrOfAnswers,
  getFromLocalStorage,
  getRandomNumber,
  getSrc,
} from "./secondary-functions";
import { KeysLS, ValueButtonNext } from "./types-for-audiocall";
import { model, view } from "../../ts";

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

      if (localStorage.getItem(KeysLS.invalidAnswer)) {
        localStorage.removeItem(KeysLS.invalidAnswer);
      }
      if (localStorage.getItem(KeysLS.validAnswer)) {
        localStorage.removeItem(KeysLS.validAnswer);
      }

      api.getWords(group, page).then((words) => {
        contentEl.innerHTML = getPageGame();

        /*create progress element*/
        const defaultValueIdex = "0";
        const defaultValueProgress = "5";
        const defaultValueProgressText = "1";
        localStorage.setItem(KeysLS.index, defaultValueIdex);
        localStorage.setItem(KeysLS.progress, defaultValueProgress);
        localStorage.setItem(KeysLS.textProgress, defaultValueProgressText);
        const contentProgress = document.getElementById(
          "textProgress"
        ) as HTMLElement;
        const circle = document.getElementById(
          "circle"
        ) as unknown as SVGCircleElement;
        const length = 2 * Math.PI * circle.r.baseVal.value;
        circle.style.strokeDasharray = `${length} ${length}`;
        circle.style.strokeDashoffset = `${length}`;
        circle.style.strokeDashoffset = createOffset(
          Number(defaultValueProgress),
          length
        );
        contentProgress.textContent = `${defaultValueProgressText}/20`;

        const audio = new Audio();
        const imageWord = document.getElementById("image") as HTMLElement;
        const buttonNext = document.getElementById("next") as HTMLButtonElement;
        const answers = document.getElementById("answers") as HTMLElement;
        const correctWord = document.getElementById(
          "correct-word"
        ) as HTMLElement;
        const audioButton = document.getElementById(
          "sound-btn"
        ) as HTMLButtonElement;
        this.renderGame(
          words,
          answers,
          imageWord,
          buttonNext,
          correctWord,
          audioButton,
          audio
        );

        buttonNext.addEventListener("click", () => {
          if (
            Number(localStorage.getItem(KeysLS.textProgress)) ===
            numberOfQuestion
          ) {
            const gameAudiocallElement = document.getElementById(
              "game-audio"
            ) as HTMLElement;
            gameAudiocallElement.innerHTML = getPageStatistic();
            const validAnswer = getFromLocalStorage(KeysLS.validAnswer) || [];
            const invalidAnswer =
              getFromLocalStorage(KeysLS.invalidAnswer) || [];
            const numberValidAnswer = validAnswer.length;
            const numberInvalidAnswer = invalidAnswer.length;
            const percentOfValid = (numberValidAnswer * 100) / numberOfQuestion;
            const animateElement = document.getElementById(
              "statistic_circle-wive"
            ) as HTMLElement;
            const animationCircle = animateElement.animate(
              [{ top: "100%" }, { top: `${100 - percentOfValid}%` }],
              { duration: 2000, fill: "forwards" }
            );

            const textStatistic = document.getElementById(
              "text-statistic"
            ) as HTMLElement;
            textStatistic.textContent = `${numberValidAnswer}/${numberOfQuestion}`;
            const buttonPlayAgain = document.getElementById(
              "play-again"
            ) as HTMLButtonElement;
            buttonPlayAgain.addEventListener("click", () => {
              view.renderContent(model.activePage);
            });
          } else {
            if (buttonNext.textContent === ValueButtonNext.dontKnow) {
              const ind = Number(localStorage.getItem(KeysLS.index) || 0);
              addAnswer(words[ind], KeysLS.invalidAnswer);
            } else {
              buttonNext.textContent = ValueButtonNext.dontKnow;
            }

            changeValFromLS(KeysLS.index);
            changeValFromLS(KeysLS.progress);
            changeValFromLS(KeysLS.textProgress);
            const newProgress = Number(
              localStorage.getItem(KeysLS.progress) || 0
            );
            const newTextProgress =
              Number(localStorage.getItem(KeysLS.textProgress)) || 0;

            circle.style.strokeDashoffset = createOffset(newProgress, length);
            contentProgress.textContent = `${newTextProgress}/20`;

            answers.innerHTML = "";
            audioButton.classList.remove("after-select");
            correctWord.classList.add("hide");
            this.renderGame(
              words,
              answers,
              imageWord,
              buttonNext,
              correctWord,
              audioButton,
              audio
            );
          }
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
    audioButton: HTMLButtonElement,
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
    audioButton.addEventListener("click", () => {
      this.playAudio(audio, audioSrc);
    });

    const arrayAnswers = getArrOfAnswers(currentWord, words);
    const arrButtonAnswers = this.renderAnswers(arrayAnswers, answers);
    arrButtonAnswers.forEach((button) => {
      button.addEventListener("click", () => {
        arrButtonAnswers.forEach((btn) => {
          btn.disabled = true;
          btn.style.cursor = "default";
        });
        if (
          Number(localStorage.getItem(KeysLS.textProgress)) === numberOfQuestion
        ) {
          buttonNext.textContent = ValueButtonNext.last;
        } else buttonNext.textContent = ValueButtonNext.next;
        audioButton.classList.add("after-select");
        correctWord.classList.remove("hide");
        correctWord.innerText = `${currentWord.word}  ${currentWord.transcription}`;

        /*check answer*/
        if (button.textContent === currentWord.wordTranslate) {
          button.style.background = "#00FF7F";
          addAnswer(currentWord, KeysLS.validAnswer);
        } else {
          button.style.background = "#CD5C5C";
          addAnswer(currentWord, KeysLS.invalidAnswer);
        }
      });
    });
  }
}
