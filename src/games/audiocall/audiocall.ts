export class AudioCall {
  static getHTML(): string {
    return /*html*/ `
      <div class="audiocall">
        <h2>Мини-игра аудиовызов</h2>
        <p>Выбери сложность игры</p>
        <div id="levels" class="levels">
        <button data-level=0 class="btn">1</button>
        <button data-level=1 class="btn">2</button>
        <button data-level=2 class="btn">3</button>
        <button data-level=3 class="btn">4</button>
        <button data-level=4 class="btn">5</button>
        <button data-level=5 class="btn">6</button>
        </div>
        <div class="wrapper-btn">
        <button class="btn">Назад к играм</button>
        <button class="btn">Играть</button>
        </div>
      </div>
    `;
  }
}
