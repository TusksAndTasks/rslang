import { ILogin, INewUser } from "../types/types";

export class API {
  private baseUrl: string = 'https://react-learnwords-example.herokuapp.com';
  private users: string = `${this.baseUrl}/users`;
  private signin: string = `${this.baseUrl}/signin`;

  public createUser = async (name: string, email: string, password: string): Promise<INewUser> | never => {
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

    return await response.json();
  }

  public signIn = async (email: string, password: string): Promise<ILogin> | never => {
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

    return await response.json();
  }
}