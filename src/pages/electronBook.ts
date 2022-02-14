import { model, view } from "../ts";
import { api } from "../ts/api";
import { EPage, IWord } from "../types/types";

export class ElectronBook {
  private words: IWord[] = [];
  private isAudioPlaying: boolean = false;
  private firstPageIdx: number = 0;
  private pageLimitIdx: number = 29;
  private groupsCount: number = 6;

  public getHTML(): string {
    return /*html*/`
      <div class="electron-book">
        <div class='container'>
          <div class="electron-book__title title">Проверьте свои знания в мини-играх</div>
          <div class="row electron-book__row">
            <div class="electron-book__col">
              <div id="electron-book-audiocall" class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/headphones.png" alt=""></div>
                  <div>Аудиовызов</div>
                </div>
              </div>
            </div>
            <div class="electron-book__col">
              <div id="electron-book-sprint" class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/gamepad.png" alt=""></div>
                  <div>Спринт</div>
                </div>
              </div>
            </div>
          </div>
          <div class="row pagination align-items-center">
            <button id="pagination-prev" class="btn">Пред.</button>
            <div id="pagination-page" class="pagination__number"></div>
            <button id="pagination-next" class="btn">След.</button>
            <input id="pagination-input" type="number" class="pagination__input" min="${this.firstPageIdx + 1}" max="${this.pageLimitIdx + 1}" value="${this.firstPageIdx + 1}">
            <button id="pagination-switch" class="btn" disabled>Перейти</button>
          </div>
          <div class="row electron-book__wrapper">
            <div id="electron-book-words" class="electron-book__words">
              <div class="loader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
            </div>
            <div>
              <div class="electron-book__groups-title">Группы</div>
              <div id="electron-book-groups" class="electron-book__groups"></div>
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
    this.initGroups();
    this.initWords(model.electronBookGroup, model.electronBookPage);
    this.initGamesButtons();
  }

  public initPagination(): void {
    this.initPrevBtn();
    this.initNextBtn();
    this.initPageNumber();
    this.switchPage();
  }

  public initPrevBtn(): void {
    const prevBtn = document.getElementById('pagination-prev') as HTMLElement;

    if (model.electronBookPage === this.firstPageIdx) {
      prevBtn.setAttribute('disabled', '');
    } else {
      prevBtn.removeAttribute('disabled');
    }

    prevBtn.onclick = () => {
      if (model.electronBookPage > this.firstPageIdx) {
        model.electronBookPage--;
        this.initWords(model.electronBookGroup, model.electronBookPage);
        this.initPagination();
        this.initGroups();
      }
    };
  }

  public initNextBtn(): void {
    const nextBtn = document.getElementById('pagination-next') as HTMLElement;

    if (model.electronBookPage === this.pageLimitIdx) {
      nextBtn.setAttribute('disabled', '');
    } else {
      nextBtn.removeAttribute('disabled');
    }

    nextBtn.onclick = () => {
      if (model.electronBookPage < this.pageLimitIdx) {
        model.electronBookPage++;
        this.initWords(model.electronBookGroup, model.electronBookPage);
        this.initPagination();
        this.initGroups();
      }
    };
  }

  public initPageNumber(): void {
    const paginationPage = document.getElementById('pagination-page') as HTMLElement;
    paginationPage.innerHTML = `${model.electronBookPage + 1}`;
  }

  public switchPage(): void {
    const paginationInput = document.getElementById('pagination-input') as HTMLInputElement;
    const switchPageBtn = document.getElementById('pagination-switch') as HTMLElement;
    const events = ['change', 'input'];

    this.validatePageNumber(paginationInput, switchPageBtn);

    events.forEach(event => {
      paginationInput.addEventListener(event, () => {
        this.validatePageNumber(paginationInput, switchPageBtn);
      });
    })

    switchPageBtn.onclick = () => {
      model.electronBookPage = +paginationInput.value - 1;
      this.initWords(model.electronBookGroup, model.electronBookPage);
      this.initPagination();
      this.initGroups();
    };
  }

  public validatePageNumber(paginationInput: HTMLInputElement, switchPageBtn: HTMLElement): void {
    const paginationInputIdx = +paginationInput.value - 1;

    if (!Number.isNaN(paginationInputIdx) && paginationInputIdx >= this.firstPageIdx && paginationInputIdx <= this.pageLimitIdx) {
      switchPageBtn.removeAttribute('disabled');
    } else {
      switchPageBtn.setAttribute('disabled', '');
    }
  }

  public initWords(group: number, page: number): void {
    const wordsList = document.getElementById('electron-book-words') as HTMLElement;
    wordsList.innerHTML = '<div class="loader"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>';

    api.getWords(group, page)
      .then((words: IWord[]) => {
        this.words = words;
        this.sortWordsByNumber(this.words);
        this.renderWordsList();
      });
  }

  public renderWordsList(): void {
    const wordsList = document.getElementById('electron-book-words') as HTMLElement;
    wordsList.innerHTML = '';

    this.words.forEach((word: IWord) => {
      wordsList.append(this.getWordCard(word));
    });
  }

  public getWordCard(word: IWord): HTMLElement {
    const wordCard = document.createElement('div') as HTMLElement;
    wordCard.classList.add('electron-book__word');

    this.getWordImage(word)
      .then(img => {
        wordCard.prepend(img);
        const imgHTML = wordCard.innerHTML;

        wordCard.classList.add(`group-${model.electronBookGroup + 1}`);

        wordCard.innerHTML = /*html*/`
          <div class="row word-card">
            <div class="word-card__image">
              ${imgHTML}
            </div>
            <div class="word-card__body">
              <div class="word-card__top">
                <div class="row align-items-center justify-content-sb">
                  <div class="word-card__word">${word.word}</div>
                  <div class="word-card__transcription">${word.transcription}</div>
                  <div class="word-card__audio"></div>
                </div>
                <div class="word-card__translate">${word.wordTranslate}</div>
              </div>

              <div class="word-card__mid">
                <div class="word-card__meaning">${word.textMeaning}</div>
                <div class="word-card__meaningtranslate">${word.textMeaningTranslate}</div>
              </div>

              <div class="word-card__bottom">
                <div class="word-card__example">${word.textExample}</div>
                <div class="word-card__exampletranslate">${word.textExampleTranslate}</div>
              </div>

              ${model.auth 
                ? 
                  `<div class="word-card__buttons">
                    <button id="word-card-difficult" class="btn">Сложное</button>
                    <button id="word-card-learned" class="btn">Изучено</button>
                  </div>`
                : ''
              }
            </div>
          </div>
        `;
      })
      .then(() => {
        this.initAudioPlayerBtn(wordCard, word);
      });

    return wordCard;
  }

  public async getWordImage(word: IWord): Promise<HTMLImageElement> {
    const img = new Image() as HTMLImageElement;
    img.src = `https://rs-lang-react.herokuapp.com/${word.image}`;
    img.alt = `${word.word}`;
    await img.decode();

    return img;
  }

  public async getWordAudio(src: string): Promise<HTMLAudioElement> {
    const audio = new Audio() as HTMLAudioElement;
    audio.src = `https://rs-lang-react.herokuapp.com/${src}`;

    return audio;
  }

  public initAudioPlayerBtn(wordCard: HTMLElement, word: IWord): void {
    Promise.all([
      this.getWordAudio(word.audio),
      this.getWordAudio(word.audioMeaning),
      this.getWordAudio(word.audioExample)
    ])
      .then(audioPlayers => {
        const audioBtn = wordCard.querySelector('.word-card__audio') as HTMLElement;

        audioBtn.addEventListener('click', () => {
          if (audioBtn.classList.contains('active')) {
            audioBtn.classList.remove('active');

            audioPlayers.forEach(audioPlayer => {
              audioPlayer.pause();
              audioPlayer.currentTime = 0;
              this.isAudioPlaying = false;
            });
          } else {
            if (!this.isAudioPlaying) {
              audioBtn.classList.add('active');
              this.isAudioPlaying = true;

              audioPlayers[0].play()
                .then(() => {
                  audioPlayers[0].onended = () => {
                    audioPlayers[1].play();
                  };
                })
                .then(() => {
                  audioPlayers[1].onended = () => {
                    audioPlayers[2].play()
                      .then(() => {
                        audioPlayers[2].onended = () => {
                          audioBtn.classList.remove('active');
                          this.isAudioPlaying = false;
                        }
                      })
                  };
                });
            }
          }
        });
      });
  }

  public sortWordsByNumber(arr: IWord[]): void {
    arr.sort((a, b) => {
      const aImageNum = +a.image.slice(-8, -4);
      const bImageNum = +b.image.slice(-8, -4);
      return aImageNum - bImageNum;
    });
  }

  public initGroups(): void {
    const groups = document.getElementById('electron-book-groups') as HTMLElement;

    groups.innerHTML = '';

    if (model.auth) {
      this.groupsCount = 7;
    } else {
      this.groupsCount = 6;
    }

    for (let i = 0; i < this.groupsCount; i++) {
      const group = document.createElement('div') as HTMLElement;

      group.classList.add('electron-book__group', `electron-book__group--${i + 1}`);

      if (i === model.electronBookGroup) {
        group.classList.add('electron-book__group--active');
      }

      group.innerHTML = `${i + 1}`;
      group.onclick = () => {
        this.switchGroup(i);
      };
      groups.append(group);
    }
  }

  public switchGroup(group: number): void {
    model.electronBookGroup = group;
    this.initWords(model.electronBookGroup, model.electronBookPage);
    this.initPagination();
    this.initGroups();
  }

  public initGamesButtons(): void {
    const electronBookAudiocallBtn = document.getElementById('electron-book-audiocall') as HTMLElement;
    const electronBookSprintBtn = document.getElementById('electron-book-sprint') as HTMLElement;

    electronBookAudiocallBtn.onclick = () => {
      model.previousPage = model.activePage;
      model.activePage = EPage.audiocall;
      view.renderContent(model.activePage);
    };

    electronBookSprintBtn.onclick = () => {
      model.previousPage = model.activePage;
      model.activePage = EPage.sprint;
      view.renderContent(model.activePage);
    };
  }
}
