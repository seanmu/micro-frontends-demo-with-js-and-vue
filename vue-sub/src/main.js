import { createApp } from "vue";
import App from "./App.vue";

let app;
const init = (id) => {
  app = createApp(App);
  app.mount(`#${id}`);
};

// init();

window.renderVue = init;

window.unmountVue = () => {
  app.unmount();
};

// window.renderVue = (id) => {
// const app = createApp(App);
// app.mount(`#vueRoot`);
// };
