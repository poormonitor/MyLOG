import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia()

pinia.use(createPersistedState())
app.use(pinia);
app.use(router);

const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

app.mount("#app");
