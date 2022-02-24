import { model } from ".";
import { token } from "../pages/change-token";
import {
  IAuthObject,
  INewWord,
  ISettings,
  IStatisticsObj,
  IUser,
  IWord,
  IWordData,
} from "../types/types";

class API {
  public baseUrl: string = "https://rss-lang-application.herokuapp.com";
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
  };

  public getWords = async (
    group: number = 0,
    page: number = 0
  ): Promise<IWord[]> | never => {
    const response: Response = await fetch(
      `${this.words}?group=${group}&page=${page}`
    );

    if (!response.ok) {
      console.error(response.status, response.statusText);
    }

    return await response.json();
  };

  public getAggregatedWords = async (
    userId: string,
    wordsPerPage: number = 20,
    filter: string = ""
  ): Promise<IWord[]> | never => {
    const response: Response = await fetch(
      `${this.users}/${userId}/aggregatedWords?&wordsPerPage=${wordsPerPage}&filter=${filter}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(response.status, response.statusText);
      token.init();
    }

    const data = await response.json();
    const aggregatedWords = data[0].paginatedResults;

    return aggregatedWords;
  };

  public createUserWord = async (
    userId: string,
    wordId: string | undefined,
    word: INewWord
  ) => {
    const response: Response = await fetch(
      `${this.users}/${userId}/words/${wordId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(word),
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      token.init();
      return null;
    }
  };

  public deleteUserWord = async (
    userId: string,
    wordId: string | undefined,
    word: INewWord
  ) => {
    const response: Response = await fetch(
      `${this.users}/${userId}/words/${wordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(word),
      }
    );
    if (response.ok) {
      return response;
    } else {
      token.init();
      return null;
    }
  };

  public updateUserWord = async (
    userId: string,
    wordId: string | undefined,
    word: INewWord
  ) => {
    const response: Response = await fetch(
      `${this.users}/${userId}/words/${wordId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(word),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      token.init();
      return null;
    }
  };

  public async createAggregatedWords(page: number) {
    try {
      const filter = `filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%20%7B%22userWord.difficulty%22%3A%22normal%22%7D%2C%20%7B%22userWord%22%3Anull%20%7D%5D%7D%2C%7B%22page%22%3A${page}%7D%5D%7D`;
      const wordsPerPage = "wordsPerPage=20&";
      const group = `group=${model.electronBookGroup}&`;
      const response = await fetch(
        `${this.users}/${model.auth?.userId}/aggregatedWords?${group}${wordsPerPage}${filter}`,
        {
          headers: {
            Authorization: `Bearer ${model.auth!.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    } catch (err) {
      token.init();
      return null;
    }
  }

  public async updateStatistics(statistic: IStatisticsObj) {
    try {
      await fetch(
        `${this.users}/${(model.auth as IAuthObject).userId}/statistics`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${model.auth!.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statistic),
        }
      );
    } catch (err) {
      token.init();
      return null;
    }
  }

  public async getStatistics() {
    const response = await fetch(
      `${this.users}/${(model.auth as IAuthObject).userId}/statistics`,
      {
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      return (await response.json()) as IStatisticsObj;
    } else {
      if (response.status === 401 || response.status === 403) {
        token.init();
      } else {
        console.warn("Статистика отсутствует.Новая статисктика была создана.");
      }
      return null;
    }
  }

  public async getSettings() {
    const response = await fetch(
      `${this.users}/${(model.auth as IAuthObject).userId}/settings`,
      {
        headers: {
          Authorization: `Bearer ${model.auth!.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      return (await response.json()) as ISettings;
    } else {
      if (response.status === 401 || response.status === 403) {
        token.init();
      } else {
        console.warn(
          "Глобальная статистика отсутствует.Глобальная статистика создастся по истечение хотя бы одного игрового дня"
        );
      }
      return null;
    }
  }

  public async updateSettings(statistic: ISettings) {
    try {
      await fetch(
        `${this.users}/${(model.auth as IAuthObject).userId}/settings`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${model.auth!.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statistic),
        }
      );
    } catch (err) {
      token.init();
      return null;
    }
  }
}

export const api = new API();
