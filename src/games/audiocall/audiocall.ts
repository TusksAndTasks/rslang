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
import {
  IDataListenerNext,
  IDataRenderGame,
  KeysLS,
  ValueButtonNext,
} from "./types-for-audiocall";
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
        const dataForRenderGame = {
          words: words,
          answers: answers,
          imageWord: imageWord,
          buttonNext: buttonNext,
          correctWord: correctWord,
          audioButton: audioButton,
          audio: audio,
        };
        this.renderGame(dataForRenderGame);

        const dataForListenerNext: IDataListenerNext = {
          words: words,
          buttonNext: buttonNext,
          circle: circle,
          contentProgress: contentProgress,
          answers: answers,
          imageWord: imageWord,
          correctWord: correctWord,
          audioButton: audioButton,
          audio: audio,
        };

        document.addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.code == "Space") {
            this.eventButtonNext(dataForListenerNext, dataForRenderGame);
          }
        });
        buttonNext.addEventListener("click", () => {
          this.eventButtonNext(dataForListenerNext, dataForRenderGame);
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

  private renderGame(data: IDataRenderGame): void {
    const currentIndex = Number(localStorage.getItem(KeysLS.index));
    const currentWord = data.words[currentIndex];
    const url = `${getSrc(currentWord.image)}`;
    const backImg = `url(${url})`;
    const audioSrc = `${getSrc(currentWord.audio)}`;
    data.imageWord.style.backgroundImage = backImg;
    this.playAudio(data.audio, audioSrc);
    data.audioButton.addEventListener("click", () => {
      this.playAudio(data.audio, audioSrc);
    });

    const arrayAnswers = getArrOfAnswers(currentWord, data.words);
    const arrButtonAnswers = this.renderAnswers(arrayAnswers, data.answers);
    data.answers.addEventListener("click", (e: Event) => {
      const button = e.target as HTMLButtonElement;
      this.eventButtonAnswer(
        arrButtonAnswers,
        data.buttonNext,
        data.audioButton,
        data.correctWord,
        currentWord,
        button
      );
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const indexCurrentWord: number = Number(event.code.slice(-1));
      if (indexCurrentWord > 0 && indexCurrentWord < 5) {
        this.eventButtonAnswer(
          arrButtonAnswers,
          data.buttonNext,
          data.audioButton,
          data.correctWord,
          currentWord,
          arrButtonAnswers[indexCurrentWord - 1]
        );
      }
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

  private eventButtonNext(
    data: IDataListenerNext,
    dataForRenderGame: IDataRenderGame
  ) {
    if (
      Number(localStorage.getItem(KeysLS.textProgress)) === numberOfQuestion
    ) {
      this.endOfTheGame(data.words);
    } else {
      if (data.buttonNext.textContent === ValueButtonNext.dontKnow) {
        addAnswer(false, KeysLS.checkAnswers);
      } else {
        data.buttonNext.textContent = ValueButtonNext.dontKnow;
      }

      changeValFromLS(KeysLS.index);
      changeValFromLS(KeysLS.progress);
      changeValFromLS(KeysLS.textProgress);
      const newProgress = Number(localStorage.getItem(KeysLS.progress) || 0);
      const newTextProgress =
        Number(localStorage.getItem(KeysLS.textProgress)) || 0;

      data.circle.style.strokeDashoffset = createOffset(newProgress, length);
      data.contentProgress.textContent = `${newTextProgress}/20`;
      data.answers.innerHTML = "";
      data.audioButton.classList.remove("after-select");
      data.correctWord.classList.add("hide");
      this.renderGame(dataForRenderGame);
    }
  }

  private eventButtonAnswer(
    arrButtonAnswers: HTMLButtonElement[],
    buttonNext: HTMLButtonElement,
    audioButton: HTMLButtonElement,
    correctWord: HTMLElement,
    currentWord: IWordData,
    button: HTMLButtonElement
  ) {
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
    if ((button.textContent as string).includes(currentWord.wordTranslate)) {
      button.style.background = "#00FF7F";
      addAnswer(true, KeysLS.checkAnswers);
    } else {
      button.style.background = "#CD5C5C";
      addAnswer(false, KeysLS.checkAnswers);
    }
  }
}
