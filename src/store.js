import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex)

const state = {
  message: "hello"
};

const mutations = {
  updateMessage (state, msg) {
    state.message = msg;
  }
}

const actions = {
  updateMessage (mut, msg) {
    mut.commit("updateMessage", msg);
  }
}

const getters = {
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
