import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// Import global styles
import "./style/style.scss";

// Disable production tip in the console
Vue.config.productionTip = false;

// Import lodash library as _
import _ from "lodash";

// Function to register all components in a given require context
function requireAllComponents(requireContext) {
  // Get all keys from the require context
  var keys = requireContext.keys();

  // Iterate over the keys and register the components
  _.forEach(keys, (k) => {
    // Require the component module
    var module = requireContext(k);

    // Extract the component name from the file path
    var name = k.match(/([^/]*).vue$/);

    // Register the component globally with extracted name
    Vue.component(name[1], module.default || module);
  });
}

// Register components from different directories using require context
requireAllComponents(require.context("./layout", true, /[A-Za-z]\w+\.(vue|js)$/));
requireAllComponents(require.context("./components", true, /[A-Za-z]\w+\.(vue|js)$/));
requireAllComponents(require.context("./modules/PracasParques", true, /[A-Za-z]\w+\.(vue|js)$/));
requireAllComponents(require.context("./modules/Temperatura", true, /[A-Za-z]\w+\.(vue|js)$/));
requireAllComponents(require.context("./modules/Vegetacao", true, /[A-Za-z]\w+\.(vue|js)$/));

// Import and use Donut chart component
import Donut from "vue-css-donut-chart";
import "vue-css-donut-chart/dist/vcdonut.css";
Vue.use(Donut);

// Import charts.css
import "charts.css";

// Create a new Vue instance
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
