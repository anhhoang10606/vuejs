import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Admin from "../pages/Admin.vue";
import User from "../pages/User.vue";
import Profile from "../pages/profile.vue";
import ProductList from "@/pages/ProductList.vue";
import ProductDetail from "@/pages/ProductDetail.vue";
import Cart from "@/pages/Cart.vue";
import Checkout from "@/pages/Checkout.vue";
import OrderSuccess from "@/pages/OrderSuccess.vue";
import Voucher from "@/pages/Voucher.vue";

const routes = [
  { path: "/", redirect: "/user" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true, role: "admin" },
  },
  { path: "/user", name: "User", component: User },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/forgotpass", component: () => import("../pages/ForgotPass.vue") },
  { path: "/products", name: "ProductList", component: ProductList },
  { path: "/product/:id", name: "ProductDetail", component: ProductDetail },
  { path: "/checkout", component: Checkout, meta: { requiresAuth: true } },
  { path: "/voucher", component: Voucher, meta: { requiresAuth: true } },
  { path: "/cart", name: "Cart", component: Cart },
  {
    path: "/order-success/:orderId",
    name: "OrderSuccess",
    component: OrderSuccess,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!to.meta.requiresAuth) {
    return next();
  }

  if (!user) {
    return next("/login");
  }

  if (to.meta.role && user.role !== to.meta.role) {
    return next("/login");
  }

  next();
});

export default router;
