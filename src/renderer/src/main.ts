import App from './App.vue'
import Router from './router'
import { createApp } from 'vue'
import './assets/css/style.css'

const app = createApp(App);

app.use(Router);
app.mount('#app');
