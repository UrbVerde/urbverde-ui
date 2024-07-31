import Vue from "vue";
import routes from "./routes";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes,
  mode: "history",
});

// import beforeEach from "./beforeEach";
// router.beforeEach(beforeEach);

export default router;
