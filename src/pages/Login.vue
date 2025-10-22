<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const error = ref("");

const login = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (username.value === "anhnhpk" && password.value === "12345") {
    localStorage.setItem("user", JSON.stringify({ username: "Admin", role: "admin" }));
    router.push("/admin");
    return;
  }

  const found = users.find(
    (u) => u.username === username.value && u.password === password.value
  );

  if (found) {
    localStorage.setItem("user", JSON.stringify(found));

    const username = found.username;
    const userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${username}`)) || [];
    localStorage.setItem(`favorites_${username}`, JSON.stringify(userFavorites));

    if (found.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }

    setTimeout(() => {
      location.reload();
    }, 100);
  } else {
    error.value = "Sai username hoặc password!";
  }


};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h2 class="text-center mb-4 fw-bold">Login Page</h2>

      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" placeholder="Enter username" />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Enter password" />
      </div>

      <button @click="login" class="btn btn-primary w-100">Login</button>
      <br>
      <div class="mb-3">
        <router-link to="/register" style="text-decoration: none; color: #007bff;">
          Chưa có tài khoản? Đăng ký
        </router-link>
      </div>
      <div class="mb-3">
        <router-link to="/forgotpass" style="text-decoration: none; color: #007bff;">
          Quên mật khẩu?
        </router-link>
      </div>
      <p v-if="error" style="color:red">{{ error }}</p>
    </div>
  </div>
</template>
