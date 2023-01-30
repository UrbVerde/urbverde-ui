import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";

Vue.use(Vuex);

// import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({ modules });
// , plugins: [createPersistedState()]
