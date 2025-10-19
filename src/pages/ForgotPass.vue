<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const step = ref(1);
const username = ref("");
const otp = ref("");
const enteredOtp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const message = ref("");
const success = ref(false);

const sendOtp = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === username.value);

  if (!user) {
    message.value = "Không tìm thấy tài khoản!";
    success.value = false;
    return;
  }

  otp.value = Math.floor(100000 + Math.random() * 900000).toString();

  localStorage.setItem("reset_otp", otp.value);
  localStorage.setItem("reset_user", username.value);

  message.value = `OTP đã được gửi (test): ${otp.value}`;
  success.value = true;
  step.value = 2;
};

const verifyAndReset = () => {
  const savedOtp = localStorage.getItem("reset_otp");
  const savedUser = localStorage.getItem("reset_user");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.username === savedUser);

  if (enteredOtp.value !== savedOtp) {
    message.value = " Mã OTP không đúng!";
    success.value = false;
    return;
  }

  if (!newPassword.value || newPassword.value.length < 4) {
    message.value = " Mật khẩu mới phải có ít nhất 4 ký tự!";
    success.value = false;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    message.value = " Xác nhận mật khẩu không khớp!";
    success.value = false;
    return;
  }
  if (index === -1) {
    message.value = " Người dùng không tồn tại!";
    success.value = false;
    return;
  }

  users[index].password = newPassword.value;
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.removeItem("reset_otp");
  localStorage.removeItem("reset_user");

  alert("Đổi mật khẩu thành công! Đăng nhập lại với mật khẩu mới.");

  setTimeout(() => router.push("/login"), 1000);
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 400px;">
      <h2 class="text-center mb-4 fw-bold">Quên mật khẩu</h2>

      <div v-if="step === 1">
        <div class="mb-3">
          <label class="form-label">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Nhập username của bạn"
          />
        </div>

        <button @click="sendOtp" class="btn btn-primary w-100">Gửi OTP</button>
      </div>

      <div v-if="step === 2">
        <div class="mb-3">
          <label class="form-label">Nhập mã OTP</label>
          <input
            v-model="enteredOtp"
            type="text"
            class="form-control"
            placeholder="Nhập mã OTP đã gửi"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input
            v-model="newPassword"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Xác nhận mật khẩu</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button @click="verifyAndReset" class="btn btn-success w-100">
          Xác nhận đổi mật khẩu
        </button>

        <div class="text-center mt-3">
          <a href="#" @click.prevent="step = 1" style="text-decoration: none;">← Quay lại</a>
        </div>
      </div>

      <p v-if="message" class="mt-3 text-center" :style="{ color: success ? 'green' : 'red' }">
        {{ message }}
      </p>

      <div class="text-center mt-3">
        <router-link to="/login" style="text-decoration: none; color: #007bff;">
          Quay lại đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}
</style>
