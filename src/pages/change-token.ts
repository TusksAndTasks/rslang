import { model, view } from "../ts";
import { EPage } from "../types/types";
import { Auth } from "./auth";

export class Token {
  public getHTML(): string {
    return /*html*/ `
      <div class="auth">
        <div id="modal-auth" class="modal auth">
          <div class="modal__body">
          <div id='to-main' class = 'modal-token_wrapper'> 
           <div class="modal-token">Вас долго не было. Авторизуйтесь еще раз</div>
           <button class="toMain btn btn-blue">На главную</button>
           </div>
            <div id="content-wrapper"></div>
          </div>
          <div class="modal__overlay"></div>
        </div>
      </div>
    `;
  }

  public init(): void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    contentEl.innerHTML = this.getHTML();

    const btnBack = document.getElementById("modal-auth") as HTMLElement;
    btnBack.onclick = () => {
      model.auth = null;
      const auth = new Auth();
      auth.logoutUser();
      view.renderContent(EPage.main);
    };
  }
}
export const token = new Token();
