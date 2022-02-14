import { model, view } from "../ts";
import { api } from "../ts/api";
import { EPage, IAuthObject, IUser } from "../types/types";

export class Auth {
  public getHTML(): string {
    return /*html*/`
      <div class="auth">
        <div id="modal-auth" class="modal auth">
          <div class="modal__body">
            <div class="row auth__top">
              <div id="login-toggle-btn" class="auth__login-btn">Вход</div>
              <div id="registration-toggle-btn" class="auth__registration-btn">Регистрация</div>
            </div>
            <div id="content-wrapper"></div>
          </div>
          <div class="modal__overlay"></div>
        </div>
      </div>
    `;
  }

  public init(): void {
    if (model.auth) {
      this.logoutUser();
    } else {
      const contentEl = document.querySelector('#content') as HTMLElement;
      contentEl.innerHTML = this.getHTML();
      this.openAuthModal();
    }
  }

  public openAuthModal(): void {
    this.showLogin();
    this.setAuthListeners();
  }

  private showLogin() {
    const contentWrapper = document.getElementById('content-wrapper') as HTMLElement;
    const loginToggleBtn = document.getElementById('login-toggle-btn') as HTMLElement;
    const registrationToggleBtn = document.getElementById('registration-toggle-btn') as HTMLElement;

    loginToggleBtn.classList.add('active');
    registrationToggleBtn.classList.remove('active');
    contentWrapper.innerHTML = /*html*/`
      <div class="row auth__content">
        <div id="login-content" class="auth__login-content active">
          <input tabindex="1" id="login-email" type="email" placeholder="Почта" required />
          <input tabindex="2" id="login-password" type="password" placeholder="Пароль" required minlength="8" />
          <div class="row auth__bottom">
            <button tabindex="4" class="btn auth__cancel">Отмена</button>
            <button tabindex="3" id="login" class="btn btn-blue" type="submit">Вход</button>
          </div>
        </div>
      </div>
    `;

    const loginEmailInput = document.getElementById('login-email') as HTMLInputElement;
    const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
    const loginBtn = document.getElementById('login') as HTMLInputElement;

    loginBtn.addEventListener('click', () => {
      if (!this.validateEmail(loginEmailInput.value)) {
        this.showError(loginEmailInput);
      } else if (loginPasswordInput.value.length < 8) {
        this.showError(loginPasswordInput);
      } else {
        this.loginUser(loginEmailInput.value, loginPasswordInput.value);
        this.backToActivePage();
      }
    });
  }

  private showRegistration() {
    const contentWrapper = document.getElementById('content-wrapper') as HTMLElement;
    const loginToggleBtn = document.getElementById('login-toggle-btn') as HTMLElement;
    const registrationToggleBtn = document.getElementById('registration-toggle-btn') as HTMLElement;

    registrationToggleBtn.classList.add('active');
    loginToggleBtn.classList.remove('active');
    contentWrapper.innerHTML = /*html*/`
      <div class="row auth__content">
        <div id="registration-content" class="auth__registration-content">
          <input tabindex="1" id="registration-name" type="text" placeholder="Имя" required minlength="1" />
          <input tabindex="2" id="registration-email" type="email" placeholder="Почта" required/>
          <input tabindex="3" id="registration-password" type="password" placeholder="Пароль" required minlength="8" />
          <div class="row auth__bottom">
            <button tabindex="5" class="btn auth__cancel">Отмена</button>
            <button tabindex="4" id="registration" class="btn btn-blue" type="submit">Регистрация</button>
          </div>
        </div>
      </div>
    `;

    const registrationNameInput = document.getElementById('registration-name') as HTMLInputElement;
    const registrationEmailInput = document.getElementById('registration-email') as HTMLInputElement;
    const registrationPasswordInput = document.getElementById('registration-password') as HTMLInputElement;
    const registrationBtn = document.getElementById('registration') as HTMLInputElement;

    registrationBtn.addEventListener('click', () => {
      if (registrationNameInput.value.length < 1) {
        this.showError(registrationNameInput);
      } else if (!this.validateEmail(registrationEmailInput.value)) {
        this.showError(registrationEmailInput);
      } else if (registrationPasswordInput.value.length < 8) {
        this.showError(registrationPasswordInput);
      } else {
        this.registrateUser(registrationNameInput.value, registrationEmailInput.value, registrationPasswordInput.value);
        this.backToActivePage();
      }
    });
  }

  private setAuthListeners() {
    const loginToggleBtn = document.getElementById('login-toggle-btn') as HTMLElement;
    const registrationToggleBtn = document.getElementById('registration-toggle-btn') as HTMLElement;
    const modalAuth = document.getElementById('modal-auth') as HTMLElement;

    modalAuth.addEventListener('click', (event): void => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('modal__overlay')
        || target.classList.contains('modal__close')
        || target.classList.contains('auth__cancel')
      ) {
        this.backToActivePage();
      } else if (target === loginToggleBtn) {
        this.showLogin();
      } else if (target === registrationToggleBtn) {
        this.showRegistration();
      }
    });
  }

  public registrateUser(name: string, email: string, password: string): void {
    api.createUser(name, email, password)
      .then((newUser: IUser) => {
        this.showAuthStatusMessage('Пользователь зарегистрирован', true);
        this.loginUser(newUser.email, password);
        this.backToActivePage();
      })
      .catch(() => {
        this.showAuthStatusMessage('Такой пользователь уже зарегистрирован, войдите', false)
      });
  }

  public loginUser(email: string, password: string): void {
    api.signIn(email, password)
      .then((loginObj: IAuthObject) => {
        this.showAuthStatusMessage('Авторизован', true);
        model.auth = loginObj;
        localStorage.setItem('authObject', JSON.stringify(loginObj));
        this.setLogoutButton();
        this.backToActivePage();
      })
      .catch(() => {
        this.showAuthStatusMessage('Неверный логин или пароль', false);
        model.auth = null;
      });
  }

  public validateEmail(email: string): RegExpMatchArray | null {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  public showError(input: HTMLInputElement): void {
    const inputError = document.createElement('div');
    inputError.classList.add('input-error');
    inputError.innerHTML = input.validationMessage;

    if (!input.nextElementSibling?.classList.contains('input-error')) {
      input.after(inputError);
      input.style.border = '1px solid red';
      setTimeout(() => {
        input.style.border = '';
        inputError.remove();
      }, 2000);
    }
  }

  public backToActivePage(): void {
    if (model.previousPage) {
      model.activePage = model.previousPage;
      view.renderContent(model.activePage);
    }
  }

  public showAuthStatusMessage(status: string, isSuccess: boolean): void {
    const authStatusModal = document.createElement('div') as HTMLElement;
    authStatusModal.classList.add('auth-status-modal', 'btn', isSuccess ? 'btn-blue' : 'btn-error');
    authStatusModal.innerHTML = status;
    document.body.append(authStatusModal);
    setTimeout(() => {
      authStatusModal.remove();
    }, 2900);
  }

  public setLogoutButton(): void {
    const header = document.querySelector('#header .row') as HTMLElement;
    const loginBtn = document.getElementById('login-btn') as HTMLElement;
    const logoutBtn = document.createElement('button');

    logoutBtn.classList.add('btn', 'btn-logout', 'btn-darkblue');
    logoutBtn.id = 'logout-btn'
    logoutBtn.innerHTML = `Выйти`;
    loginBtn.remove();
    header.append(logoutBtn);

    logoutBtn.addEventListener('click', () => {
      this.logoutUser();
    });
  }

  public setLoginButton(): void {
    const header = document.querySelector('#header .row') as HTMLElement;
    const logoutBtn = document.getElementById('logout-btn') as HTMLElement;
    const loginBtn = document.createElement('button');

    loginBtn.classList.add('btn', 'btn-login', 'btn-blue');
    loginBtn.id = 'login-btn'
    loginBtn.innerHTML = `Войти`;
    logoutBtn.remove();
    header.append(loginBtn);

    loginBtn.addEventListener('click', () => {
      model.activePage = EPage.auth;
      view.renderContent(model.activePage);
      this.init();
    });
  }

  public logoutUser(): void {
    localStorage.removeItem('authObject');

    if (model.auth && model.electronBookGroup === 6) model.electronBookGroup--;

    model.auth = null;
    this.setLoginButton();
    this.showAuthStatusMessage('Вы вышли из аккаунта', false);
    this.backToActivePage();
  }
}
