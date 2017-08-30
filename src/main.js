import Vue from "vue";
import App from "./App.vue";
import * as OfflinePluginRuntime from "offline-plugin/runtime";

require("./assets/css/site.scss");

OfflinePluginRuntime.install();

new Vue({
  el: "#app",
  render: h => h(App)
});
