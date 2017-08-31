import Vue from "vue";
import App from "./App.vue";
import Status from "./Status.vue";

require("./assets/css/site.scss");

new Vue({
  el: "#app",
  render: h => h(App)
});

new Vue({
  el: "#status",
  render: h => h(Status)
});
