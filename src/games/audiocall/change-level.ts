class ChangeLevel {
  public getHTML(): string {
    return /*html*/ `
  <div id="audiocall" class="audiocall mt-10">
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
  }
}
export const changeLevel = new ChangeLevel();
