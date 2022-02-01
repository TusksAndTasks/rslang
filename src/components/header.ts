export class Header {
  static getHTML(): string {
    return /*html*/`
      <div class="row">
        <button id="auth-btn" class="btn">Авторизация</button>
        <button id="main-btn" class="btn">Главная</button>
        <button id="electron-book-btn" class="btn">Электронный учебник</button>
        <button id="audio-call-btn" class="btn">Мини-игра аудиовызов</button>
        <button id="sprint-btn" class="btn">Мини-игра спринт</button>
      </div>
    `;
  }
}