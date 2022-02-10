import { IWordData } from "../../types/types";

export const getPageLevel = (): string => {
  return `
      <div class="audiocall mt-10">
        <h2> Аудиовызов </h2>
        <div class="audiocall__icon"></div>
        <p> Выберите сложность игры </p>
        <div id="levels" class="levels">
        <button data-level=0 class="btn btn-blue"> 1 </button>
        <button data-level=1 class="btn btn-blue"> 2 </button>
        <button data-level=2 class="btn btn-blue"> 3 </button>
        <button data-level=3 class="btn btn-blue"> 4 </button>
        <button data-level=4 class="btn btn-blue"> 5 </button>
        <button data-level=5 class="btn btn-blue"> 6 </button>
        </div>
      </div>
    `;
};

export const getPageGame = (): string => {
  return `
    <div id="game-audio" class="game-audio">
      <div class="game-header">
        <div class="game-header__progress">
          <svg class="game-header__progress_svg">
              <circle id="circle" class="game-header__progress_circle" fill="none" r="45">
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
};

export const getPageStatistic = (): string => {
  return `
  <div class="audiocall__statistic_wrapper">
    <div id="last-page" class="audiocall__statistic">
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
        <button id="details" class="btn btn-blue">Подробнее</button>
        <button id="play-again" class="btn btn-blue" >Играть снова</button>
      </div>
    </div>
    <div id="answers-statistic" class="audiocall__statistic_answers">
    </div>
  </div>
  `;
};

export const getStatisticAnswersItem = (
  word: IWordData,
  index: string,
  check: string
): string => {
  return `
    <button id="statisticSoundButton" data-sound=${index}
    class="statistic-answers-item_sound">
    </button>
    <div class="details-word">${word.word}</div>
    <div class="details-word">${word.transcription}</div>
    <div class="details-word_lang">${word.wordTranslate}</div>
    <div id="check-answer" class="check-answer ${check}">
    </div>
  `;
};
