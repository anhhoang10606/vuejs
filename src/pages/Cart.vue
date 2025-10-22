<script setup>
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const API = import.meta.env.VITE_URL_API || 'http://localhost:3000';
const store = useStore();

const carts = computed(() => store.state.carts);
const totalCart = computed(() => store.getters.totalCart);

const orderInfo = reactive({
  name: "",
  sdt: "",
  address: "",
  email: "",
  pay_type: "cod"
});

const clearData = () => {
  orderInfo.name = '';
  orderInfo.sdt = '';
  orderInfo.address = '';
  orderInfo.email = '';
  orderInfo.pay_type = 'cod';
};

const handleRemove = (id) => {
  store.commit('remove_cart', id);
};

const handleQuantityChange = (item, newQuantity) => {
  if (newQuantity < 1) return;
  if (newQuantity > item.stock) {
    alert(`Sản phẩm "${item.name}" vượt quá số lượng tồn kho!`);
    return;
  }
  store.commit('update_cart_quantity', { id: item.id, quantity: newQuantity });
};

const handleSubmit = async () => {
  for (const item of carts.value) {
    if (item.quantity > item.stock) {
      alert(`Sản phẩm "${item.name}" vượt quá số lượng tồn kho! Vui lòng điều chỉnh lại.`);
      return;
    }
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const payload = {
    id: Date.now(),
    name: orderInfo.name,
    sdt: orderInfo.sdt,
    address: orderInfo.address,
    email: orderInfo.email,
    pay_type: orderInfo.pay_type,
    items: carts.value.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total: totalCart.value,
    created_at: Date.now(),
    status: 'Đang xử lý',
    user_id: currentUser?.id || null,
    username: currentUser?.username || 'guest'
  };

  try {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(payload);
    localStorage.setItem('orders', JSON.stringify(allOrders));

    clearData();
    store.commit('clear_cart');
    alert('Đặt hàng thành công!');
  } catch (error) {
    alert('Có lỗi xảy ra khi thanh toán!');
    console.error(error);
  }
};

</script>

<template>
  <div class="container">
    <h1 class="h4 mb-3">Thanh toán</h1>
    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent="handleSubmit">
              <p class="mb-2 fw-bold">1) Thông tin liên hệ</p>
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
              </div>

              <hr class="my-4" />

              <p class="mb-2 fw-bold">2) Địa chỉ giao hàng</p>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input v-model="orderInfo.address" type="text" class="form-control" required />
              </div>

              <hr class="my-4" />

              <p class="mb-2 fw-bold">3) Phương thức thanh toán</p>
              <div class="form-check mb-2">
                <input v-model="orderInfo.pay_type" type="radio" value="cod" class="form-check-input" id="payCOD" />
                <label class="form-check-label" for="payCOD">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div class="form-check">
                <input v-model="orderInfo.pay_type" type="radio" value="vnpay" class="form-check-input" id="payCard" />
                <label class="form-check-label" for="payCard">Thẻ VNPAY</label>
              </div>

              <button type="submit" class="btn btn-primary mt-3">Thanh toán</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-3">
            <h6 class="mb-3">Giỏ hàng</h6>
            <table class="table table-sm align-middle">
              <thead>
                <tr>
                  <th scope="col">Tên</th>
                  <th scope="col" class="text-center">SL</th>
                  <th scope="col" class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cart in carts" :key="cart.id">
                  <td>{{ cart.name }}</td>
                  <td class="text-center">
                    <input type="number" :max="cart.stock" :min="1" v-model.number="cart.quantity"
                      @change="handleQuantityChange(cart, cart.quantity)"
                      class="form-control form-control-sm text-center" style="max-width: 70px;" />
                  </td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-danger" @click="handleRemove(cart.id)">Xoá</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between">
              <strong>Tổng:</strong>
              <strong>{{ totalCart }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>