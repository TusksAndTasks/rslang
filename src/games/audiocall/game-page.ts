import { api } from "../../ts/api";
import { IWordData, IWordsData } from "../../types/types";
import { lastPage } from "./last-page";
import { NameBtnAudiocall } from "../../types/types";
import { model } from "../../ts";

const stepForProgress = 5;
const stepForCurrentIndex = 1;

class GamePage {
  public numberWrongAnswers: number = 3;
  public currentIndex: number = 0;
  public currentProgress: number = 5;
  public audio: HTMLAudioElement = new Audio();
  public checkAnswers: boolean[] = [];

  private getHTML(): string {
    return `
    <div id="game-audio" class="game-audio">
      <div class="game-header">
        <div class="game-header__progress">
          <svg class="game-header__progress_svg">
            <circle id="circle" class="game-header__progress_circle" fill="none" r="35">
          </svg>
          <div id="textProgress" class="game-header__progress_text"> </div>
        </div>
      </div>
      <div id="image" class="game-main__word_image" >
        <button id="sound-btn" class="game-main__word_sound">
          <div id="animation" class="game-main__word_animate"></div>
        </button>
        <div id="correct-word" class="game-main__word_en hide"> </div>
      </div>
      <div id="answers" class="game-main__word_answers"></div>
      <button id="next" class="btn button-answers_dont-know btn-blue">Не знаю</button>
    </div>
  `;
  }

  private renderProgress(): void {
    const contentProgress = document.getElementById(
      "textProgress"
    ) as HTMLElement;
    const circle = document.getElementById(
      "circle"
    ) as unknown as SVGCircleElement;
    const length = 2 * Math.PI * circle.r.baseVal.value;
    circle.style.strokeDasharray = `${length} ${length}`;
    circle.style.strokeDashoffset = `${length}`;
    const offset = length - (this.currentProgress / 100) * length;
    circle.style.strokeDashoffset = String(offset);
    contentProgress.textContent = `${this.currentIndex + 1}/20`;
  }

  private startAudio(src: string): void {
    this.audio.src = src;
    this.audio.play();
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
    this.audio.addEventListener("ended", () => audioAnimate.cancel());
  }

  private getRandomArray(arr: IWordsData): IWordsData {
    for (let index = arr.length - 1; index > 0; index -= 1) {
      let j = Math.floor(Math.random() * (index + 1));
      let elArr = arr[index];
      arr[index] = arr[j];
      arr[j] = elArr;
    }
    return arr;
  }

  private createArrayOfAnswers = (
    correctWord: IWordData,
    words: IWordsData
  ): IWordsData => {
    const arrOfAnswerers = [correctWord];
    const arrWrongAnswers = words.filter(
      (wordData) => wordData.word !== correctWord.word
    );
    const randomAnswers = this.getRandomArray(arrWrongAnswers);
    for (let index = 0; index < this.numberWrongAnswers; index += 1) {
      arrOfAnswerers.push(randomAnswers[index]);
    }
    return this.getRandomArray(arrOfAnswerers);
  };

  private listenerForAnswers(
    arrButtonAnswers: HTMLButtonElement[],
    button: HTMLButtonElement,
    currentWord: IWordData
  ) {
    arrButtonAnswers.forEach((btn) => {
      btn.disabled = true;
      btn.style.cursor = "default";
    });
    const buttonNext = document.getElementById("next") as HTMLElement;

    if (this.currentIndex + 1 === model.numberOfQuestion) {
      buttonNext.textContent = NameBtnAudiocall.last;
    } else buttonNext.textContent = NameBtnAudiocall.next;

    const correctWord = document.getElementById("correct-word") as HTMLElement;
    const audioButton = document.getElementById(
      "sound-btn"
    ) as HTMLButtonElement;
    audioButton.classList.add("after-select");
    correctWord.classList.remove("hide");
    correctWord.innerText = `${currentWord.word}  ${currentWord.transcription}`;

    if ((button.textContent as string).includes(currentWord.wordTranslate)) {
      button.style.background = "#00FF7F";
      this.audio.src = "../../assets/valid.mp3";
      this.audio.play();
      this.checkAnswers.push(true);
    } else {
      button.style.background = "#CD5C5C";
      this.audio.src = "../../assets/error.mp3";
      this.audio.play();
      this.checkAnswers.push(false);
    }
  }

  private renderAnswersButtons(
    arrAnswers: IWordsData,
    currentWord: IWordData
  ): HTMLButtonElement[] {
    const buttonsAnswers: HTMLButtonElement[] = [];
    const answersContainer = document.getElementById("answers") as HTMLElement;
    arrAnswers.forEach((word: IWordData, index: number) => {
      const button = document.createElement("button");
      button.textContent = `${index + 1} ${word.wordTranslate}`;
      button.className = "btn button-answers";
      answersContainer.append(button);
      buttonsAnswers.push(button);
      button.onclick = () => {
        this.listenerForAnswers(buttonsAnswers, button, currentWord);
      };
    });

    const audioButton = document.getElementById(
      "sound-btn"
    ) as HTMLButtonElement;
    const buttonNext = document.getElementById("next") as HTMLElement;
    document.onkeyup = (e: KeyboardEvent) => {
      const numberKey: number = Number(e.key);
      if (numberKey > 0 && numberKey < 5) {
        buttonsAnswers[numberKey - 1].click();
      }
      if (e.code === "Space") {
        e.preventDefault();
        audioButton.click();
      }
      if (e.code === "Enter") {
        e.preventDefault();
        buttonNext.click();
      }
    };
    return buttonsAnswers;
  }

  private renderGame(words: IWordsData) {
    const currentWord: IWordData = words[this.currentIndex];

    const audioButton = document.getElementById(
      "sound-btn"
    ) as HTMLButtonElement;
    const audioSrc = `${api.baseUrl}/${currentWord.audio}`;
    this.startAudio(audioSrc);
    audioButton.onclick = () => {
      this.startAudio(audioSrc);
    };

    const imageWord = document.getElementById("image") as HTMLElement;
    const imageUrl = `${api.baseUrl}/${currentWord.image}`;
    const backImg = `url(${imageUrl})`;
    imageWord.style.backgroundImage = backImg;

    const arrayAnswers = this.createArrayOfAnswers(currentWord, words);
    this.renderAnswersButtons(arrayAnswers, currentWord);
  }

  private listenerForNext(buttonNext: HTMLButtonElement, words: IWordsData) {
    if (this.currentIndex + 1 === model.numberOfQuestion) {
      this.currentIndex = 0;
      this.currentProgress = 5;
      lastPage.renderLastPage(words, this.checkAnswers);
    } else {
      if (buttonNext.textContent === NameBtnAudiocall.dontKnow) {
        this.checkAnswers.push(false);
      } else {
        buttonNext.textContent = NameBtnAudiocall.dontKnow;
      }
      this.currentIndex += stepForCurrentIndex;
      this.currentProgress += stepForProgress;

      this.renderProgress();
      const answers = document.getElementById("answers") as HTMLElement;
      answers.innerHTML = "";
      const correctWord = document.getElementById(
        "correct-word"
      ) as HTMLElement;
      const audioButton = document.getElementById(
        "sound-btn"
      ) as HTMLButtonElement;
      audioButton.classList.remove("after-select");
      correctWord.classList.add("hide");
      this.renderGame(words);
    }
  }

  public startGame(page: number, group: number) {
    this.currentIndex = 0;
    this.currentProgress = 5;
    this.checkAnswers = [];

    const contentEl = document.querySelector("#content") as HTMLElement;
    contentEl.innerHTML = this.getHTML();
    this.renderProgress();
    api.getWords(group, page).then((words: IWordsData) => {
      this.renderGame(words);
      const buttonNext = document.getElementById("next") as HTMLButtonElement;
      buttonNext.onclick = () => {
        this.listenerForNext(buttonNext, words);
      };
    });
  }
}
export const gamePage = new GamePage();
