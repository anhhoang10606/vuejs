<script setup>
import { ref, onMounted } from "vue";

const orders = ref([]);
const user = ref(JSON.parse(localStorage.getItem("user")));

const loadOrders = () => {
  if (!user.value) return;

  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

  if (user.value.role === "admin") {
    orders.value = allOrders.sort((a, b) => b.created_at - a.created_at);
  } 
  else {
    orders.value = allOrders
      .filter((o) => o.created_by === user.value.username)
      .sort((a, b) => b.created_at - a.created_at);
  }
};

const updateStatus = (order, newStatus) => {
  order.status = newStatus;

  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const index = allOrders.findIndex((o) => o.id === order.id);
  if (index !== -1) {
    allOrders[index].status = newStatus;
    localStorage.setItem("orders", JSON.stringify(allOrders));
  }

  alert(`Cập nhật trạng thái đơn ${order.id} thành ${newStatus}`);
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div>
    <h3 class="mb-4">
      {{ user.role === "admin" ? "Quản lý tất cả đơn hàng" : "Lịch sử đơn hàng của bạn" }}
    </h3>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Người mua</th>
          <th>Tổng tiền</th>
          <th>Trạng thái</th>
          <th>Ngày đặt</th>
          <th>Chi tiết</th>
          <th v-if="user.role === 'admin'">Thao tác</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.name || order.username || "Khách" }}</td>
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
          <td v-if="user.role === 'admin'">
            <select
              v-model="order.status"
              @change="updateStatus(order, order.status)"
              class="form-select form-select-sm"
            >
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </td>
        </tr>

        <tr v-if="orders.length === 0">
          <td :colspan="user.role === 'admin' ? 7 : 6" class="text-center">
            Chưa có đơn hàng nào
          </td>
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

th,
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
}

button {
  margin: 2px;
}
</style>
