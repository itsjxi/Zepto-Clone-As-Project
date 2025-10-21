import './style.css'
import { Model } from './model/model';
import { ContainerView } from './view/containerView';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const container = new ContainerView(Model);
    container.init();
});

// Add loading state
document.body.style.opacity = '0';
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    }, 100);
});

