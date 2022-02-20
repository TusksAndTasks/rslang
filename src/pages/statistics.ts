import { model, view } from "../ts";
import { EPage } from "../types/types";

export class Statistics {
  public initStatistics() {
    const contentEl = document.getElementById("content") as HTMLElement;
    if (model.auth) {
      contentEl.innerHTML = this.getHTMLFotAuth();
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
      <h2> Cтатистика за ${new Date().toLocaleDateString()}</h2>
      <div class="statistics-auth__wrapper">
        <div class="statistics-auth__column1">
          <div class="statistics-auth__card_new">
            <p id="new-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">новых слов</p>
          </div>
          <div class="statistics-auth__card_learn">
            <p id="learn-words" class="statistics-auth__words_value">0</p>
            <p class="statistics-auth__words_text">слов изучено</p>
          </div>
          <div class="statistics-auth__card_percent">
            <p class="statistics-auth__words_text">правильных ответов</p>
            <div id="statistic_circle" class="audiocall__statistic_circle">
              <div id="statistic_circle-wive" class="audiocall__statistic_circle-wive"></div>
              <div id="text-statistic" class="audiocall__statistic_text"></div>
            </div>
          </div>
        </div>
        <div class="statistics-auth__column2">
          <div class="statistics-auth__card_audio">
            <div class="statistics-auth__card_audio-wr">
              <div></div>
              <p>Аудиовызов</p>
            </div>
          <p class="game_text"><span class="game_value">0</span>  новых слов</p>
          <p class="game_text"><span class="game_value">0</span>  % правильных ответов</p>
          <p class="game_text"><span class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div> 
          <div class="statistics-auth__card_sprint">
            <div class="statistics-auth__card_sprint-wr">
              <div></div>
              <p>Спринт</p>
            </div>
            <p class="game_text"><span class="game_value">0</span>  новых слов</p>
            <p class="game_text"><span class="game_value">0</span>  % правильных ответов</p>
            <p  class="game_text"><span class="game_value">0</span>  cамая длинная серия правильных ответов</p>
          </div>          
        </div>
      </div>   
    </div>
    `;
  }
}

//<div class="statistics-auth__item">
//<h2> Игра Аудиовызов </h2>
//<p>Количество сыгранных игр</p>
//<p>Количество новых слов</p>
//<p>Процент правильных ответов</p>
//<p> Самая длинная серия правильных ответов</p>
//</div>
//<div class="statistics-auth__item">
//<h2> Игра Спринт </h2>
//<p>Количество сыгранных игр</p>
//<p>Количество новых слов</p>
//<p>Процент правильных ответов</p>
//<p> Самая длинная серия правильных ответов</p>
//</div>
//<div class="statistics-auth__item">
//<h2> Игра Спринт </h2>
//<p>Количество сыгранных игр</p>
//<p>Количество новых слов</p>
//<p>Процент правильных ответов</p>
//<p> Самая длинная серия правильных ответов</p>
