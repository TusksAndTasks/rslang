import { controller, model, view } from "../ts";
import { api } from "../ts/api";
import { EPage } from "../types/types";

export class Main {
  public getHTML(): string {
    return /*html*/`
      <div class="main">
        <div class="container">
          <div class="about">
            <div class="row about__row">
              <div class="about__title">RS Lang</div>
              <div class="about__info">
                <div class="about__subtitle title">Изучение английского языка еще никогда не было таким легким!</div>
                <div class="about__text">Изучение английских слов может быть веселым и интересным. Играйте в игры, прослушивайте произношение, улучшайте свои знания. С нашим приложением учеба в удовольствие</div>
                <button id="start" class="btn btn-blue">Начать</button>
              </div>
            </div>
          </div>
          <div class="advanteges">
            <div class="advanteges__title title">Что мы предлагаем</div>
            <div class="row advanteges__row">
              <div class="advanteges__col">
                <div class="advanteges-card">
                  <div class="advanteges-card__subtitle">Электронный учебник</div>
                  <div class="advanteges-card__icon"><img src="./assets/icons/book.png" alt=""></div>
                  <div class="advanteges-card__text">
                    Электронный учебник генерируется на основе коллекции исходных данных и состоит из шести разделов, в каждом разделе 30 страниц, на каждой странице 20 слов для изучения. Раздел "Сложные слова" состоит из слов, которые пользователь отметил как сложные. Все слова в этом разделе размещаются на одной странице.
                  </div>
                </div>
              </div>
              <div class ="advanteges__col">
                <div class="advanteges-card">
                  <div class="advanteges-card__subtitle">Аудиовызов</div>
                  <div class="advanteges-card__icon"><img src="./assets/icons/headphones.png" alt=""></div>
                  <div class="advanteges-card__text">
                    Проверьте свои навыки аудирования, выберите правильный перевод услышанного слова. Будьте осторожны, так как у вас есть только одна попытка.
                  </div>
                </div>
              </div>
             <div class="advanteges__col">
                <div class="advanteges-card">
                  <div class="advanteges-card__subtitle">Спринт</div>
                  <div class="advanteges-card__icon"><img src="./assets/icons/gamepad.png" alt=""></div>
                  <div class="advanteges-card__text">
                    Проверьте, сколько очков вы можете получить за одну минуту, пытаясь определить правильный ли перевод слова
                  </div>
                </div>
             </div>
              <div class ="advanteges__col">
                <div class="advanteges-card">
                  <div class="advanteges-card__subtitle">Статистика</div>
                  <div class="advanteges-card__icon"><img src="./assets/icons/bar-chart.png" alt=""></div>
                  <div class="advanteges-card__text">
                    Весь прогресс обучения можно посмотреть в статистике, где представлены данные как за текущий день, так и за весь период обучения. Информация представлена как в виде таблицы, так и в виде графиков, что очень удобно.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team">
            <div class="team__title title">Команда разработчиков</div>
            <div class="team-card">
              <div class="team-card__image">
                <img src="./assets/team-01.jpg" alt="">
              </div>
              <div class="team-card__about">
                <div class="team-card__name">Дмитрий</div>
                <div class="team-card__position">Team leader, Frontend developer</div>
                <div class="team-card__info">Создал доску Trello, сборку проекта, базовую структуру, роутинг между страницами, авторизацию, электронный учебник</div>
                <a href="https://github.com/bamfl" class="team-card__link" target="_blank">
                  <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                      <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                      </path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="team-card">
              <div class="team-card__image">
                <img src="./assets/team-02.jpg" alt="">
              </div>
              <div class="team-card__about">
                <div class="team-card__name">Светлана</div>
                <div class="team-card__position">Frontend developer</div>
                <div class="team-card__info">Создала игру Аудиовызов</div>
                <a href="https://github.com/Swettlana" class="team-card__link" target="_blank">
                  <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                      <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                      </path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="team-card">
              <div class="team-card__image">
                <img src="https://avatars.githubusercontent.com/u/86926386?v=4" alt="">
              </div>
              <div class="team-card__about">
                <div class="team-card__name">Александр</div>
                <div class="team-card__position">Frontend developer</div>
                <div class="team-card__info">Создал игру Спринт</div>
                <a href="https://github.com/TusksAndTasks" class="team-card__link" target="_blank">
                  <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                      <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z">
                      </path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public init() {
    this.statisticReset();
    const contentEl = document.querySelector('#content') as HTMLElement;
    contentEl.innerHTML = this.getHTML();
    this.initStartBtn();
  }

  private async statisticReset(){
    let now = new Date()
    if(!localStorage.getItem('date')){
      localStorage.setItem('date', now.getTime().toString());
    } else {
       let startDate = +(localStorage.getItem('date') as string);
       if ((now.getTime() - startDate) > 86400000){
        let stat = {
          learnedWords: 0,
          optional: {
              audiocall: {
                 correctWords: 0,
                 incorrectWords: 0,
                 streak: 0,
                 newWords: +0
              },
              sprint: {
                  correctWords: 0,
                  incorrectWords: 0,
                  streak: 0,
                  newWords: +0
              }
          }
        }
        let setting = {
          wordsPerDay: 1,
          optional: {
            learnedWords: model.electronBookLearnedWords,
            dayStats: { test: {
               learnedWords: 1,
               optional: {
                 sprint: {
                   correctWords: 1,
                   incorrectWords: 1,
                   streak: 1,
                   newWords: 1
                 },
                 audiocall: {
                  correctWords: 1,
                  incorrectWords: 1,
                  streak: 1,
                  newWords: 1
                 }
               }
            }},
            dayLearnWords: {test: 100},
          },
        }
         if(model.auth){
          let statisticsFull = await api.getStatistics();
          let statisticsWords = await api.getSettings();
          const date = new Date(startDate).getUTCDate();
           if(statisticsWords){
             delete statisticsWords.id;
             console.log(statisticsWords.optional.dayLearnWords);
              statisticsWords.optional.dayLearnWords[`${new Date(startDate).getUTCDate()}`] = statisticsWords.optional.learnedWords;
              statisticsWords.optional.learnedWords = 0;
           if (statisticsFull){
             statisticsWords.optional.dayStats[`${new Date(startDate).getUTCDate()}`] = statisticsFull; 
           }
           console.log(statisticsWords);
           await api.updateSettings(statisticsWords);
          }
          if(!statisticsWords){
          api.updateSettings(setting);
          }
          localStorage.setItem('date', now.getTime().toString());  
          api.updateStatistics(stat)};
       }
    }
  }

  public initStartBtn() {
    const startBtn = document.getElementById('start') as HTMLElement;

    startBtn.onclick = () => {
      const electronBookBtn = document.getElementById('electron-book-btn') as HTMLElement;

      model.previousPage = model.activePage;
      model.activePage = EPage.electronBook;
      view.renderContent(model.activePage);
      controller.toggleHeaderMenu('close');
      controller.setActiveMenuItem(electronBookBtn);
    };
  }
}
