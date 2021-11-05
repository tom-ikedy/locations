import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
  },
  {
    path: '/regaccount',
    name: 'RegAccount',
    component: () => import('@/views/RegAccount.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/user/:userId',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true,
  },
  {
    path: '/user/:userId/userSetting',
    name: 'UserSetting',
    component: () => import('@/views/UserSetting.vue'),
    props: true,
  },
  {
    path: '/user/:userId/editShop/:shopId',
    name: 'EditShop',
    component: () => import('@/views/EditShop.vue'),
    props: true,
  },
  {
    path: '/user/:userId/shop/:shopId',
    name: 'Shop',
    component: () => import('@/views/Shop.vue'),
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
