<script setup>
import { ref, reactive } from "vue";

const quantity = ref(0);
const increase = () => quantity.value++;
const decrease = () => { if (quantity.value > 0) quantity.value--; };

const user = reactive({ name: "", age: null, email: "" });
const message = ref("");
const updateInfo = () => {
  if (!user.name || !user.age || !user.email) {
    message.value = "Vui lòng nhập đầy đủ thông tin!";
    return;
  }
  if (user.age < 0) {
    message.value = "Tuổi không hợp lệ!";
    return;
  }
  message.value = "Cập nhật thông tin thành công!";
};

const oneWay = ref("Xinchao");
const twoWay = ref("bonjour");

const score = ref(null);
const classification = ref("");
const checkScore = () => {
  if (score.value < 5) classification.value = "Yếu";
  else if (score.value < 6.5) classification.value = "Trung bình";
  else if (score.value < 8) classification.value = "Khá";
  else if (score.value < 9) classification.value = "Giỏi";
  else classification.value = "Xuất sắc";
};

const username = ref("");
const password = ref("");
const loginMessage = ref("");
const color = ref("");
const login = () => {
  if (username.value === "admin" && password.value === "123456") {
    loginMessage.value = "Đăng nhập thành công!";
    color.value = "green";
  } else {
    loginMessage.value = "Đăng nhập thất bại!";
    color.value = "red";
  }
};
</script>

<template>
  <div class="container my-4">
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">Bài 1:</div>
      <div class="card-body">
        <p>Số lượng sản phẩm: <strong>{{ quantity }}</strong></p>
        <button class="btn btn-success me-2" @click="increase">Tăng</button>
        <button class="btn btn-danger" @click="decrease">Giảm</button>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header bg-info text-white">Bài 2: </div>
      <div class="card-body">
        <form @submit.prevent="updateInfo" class="row g-2">
          <div class="col-md-4">
            <input v-model="user.name" class="form-control" placeholder="Tên" />
          </div>
          <div class="col-md-4">
            <input v-model.number="user.age" type="number" class="form-control" placeholder="Tuổi" />
          </div>
          <div class="col-md-4">
            <input v-model="user.email" type="email" class="form-control" placeholder="Email" />
          </div>
          <div class="col-12 mt-2">
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </div>
        </form>
        <p class="mt-2">{{ message }}</p>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header bg-warning">Bài 3: </div>
      <div class="card-body">
        <p><strong>One-way:</strong> {{ oneWay }}</p>
        <input :value="oneWay" class="form-control mb-2" />

        <p><strong>Two-way:</strong> {{ twoWay }}</p>
        <input v-model="twoWay" class="form-control" />
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header bg-success text-white">Câu 4:</div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model.number="score" type="number" class="form-control w-25 d-inline-block me-2" placeholder="Nhập điểm" />
          <button class="btn btn-secondary" @click="checkScore">Xếp loại</button>
        </div>
        <p><strong>Xếp loại:</strong> {{ classification }}</p>

        <h5>Login</h5>
        <input v-model="username" class="form-control mb-2" placeholder="Username" />
        <input v-model="password" type="password" class="form-control mb-2" placeholder="Password" />
        <button class="btn btn-dark" @click="login">Login</button>
        <p class="mt-2" :style="{ color: color }">{{ loginMessage }}</p>
      </div>
    </div>
  </div>
</template>
