import { IAuthObject, IUser, IWord } from "../types/types";

class API {
  private baseUrl: string = 'https://react-learnwords-example.herokuapp.com';
  private users: string = `${this.baseUrl}/users`;
  private signin: string = `${this.baseUrl}/signin`;
  private words: string = `${this.baseUrl}/words`;

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

  public getWords = async (group: number = 1, page: number = 1): Promise<IWord[]> | never => {
    const response: Response = await fetch(`${this.words}?group=${group}&page=${page}`);

    if (!response.ok) {
      console.error(response.status, response.statusText)
    }

    return await response.json();
  }
}

export const api = new API();