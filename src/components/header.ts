import { IAuthObject } from "../types/types";

export class Header {
  public getHTML(auth: IAuthObject | null): string {
    return /*html*/`
      <div class="row">
        <button id="main-btn" class="btn">Главная</button>
        <button id="electron-book-btn" class="btn">Электронный учебник</button>
        <button id="audio-call-btn" class="btn">Мини-игра аудиовызов</button>
        <button id="sprint-btn" class="btn">Мини-игра спринт</button>
        ${auth
        ? '<button id="logout-btn" class="btn btn-logout btn-error">Выйти</button>'
        : '<button id="login-btn" class="btn btn-login btn-success">Войти</button>'
      }
      </div>
    `;
  }
}