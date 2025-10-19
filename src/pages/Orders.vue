<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])

const loadOrders = () => {
  const savedOrders = JSON.parse(localStorage.getItem('orders')) || []
  orders.value = savedOrders.sort((a, b) => b.created_at - a.created_at)
}

onMounted(() => {
  loadOrders()
})

const updateStatus = (order, newStatus) => {
  order.status = newStatus
  localStorage.setItem('orders', JSON.stringify(orders.value))
  alert(`Cập nhật trạng thái đơn ${order.id} thành ${newStatus}`)
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
</script>

<template>
  <div>
    <h3 class="mb-4">Quản lý đơn hàng</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Người mua</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Ngày đặt</th>
          <th>Chi tiết</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.name || order.username || 'Khách' }}</td>
          <td>{{ order.total.toLocaleString() }} VNĐ</td>
          <td>{{ order.status }}</td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - {{ item.quantity }} x {{ item.price.toLocaleString() }}đ
              </li>
            </ul>
          </td>
          <td>
            <select v-model="order.status" @change="updateStatus(order, order.status)" class="form-select form-select-sm">
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </td>
        </tr>
        <tr v-if="orders.length === 0">
          <td colspan="7" class="text-center">Chưa có đơn hàng nào</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
}
button {
  margin: 2px;
}
</style>
