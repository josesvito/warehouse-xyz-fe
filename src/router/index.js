import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js"
import Home from "../views/Home.vue";
import LandingPage from "../views/LandingPage.vue";
import DetailAccountPage from "../views/pages/profiles/DetailAccount.vue";
import Dashboard from "../views/pages/mains/Dashboard.vue"
import Items from "../views/pages/mains/Items.vue"
import Procurement from "../views/pages/mains/Procurement.vue"
import Purchases from "../views/pages/mains/Purchase.vue"
import User from "../views/pages/mains/User.vue"

Vue.use(VueRouter);

const prefixRoutes = (prefix, routes) => {
  return routes.map(route => {
    route.path = prefix + '/' + route.path
    return route
  })
}

const routes = [{
    path: "/login",
    name: "LoginPage",
    component: LandingPage,
    beforeEnter(to, from, next) {
      if(store.getters.getToken) next('/')
      else next()
    }
  },
  {
    path: "/",
    component: Home,
    children: [
      {path: '', component: Dashboard},
      {path: 'item', component: Items},
      {path: 'procurement', component: Procurement},
      {path: 'purchases', component: Purchases},
      {path: 'user', component: User, beforeEnter(to, from, next) {
        if (store.getters.getUserData.role_id == 1) next()
        else next('/')
      }}
    ].concat(prefixRoutes('profile', [
      {path: '', component: DetailAccountPage},
    ])),
    beforeEnter(to, from, next) {
      if (store.getters.getToken) next()
      else next('/login')
    }
  },
  {
    path: "*",
    redirect: "/"
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;