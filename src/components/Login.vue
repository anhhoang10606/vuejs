<script setup>
import { ref } from 'vue'
const username = ref('')
const password = ref('')
const message = ref('')
const isSuccess = ref(false)

const handleDangNhap = () => {
    if (username.value === "") {
        message.value = "username not empty"
    }
    else if (password.value === "") {
        message.value = "password not empty"
    }
    else if (username.value === 'admin' && password.value === '123456') {
        message.value = 'Đăng nhập thành công'
        isSuccess.value = true
    } else {
        message.value = 'Đăng nhập thất bại'
        isSuccess.value = false
    }
}

</script>
<template>
    <form>
        <input type="text" v-model="username" placeholder="username" />
        <input type="password" v-model="password" placeholder="password" />
        <input @click="handleDangNhap" type="button" value="đăng nhập" />
        <span :class="{ success: isSuccess, error: !isSuccess }">{{ message }}</span>
    </form>
</template>
<style scoped>
form {
    width: 500px;
    margin: 0 auto;
    border: 2px solid green;
    padding: 20px;
}
form input {
    width: 100%;
    display: block;
    margin-top: 20px;
}

.success {
    color: green;
}

.error {
    color: red;
}
</style>