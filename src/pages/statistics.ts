import { model, view } from "../ts";
import { api } from "../ts/api";
import { EPage } from "../types/types";

export class Statistics {
  public initStatistics() {
    const contentEl = document.getElementById("content") as HTMLElement;
    if (model.auth) {
      contentEl.innerHTML = this.getHTMLFotAuth();
      this.fillValue();
    } else {
      contentEl.innerHTML = this.getHTMLFotNoAuth();
      const btnBack = document.getElementById(
        "statistic-btn-back"
      ) as HTMLElement;
      btnBack.onclick = () => {
        view.renderContent(EPage.main);
      };
    }
  }
  private getHTMLFotNoAuth(): string {
    return /*html*/ `
    <div class="statistics mt-10">
    <h2> Cтатистика </h2>
    <div class="statistics__icon"></div>
    <p>  Страница недоступна для неавторизованного пользователя </p>
    <button id="statistic-btn-back" class="btn btn-blue"> На главную </button>
    </div>
    `;
  }
  private getHTMLFotAuth(): string {
    return /*html*/ `
    <div class="statistics-auth mt-10">
      <h2> Cтатистика за ${new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</h2>
      <div class="statistics-auth__wrapper">
        <div class="statistics-auth__column1">
          <div class="statistics-auth__card_new">
            <p id="new-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">новых слов</p>
          </div>
          <div class="statistics-auth__card_learn">
            <div class="statistics-auth__learn-wrapper">
            <p id="learn-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">слов изучено в мини-играх</p>
            </div>
            <div class="statistics-auth__learn-wrapper">
            <p id="learn-words-EB" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">слов изучено в учебнике</p>
            </div>
          </div>
          <div class="statistics-auth__card_percent">
            <div id="statistic_circle" class="audiocall__statistic_circle">
              <div id="statistic_circle-wive-total" class="audiocall__statistic_circle-wive"></div>
              <div id="text-statistic-total" class="audiocall__statistic_text"></div>
            </div>
            <p class="statistics-auth__words_text">правильных ответов</p>
          </div>
        </div>
        <div class="statistics-auth__column2">
          <div class="statistics-auth__card_audio">
            <div class="statistics-auth__card_audio-wr">
              <div></div>
              <p>Аудиовызов</p>
            </div>
          <p class="game_text"><span id="audio-new-words" class="game_value">0</span>  новых слов</p>
          <p   class="game_text"><span  id="audio-correct-words" class="game_value">0</span>  % правильных ответов</p>
          <p  class="game_text"><span id="audio-in-row"  class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div> 
          <div class="statistics-auth__card_sprint">
            <div class="statistics-auth__card_sprint-wr">
              <div></div>
              <p>Спринт</p>
            </div>
            <p class="game_text"><span id="sprint-new-words"  class="game_value">0</span>  новых слов</p>
            <p  class="game_text"><span id="sprint-correct-words" class="game_value">0</span>  % правильных ответов</p>
            <p class="game_text"><span id="sprint-in-row"  class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div>          
        </div>
      </div>   
    </div>
    `;
  }

  private fillValue() {
    const newWords = document.getElementById("new-words") as HTMLElement;
    const learnedWords = document.getElementById("learn-words") as HTMLElement;

    const audioNew = document.getElementById("audio-new-words") as HTMLElement;
    const audioCorrect = document.getElementById(
      "audio-correct-words"
    ) as HTMLElement;
    const audioInRow = document.getElementById("audio-in-row") as HTMLElement;

    const sprintNew = document.getElementById(
      "sprint-new-words"
    ) as HTMLElement;
    const sprintCorrect = document.getElementById(
      "sprint-correct-words"
    ) as HTMLElement;
    const sprintInRow = document.getElementById("sprint-in-row") as HTMLElement;

    const textStatisticProgress = document.getElementById(
      "text-statistic-total"
    ) as HTMLElement;
    const animateElementProgress = document.getElementById(
      "statistic_circle-wive-total"
    ) as HTMLElement;
    const learnWordsEB = document.getElementById(
      "learn-words-EB"
    ) as HTMLElement;

    api.getStatistics().then((data) => {
      console.log(data);
      if (data) {
        newWords.innerText = `${
          data.optional.audiocall.newWords + data.optional.sprint.newWords
        }`;
        learnedWords.innerHTML = `${data.learnedWords}`;

        const totalAnswersAudio =
          data.optional.audiocall.correctWords +
          data.optional.audiocall.incorrectWords;

        audioNew.innerText = `${data.optional.audiocall.newWords}`;
        audioCorrect.innerHTML = `${
          Math.round(
            (data.optional.audiocall.correctWords * 100) / totalAnswersAudio
          ) || 0
        }`;
        audioInRow.innerText = `${data.optional.audiocall.streak}`;

        const totalAnswersSprint =
          data.optional.sprint.correctWords +
          data.optional.sprint.incorrectWords;

        sprintNew.innerText = `${data.optional.sprint.newWords}`;
        sprintCorrect.innerHTML = `${
          Math.round(
            (data.optional.sprint.correctWords * 100) / totalAnswersSprint
          ) || 0
        }`;
        sprintInRow.innerText = `${data.optional.sprint.streak}`;

        const totalAnswers = totalAnswersAudio + totalAnswersSprint;
        const totalCorrectAnswer =
          data.optional.audiocall.correctWords +
          data.optional.sprint.correctWords;
        const totalPercent =
          Math.round((totalCorrectAnswer * 100) / totalAnswers) || 0;

        textStatisticProgress.innerText = `${Math.round(totalPercent)}%`;
        animateElementProgress.animate(
          [{ top: "100%" }, { top: `${100 - totalPercent}%` }],
          {
            duration: 2000,
            fill: "forwards",
          }
        );
      }
    }).then(() => {
      api.getSettings().then((data) => {
        if (data) {
          learnWordsEB.innerHTML = data.optional.learnedWords.toString();
        } else {
          learnWordsEB.innerHTML = "0";
        }
      });
    });
  }
}
