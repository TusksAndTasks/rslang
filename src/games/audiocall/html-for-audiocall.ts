import { IWordData } from "../../types/types";

export const getPageLevel = (): string => {
  return `
      <div class="audiocall mt-10">
        <h2>Мини-игра аудиовызов</h2>
        <h4> Игра направлена на тре&shy;ни&shy;ров&shy;ку навы&shy;ков ауди&shy;рова&shy;ния. В процес&shy;се 
        игры необ&shy;хо&shy;димо уга&shy;дать пе&shy;ре&shy;вод слова, произ&shy;несен&shy;ного на англий&shy;ском языке.</h4>
        <p>Для начала выбери сложность игры</p>
        <div id="levels" class="levels">
        <button data-level=0 class="btn">1</button>
        <button data-level=1 class="btn">2</button>
        <button data-level=2 class="btn">3</button>
        <button data-level=3 class="btn">4</button>
        <button data-level=4 class="btn">5</button>
        <button data-level=5 class="btn">6</button>
        </div>
      </div>
    `;
};

export const getPageGame = (backImg: string, word: IWordData): string => {
  return `
    <div class="game-audio">
      <div class="game-header">
        <div class="game-header__progress">
          <svg class="game-header__progress_svg">
              <circle id="circle" class="game-header__progress_circle" fill="none" r="45">
          </svg>
          <div id="textProgress" class="game-header__progress_text">
          0/20
          </div>
        </div>
        <div class="game-header__settings">
          <div class="game-header__settings_sound"></div>
          <div class="game-header__settings_full"></div>
        </div>
      </div>
      <div id="image" class="game-main__word_image" style=${backImg}>
        <button id="sound-btn" class="game-main__word_sound">
          <div id="animation" class="game-main__word_animate"></div>
        </button>
        <div id="correct-word" class="game-main__word_en hide">${word.word} ${word.transcription} </div>
      </div>
      <div id="answers" class="game-main__word_answers"></div>
      <button id="next" class="btn button-answers_dont-know"> Не знаю </button>
    </div>
   `;
};
