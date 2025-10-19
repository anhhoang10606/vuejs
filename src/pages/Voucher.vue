<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const newVoucherCode = ref("");
const newVoucherDiscount = ref(0);

const applyCode = ref("");
const applyMessage = ref("");

const countCart = computed(() => store.getters.countCart);

const user = ref(JSON.parse(localStorage.getItem("user")) || null);

const addVoucher = () => {
  if (!newVoucherCode.value) {
    alert("Vui lòng nhập mã khuyến mãi");
    return;
  }
  if (vouchers.value.find(v => v.code === newVoucherCode.value.toUpperCase())) {
    alert("Mã này đã tồn tại");
    return;
  }
  vouchers.value.push({ code: newVoucherCode.value.toUpperCase(), discount: newVoucherDiscount.value });
  newVoucherCode.value = "";
  newVoucherDiscount.value = 0;
  alert("Thêm mã thành công");
};

const removeVoucher = (code) => {
  vouchers.value = vouchers.value.filter(v => v.code !== code);
};

const applyVoucher = () => {
  const code = applyCode.value.toUpperCase();
  const found = vouchers.value.find(v => v.code === code);
  if (found) {
    applyMessage.value = `Đã áp dụng mã ${code}, giảm ${found.discount}%`;
  } else {
    applyMessage.value = "Mã khuyến mãi không hợp lệ";
  }
};
</script>

<template>
  <div class="user-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold text-primary">
          <img src="/Logo.png" alt="Logo" width="40" height="40" class="me-2" />
          AnhHoangShop
        </router-link>

        <form class="d-flex mx-auto w-50">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Tìm sản phẩm..."
            v-model="newVoucherCode"
            disabled
          />
        </form>

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

    <div class="container p-3 border rounded">
      <h3>Mã Khuyến Mãi</h3>

      <div class="mb-3">
        <input v-model="applyCode" type="text" placeholder="Nhập mã khuyến mãi" class="form-control w-50 d-inline-block" />
        <button @click="applyVoucher" class="btn btn-primary ms-2">Áp dụng</button>
      </div>

      <p v-if="applyMessage" class="text-info">{{ applyMessage }}</p>

      <hr />

      <h5>Thêm mã mới</h5>
      <div class="mb-3">
        <input v-model="newVoucherCode" type="text" placeholder="Mã khuyến mãi" class="form-control w-50 d-inline-block" />
        <input v-model.number="newVoucherDiscount" type="number" placeholder="Phần trăm giảm" min="0" max="100" class="form-control w-25 d-inline-block ms-2" />
        <button @click="addVoucher" class="btn btn-success ms-2">Thêm</button>
      </div>

      <hr />

      <h5>Danh sách mã</h5>
      <ul class="list-group w-50">
        <li v-for="v in vouchers" :key="v.code" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ v.code }} - Giảm {{ v.discount }}%</span>
          <button @click="removeVoucher(v.code)" class="btn btn-danger btn-sm">Xóa</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.user-page {
  background-color: #f9f9f9;
  min-height: 100vh;
}
</style>
