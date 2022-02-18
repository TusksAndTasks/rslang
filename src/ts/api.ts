import { model } from ".";
import { IAuthObject, INewWord, IStatisticsObj, IUser, IWord, IWordData } from "../types/types";

class API {
  public baseUrl: string = "https://react-learnwords-example.herokuapp.com";
  private users: string = `${this.baseUrl}/users`;
  private signin: string = `${this.baseUrl}/signin`;
  private words: string = `${this.baseUrl}/words`;

  public getWord = async (id: string): Promise<IWordData> | never => {
    const response: Response = await fetch(`${this.words}/${id}`);
    return (await response.json()) as IWordData;
  };

  public createUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<IUser> | never => {
    const response: Response = await fetch(this.users, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      console.error(response.status, response.statusText);
    }

    return await response.json();
  };

  public signIn = async (
    email: string,
    password: string
  ): Promise<IAuthObject> | never => {
    const response: Response = await fetch(this.signin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      console.error(response.status, response.statusText);
    }

    return await response.json();
  }

  public getWords = async (group: number = 0, page: number = 0): Promise<IWord[]> | never => {
    const response: Response = await fetch(`${this.words}?group=${group}&page=${page}`);

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }

    return await response.json();
  }

  public getAggregatedWords = async (userId: string, wordsPerPage: number = 20, filter: string = ''): Promise<IWord[]> | never => {
    const response: Response = await fetch(`${this.users}/${userId}/aggregatedWords?&wordsPerPage=${wordsPerPage}&filter=${filter}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${model.auth!.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }


    const data = await response.json()
    const aggregatedWords = data[0].paginatedResults;

    return aggregatedWords;
  }


  public createUserWord = async (userId: string, wordId: string | undefined, word: INewWord) => {
    const response: Response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.auth!.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });

    return await response.json();
  };

  public deleteUserWord = async (userId: string, wordId: string | undefined, word: INewWord) => {
    const response: Response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${model.auth!.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });

    return response;
  };

  public updateUserWord = async (userId: string, wordId: string | undefined, word: INewWord) => {
    const response: Response = await fetch(`${this.users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${model.auth!.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(word)
    });

    return await response.json();
  };
  
  
  public async createAggregatedWords(page: number) {
    try {
      const filter = `filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%20%7B%22userWord.difficulty%22%3A%22normal%22%7D%2C%20%7B%22userWord%22%3Anull%20%7D%5D%7D%2C%7B%22page%22%3A${page}%7D%5D%7D`;
      const wordsPerPage = 'wordsPerPage=20&'
      const group = `group=${model.electronBookGroup}&`
      const response = await fetch(`${this.users}/${model.auth?.userId}/aggregatedWords?${group}${wordsPerPage}${filter}`, {
        headers: {
          'Authorization': `Bearer ${model.auth!.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }
  catch (err) {
     throw err;
  }
};
  
  
  public async updateStatistics(statistic: IStatisticsObj){
    try{
      console.log(JSON.stringify(statistic))
      await fetch(`${this.users}/${(model.auth as IAuthObject).userId}/statistics`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${model.auth!.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statistic)
      });
    }
    catch (err) {
      throw err;
    }
  }

  public async getStatistics(){
    try{
      const response = await fetch(`${this.users}/${(model.auth as IAuthObject).userId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${model.auth!.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      if (response.ok){
        return await response.json() as IStatisticsObj;
      } else {
        return null;
      }
    }
    catch (err) {
      throw err;
    }
  }



}

export const api = new API();
