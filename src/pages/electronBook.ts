import { api } from "../ts/api";
import { IWord } from "../types/types";

export class ElectronBook {
  private words: IWord[] = [];

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
            <input type="number" class="pagination__input" min="1" max="20" value="1">
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
    this.getWords(0, 0);
  }

  private initPrevBtn(): void {

  }

  private initNextBtn(): void {

  }

  private initPageNumber(): void {

  }

  private getWords(group: number, page: number): void {
    api.getWords(group, page)
      .then((words: IWord[]) => {
        this.words = words;
        this.renderWordsList();
      });
  }

  private renderWordsList(): void {
    const wordsList = document.getElementById('electron-book-words') as HTMLElement;
    wordsList.innerHTML = '';

    this.sortWordsByNumber(this.words);

    this.words.forEach((word: IWord) => {
      wordsList.append(this.getWordCard(word));
    });
  }

  private getWordCard(word: IWord): HTMLElement {
    const wordCard = document.createElement('div') as HTMLElement;
    wordCard.classList.add('electron-book__word');

    this.getWordImage(word)
      .then(img => {
        wordCard.prepend(img);
        const imgHTML = wordCard.innerHTML;

        wordCard.innerHTML = /*html*/`
          <div class="row word-card">
            <div class="word-card__image">
              ${imgHTML}
            </div>
            <div class="word-card__body">
              <div class="word-card__top">
                <div class="row">
                  <div class="word-card__word">${word.word}</div>
                  <div class="word-card__transcription">${word.transcription}</div>
                  <div class="word-card__audio">
                    <img src="./assets/icons/audio-speaker.png" alt="audio-speaker">
                  </div>
                </div>
              </div>

              <div class="word-card__mid">
                <div class="word-card__translate">${word.wordTranslate}</div>
                <div class="word-card__meaning">${word.textMeaning}</div>
                <div class="word-card__meaningtranslate">${word.textMeaningTranslate}</div>
              </div>

              <div class="word-card__bottom">
                <div class="word-card__example">${word.textExample}</div>
                <div class="word-card__exampletranslate">${word.textExampleTranslate}</div>
              </div>
            </div>
          </div>
        `
      });

    return wordCard;
  }

  private async getWordImage(word: IWord): Promise<HTMLImageElement> {
    const img = new Image() as HTMLImageElement;
    img.src = `https://rs-lang-react.herokuapp.com/${word.image}`;
    img.alt = `${word.word}`;
    await img.decode();

    return img;
  }

  private sortWordsByNumber(arr: IWord[]) {
    arr.sort((a, b) => {
      const aImageNum = +a.image.slice(-8, -4);
      const bImageNum = +b.image.slice(-8, -4);
      return aImageNum - bImageNum;
    });
  }
}
