import { api } from "../../ts/api";
import { IAuthObject, IUserWord, IWord, IWordData, IWordsData } from "../../types/types";
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

  private getRandomArray(arr: Array<IWord | IWordData>): Array<IWord | IWordData> {
    for (let index = arr.length - 1; index > 0; index -= 1) {
      let j = Math.floor(Math.random() * (index + 1));
      let elArr = arr[index];
      arr[index] = arr[j];
      arr[j] = elArr;
    }
    return arr;
  }

  private createArrayOfAnswers = (
    correctWord: IWordData | IWord,
    words: Array<IWord | IWordData>
  ): Array<IWord | IWordData> => {
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
    currentWord: IWordData | IWord
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
      if(model.auth){this.updateCorrectUserWord(currentWord);}
      this.checkAnswers.push(true);
    } else {
      button.style.background = "#CD5C5C";
      this.audio.src = "../../assets/error.mp3";
      this.audio.play();
      if(model.auth){this.updateIncorrectUserWord(currentWord);}
      this.checkAnswers.push(false);
    }
  }

  private updateCorrectUserWord(word: IWord | IWordData | undefined ){
    if(!(word as IWord).userWord){
       const userWordData = {
         difficulty: 'normal',
         optional: {
           correctCount: 1,
           totalCorrectCount: 1,
           totalIncorrectCount: 0
         } 
      }
       api.createUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userWordData);
    } else {
      const userInfo = ((word as IWord).userWord as IUserWord)
      userInfo.optional.correctCount++;
      userInfo.optional.totalCorrectCount++;
       if(userInfo.difficulty === 'normal' && userInfo.optional.correctCount >= 3){
         model.audiocallStatData++
         userInfo.difficulty = 'easy';
       }
       else if (userInfo.difficulty === 'hard' && userInfo.optional.correctCount >= 5){
        model.audiocallStatData++
        userInfo.difficulty = 'easy';
       }
      api.updateUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userInfo);     
    }

  }

  private updateIncorrectUserWord(word: IWord | IWordData | undefined ){
    if(!(word as IWord).userWord){
       const userWordData = {
         difficulty: 'normal',
         optional: {
           correctCount: 0,
           totalCorrectCount: 0,
           totalIncorrectCount: 1
         } 
      }
       api.createUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userWordData);
    } else {
      const userInfo = ((word as IWord).userWord as IUserWord)
      userInfo.optional.totalIncorrectCount++;
       if (userInfo.difficulty === 'easy'){
        userInfo.difficulty = 'normal';
        userInfo.optional.correctCount = 0;
       }
      api.updateUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userInfo);     
    }

  }



  private renderAnswersButtons(
    arrAnswers: Array<IWord | IWordData>,
    currentWord: IWordData | IWord
  ): HTMLButtonElement[] {
    const buttonsAnswers: HTMLButtonElement[] = [];
    const answersContainer = document.getElementById("answers") as HTMLElement;
    arrAnswers.forEach((word: IWordData | IWord, index: number) => {
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

  private renderGame(words: Array<IWord | IWordData>) {
    const currentWord: IWordData | IWord = words[this.currentIndex];

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

  private listenerForNext(buttonNext: HTMLButtonElement, words: Array<IWord | IWordData>) {
    if (this.currentIndex + 1 === (model.auth ? model.audiocallWordsArray.length : model.numberOfQuestion)) {
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
    if(!model.auth){
    api.getWords(group, page).then((words) => {
      this.renderGame(words as IWordsData);
      const buttonNext = document.getElementById("next") as HTMLButtonElement;
      buttonNext.onclick = () => {
        this.listenerForNext(buttonNext, words as IWordsData);
      };
    });
  } else {
    this.renderGame(model.audiocallWordsArray);
    const buttonNext = document.getElementById("next") as HTMLButtonElement;
    buttonNext.onclick = () => {
      this.listenerForNext(buttonNext, model.audiocallWordsArray as Array<IWord | IWordData>);
    };
  }
  }
}
export const gamePage = new GamePage();
