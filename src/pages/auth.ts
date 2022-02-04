import { API } from "../ts/api";

const api = new API();
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
            <div id="form-wrapper"></div>
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
    const formWrapper = document.getElementById('form-wrapper') as HTMLElement;
    const modalAuth = document.getElementById('modal-auth') as HTMLElement;
    const loginToggleBtn = document.getElementById('login-toggle-btn') as HTMLElement;
    const registrationToggleBtn = document.getElementById('registration-toggle-btn') as HTMLElement;

    const showLogin = () => {
      loginToggleBtn.classList.add('active');
      registrationToggleBtn.classList.remove('active');
      formWrapper.innerHTML = /*html*/`
        <div class="row auth__content">
          <div id="login-content" class="auth__login-content active">
            <input id="login-email" type="email" placeholder="Почта" required/>
            <input id="login-password" type="password" placeholder="Пароль" required minlength="8" />
            <div class="row auth__bottom">
              <button class="btn auth__cancel">Отмена</button>
              <button id="login-btn" class="btn btn-blue" type="submit">Вход</button>
            </div>
          </div>
        </div>
      `;

      const loginEmailInput = document.getElementById('login-email') as HTMLInputElement;
      const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
      const loginBtn = document.getElementById('login-btn') as HTMLInputElement;

      loginBtn.addEventListener('click', () => {
        if (!this.validateEmail(loginEmailInput.value)) {
          this.showError(loginEmailInput);
        } else if (loginPasswordInput.value.length < 8) {
          this.showError(loginPasswordInput);
        } else {
          this.loginUser(loginEmailInput.value, loginPasswordInput.value);
        }
      });
    }

    const showRegistration = () => {
      registrationToggleBtn.classList.add('active');
      loginToggleBtn.classList.remove('active');
      formWrapper.innerHTML = /*html*/`
        <div class="row auth__content">
          <div id="registration-content" class="auth__registration-content">
            <input id="registration-name" type="text" placeholder="Имя" required minlength="1" />
            <input id="registration-email" type="email" placeholder="Почта" required/>
            <input id="registration-password" type="password" placeholder="Пароль" required minlength="8" />
            <div class="row auth__bottom">
              <button class="btn auth__cancel">Отмена</button>
              <button id="registration-btn" class="btn btn-blue" type="submit">Регистрация</button>
            </div>
          </div>
        </div>
      `;

      const registrationNameInput = document.getElementById('registration-name') as HTMLInputElement;
      const registrationEmailInput = document.getElementById('registration-email') as HTMLInputElement;
      const registrationPasswordInput = document.getElementById('registration-password') as HTMLInputElement;
      const registrationBtn = document.getElementById('registration-btn') as HTMLInputElement;

      registrationBtn.addEventListener('click', () => {
        if (registrationNameInput.value.length < 1) {
          this.showError(registrationNameInput);
        } else if (!this.validateEmail(registrationEmailInput.value)) {
          this.showError(registrationEmailInput);
        } else if (registrationPasswordInput.value.length < 8) {
          this.showError(registrationPasswordInput);
        } else {
          this.registrateUser(registrationNameInput.value, registrationEmailInput.value, registrationPasswordInput.value);
        }
      });
    }

    showLogin();

    modalAuth.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('modal__overlay')
        || target.classList.contains('modal__close')
        || target.classList.contains('auth__cancel')
      ) {
        this.destroyModal(modalAuth);
      } else if (target === loginToggleBtn) {
        showLogin();
      } else if (target === registrationToggleBtn) {
        showRegistration();
      }
    })
  }

  public destroyModal(modal: HTMLElement): void {
    modal.remove();
    document.documentElement.style.overflow = '';
  }

  public registrateUser(name: string, email: string, password: string) {
    api.createUser(name, email, password)
      .finally(() => {
        const modalAuth = document.getElementById('modal-auth') as HTMLElement;
        this.destroyModal(modalAuth);
      })
  }

  public loginUser(email: string, password: string) {
    api.signIn(email, password)
      .finally(() => {
        const modalAuth = document.getElementById('modal-auth') as HTMLElement;
        this.destroyModal(modalAuth);
      })
  }

  public validateEmail(email: string): RegExpMatchArray | null {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  public showError(input: HTMLInputElement): void {
    const inputError = document.createElement('div');
    inputError.classList.add('input-error');
    inputError.innerHTML = input.validationMessage;
    input.after(inputError);
    input.style.border = '2px solid red';
    setTimeout(() => {
      input.style.border = '';
      inputError.remove();
    }, 2000);
  }
}
