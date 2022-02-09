export class ElectronBook {
  public getHTML(): string {
    return /*html*/`
      <div class="electron-book">
        <div class='container'>
          <div class="electron-book__title title">Проверьте свои знания в мини-играх</div>
          <div class="row electron-book__row">
            <div class="electron-book__col">
              <div class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/headphones.png" alt=""></div>
                  <div>Аудиовызов</div>
                </div>
              </div>
            </div>
            <div class="electron-book__col">
              <div class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/gamepad.png" alt=""></div>
                  <div>Спринт</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row pagination align-items-center">
            <button id="pagination-prev" class="btn" disabled>Пред.</button>
            <div id="pagination-page" class="pagination__number">1</div>
            <button id="pagination-next" class="btn" disabled>След.</button>
            <input type="number" class="pagination__input">
            <button id="pagination-search" class="btn" disabled>Перейти</button>
          </div>
          <div class="row">
            <div id="electron-book-words" class="electron-book__words"></div>
            <div id="electron-book-groups" class="electron-book__groups">
              <div class="electron-book__group">1</div>
              <div class="electron-book__group">2</div>
              <div class="electron-book__group">3</div>
              <div class="electron-book__group">4</div>
              <div class="electron-book__group">5</div>
              <div class="electron-book__group">6</div>
              <div class="electron-book__group">7</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public init(): void {
    const contentEl = document.querySelector('#content') as HTMLElement;
    contentEl.innerHTML = this.getHTML();
    this.initPagination();
  }

  public initPagination(): void {
    this.initPrevBtn();
    this.initNextBtn();
    this.initPageNumber();
  }

  private initPrevBtn(): void {

  }

  private initNextBtn(): void {

  }

  private initPageNumber(): void {

  }
}
