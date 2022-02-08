import "../scss/global.scss";
import "../scss/style.scss";
import "../scss/audiocall.scss";
import '../scss/auth.scss';
import '../scss/main.scss';
import '../scss/header.scss';
import '../scss/footer.scss';

import "airbnb-browser-shims/browser-only";

import { Model } from "./model";
import { View } from "./view";
import { Controller } from "./controller";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Auth } from "../pages/auth";
import { Main } from "../pages/main";
import { ElectronBook } from "../pages/electronBook";
import { Sprint } from "../games/sprint/sprint";
import { Audiocall } from "../games/audiocall/audiocall";
import { Statistics } from '../pages/statistics';

export const view = new View(new Header(), Footer, new Auth(), Main, ElectronBook, new Audiocall(), Sprint, Statistics);
export const model = new Model();
 

export const controller = new Controller(view, model)

controller.initApp();
