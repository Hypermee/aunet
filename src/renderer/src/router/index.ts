import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import("../pages/home/index.vue")
  },
  {
    path: '/show',
    name: 'show',
    component: () => import("../pages/show/index.vue")
  },
  {
    path: '/more',
    name: 'more',
    component: () => import("../pages/more/index.vue")
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import("../pages/setup/index.vue")
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router;
