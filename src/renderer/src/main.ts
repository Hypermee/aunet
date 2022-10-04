import App from './App.vue'
import Router from './router'
import { createApp, toRaw } from 'vue'
import { createPinia, PiniaPluginContext } from "pinia"

import './assets/css/style.css'

const Store = require('electron-store');

const app = createApp(App);
const store = new Store();

// Pinia + electron-store
const getStorage = (key: string) => {
  let value = store.get(key) as string;
  return value ? JSON.parse(value) : {};
}

const setStorage = (key: string, value: any) => {
  store.set(key, JSON.stringify(value))
}

const piniaPlugin = (context: PiniaPluginContext) => {
  const { store } = context;
  const data = getStorage(store.$id);

  store.$subscribe(() => {
    setStorage(store.$id, toRaw(store.$state))
  })

  return {
    ...data
  }
}

app.use(Router);
app.use(createPinia().use(piniaPlugin));

app.mount('#app');
