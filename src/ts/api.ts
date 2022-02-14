import { IAuthObject, IUser } from "../types/types";
import { IWordData, IWordsData } from "../types/types";

class API {
  public baseUrl: string = "https://react-learnwords-example.herokuapp.com";
  private users: string = `${this.baseUrl}/users`;
  private signin: string = `${this.baseUrl}/signin`;
  private words: string = `${this.baseUrl}/words`;

  public getWords = async (
    group: number,
    page: number
  ): Promise<IWordsData> | never => {
    const response: Response = await fetch(
      `${this.words}?group=${group}&page=${page}`
    );
    return (await response.json()) as IWordsData;
  };

  public getWord = async (id: string): Promise<IWordData> | never => {
    const response: Response = await fetch(`${this.words}/${id}`, {
      method: "GET",
    });
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
  };
}

export const api = new API();
