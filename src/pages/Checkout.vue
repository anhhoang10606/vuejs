<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API = import.meta.env.VITE_URL_API || 'http://localhost:3000'
const store = useStore()
const router = useRouter()

const carts = computed(() => store.state.carts)
const totalCart = computed(() => {
  return carts.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
const countCart = computed(() => store.getters.countCart)
const user = ref(null)
const userVouchers = ref([])

const orderInfo = reactive({
  name: '',
  sdt: '',
  address: '',
  email: '',
  pay_type: 'cod',
  coupon: '',
  discount: 0
})

const discountedTotal = computed(() => {
  return totalCart.value - orderInfo.discount
})

onMounted(() => {
  const u = JSON.parse(localStorage.getItem('user') || '{}')
  if (u && Object.keys(u).length > 0) {
    user.value = u
    userVouchers.value = u.receivedVouchers || []
    orderInfo.name = u.fullname || ''
    orderInfo.email = u.email || ''
    orderInfo.sdt = u.sdt || ''
    orderInfo.address = u.address || ''
  }
})

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/login')
}

const clearData = () => {
  orderInfo.name = ''
  orderInfo.sdt = ''
  orderInfo.address = ''
  orderInfo.email = ''
  orderInfo.pay_type = 'cod'
  orderInfo.coupon = ''
  orderInfo.discount = 0
  store.state.carts = []
}

const handleRemove = (id) => {
  store.commit('remove_cart', id)
}

const increaseQuantity = (item) => {
  item.quantity++
  store.commit('update_cart', item)
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    store.commit('update_cart', item)
  } else {
    handleRemove(item.id)
  }
}

const applyCoupon = () => {
  const codeInput = orderInfo.coupon.trim().toUpperCase()
  const matchedVoucher = userVouchers.value.find(v => v.code.toUpperCase() === codeInput)
  if (matchedVoucher) {
    orderInfo.discount = totalCart.value * (matchedVoucher.discount / 100)
    alert(`Áp dụng mã giảm giá thành công, bạn được giảm ${orderInfo.discount.toLocaleString()}đ`)
  } else {
    orderInfo.discount = 0
    alert('Mã giảm giá không hợp lệ hoặc bạn chưa nhận mã này!')
  }
}

const handleSubmit = async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const payload = {
    name: orderInfo.name,
    sdt: orderInfo.sdt,
    address: orderInfo.address,
    email: orderInfo.email,
    pay_type: orderInfo.pay_type,
    coupon: orderInfo.coupon,
    discount: orderInfo.discount,
    items: carts.value.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: discountedTotal.value,
    created_at: Date.now(),
    status: 'pending',
    user_id: currentUser ? currentUser.id : null
  }

  const res = await axios.post(`${API}/orders`, payload)
  if (res.status === 201) {
    clearData()
    alert('Đặt hàng thành công!')
  }
}
</script>

<template>
  <div class="checkout-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold text-primary">
          <img src="/Logo.png" alt="Logo" width="40" height="40" class="me-2" />
          AnhHoangShop
        </router-link>

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

    <div class="container py-4">
      <h3 class="mb-4">Thanh toán</h3>
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="handleSubmit">
                <p class="fw-bold mb-3">Thông tin nhận hàng</p>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Họ và tên</label>
                    <input v-model="orderInfo.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input v-model="orderInfo.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="orderInfo.sdt" type="tel" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Địa chỉ</label>
                    <input v-model="orderInfo.address" type="text" class="form-control" required />
                  </div>
                </div>

                <hr class="my-4" />

                <p class="fw-bold mb-3">Mã giảm giá</p>
                <div class="input-group mb-3">
                  <input
                    v-model="orderInfo.coupon"
                    type="text"
                    class="form-control"
                    placeholder="Nhập mã giảm giá"
                  />
                  <button class="btn btn-outline-secondary" type="button" @click="applyCoupon">
                    Áp dụng
                  </button>
                </div>

                <hr class="my-4" />

                <p class="fw-bold mb-3">Phương thức thanh toán</p>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    v-model="orderInfo.pay_type"
                    type="radio"
                    value="cod"
                    id="payCOD"
                  />
                  <label class="form-check-label" for="payCOD">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    v-model="orderInfo.pay_type"
                    type="radio"
                    value="vnpay"
                    id="payVNPAY"
                  />
                  <label class="form-check-label" for="payVNPAY">VNPAY</label>
                </div>

                <div class="d-flex justify-content-between mt-4">
                  <strong>Tổng tiền:</strong>
                  <strong>{{ discountedTotal.toLocaleString() }}đ</strong>
                </div>

                <button type="submit" class="btn btn-primary mt-4 w-100">Xác nhận thanh toán</button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body p-3">
              <h6 class="mb-3">Giỏ hàng</h6>
              <table class="table table-sm align-middle text-center">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Số lượng</th>
                    <th>Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="cart in carts" :key="cart.id">
                    <td>{{ cart.name }}</td>
                    <td>
                      <div class="d-flex justify-content-center align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" @click="decreaseQuantity(cart)">-</button>
                        <span>{{ cart.quantity }}</span>
                        <button class="btn btn-sm btn-outline-primary" @click="increaseQuantity(cart)">+</button>
                      </div>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-danger" @click="handleRemove(cart.id)">X</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-between border-top pt-2">
                <strong>Tổng cộng:</strong>
                <strong>{{ totalCart.toLocaleString() }}đ</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background-color: #f9f9f9;
  min-height: 100vh;
}
</style>
