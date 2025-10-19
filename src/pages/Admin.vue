<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Orders from './Orders.vue'

const router = useRouter();
const currentView = ref("products");

const lowStockThreshold = 5;

const products = ref([]);
const users = ref(JSON.parse(localStorage.getItem("users")) || []);
const orders = ref(JSON.parse(localStorage.getItem("orders")) || []);
const vouchers = ref(JSON.parse(localStorage.getItem("vouchers")) || []);

const admin = ref(JSON.parse(localStorage.getItem("user")) || { username: "Admin" });

const form = reactive({
  id: null,
  name: "",
  price: 0,
  category: "",
  image: "",
  description: "",
  stock: 0,
});
const isEditing = ref(false);

const userForm = reactive({
  username: "",
  email: "",
  password: "",
});
const isEditingUser = ref(false);
const editingUserIndex = ref(null);

const voucherForm = reactive({
  code: "",
  discount: 0,
});
const isEditingVoucher = ref(false);
const editingVoucherIndex = ref(null);

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("products")) || [];
  products.value = saved;
});

const saveProducts = () => localStorage.setItem("products", JSON.stringify(products.value));
const saveUsers = () => localStorage.setItem("users", JSON.stringify(users.value));
const saveVouchers = () => localStorage.setItem("vouchers", JSON.stringify(vouchers.value));

const resetForm = () => {
  form.id = null;
  form.name = "";
  form.price = 0;
  form.category = "";
  form.image = "";
  form.description = "";
  form.stock = 0;
  isEditing.value = false;
};

const addProduct = () => {
  if (!form.name || !form.price) return alert("Vui lòng nhập đủ thông tin sản phẩm!");
  products.value.push({ ...form, id: Date.now() });
  saveProducts();
  resetForm();
};

const deleteProduct = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
    products.value = products.value.filter((p) => p.id !== id);
    saveProducts();
  }
};

const editProduct = (product) => {
  Object.assign(form, product);
  isEditing.value = true;
};

const updateProduct = () => {
  const index = products.value.findIndex((p) => p.id === form.id);
  if (index !== -1) {
    products.value[index] = { ...form };
    saveProducts();
    resetForm();
  }
};

const resetUserForm = () => {
  userForm.username = "";
  userForm.email = "";
  userForm.password = "";
  isEditingUser.value = false;
  editingUserIndex.value = null;
};

const addUser = () => {
  if (!userForm.username || !userForm.email || !userForm.password)
    return alert("Vui lòng nhập đầy đủ thông tin người dùng!");
  users.value.push({ ...userForm });
  saveUsers();
  resetUserForm();
};

const editUser = (u, index) => {
  Object.assign(userForm, u);
  isEditingUser.value = true;
  editingUserIndex.value = index;
};

const updateUser = () => {
  if (editingUserIndex.value !== null) {
    users.value[editingUserIndex.value] = { ...userForm };
    saveUsers();
    resetUserForm();
  }
};

const deleteUser = (index) => {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
    users.value.splice(index, 1);
    saveUsers();
  }
};
// voucher ch có date, hạn sd
const resetVoucherForm = () => {
  voucherForm.code = "";
  voucherForm.discount = 0;
  isEditingVoucher.value = false;
  editingVoucherIndex.value = null;
};

const addVoucher = () => {
  if (!voucherForm.code) {
    alert("Vui lòng nhập mã voucher");
    return;
  }
  if (vouchers.value.find((v) => v.code === voucherForm.code.toUpperCase())) {
    alert("Mã voucher đã tồn tại");
    return;
  }
  vouchers.value.push({ code: voucherForm.code.toUpperCase(), discount: voucherForm.discount });
  saveVouchers();
  resetVoucherForm();
};

const editVoucher = (v, index) => {
  Object.assign(voucherForm, v);
  isEditingVoucher.value = true;
  editingVoucherIndex.value = index;
};

const updateVoucher = () => {
  if (editingVoucherIndex.value !== null) {
    vouchers.value[editingVoucherIndex.value] = { ...voucherForm };
    saveVouchers();
    resetVoucherForm();
  }
};

const deleteVoucher = (index) => {
  if (confirm("Bạn có chắc chắn muốn xóa mã voucher này không?")) {
    vouchers.value.splice(index, 1);
    saveVouchers();
  }
};

const logout = () => {
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<template>
  <div class="admin-layout">
    <header class="topbar shadow-sm px-4 d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <img src="/Logo.png" alt="Logo" width="40" class="me-2" />
        <h4 class="m-0 text-primary fw-bold">AnhHoangShop</h4>
      </div>
      <div class="d-flex align-items-center">
        <span class="me-3 fw-semibold text-dark">
          <span class="text-primary">{{ admin.username }}</span>
        </span>
        <button class="btn btn-outline-danger btn-sm" @click="logout">Đăng xuất</button>
      </div>
    </header>

    <div class="main-content">
      <aside class="sidebar">
        <button
          class="menu-btn"
          :class="{ active: currentView === 'products' }"
          @click="currentView = 'products'"
        >
          Sản phẩm
        </button>
        <button
          class="menu-btn"
          :class="{ active: currentView === 'users' }"
          @click="currentView = 'users'"
        >
          Người dùng
        </button>
        <button
          class="menu-btn"
          :class="{ active: currentView === 'orders' }"
          @click="currentView = 'orders'"
        >
          Đơn hàng
        </button>
        <button
          class="menu-btn"
          :class="{ active: currentView === 'stats' }"
          @click="currentView = 'stats'"
        >
          Thống kê
        </button>
        <button
          class="menu-btn"
          :class="{ active: currentView === 'vouchers' }"
          @click="currentView = 'vouchers'"
        >
          Mã khuyến mãi
        </button>
      </aside>

      <section class="content p-4">
        <div v-if="currentView === 'products'">
          <h3 class="fw-bold text-primary mb-3">Quản lý sản phẩm</h3>

          <div class="card p-3 mb-4 shadow-sm">
            <h5>{{ isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm" }}</h5>
            <div class="row g-3">
              <div class="col-md-4">
                <input
                  v-model="form.name"
                  class="form-control"
                  placeholder="Tên sản phẩm"
                />
              </div>
              <div class="col-md-4">
                <input
                  v-model="form.price"
                  type="number"
                  class="form-control"
                  placeholder="Giá"
                />
              </div>
              <div class="col-md-4">
                <input
                  v-model="form.stock"
                  type="number"
                  class="form-control"
                  placeholder="Số lượng tồn"
                  min="0"
                />
              </div>
              <div class="col-md-6">
                <input
                  v-model="form.category"
                  class="form-control"
                  placeholder="Danh mục"
                />
              </div>
              <div class="col-md-6">
                <input
                  v-model="form.image"
                  class="form-control"
                  placeholder="Link hình ảnh"
                />
              </div>
              <div class="col-12">
                <textarea
                  v-model="form.description"
                  class="form-control"
                  placeholder="Mô tả sản phẩm"
                ></textarea>
              </div>
            </div>
            <div class="mt-3">
              <button
                v-if="!isEditing"
                @click="addProduct"
                class="btn btn-primary me-2"
              >
                Thêm
              </button>
              <button
                v-else
                @click="updateProduct"
                class="btn btn-success me-2"
              >
                Cập nhật
              </button>
              <button @click="resetForm" class="btn btn-secondary">Hủy</button>
            </div>
          </div>

          <div class="card shadow p-3">
            <table class="table text-center align-middle">
              <thead class="table-light">
                <tr>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Số lượng tồn</th>
                  <th>Danh mục</th>
                  <th>Hình</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in products" :key="p.id">
                  <td>{{ p.name }}</td>
                  <td>{{ p.price }}</td>
                  <td>
                    {{ p.stock }}
                    <span
                      v-if="p.stock <= lowStockThreshold"
                      class="text-danger fw-bold ms-2"
                      >Sắp hết hàng!</span
                    >
                  </td>
                  <td>{{ p.category }}</td>
                  <td>
                    <img :src="p.image" width="60" />
                  </td>
                  <td>{{ p.description }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      @click="editProduct(p)"
                    >
                      Sửa
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteProduct(p.id)"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="currentView === 'users'">
          <h3 class="fw-bold text-primary mb-3">Quản lý người dùng</h3>

          <div class="card p-3 mb-4 shadow-sm">
            <h5>{{ isEditingUser ? "Sửa người dùng" : "Thêm người dùng" }}</h5>
            <div class="row g-3">
              <div class="col-md-4">
                <input
                  v-model="userForm.username"
                  class="form-control"
                  placeholder="Tên đăng nhập"
                />
              </div>
              <div class="col-md-4">
                <input
                  v-model="userForm.email"
                  class="form-control"
                  placeholder="Email"
                />
              </div>
              <div class="col-md-4">
                <input
                  v-model="userForm.password"
                  class="form-control"
                  placeholder="Mật khẩu"
                />
              </div>
            </div>
            <div class="mt-3">
              <button
                v-if="!isEditingUser"
                @click="addUser"
                class="btn btn-primary me-2"
              >
                Thêm
              </button>
              <button
                v-else
                @click="updateUser"
                class="btn btn-success me-2"
              >
                Cập nhật
              </button>
              <button @click="resetUserForm" class="btn btn-secondary">Hủy</button>
            </div>
          </div>

          <div class="card shadow p-3">
            <table class="table text-center align-middle">
              <thead class="table-light">
                <tr>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Mật khẩu</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(u, index) in users" :key="u.username">
                  <td>{{ u.username }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.password }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      @click="editUser(u, index)"
                    >
                      Sửa
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteUser(index)"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="currentView === 'orders'">
          <Orders />
        </div>

        <div v-if="currentView === 'stats'">
          <h3 class="fw-bold text-primary mb-3">Doanh thu</h3>
        </div>

        <div v-if="currentView === 'vouchers'">
          <h3 class="fw-bold text-primary mb-3">Quản lý mã khuyến mãi</h3>

          <div class="card p-3 mb-4 shadow-sm">
            <h5>{{ isEditingVoucher ? "Sửa mã khuyến mãi" : "Thêm mã khuyến mãi" }}</h5>
            <div class="row g-3">
              <div class="col-md-6">
                <input
                  v-model="voucherForm.code"
                  class="form-control"
                  placeholder="Mã khuyến mãi"
                />
              </div>
              <div class="col-md-6">
                <input
                  v-model.number="voucherForm.discount"
                  type="number"
                  min="0"
                  max="100"
                  class="form-control"
                  placeholder="Phần trăm giảm"
                />
              </div>
            </div>
            <div class="mt-3">
              <button
                v-if="!isEditingVoucher"
                @click="addVoucher"
                class="btn btn-primary me-2"
              >
                Thêm
              </button>
              <button
                v-else
                @click="updateVoucher"
                class="btn btn-success me-2"
              >
                Cập nhật
              </button>
              <button @click="resetVoucherForm" class="btn btn-secondary">
                Hủy
              </button>
            </div>
          </div>

          <div class="card shadow p-3">
            <table class="table text-center align-middle">
              <thead class="table-light">
                <tr>
                  <th>Mã khuyến mãi</th>
                  <th>Phần trăm giảm</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(v, index) in vouchers" :key="v.code">
                  <td>{{ v.code }}</td>
                  <td>{{ v.discount }}%</td>
                  <td>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      @click="editVoucher(v, index)"
                    >
                      Sửa
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click="deleteVoucher(index)"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 60px;
}
.main-content {
  flex: 1;
  display: flex;
  min-height: calc(100vh - 60px);
}
.sidebar {
  width: 220px;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
}
.menu-btn {
  background: none;
  border: none;
  text-align: left;
  padding: 10px 15px;
  font-size: 16px;
  width: 100%;
  border-radius: 8px;
  transition: 0.3s;
}
.menu-btn:hover {
  background: #e3f2fd;
}
.menu-btn.active {
  background: #0d6efd;
  color: white;
}
.content {
  flex: 1;
  background: #fff;
  overflow-y: auto;
}
.text-danger {
  color: #dc3545;
}
.fw-bold {
  font-weight: 700;
}
.ms-2 {
  margin-left: 0.5rem;
}
</style>