import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "./style/style.scss";

Vue.config.productionTip = false;

import _ from "lodash";

function requireAllComponents(requireContext) {
  var keys = requireContext.keys();
  _.forEach(keys, (k) => {
    var modulo = requireContext(k);
    var nome = k.match(/([^/]*).vue$/);
    Vue.component(nome[1], modulo.default || modulo);
  });
}
requireAllComponents(
  require.context("./layout", true, /[A-Za-z]\w+\.(vue|js)$/)
);
requireAllComponents(
  require.context("./components", true, /[A-Za-z]\w+\.(vue|js)$/)
);
requireAllComponents(
  require.context("./modules/PracasParques", true, /[A-Za-z]\w+\.(vue|js)$/)
);
requireAllComponents(
  require.context("./modules/Temperatura", true, /[A-Za-z]\w+\.(vue|js)$/)
);
requireAllComponents(
  require.context("./modules/Vegetacao", true, /[A-Za-z]\w+\.(vue|js)$/)
);

import Donut from "vue-css-donut-chart";
import "vue-css-donut-chart/dist/vcdonut.css";

Vue.use(Donut);

import "charts.css";

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
