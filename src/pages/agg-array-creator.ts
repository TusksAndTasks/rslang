import { model } from "../ts";
import { api } from "../ts/api";
import { IAggResponse, IAuthObject, IWord, IWordsData } from "../types/types";




export class AggArrayCreator {

   static async sprintGameArray() {
       if (model.electronBookGroup === 6){
           let sprintArray = await this.hardWordsArray();
           model.sprintWordsArray = sprintArray;
       } else {
       const page = model.electronBookPage;
       let sprintArray =  await this.createArray(page) as IWord[];
       model.sprintWordsArray = sprintArray;
       }
   } 

   static async audioGameArray() {
       if(model.electronBookGroup === 6){
           let arrayAudioGame = await this.hardWordsArray();
           model.audiocallWordsArray = arrayAudioGame;
           if (model.audiocallWordsArray.length < 4) {
               let backupArray = await api.getWords(3, model.electronBookPage);
               model.audiocallBackupArray = backupArray;
           }
       } else {
       const page = model.electronBookPage;
       let arrayAudioGame =  await this.createArray(page) as IWord[];
       model.audiocallWordsArray = arrayAudioGame;
       if (model.audiocallWordsArray.length < 4) {
        let backupArray = await api.getWords(3, model.electronBookPage);
        model.audiocallBackupArray = backupArray;
        }
       }
   }

   static async hardWordsArray() {
       let arrayOfHardWords = await api.getAggregatedWords((model.auth as IAuthObject).userId, 40, '%7B%22userWord.difficulty%22%3A%22hard%22%7D');
       function createRandomNumber(): number {
        return Math.random() < 0.5 ? -1 : 1;
      }
       let finalArr = arrayOfHardWords.sort((firstWord, secondWord) => {
           return createRandomNumber();
       }).slice(0, 20);
       return finalArr;
   }

   static async createArray(page: number): Promise<IWord[] | undefined> {
       let resp: Array<IAggResponse> = await api.createAggregatedWords(page);
       let arr = resp[0].paginatedResults

       if (arr.length === 20){
           return arr;
       }

       else if (arr.length < 20) {
           page -= 1;
           if(page < 0){
               return arr;
           }; 
           let secondResp = await this.createArray(page) as Array<IWord>;
           let secondArr = secondResp;
           let finalArr = arr.concat(secondArr);
           if (finalArr.length > 20){
             return finalArr.slice(0, 20);
           }   
       }

   }   

}