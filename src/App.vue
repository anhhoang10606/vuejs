<script setup>
import { ref, reactive } from "vue";
// code trong này
import ThongBao from "./ThongBao.vue";
import TrangThai from "./TrangThai.vue";
import Products from "./components/Products.vue";
import Login from "./components/Login.vue";
// import ListPost from "./components/ListPost.vue";
// import Modal from "./components/Modal.vue";
// import product from "./components/product.vue";
import Profile from "./components/Profile.vue";
import Lab2 from "./components/Lab2.vue";
import Lab3 from "./components/Lab3.vue";

/**
 * tên
 * chuyên ngành
 * điểm mạnh
 * điểm yếu
 * ước mơ
 * điểm tb
 */
const products = reactive([
    {
        "id": "12345",
        "name": "Example Product 1",
        "price": 19.99,
        "category": "Electronics",
        "image": "https://picsum.photos/200/300"
    },
    {
        "id": "67890",
        "name": "Example Product 2",
        "price": 24.99,
        "category": "Home & Kitchen",
         "image": "https://picsum.photos/200/300"
    },
    {
        "id": "54321",
        "name": "Example Product 3",
        "price": 9.99,
        "category": "Books",
         "image": "https://picsum.photos/200/300"
    },
    {
        "id": "09876",
        "name": "Example Product 4",
        "price": 49.99,
        "category": "Fashion",
         "image": "https://picsum.photos/200/300"
    },
    {
        "id": "45678",
        "name": "Example Product 5",
        "price": 14.99,
        "category": "Electronics",
         "image": "https://picsum.photos/200/300"
    },
])

</script>

<template>
  <div class="container">
  <!-- <ThongBao />
  <h1>Frontend framework 2025</h1>
  <ThongBao message="thông báo mới" />
  <TrangThai/>
  <Products :products="products"/>
  <Login/> -->
  <!-- <ListPost/>
  <Modal/>
  <product/> -->
  <router-view />
  <!-- <Profile/>
  <Lab2/> -->
  <!--<Lab3/>-->
  </div>

</template>

<style scoped>
h1 {
  color: red
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>