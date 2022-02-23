import { model, view } from "../ts";
import { EPage } from "../types/types";
import { Auth } from "./auth";

export class Token {
  public getHTML(message: string, nameButton: string): string {
    return /*html*/ `
      <div class="auth">
        <div id="modal-auth" class="modal auth">
          <div class="modal__body">
          <div id='to-main' class = 'modal-token_wrapper'> 
           <div class="modal-token">${message}</div>
           <button class="toMain btn btn-blue"> ${nameButton} </button>
           </div>
            <div id="content-wrapper"></div>
          </div>
          <div class="modal__overlay"></div>
        </div>
      </div>
    `;
  }

  public init(message: string, nameButton: string): void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    contentEl.innerHTML = this.getHTML(message, nameButton);

    const btnBack = document.getElementById("modal-auth") as HTMLElement;

    btnBack.onclick = () => {
      if (nameButton === "На главную") {
        view.renderContent(EPage.main);
      } else {
        model.auth = null;
        const auth = new Auth();
        auth.logoutUser();
        auth.init();
      }
    };
  }
}
export const token = new Token();
