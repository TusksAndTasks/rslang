import { model, view } from ".";
import {
  EPage,
  IAuthObject,
  INewToken,
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
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.getAggregatedWords(userId, wordsPerPage, filter);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }
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
    if (!response.ok) {
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.createUserWord(userId, wordId, word);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }
    }
    return await response.json();
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
    if (!response.ok) {
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.deleteUserWord(userId, wordId, word);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }
    }

    return response;
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

    if (!response.ok) {
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.updateUserWord(userId, wordId, word);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }
    }

    return await response.json();
  };

  public async createAggregatedWords(page: number) {
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
    if (!response.ok) {
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.createAggregatedWords(page);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }

      return await response.json();
    }
  }

  public async updateStatistics(statistic: IStatisticsObj) {
    console.log(JSON.stringify(statistic));
    const response = await fetch(
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
    if (!response.ok) {
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.updateStatistics(statistic);
        } else {
          this.logOut();
        }
      } else {
        console.error(response.status, response.statusText);
      }
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
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.getStatistics();
        } else {
          this.logOut();
        }
      } else
        console.warn("Статистика отсутствует.Новая статисктика была создана.");
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
      if (response.status === 401) {
        const isValid: boolean = await this.getNewToken();
        if (isValid) {
          this.getSettings();
        } else {
          this.logOut();
        }
      } else {
        console.warn(
          "Глобальная статистика отсутствует.Глобальная статистика создастся по истечение хотя бы одного игрового дня"
        );
      }
      return null;
    }
  }

  public async updateSettings(statistic: ISettings) {
    console.log(JSON.stringify(statistic));
    const response = await fetch(
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
    if (response.status === 401) {
      const isValid: boolean = await this.getNewToken();
      if (isValid) {
        this.updateSettings(statistic);
      } else {
        this.logOut();
      }
    }
  }

  private async getNewToken(): Promise<boolean> {
    const response: Response = await fetch(
      `${this.users}/${(model.auth as IAuthObject).userId}/tokens`,
      {
        headers: {
          Authorization: `Bearer ${model.auth!.refreshToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const newToken = (await response.json()) as INewToken;
      console.warn("Получен новый токен", newToken);
      const userObj: IAuthObject = JSON.parse(
        localStorage.getItem("authObject") as string
      );

      userObj.token = newToken.token;
      userObj.refreshToken = newToken.refreshToken;

      localStorage.setItem("authObject", JSON.stringify(userObj));
      model.auth = userObj;
      return true;
    } else return false;
  }

  private logOut() {
    console.log("Рефреш токен невалиден - войдите снова");
    localStorage.removeItem("authObject");
    view.renderContent(EPage.main);
    window.location.reload();
  }
}

export const api = new API();
