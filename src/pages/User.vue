<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const store = useStore()
const products = ref([])
const user = ref(null)
const searchQuery = ref("")
const searchResults = ref([])

const countCart = computed(() => store.getters.countCart)
const favorites = ref([])
const vouchers = ref([])
const receivedVouchers = ref([])

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("products")) || []
  products.value = saved
  searchResults.value = saved

  const u = JSON.parse(localStorage.getItem("user"))
  if (u) {
    user.value = u
    receivedVouchers.value = u.receivedVouchers || []
  }
  
  const fav = JSON.parse(localStorage.getItem("favorites")) || []
  favorites.value = fav
  
  vouchers.value = JSON.parse(localStorage.getItem("vouchers")) || []
})

const logout = () => {
  localStorage.removeItem("user")
  user.value = null
  router.push("/login")
}

const handleBuy = (product) => {
  if (!user.value) {
    alert("Vui lòng đăng nhập để mua hàng!")
    router.push("/login")
    return
  }
  if (product.stock <= 0) {
    alert("Sản phẩm đã hết hàng, không thể thêm vào giỏ!")
    return
  }
  store.commit("add_cart", product)
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
}

const onSearch = () => {
  searchResults.value = products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const toggleFavorite = (productId) => {
  if (favorites.value.includes(productId)) {
    favorites.value = favorites.value.filter(id => id !== productId)
    alert("Đã bỏ yêu thích sản phẩm!")
  } else {
    favorites.value.push(productId)
    alert("Đã yêu thích sản phẩm!")
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value))
}

const isFavorite = (productId) => favorites.value.includes(productId)

const hasVoucher = (code) => {
  return receivedVouchers.value.some(v => v.code === code)
}

const receiveVoucher = (voucher) => {
  if (!user.value) {
    alert("Vui lòng đăng nhập để nhận mã!")
    return
  }
  if (hasVoucher(voucher.code)) {
    alert("Bạn đã nhận mã này!")
    return
  }
  receivedVouchers.value.push(voucher)
  const newUser = { ...user.value, receivedVouchers: receivedVouchers.value }
  user.value = newUser
  localStorage.setItem("user", JSON.stringify(newUser))
  alert(`Đã nhận mã ${voucher.code}!`)
}
</script>

<template>
  <div class="user-page">
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand fw-bold text-primary">
          <img src="/Logo.png" alt="Logo" width="40" height="40" class="me-2" />
          AnhHoangShop
        </router-link>
        <form class="d-flex mx-auto w-50" @submit.prevent="onSearch">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Tìm sản phẩm..."
            v-model="searchQuery"
          />
          <button class="btn btn-primary" type="submit">Tìm</button>
        </form>
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
    <section class="banner text-center mb-3">
      <img src="/banner.jpg" alt="Banner" class="img-fluid rounded" />
    </section>
    <section class="vouchers mb-4 container">
      <h5 class="mb-3">Mã khuyến mãi nổi bật</h5>
      <div class="d-flex flex-wrap gap-3">
        <div
          v-for="voucher in vouchers"
          :key="voucher.code"
          class="voucher-card p-3 border rounded shadow-sm flex-fill"
          style="min-width: 150px; max-width: 250px;"
        >
          <div class="fw-bold">{{ voucher.code }}</div>
          <div>Giảm giá {{ voucher.discount }}%</div>
          <button
            v-if="user && !hasVoucher(voucher.code)"
            class="btn btn-outline-primary btn-sm mt-2"
            @click="receiveVoucher(voucher)"
          >
            Nhận mã
          </button>
          <span v-else-if="user" class="badge bg-success mt-2">Đã nhận</span>
        </div>
      </div>
    </section>
    <div class="container">
      <h2 class="mb-3 text-center">Danh sách sản phẩm</h2>
      <div v-if="searchResults.length === 0" class="text-center text-muted">
        <p>Không có sản phẩm nào hoặc không tìm thấy kết quả phù hợp.</p>
      </div>
      <div v-else class="products d-flex flex-wrap justify-content-center gap-3">
        <div
          v-for="p in searchResults"
          :key="p.id"
          class="product-card position-relative"
        >
          <button
            class="favorite-btn"
            :class="{ active: isFavorite(p.id) }"
            @click="toggleFavorite(p.id)"
            title="Yêu thích"
          >
            <i :class="isFavorite(p.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          </button>
          <img :src="p.image" alt="img" />
          <h3>{{ p.name }}</h3>
          <p>Giá: {{ p.price.toLocaleString() }} VNĐ</p>
          <p>Danh mục: {{ p.category }}</p>
          <button
            @click="handleBuy(p)"
            class="btn btn-primary w-100 mt-2"
            :disabled="p.stock <= 0"
            title="Sản phẩm đã hết hàng"
          >
            Thêm vào giỏ
          </button>
          <router-link
            :to="`/product/${p.id}`"
            class="btn btn-outline-secondary w-100 mt-2"
          >
            Chi tiết
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-page {
  background-color: #f9f9f9;
  min-height: 100vh;
}
.banner img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}
.voucher-card {
  background-color: #f1f5f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
.products {
  margin-top: 20px;
}
.product-card {
  border: 1px solid #ddd;
  background: #fff;
  padding: 15px;
  width: 200px;
  text-align: center;
  border-radius: 10px;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-card img {
  max-width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: gray;
  transition: color 0.3s;
  z-index: 10;
}
.favorite-btn.active,
.favorite-btn:hover {
  color: red;
}
</style>