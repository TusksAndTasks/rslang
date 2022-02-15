import { controller, model, view } from "../ts";
import { api } from "../ts/api";
import { EPage, IWord } from "../types/types";

export class ElectronBook {
  private words: IWord[] = [];
  private isAudioPlaying: boolean = false;
  private firstPageIdx: number = 0;
  private pageLimitIdx: number = 29;
  private groupsCount: number = 5;
  private difficultWordsGroup: number = 6;

  public getHTML(): string {
    return /*html*/`
      <div class="electron-book">
        <div class='container'>
          <div class="electron-book__title title">Проверьте свои знания в мини-играх</div>
          <div class="row electron-book__row">
            <div class="electron-book__col">
              <button id="electron-book-audiocall" class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/headphones.png" alt=""></div>
                  <div>Аудиовызов</div>
                </div>
              </button>
            </div>
            <div class="electron-book__col">
              <button id="electron-book-sprint" class="electron-book__game">
                <div class="row align-items-center justify-content-center">
                  <div class="electron-book__icon"><img src="./assets/icons/gamepad.png" alt=""></div>
                  <div>Спринт</div>
                </div>
              </button>
            </div>
          </div>
          <div id="pagination" class="row pagination align-items-center">
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
  }

  public initPagination(): void {
    this.initPrevBtn();
    this.initNextBtn();
    this.initPageNumber();
    this.switchPage();

    if (model.electronBookGroup === this.difficultWordsGroup) {
      this.hidePagination();
    } else {
      this.showPagination();
    }
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

    if (model.auth) {
      api.getAggregatedWords(
        model.auth.userId,
        group === this.difficultWordsGroup ? '' : group,
        group === this.difficultWordsGroup ? '' : page,
        group === this.difficultWordsGroup ? 3600 : 20,
        group === this.difficultWordsGroup ? '%7B%22userWord.difficulty%22%3A%22hard%22%7D' : ''
      )
        .then((words: IWord[]) => {
          this.words = words;
          this.sortWordsByNumber(this.words);
          this.renderWordsList();
          this.initGamesButtons();
        });
    } else {
      api.getWords(group, page)
        .then((words: IWord[]) => {
          this.words = words;
          this.sortWordsByNumber(this.words);
          this.renderWordsList();
          this.initGamesButtons();
        });
    }

  }

  public renderWordsList(): void {
    const wordsList = document.getElementById('electron-book-words') as HTMLElement;
    wordsList.innerHTML = '';

    if (this.words.length > 0) {
      this.words.forEach((word: IWord) => {
        wordsList.append(this.getWordCard(word));
      });
    } else {
      wordsList.innerHTML = '<div class="electron-book__title title">Список слов пуст</div>';
    }
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

              ${model.auth && model.electronBookGroup !== this.difficultWordsGroup
            ?
            `<div class="word-card__buttons">
                        <button class="btn btn-hard">Сложное</button>
                        <button class="btn btn-easy">Изучено</button>
                      </div>`
            : ''
          }
            </div>
          </div>
        `;

      })
      .then(() => {
        this.initAudioPlayerBtn(wordCard, word);

        if (model.electronBookGroup !== 6) {
          if (model.auth) {
            this.initCardDifficultyButtons(wordCard, word);
          }
          this.addDifficultyCardClass(wordCard, word);
        }
      });

    return wordCard;
  }

  public addDifficultyCardClass(wordCard: HTMLElement, word: IWord): void {
    if (word.userWord) {
      const card = (wordCard.firstElementChild as HTMLElement);
      card.classList.add(`word-card--${word.userWord.difficulty}`);

      const btn = wordCard.querySelector(`.btn-${word.userWord.difficulty}`) as HTMLElement;
      btn.classList.add(`btn-${word.userWord.difficulty}-active`);
    }
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

  public initCardDifficultyButtons(wordCard: HTMLElement, word: IWord) {
    const hardBtn = wordCard.querySelector('.btn-hard') as HTMLElement;
    const easyBtn = wordCard.querySelector('.btn-easy') as HTMLElement;

    hardBtn.onclick = () => this.toggleWordToDifficultWords(wordCard, word, hardBtn, easyBtn);
    easyBtn.onclick = () => this.toggleWordToEasyWords(wordCard, word, hardBtn, easyBtn);
  }

  public toggleWordToDifficultWords(wordCard: HTMLElement, word: IWord, hardBtn: HTMLElement, easyBtn: HTMLElement): void {
    if (!easyBtn.classList.contains('btn-easy-active')) {
      if ((wordCard.firstElementChild as HTMLElement).classList.contains('word-card--hard')) {
        api.deleteUserWord(model.auth!.userId, word._id, { difficulty: 'hard', optional: {} })
          .then(() => {
            (wordCard.firstElementChild as HTMLElement).classList.remove('word-card--hard');
            hardBtn.classList.remove('btn-hard-active');
            this.checkEasyWordsCount();
          });
      } else {
        api.createUserWord(model.auth!.userId, word._id, { difficulty: 'hard', optional: {} })
          .then(() => {
            (wordCard.firstElementChild as HTMLElement).classList.add('word-card--hard');
            hardBtn.classList.add('btn-hard-active');
            this.checkEasyWordsCount();
          });
      }
    } else {
      api.updateUserWord(model.auth!.userId, word._id, { difficulty: 'hard', optional: {} })
        .then(() => {
          (wordCard.firstElementChild as HTMLElement).classList.add('word-card--hard');
          hardBtn.classList.add('btn-hard-active');
          (wordCard.firstElementChild as HTMLElement).classList.remove('word-card--easy');
          easyBtn.classList.remove('btn-easy-active');
          this.checkEasyWordsCount();
        });
    }
  }

  public toggleWordToEasyWords(wordCard: HTMLElement, word: IWord, hardBtn: HTMLElement, easyBtn: HTMLElement): void {
    if (!hardBtn.classList.contains('btn-hard-active')) {
      if ((wordCard.firstElementChild as HTMLElement).classList.contains('word-card--easy')) {
        api.deleteUserWord(model.auth!.userId, word._id, { difficulty: 'easy', optional: {} })
          .then(() => {
            (wordCard.firstElementChild as HTMLElement).classList.remove('word-card--easy');
            easyBtn.classList.remove('btn-easy-active');
            this.checkEasyWordsCount();
          });
      } else {
        api.createUserWord(model.auth!.userId, word._id, { difficulty: 'easy', optional: {} })
          .then(() => {
            (wordCard.firstElementChild as HTMLElement).classList.add('word-card--easy');
            easyBtn.classList.add('btn-easy-active');
            this.checkEasyWordsCount();
          });
      }
    } else {
      api.updateUserWord(model.auth!.userId, word._id, { difficulty: 'easy', optional: {} })
        .then(() => {
          (wordCard.firstElementChild as HTMLElement).classList.remove('word-card--hard');
          hardBtn.classList.remove('btn-hard-active');
          (wordCard.firstElementChild as HTMLElement).classList.add('word-card--easy');
          easyBtn.classList.add('btn-easy-active');
          this.checkEasyWordsCount();
        });
    }
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
      this.groupsCount = this.difficultWordsGroup;
    } else {
      this.groupsCount = 5;
    }

    for (let i = 0; i <= this.groupsCount; i++) {
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
    const audioCallBtn = document.getElementById('audio-call-btn') as HTMLElement;
    const sprintBtn = document.getElementById('sprint-btn') as HTMLElement;

    electronBookAudiocallBtn.onclick = () => {
      model.previousPage = model.activePage;
      model.activePage = EPage.audiocall;
      view.renderContent(model.activePage);
      controller.setActiveMenuItem(audioCallBtn);
    };

    electronBookSprintBtn.onclick = () => {
      model.previousPage = model.activePage;
      model.activePage = EPage.sprintDifficulty;
      view.renderContent(model.activePage);
      controller.setActiveMenuItem(sprintBtn);
    };

    this.checkEasyWordsCount();
  }

  public checkEasyWordsCount(): void {
    const electronBookAudiocallBtn = document.getElementById('electron-book-audiocall') as HTMLElement;
    const electronBookSprintBtn = document.getElementById('electron-book-sprint') as HTMLElement;

    if (this.words.every(word => word.userWord?.difficulty === 'easy') || document.querySelectorAll('.word-card--easy').length === 20) {
      electronBookAudiocallBtn.setAttribute('disabled', '');
      electronBookSprintBtn.setAttribute('disabled', '');
    } else {
      electronBookAudiocallBtn.removeAttribute('disabled');
      electronBookSprintBtn.removeAttribute('disabled');
    }
  }

  public hidePagination(): void {
    const pagination = document.getElementById('pagination') as HTMLElement;
    pagination.style.display = 'none';
  }

  public showPagination(): void {
    const pagination = document.getElementById('pagination') as HTMLElement;
    pagination.style.display = 'flex';
  }
}
