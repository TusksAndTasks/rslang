import { model, view } from "../../ts";
import { api } from "../../ts/api";
import { IWord, IWordData, IWordsData } from "../../types/types";

class LastPage {
  public getHTML(): string {
    return `
    <div id="last-page" class="audiocall__statistic_wrapper">
      <div class="audiocall__statistic">
        <p class="audiocall__statistic_tittle"> Ваш результат </p>
        <div id="statistic_circle" class="audiocall__statistic_circle">
          <div id="statistic_circle-wive" class="audiocall__statistic_circle-wive"></div>
          <div id="text-statistic" class="audiocall__statistic_text"></div>
        </div>
        <div class="audiocall__statistic_total">
          <div id="total-valid-answers" class="audiocall__statistic_total-true"></div>
          <div id="in-a-row-answers" class="audiocall__statistic_total-true"></div>
          <div id="total-invalid-answers" class="audiocall__statistic_total-false"></div>
        </div>
        <div class="audiocall__statistic_buttons">
          <button id="details" class="btn btn-blue" >Подробнее</button>
          <button id="play-again" class="btn btn-blue" >Играть снова</button>
        </div>
      </div>
    </div>
    `;
  }

  getStatisticAnswersItem(
    word: IWordData | IWord,
    index: string,
    check: string
  ): string {
    return `
      <button id="statisticSoundButton" data-sound=${index}
      class="statistic-answers-item_sound">
      </button>
      <div class="details-word">${word.word}</div>
      <div class="details-word_tr">${word.transcription}</div>
      <div class="details-word_lang">${word.wordTranslate}</div>
      <div id="check-answer" class="check-answer ${check}">
      </div>
    `;
  }

  getNumberAnswersInRow(arr: boolean[]): number {
    let max = 0;
    let current = 0;
    const firstIndex = arr.indexOf(true);
    if (firstIndex !== -1) {
      arr.forEach((el) => {
        if (el) {
          current++;
          max = Math.max(max, current);
        } else {
          current = 0;
        }
      });
    }
    return max;
  }

  renderPageDetails(words: Array<IWord | IWordData>, arrForCheckAnswers: boolean[]): void {
    const detailsWrapper = document.getElementById("last-page") as HTMLElement;
    detailsWrapper.innerHTML = "";
    const details = document.createElement("div");
    details.className = "audiocall__statistic_answers";
    detailsWrapper.append(details);

    words.forEach((word, index) => {
      const wrapperItem = document.createElement("div");
      wrapperItem.className = "statistic-answers-item";
      if (arrForCheckAnswers[index]) {
        wrapperItem.innerHTML = this.getStatisticAnswersItem(
          word,
          String(index),
          "valid"
        );
      } else
        wrapperItem.innerHTML = this.getStatisticAnswersItem(
          word,
          String(index),
          "invalid"
        );
      details.append(wrapperItem);
    });

    const buttonBack = document.createElement("button");
    buttonBack.className = "back-from-details btn btn-blue";
    buttonBack.textContent = "Назад";
    details.append(buttonBack);

    buttonBack.onclick = () => {
      this.renderLastPage(words, arrForCheckAnswers);
    };

    const audioAnswer = new Audio();
    const buttonsAudio = detailsWrapper.querySelectorAll(
      "#statisticSoundButton"
    );

    buttonsAudio.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number((button as HTMLElement).dataset.sound);
        const src = `${api.baseUrl}/${words[index].audio}`;
        audioAnswer.src = src;
        audioAnswer.play();
      });
    });
  }

  renderLastPage(words: Array<IWord | IWordData>, arrForCheckAnswers: boolean[]) {
    document.onkeyup = null;
    const gameAudiocallElement = document.getElementById(
      "game-audio"
    ) as HTMLElement;
    gameAudiocallElement.innerHTML = this.getHTML();
    const numberValidAnswer = arrForCheckAnswers.filter(
      (val) => val === true
    ).length;
    const percentOfValid = Math.round(
      (numberValidAnswer * 100) / (model.auth ? model.audiocallWordsArray.length : model.numberOfQuestion)
    );
    const animateElement = document.getElementById(
      "statistic_circle-wive"
    ) as HTMLElement;
    animateElement.animate(
      [{ top: "100%" }, { top: `${100 - percentOfValid}%` }],
      { duration: 2000, fill: "forwards" }
    );

    const streak = this.getNumberAnswersInRow(arrForCheckAnswers);

    if(model.auth){this.changeStatistics(numberValidAnswer, streak)}

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
    totalInvalid.textContent = `Ошибок ${
      (model.auth ? model.audiocallWordsArray.length : model.numberOfQuestion) - numberValidAnswer
    }`;
    answersInRow.textContent = `Верных ответов подряд ${streak}`;

    const buttonPlayAgain = document.getElementById(
      "play-again"
    ) as HTMLButtonElement;
    buttonPlayAgain.addEventListener("click", () => {
      view.renderContent(model.activePage);
    });

    const buttonStatisticAnswers = document.getElementById(
      "details"
    ) as HTMLButtonElement;
    buttonStatisticAnswers.addEventListener("click", () => {
      this.renderPageDetails(words, arrForCheckAnswers);
    });
  }
   
  private async changeStatistics(correctNumbers: number, streak: number){
    let incorrectAnswers = model.audiocallWordsArray.length - correctNumbers;
    let statistic = await api.getStatistics();
    
    if(!statistic){
        statistic = {learnedWords: model.audiocallStatData,
        optional: {
            audiocall: {
               correctWords: correctNumbers,
               incorrectWords: incorrectAnswers,
               streak: streak,
               newWords: model.audiocallNewWords
            },
            sprint: {
                correctWords: 0,
                incorrectWords: 0,
                streak: 0,
                newWords: +0
            }
        }
      }
    } else {
        delete statistic.id;
        statistic.learnedWords += model.audiocallStatData;
        statistic.optional.audiocall.correctWords += correctNumbers;
        statistic.optional.audiocall.incorrectWords += incorrectAnswers;
        statistic.optional.audiocall.streak = statistic.optional.sprint.streak < streak ? streak : statistic.optional.sprint.streak;
        statistic.optional.audiocall.newWords += model.audiocallNewWords;
    }
    
    model.audiocallNewWords = 0;
    api.updateStatistics(statistic);
  }

}
export const lastPage = new LastPage();
