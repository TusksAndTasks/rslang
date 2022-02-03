import { IModel, IView } from "../../types/types";

export const addAudioCallListeners = (view: IView, model: IModel): void => {
  const levels = document.querySelector("#levels") as HTMLElement;
  if (levels) {
    levels.addEventListener("click", (e: Event): void => {
      alert(e.target);
      alert((e.target as HTMLElement).dataset.level);

      //model.activePage = EPage.auth;
      //view.renderContent(model.activePage);
    });
  }
};
