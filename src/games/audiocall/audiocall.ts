import {
  IWordsData,
  IWordData,
  numberOfPages,
  numberOfQuestion,
} from "../../types/types";
import { api } from "../../ts/api";
import {
  getPageGame,
  getPageLevel,
  getPageStatistic,
  getStatisticAnswersItem,
} from "./html-for-audiocall";
import {
  addAnswer,
  changeValFromLS,
  createOffset,
  getArrOfAnswers,
  getFromLocalStorage,
  getMaxSeries,
  getSrc,
} from "./secondary-functions";
import { KeysLS, ValueButtonNext } from "./types-for-audiocall";
import { model, view } from "../../ts";

export class Audiocall {
  public initAudiocall(): void {
    const contentEl = document.getElementById("content") as HTMLElement;
    contentEl.innerHTML = getPageLevel();
    const levels = document.getElementById("levels") as HTMLElement;
    levels.addEventListener("click", (e: Event): void => {
      const group = Number((e.target as HTMLElement).dataset.level);
      const page = Math.floor(Math.random() * (numberOfPages + 1));
      localStorage.removeItem(KeysLS.checkAnswers);

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
        document.addEventListener("keypress", (e: KeyboardEvent) => {
          if (e.code === "Space") {
            buttonNext.click();
          }
        });
        buttonNext.addEventListener("click", () => {
          if (
            Number(localStorage.getItem(KeysLS.textProgress)) ===
            numberOfQuestion
          ) {
            /*end to game*/
            this.endOfTheGame(words);
          } else {
            if (buttonNext.textContent === ValueButtonNext.dontKnow) {
              addAnswer(false, KeysLS.checkAnswers);
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
    arrAnswers.forEach((wordData: IWordData, index: number) => {
      const button = document.createElement("button");
      button.textContent = `${index + 1} ${wordData.wordTranslate}`;
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
        if (
          (button.textContent as string).includes(currentWord.wordTranslate)
        ) {
          button.style.background = "#00FF7F";
          addAnswer(true, KeysLS.checkAnswers);
        } else {
          button.style.background = "#CD5C5C";
          addAnswer(false, KeysLS.checkAnswers);
        }
      });
    });
  }

  endOfTheGame(words: IWordsData) {
    const gameAudiocallElement = document.getElementById(
      "game-audio"
    ) as HTMLElement;
    gameAudiocallElement.innerHTML = getPageStatistic();

    const checkAnswer = getFromLocalStorage(KeysLS.checkAnswers);
    const numberValidAnswer = checkAnswer.filter((val) => val === true).length;
    const percentOfValid = Math.round(
      (numberValidAnswer * 100) / numberOfQuestion
    );
    const animateElement = document.getElementById(
      "statistic_circle-wive"
    ) as HTMLElement;
    animateElement.animate(
      [{ top: "100%" }, { top: `${100 - percentOfValid}%` }],
      { duration: 2000, fill: "forwards" }
    );
    const textStatistic = document.getElementById(
      "text-statistic"
    ) as HTMLElement;
    const answersInRow = document.getElementById(
      "in-a-row-answers"
    ) as HTMLElement;
    const totalValid = document.getElementById(
      "total-valid-answers"
    ) as HTMLElement;
    const totalInvalid = document.getElementById(
      "total-invalid-answers"
    ) as HTMLElement;

    textStatistic.textContent = `${percentOfValid}%`;
    totalValid.textContent = `Верных ответов ${numberValidAnswer}`;
    totalInvalid.textContent = `Ошибок ${numberOfQuestion - numberValidAnswer}`;
    answersInRow.textContent = `Верных ответов подряд ${getMaxSeries(
      checkAnswer
    )}`;

    const buttonPlayAgain = document.getElementById(
      "play-again"
    ) as HTMLButtonElement;
    buttonPlayAgain.addEventListener("click", () => {
      view.renderContent(model.activePage);
    });

    const answersGame = document.getElementById(
      "answers-statistic"
    ) as HTMLElement;
    words.forEach((word, index) => {
      const wrapperAnswers = document.createElement("div");
      wrapperAnswers.className = "statistic-answers-item";
      if (checkAnswer[index]) {
        wrapperAnswers.innerHTML = getStatisticAnswersItem(
          word,
          String(index),
          "valid"
        );
      } else
        wrapperAnswers.innerHTML = getStatisticAnswersItem(
          word,
          String(index),
          "invalid"
        );
      answersGame.append(wrapperAnswers);
    });
    const buttonBack = document.createElement("button");
    buttonBack.className = "back-from-details btn btn-blue";
    buttonBack.textContent = "Назад";
    answersGame.append(buttonBack);

    const buttonStatisticAnswers = document.getElementById(
      "details"
    ) as HTMLButtonElement;
    const lastPage = document.getElementById("last-page") as HTMLElement;
    buttonStatisticAnswers.addEventListener("click", () => {
      lastPage.animate(
        [
          { left: "0", opacity: 1 },
          { left: "200%", opacity: 0 },
        ],
        { duration: 800, fill: "forwards" }
      );

      answersGame.animate(
        [
          { left: "-200%", opacity: 0 },
          { left: "0", opacity: 1 },
        ],
        { duration: 800, fill: "forwards" }
      );
    });
    buttonBack.addEventListener("click", () => {
      lastPage.animate(
        [
          { left: "200%", opacity: 0 },
          { left: "0", opacity: 1 },
        ],
        { duration: 800, fill: "forwards" }
      );

      answersGame.animate(
        [
          { left: "0", opacity: 1 },
          { left: "-200%", opacity: 0 },
        ],
        { duration: 800, fill: "forwards" }
      );
    });

    const audioAnswer = new Audio();
    answersGame.addEventListener("click", (el: Event): void => {
      const index = Number((el.target as HTMLElement).dataset.sound);
      const src = getSrc(words[index].audio);
      audioAnswer.src = src;
      audioAnswer.play();
    });
  }
}
