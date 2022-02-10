import { model, view } from "../../ts";
import { api } from "../../ts/api";
import { EPage } from "../../types/types";


export class SprintDifficulty {
    public getHTML(): string{
        return `
      <h2>Мини-игра спринт</h2>
      <div class="sprint-difficulty">
        <button class="sprint-difficulty_button" id="sd1">1</button>
        <button class="sprint-difficulty_button" id="sd2">2</button>
        <button class="sprint-difficulty_button" id="sd3">3</button>
        <button class="sprint-difficulty_button" id="sd4">4</button>
        <button class="sprint-difficulty_button" id="sd5">5</button>
        <button class="sprint-difficulty_button" id="sd6">6</button>
      </div>
      `
    }
    

    public setDifficultyListeners() {
         const buttonsContainer = document.querySelector('.sprint-difficulty') as HTMLElement;
         buttonsContainer.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).classList.contains('sprint-difficulty_button')) {
                this.startSprintGame(+((e.target as HTMLElement).textContent as string));
            }
        })
         
    }

    private getRandomPage(){
        return Math.floor(Math.random() * (31 - 1) + 1);
    }

    private async setWordsArray(group: number) {
       try{
         const page = this.getRandomPage();
         const response = await api.getWords(group, page);
         model.wordsArray = response;
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