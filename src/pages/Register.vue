<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const fullname = ref("");
const username = ref("");
const password = ref("");
const email = ref("");
const message = ref("");
const success = ref(false);

const register = () => {
  if (!fullname.value || !username.value || !password.value || !email.value) {
    message.value = "Vui lòng nhập đầy đủ thông tin!";
    success.value = false;
    return;
  }

  if (password.value.length < 6) {
    message.value = "Mật khẩu phải có ít nhất 6 ký tự!";
    success.value = false;
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    message.value = "Email không hợp lệ!";
    success.value = false;
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const exist = users.find((u) => u.username === username.value);
  if (exist) {
    message.value = "Username đã tồn tại!";
    success.value = false;
    return;
  }

  const newUser = {
    fullname: fullname.value,
    username: username.value,
    password: password.value,
    email: email.value,
    role: "user",
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Đăng ký thành công!");

  router.push("/login");
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 450px;">
      <h2 class="text-center mb-4 fw-bold">Đăng Ký</h2>

      <div class="mb-3">
        <label class="form-label">Họ tên</label>
        <input v-model="fullname" type="text" class="form-control" placeholder="Nhập họ tên" />
      </div>

      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" placeholder="Nhập username" />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Nhập password" />
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" placeholder="Nhập email" />
      </div>

      <button @click="register" class="btn btn-success w-100">Register</button>
      <div class="mb3">
        <router-link to="/login" style="text-decoration: none; color: #007bff;">
          <br />
          Đã có tài khoản? Đăng nhập
        </router-link>
      </div>

      <p v-if="message" :style="{ color: success ? 'green' : 'red' }" class="mt-3 text-center">
        {{ message }}
      </p>
    </div>
  </div>
</template>
