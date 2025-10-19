<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();

const products = ref([]);
const filteredProducts = ref([]);
const categories = ref([]);
const product = ref(null);
const user = ref(null);

const countCart = computed(() => store.getters.countCart);
const productId = Number(route.params.id);

const categoryFilter = ref(route.query.category || "");

const filterProducts = () => {
  if (!categoryFilter.value) {
    filteredProducts.value = products.value;
  } else {
    filteredProducts.value = products.value.filter((p) => p.category === categoryFilter.value);
  }
};

watch(() => route.query.category, (newCategory) => {
  categoryFilter.value = newCategory || "";
  filterProducts();
});

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  products.value = saved;
  categories.value = [...new Set(saved.map((p) => p.category))];
  filterProducts();

  product.value = products.value.find((p) => p.id === productId);

  const u = JSON.parse(localStorage.getItem("user"));
  if (u) user.value = u;
});

const filterByCategory = (cat) => {
  router.push({ name: 'ProductList', query: { category: cat } });
};

const handleBuy = (p) => {
  if (!user.value) {
    alert("Vui lòng đăng nhập để mua hàng!");
    router.push("/login");
    return;
  }
  store.commit("add_cart", p);
  alert(`Đã thêm "${p.name}" vào giỏ hàng!`);
};

const logout = () => {
  localStorage.removeItem("user");
  user.value = null;
  router.push("/login");
};
</script>

<template>
  <div class="user-page d-flex">
    <aside class="sidebar p-3 bg-light" style="width: 250px; height: 100vh;">
      <h5>Danh mục sản phẩm</h5>
      <ul class="list-group">
        <li
          v-for="cat in categories"
          :key="cat"
          class="list-group-item list-group-item-action"
          @click="filterByCategory(cat)"
          style="cursor: pointer;"
        >
          {{ cat }}
        </li>
      </ul>
    </aside>

    <div class="flex-grow-1">
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand fw-bold text-primary">
            <img src="/Logo.png" alt="Logo" width="40" height="40" class="me-2" />
            AnhHoangShop
          </router-link>

          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item me-3 position-relative">
              <router-link to="/checkout" class="nav-link position-relative">
                <i class="bi bi-cart3 fs-4"></i>
                Giỏ hàng
                <span
                  v-if="countCart > 0"
                  class="badge bg-danger position-absolute top-0 start-100 translate-middle"
                >
                  {{ countCart }}
                </span>
              </router-link>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ user ? user.username : "Tài khoản" }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li v-if="!user">
                  <router-link class="dropdown-item" to="/login">Đăng nhập</router-link>
                </li>
                <li v-if="!user">
                  <router-link class="dropdown-item" to="/register">Đăng ký</router-link>
                </li>

                <li v-if="user">
                  <router-link class="dropdown-item" to="/profile">Profile</router-link>
                </li>
                <li v-if="user">
                  <a class="dropdown-item" href="#" @click.prevent="logout">Đăng xuất</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <div class="container">
        <div v-if="product" class="row">
          <div class="col-md-6">
            <img :src="product.image" alt="product image" class="img-fluid rounded" />
          </div>
          <div class="col-md-6">
            <h1>{{ product.name }}</h1>
            <h3>{{ product.price.toLocaleString() }} VNĐ</h3>
            <p><strong>Danh mục:</strong> {{ product.category }}</p>
            <p>{{ product.description || "Không có mô tả sản phẩm." }}</p>
            <button @click="handleBuy(product)" class="btn btn-primary">Thêm vào giỏ</button>
          </div>
        </div>
        <div v-else>
          <p class="text-center text-danger mt-5">Sản phẩm không tồn tại hoặc không được tìm thấy!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-page {
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
}

.sidebar {
  border-right: 1px solid #ddd;
}

img {
  max-width: 100%;
  height: auto;
}

.text-danger {
  color: #dc3545;
}
</style>