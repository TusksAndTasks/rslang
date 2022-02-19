import { IWord, IWordData, IWordsData } from './../../types/types';
import { model, view } from "../../ts";
import { api } from "../../ts/api";
import { EPage } from "../../types/types";


export class SprintDifficulty {
    public getHTML(): string{
        return `
      <h2 class="sprint-title">Мини-игра спринт</h2>
      <div class="sprint-difficulty">
        <button class="sprint-difficulty__button" id="sd0">1</button>
        <button class="sprint-difficulty__button" id="sd1">2</button>
        <button class="sprint-difficulty__button" id="sd2">3</button>
        <button class="sprint-difficulty__button" id="sd3">4</button>
        <button class="sprint-difficulty__button" id="sd4">5</button>
        <button class="sprint-difficulty__button" id="sd5">6</button>
      </div>
      `
    }
    

    public setDifficultyListeners() {
         const buttonsContainer = document.querySelector('.sprint-difficulty') as HTMLElement;
         const header = document.getElementById('header') as HTMLElement;
         buttonsContainer.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('sprint-difficulty__button')) {
                this.startSprintGame(+((e.target as HTMLElement).id.slice(2) as string));
            }
        });

        document.onkeyup = (e) => {
            if(+(e.key) >= 1 && +(e.key) <= 6){
                this.startSprintGame(+(e.key as string) - 1);
            }
        }

        header.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).id !== 'sprint-btn' && (e.target as HTMLElement).tagName === 'LI' || (e.target as HTMLElement).id === 'login-btn'){
                document.onkeyup = null;
            }
        })
         
    }

    private getRandomPage(){
        const pageAmount = 30;
        return Math.floor(Math.random() * model.numberOfPages);
    }

    private async setWordsArray(group: number) {
       try{
         const page = this.getRandomPage();
         if(!model.auth){
         const response = await api.getWords(group, page);
         model.sprintWordsArray = response as IWordsData;
        } else {
            const response = await api.getAggregatedWords(model.auth.userId, 20, `%7B%22page%22%3A${page}%7D`);
            model.sprintWordsArray = response as Array<IWordData | IWord>;
        }
       }
       catch (err){
           throw err;
       }
    }

    private async startSprintGame(group: number) {
        try{
            this.setWordsArray(group).then(() => {
                model.previousPage = model.activePage;
                model.activePage = EPage.sprint;
                view.renderContent(model.activePage);
            })
        }
        catch (err) {
            throw err;
        }
    }

}