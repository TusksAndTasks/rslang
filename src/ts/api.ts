import { IWordData, IWordsData } from "../types/types";

export class API {
  private baseUrl: string = "https://react-learnwords-example.herokuapp.com";
  private words: string = `${this.baseUrl}/words`;

  public getWords = async (
    group: number,
    page: number
  ): Promise<IWordsData> | never => {
    const response: Response = await fetch(
      `${this.words}?group=${group}&page=${page}`,
      {
        method: "GET",
      }
    );
    return (await response.json()) as IWordsData;
  };

  public getWord = async (id: string): Promise<IWordData> | never => {
    const response: Response = await fetch(`${this.words}/${id}`, {
      method: "GET",
    });
    return (await response.json()) as IWordData;
  };
}
