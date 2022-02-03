export class Auth {
  public getHTML(): string {
    return /*html*/`
      <div class="auth">
        <div id="modal-auth" class="modal auth">
          <div class="modal__body">
            <div class="row auth__top">
              <div class="auth__login-btn active">Вход</div>
              <div class="auth__registrarion-btn">Регистрация</div>
            </div>
            <div class="row auth__content">
              <div id="login-content" class="auth__login-content">
                <input type="email" placeholder="Почта" />
                <input type="password" placeholder="Пароль" />
                <div class="row">
                  <button class="btn">Отмена</button>
                  <button class="btn">Вход</button>
                </div>
              </div>
              <div id="registrarion-content" class="auth__registrarion-content">
                <input type="text" placeholder="Имя" />
                <input type="email" placeholder="Почта" />
                <input type="password" placeholder="Пароль" />
                <div class="row">
                  <button class="btn">Отмена</button>
                  <button class="btn">Вход</button>
                </div>
              </div>
            </div>
          </div>

          <div class="modal__overlay"></div>
        </div>
      </div>
    `;
  }

  public init(): void {
    this.addListeners();
  }
 
  public addListeners(): void {
    const modalAuth = document.getElementById('modal-auth') as HTMLElement;
    modalAuth.addEventListener('click', (event) => {
      if ((event.target as HTMLElement).classList.contains('modal__overlay') || (event.target as HTMLElement).classList.contains('modal__close')) {
        this.destroyModal(modalAuth);
      }
    })
  }

  public destroyModal(modal: HTMLElement): void {
    modal.remove();
    document.documentElement.style.overflow = '';
  }
}
