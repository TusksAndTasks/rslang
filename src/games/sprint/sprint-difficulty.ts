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
         buttonsContainer.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('sprint-difficulty__button')) {
                this.startSprintGame(+((e.target as HTMLElement).id.slice(2) as string));
            }
        });

        document.onkeyup = (e) => {
            if(e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5' || e.key === '6'){
                this.startSprintGame(+(e.key as string) - 1);
            }
        }
         
    }

    private getRandomPage(){
        return Math.floor(Math.random() * 30);
    }

    private async setWordsArray(group: number) {
       try{
         const page = this.getRandomPage();
         const response = await api.getWords(group, page);
         model.sprintWordsArray = response;
       }
       catch (err){
           throw err;
       }
    }

    private async startSprintGame(group: number) {
        try{
            this.setWordsArray(group).then(() => {
                model.activePage = EPage.sprint;
                view.renderContent(model.activePage);
            })
        }
        catch (err) {
            throw err;
        }
    }

}