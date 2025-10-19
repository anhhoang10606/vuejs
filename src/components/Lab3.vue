<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

const API = "http://localhost:3000/products";
const products = ref([]);
const message = ref("");
const color = ref("");

const form = reactive({
  id: undefined,
  title: "",
  price: null,
  category: "",
  image: "",
  description: ""
});

const getProducts = async () => {
  try {
    const res = await axios.get(API);
    products.value = res.data;
  } catch {
    notify("Không thể tải sản phẩm", "red");
  }
};

const saveProduct = async () => {
  if (!form.title || !form.price || !form.category) {
    return notify("Vui lòng nhập đủ thông tin!", "red");
  }

  try {
    if (form.id) {
      await axios.put(`${API}/${form.id}`, { ...form });
      notify("Cập nhật thành công!", "green");
    } else {
      await axios.post(API, { ...form });
      notify("Thêm thành công!", "green");
    }
    resetForm();
    getProducts();
  } catch {
    notify("Lỗi", "red");
  }
};

const editProduct = (p) => {
  Object.assign(form, p);
};

const deleteProduct = async (id) => {
  if (!confirm("Bạn có chắc muốn xoá?")) return;
  try {
    await axios.delete(`${API}/${id}`);
    notify("Xoá thành công!", "green");
    getProducts();
  } catch {
    notify("Xoá thất bại!", "red");
  }
};

const resetForm = () => {
  form.id = null;
  form.title = "";
  form.price = null;
  form.category = "";
  form.image = "";
  form.description = "";
};

const notify = (msg, c) => {
  message.value = msg;
  color.value = c;
  setTimeout(() => (message.value = ""), 2500);
};

onMounted(getProducts);
</script>

<template>
  <div class="container my-4">
    <h2 class="mb-3">Quản lý sản phẩm</h2>

    <div v-if="message">
      <p :style="{ color: color, fontWeight: 'bold' }">{{ message }}</p>
    </div>

    <div class="card mb-4">
      <div class="card-body">
        <input v-model="form.title" class="form-control mb-2" placeholder="Tên sản phẩm" />
        <input v-model.number="form.price" type="number" class="form-control mb-2" placeholder="Giá" />
        <select v-model="form.category" class="form-control mb-2">
          <option disabled value="">Chọn Category</option>
          <option>Electronics</option>
          <option>Home</option>
          <option>Sports</option>
        </select>
        <input v-model="form.image" class="form-control mb-2" placeholder="URL hình ảnh" />
        <textarea v-model="form.description" class="form-control mb-2" placeholder="Mô tả"></textarea>

        <button class="btn btn-primary me-2" @click="saveProduct">
          {{ form.id ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button v-if="form.id" class="btn btn-secondary" @click="resetForm">Huỷ</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 mb-3" v-for="p in products" :key="p.id">
        <div class="card h-100">
          <img :src="p.image" class="card-img-top" :alt="p.title" />
          <div class="card-body">
            <h5 class="card-title">{{ p.title }}</h5>
            <p class="card-text">{{ p.description }}</p>
            <p><strong>{{ p.price }} $</strong></p>
            <p><span class="badge bg-info">{{ p.category }}</span></p>
            <button class="btn btn-sm btn-warning me-2" @click="editProduct(p)">Sửa</button>
            <button class="btn btn-sm btn-danger" @click="deleteProduct(p.id)">Xoá</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
