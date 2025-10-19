<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const orderId = ref(null)
const order = ref(null)

onMounted(() => {
  orderId.value = route.params.orderId || null
  const orders = JSON.parse(localStorage.getItem('orders')) || []
  order.value = orders.find(o => o.id === Number(orderId.value))
})

const goToOrderDetail = () => {
  if (orderId.value) {
    router.push({ name: 'Profile', query: { tab: 'orders', orderId: orderId.value } })
  }
}

const goHome = () => {
  router.push({ name: 'User' })
}
</script>

<template>
  <div class="order-success-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold text-primary">
          <img src="/Logo.png" alt="Logo" width="40" height="40" class="me-2" />
          AnhHoangShop
        </router-link>
      </div>
    </nav>

    <div class="container py-4 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="96"
        height="96"
        fill="green"
        class="bi bi-check-circle mb-3"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm3.97-9.03a.75.75 0 1 1 1.058 1.06l-4.992 5.04a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 4.492-4.49z"
        />
      </svg>
      <h3>Đặt hàng thành công!</h3>
      <p class="mb-3">Mã đơn hàng của bạn: <strong>{{ orderId }}</strong></p>

      <button @click="goToOrderDetail" class="btn btn-primary me-3">
        Xem đơn hàng
      </button>
      <button @click="goHome" class="btn btn-outline-secondary">
        Quay lại trang chủ
      </button>
    </div>
  </div>
</template>

<style scoped>
.order-success-page svg {
  margin-bottom: 1rem;
}
</style>
