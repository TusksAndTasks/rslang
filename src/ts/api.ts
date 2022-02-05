import { IWordData, IWordsData } from "../types/types";

export const baseUrl: string = "https://react-learnwords-example.herokuapp.com/";
export class API {
  private words: string = `${baseUrl}words`;

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
