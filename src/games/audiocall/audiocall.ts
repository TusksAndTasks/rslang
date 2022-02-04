import { API } from "../../ts/api";

const getRandomNumber = (max: number) => Math.floor(Math.random() * max);
const api = new API();
const numberOfPages = 30;

export class Audiocall {
  static getHTML(): string {
    return /*html*/ `
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
  }

  //public init(): void {
  //  this.addListeners();
  //}

  static addListeners(): void {
    const levels = document.querySelector("#levels") as HTMLElement;
    levels.addEventListener("click", (e: Event): void => {
      const level = (e.target as HTMLElement).dataset.level;
      const group = Number(level);
      const page = getRandomNumber(numberOfPages);
      api.getWords(group, page).then((data) => {
        console.log(data);
      });
    });
  }
}
