import { model } from "../ts";
import { api } from "../ts/api";
import { IWord } from "../types/types";


interface responce{
    paginatedResults: Array<any>, totalCount: Array<any>;
}

export class AggArrayCreator {

   static async testArray() {
       const page = model.electronBookPage;
       let test =  await this.createArray(page) as IWord[];
       model.sprintWordsArray = test;
   } 

   static async audioGameArray() {
    const page = model.electronBookPage;
    let arrayAudioGame =  await this.createArray(page) as IWord[];
    model.audiocallWordsArray = arrayAudioGame;
   }

   static async createArray(page: number): Promise<any[] | undefined> {
       let resp: Array<responce> = await api.createAggregatedWords(page);
       let arr = resp[0].paginatedResults
       console.log(resp);

       if (arr.length === 20){
           return arr;
       }

       else if (arr.length < 20) {
           page -= 1;
           if(page < 0){
               return arr;
           }; 
           let secondResp = await this.createArray(page) as Array<any>;
           let secondArr = secondResp;
           let finalArr = arr.concat(secondArr);
           if (finalArr.length > 20){
             return finalArr.slice(0, 20);
           }   
       }

   }   

}