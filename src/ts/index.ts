import '../scss/global.scss';
import '../scss/style.scss';
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

const view = new View(Header, Footer, Auth, Main, ElectronBook, AudioCall, new Sprint);
const model = new Model();

const controller = new Controller(view, model)

controller.initApp();
