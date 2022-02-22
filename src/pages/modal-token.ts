import { view } from "../ts";
import { EPage } from "../types/types";

export class Token {
  public getHTML(message: string): string {
    return /*html*/ `
      <div class="auth">
        <div id="modal-auth" class="modal auth">
          <div class="modal__body">
          <div id='to-main' class = 'modal-token_wrapper'> 
           <div class="modal-token">${message}</div>
           <button class="toMain btn btn-blue">На главную</button>
           </div>
            <div id="content-wrapper"></div>
          </div>
          <div class="modal__overlay"></div>
        </div>
      </div>
    `;
  }

  public init(message: string): void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    contentEl.innerHTML = this.getHTML(message);

    const btnBack = document.getElementById("modal-auth") as HTMLElement;
    btnBack.onclick = () => {
      view.renderContent(EPage.main);
    };
  }
}
export const token = new Token();
