import Vue from "vue";
import App from "./App.vue";
import Status from "./Status.vue"
import store from "./store.js"

require("./assets/css/site.scss");

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});

new Vue({
  el: "#status",
  store,
  render: h => h(Status)
});
