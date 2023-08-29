import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { Model } from './model/model';
import { ContainerView } from './view/containerView';
import { HeaderView } from './view/headerView';

console.log(Model);
const container = new ContainerView(Model)
container.init();

const headerView = new HeaderView(Model);

