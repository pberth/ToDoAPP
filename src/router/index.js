import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signin from "../views/Signin.vue";
import Register from "../views/Register.vue";
import Page404 from "../views/Page404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/ToDoAPP",
    name: "home",
    component: Home
  },
  {
    path: "ToDoAPP/signin",
    name: "signin",
    component: Signin
  },
  {
    path: "ToDoAPP/register",
    name: "register",
    component: Register
  },
  {
    path: "*",
    name: "404",
    component: Page404
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
