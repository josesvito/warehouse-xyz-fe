import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setUserData(state, payload) {
      state.userData = payload
    }
  },
  actions: {
    login({commit}, user) {
      if (user) {
        localStorage.setItem("token", user.token)
        localStorage.setItem("userData", JSON.stringify(user))
        commit("setToken", user.token)
        commit("setUserData", user)
      }
    },
    logout({commit}) {
      commit("setToken", null)
      commit("setUserData", null)
      localStorage.clear()
    }
  },
  getters: {
    getToken: (state) => state.token,
    getUserData: (state) => state.userData,
  },
});
