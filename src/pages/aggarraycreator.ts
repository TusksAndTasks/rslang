import { model } from "../ts";
import { api } from "../ts/api";
import { IAggResponse, IWord } from "../types/types";




export class AggArrayCreator {

   static async sprintGameArray() {
       const page = model.electronBookPage;
       let sprintArray =  await this.createArray(page) as IWord[];
       model.sprintWordsArray = sprintArray;
   } 

   static async audioGameArray() {
    const page = model.electronBookPage;
    let arrayAudioGame =  await this.createArray(page) as IWord[];
    model.audiocallWordsArray = arrayAudioGame;
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