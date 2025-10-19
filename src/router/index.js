import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Admin from "../pages/Admin.vue";
import User from "../pages/User.vue";
import profile from "../pages/profile.vue";
import ProductList from "@/pages/ProductList.vue";
import ProductDetail from "@/pages/ProductDetail.vue";
import Checkout from "@/pages/Checkout.vue";
import OrderSuccess from "@/pages/OrderSuccess.vue";
import Voucher from "@/pages/Voucher.vue";

const isAuthenticated = () => {
  return localStorage.getItem('user') !== null
}

const routes = [
  { path: "/", redirect: "/User" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/admin", component: Admin, meta: { requiresAuth: true, role: "admin" } },
  { path: "/user", name: 'User', component: User },
  { path: "/profile", name: 'Profile', component: profile },
  { path: "/forgotpass", component: () => import("../pages/ForgotPass.vue") },
  { path: "/", name: 'ProductList', component: ProductList },
  { path: "/product/:id", name: 'ProductDetail', component: ProductDetail },
  { path: "/checkout", component: Checkout, meta: { requiresAuth: true } },
  { path: "/voucher", component: Voucher, meta: { requiresAuth: true } },
  { path: "/order-success/:orderId", name: 'OrderSuccess', component: OrderSuccess, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth && !user) {
    return next("/login");
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return next("/login");
  }

  next();
});

export default router;
