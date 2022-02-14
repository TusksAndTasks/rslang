import { model } from ".";
import { IAuthObject, INewWord, IUser, IWord, IWordData } from "../types/types";

class API {
  public baseUrl: string = 'https://react-learnwords-example.herokuapp.com';
  private users: string = `${this.baseUrl}/users`;
  private signin: string = `${this.baseUrl}/signin`;
  private words: string = `${this.baseUrl}/words`;

  public getWord = async (id: string): Promise<IWordData> | never => {
    const response: Response = await fetch(`${this.words}/${id}`);
    return (await response.json()) as IWordData;
  };

  public createUser = async (name: string, email: string, password: string): Promise<IUser> | never => {
    const response: Response = await fetch(this.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }

    return await response.json();
  }

  public signIn = async (email: string, password: string): Promise<IAuthObject> | never => {
    const response: Response = await fetch(this.signin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (!response.ok) {
      console.error(response.status, response.statusText)
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

  public getAggregatedWords = async (userId: string, group: number = 0, page: number = 0, wordsPerPage: number = 20, filter: string = ''): Promise<IWord[]> | never => {
    const response: Response = await fetch(`${this.users}/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`, {
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


  public createUserWord = async (userId: string, wordId: string, word: INewWord) => {
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

  public deleteUserWord = async (userId: string, wordId: string, word: INewWord) => {
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
}

export const api = new API();