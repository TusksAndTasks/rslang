import { IAuthObject } from "../types/types";

export class Header {
  public getHTML(auth: IAuthObject | null): string {
    return /*html*/`
      <div class="container">
        <div class="row align-items-center header__row">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64" width="43px" height="43px">
              <path d="M32,2C15.432,2,2,15.432,2,32s13.432,30,30,30s30-13.432,30-30S48.568,2,32,2z M43.275,46.508H22.725V17.492h6.063v23.799h14.488V46.508z" fill="#1e88e5"/>
            </svg>
          </div>
          <div id="icon-menu" class="icon-menu">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul id="body-menu" class="row justify-content-sb align-items-center">
            <li id="main-btn" class="">Главная</li>
            <li id="electron-book-btn" class="">Электронный учебник</li>
            <li id="audio-call-btn" class="">Аудиовызов</li>
            <li id="sprint-btn" class="">Спринт</li>
            <li id="statistics-btn" class="">Статистика</li>
          </ul>
          ${auth
            ? '<button id="logout-btn" class="btn btn-logout btn-darkblue">Выйти</button>'
            : '<button id="login-btn" class="btn btn-login btn-blue">Войти</button>'
          }
        </div>
      </div>
    `;
  }
}