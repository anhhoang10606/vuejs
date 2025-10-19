<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);
const activeTab = ref("info");

const profile = ref({
  fullname: "",
  email: "",
  age: "",
  gender: "",
});

const password = ref({ old: "", new: "" });
const orders = ref([]);
const userVouchers = computed(() => user.value?.receivedVouchers || []);
const address = ref("");
const products = ref([]);
const favorites = ref([]);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString('vi-VN');
};

const totalSpent = computed(() => {
  return orders.value.reduce((sum, order) => sum + (order.total || 0), 0);
});

const applyVoucher = (code) => {
  navigator.clipboard
    .writeText(code)
    .then(() => alert(`Mã giảm giá "${code}" đã được sao chép!`))
    .catch(() => alert("Không thể sao chép mã giảm giá."));
};

onMounted(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  if (u) {
    user.value = u;
    profile.value.fullname = u.fullname || "";
    profile.value.email = u.email || "";
    address.value = u.address || localStorage.getItem("address") || "";
  }
  products.value = JSON.parse(localStorage.getItem("products")) || [];
  favorites.value = JSON.parse(localStorage.getItem("favorites")) || [];
  orders.value = JSON.parse(localStorage.getItem("orders")) || [];
});

function updateProfile() {
  if (!user.value) return alert("Không tìm thấy người dùng!");

  const updatedUser = {
    ...user.value,
    fullname: profile.value.fullname,
    email: profile.value.email,
    age: profile.value.age || "",
    gender: profile.value.gender || "",
    address: address.value || "",
  };

  user.value = updatedUser;
  localStorage.setItem("user", JSON.stringify(updatedUser));
  alert("Cập nhật thông tin thành công!");
}

function changePassword() {
  if (!password.value.old || !password.value.new) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }
  alert("Mật khẩu đã được thay đổi!");
}

function cancelOrder(id) {
  const order = orders.value.find((o) => o.id === id);
  if (order) order.status = "Đã hủy";
  localStorage.setItem("orders", JSON.stringify(orders.value));
}

function reorder(id) {
  const order = orders.value.find(o => o.id === id);
  if (!order) {
    alert("Không tìm thấy đơn hàng");
    return;
  }

  let cartsCurrent = JSON.parse(localStorage.getItem("carts")) || [];

  order.items.forEach(item => {
    const existing = cartsCurrent.find(c => c.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cartsCurrent.push({ ...item });
    }
  });

  localStorage.setItem("carts", JSON.stringify(cartsCurrent));

  alert("Đơn hàng " + id + " đã được thêm lại vào giỏ!");
}


function saveAddress() {
  localStorage.setItem("address", address.value);
  if (user.value) {
    const updatedUser = { ...user.value, address: address.value };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  alert("Lưu địa chỉ thành công!");
}

function logout() {
  localStorage.clear();
  router.push("/login");
}

function toggleFavorite(productId) {
  if (favorites.value.includes(productId)) {
    favorites.value = favorites.value.filter((id) => id !== productId);
  } else {
    favorites.value.push(productId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value));
}

function isFavorite(productId) {
  return favorites.value.includes(productId);
}

const favoriteProducts = computed(() => {
  return products.value.filter((p) => favorites.value.includes(p.id));
});
</script>

<template>
  <div>
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
            v-model="searchQuery"
          />
        </form>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-3">
            <router-link to="/cart" class="nav-link">Giỏ hàng</router-link>
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

    <div class="container mt-4">
      <h3 class="fw-bold mb-4">Thông tin người dùng</h3>
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">Thông tin cá nhân</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'password' }" @click="activeTab = 'password'">Đổi mật khẩu</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">Lịch sử đơn hàng</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'voucher' }" @click="activeTab = 'voucher'">Mã khuyến mãi</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'address' }" @click="activeTab = 'address'">Địa chỉ</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'favorite' }" @click="activeTab = 'favorite'">Sản phẩm yêu thích</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'statistics' }" @click="activeTab = 'statistics'">Thống kê khách hàng</a>
        </li>
      </ul>

      <div v-if="activeTab === 'info'" class="card p-4 shadow-sm">
        <h5>Cập nhật thông tin cá nhân</h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Họ tên</label>
            <input v-model="profile.fullname" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label>Email</label>
            <input v-model="profile.email" type="email" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label>Tuổi</label>
            <input v-model="profile.age" type="number" class="form-control" />
          </div>
          <div class="col-md-6 mb-3">
            <label>Giới tính</label>
            <select v-model="profile.gender" class="form-select">
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
        <button class="btn btn-success mt-2" @click="updateProfile">Lưu thay đổi</button>
      </div>
      <div v-if="activeTab === 'password'" class="card p-4 shadow-sm">
        <h5>Đổi mật khẩu</h5>
        <div class="mb-3">
          <label>Mật khẩu cũ</label>
          <input v-model="password.old" type="password" class="form-control" />
        </div>
        <div class="mb-3">
          <label>Mật khẩu mới</label>
          <input v-model="password.new" type="password" class="form-control" />
        </div>
        <button class="btn btn-primary" @click="changePassword">Cập nhật mật khẩu</button>
      </div>
      <div v-if="activeTab === 'orders'" class="card p-4 shadow-sm">
        <h5>Lịch sử đơn hàng</h5>
        <div v-if="orders.length === 0">Bạn chưa có đơn hàng nào.</div>
        <table v-else class="table mt-3">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>{{ order.total.toLocaleString() }}₫</td>
              <td>{{ order.status }}</td>
              <td>
                <button
                  v-if="order.status === 'Đang xử lý' || order.status === 'pending'"
                  class="btn btn-sm btn-danger"
                  @click="cancelOrder(order.id)"
                >
                  Hủy
                </button>
                <button v-else class="btn btn-sm btn-success" @click="reorder(order.id)">
                  Mua lại
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="activeTab === 'voucher'" class="card p-4 shadow-sm">
        <h5>Mã khuyến mãi của bạn</h5>
        <div v-if="userVouchers.length === 0" class="text-muted">
          Bạn chưa nhận mã khuyến mãi nào!
        </div>
        <ul v-else>
          <li
            v-for="voucher in userVouchers"
            :key="voucher.code"
            class="d-flex align-items-center justify-content-between"
          >
            <div>
              <b>{{ voucher.code }}</b> - Giảm {{ voucher.discount }}%
            </div>
            <button class="btn btn-primary btn-sm" @click="applyVoucher(voucher.code)">
              Áp dụng
            </button>
          </li>
        </ul>
      </div>
      <div v-if="activeTab === 'address'" class="card p-4 shadow-sm">
        <h5>Địa chỉ giao hàng</h5>
        <div class="mb-3">
          <label>Địa chỉ</label>
          <input v-model="address" type="text" class="form-control" />
        </div>
        <button class="btn btn-success" @click="saveAddress">Lưu địa chỉ</button>
      </div>
      <div v-if="activeTab === 'favorite'" class="card p-4 shadow-sm">
        <h5>Sản phẩm yêu thích</h5>
        <div v-if="favoriteProducts.length === 0" class="text-center text-muted">
          <p>Chưa có sản phẩm yêu thích nào.</p>
        </div>
        <div v-else class="products d-flex flex-wrap justify-content-center gap-3">
          <div v-for="p in favoriteProducts" :key="p.id" class="product-card">
            <img :src="p.image" alt="img" />
            <h3>{{ p.name }}</h3>
            <p>Giá: {{ p.price.toLocaleString() }} VNĐ</p>
            <p>Danh mục: {{ p.category }}</p>
            <router-link :to="`/product/${p.id}`" class="btn btn-outline-secondary w-100">Chi tiết</router-link>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'statistics'" class="card p-4 shadow-sm">
        <h5>Thống kê khách hàng</h5>
        <p>Tổng số tiền chi tiêu: <strong>{{ totalSpent.toLocaleString() }}₫</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  cursor: pointer;
}
.nav-link.active {
  font-weight: bold;
  color: #0d6efd !important;
}
.product-card {
  border: 1px solid #ddd;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
  width: 200px;
  text-align: center;
}
.product-card img {
  max-width: 100%;
  height: 120px;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>
