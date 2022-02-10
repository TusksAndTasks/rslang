import '../scss/global.scss';
import '../scss/style.scss';
import '../scss/auth.scss';
import '../scss/sprint.scss';


import 'airbnb-browser-shims/browser-only';

import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Auth } from '../pages/auth';
import { Main } from '../pages/main';
import { ElectronBook } from '../pages/electronBook';
import { AudioCall } from '../games/audiocall/audiocall';
import { Sprint } from '../games/sprint/sprint';
import { SprintStat } from '../games/sprint/sprint-stat';

export const view = new View(new Header(), Footer, new Auth(), Main, ElectronBook, AudioCall, new Sprint(), new SprintStat());
export const model = new Model();

export const controller = new Controller(view, model)

controller.initApp();
