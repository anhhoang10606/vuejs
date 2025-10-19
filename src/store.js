import { createStore } from 'vuex'
import axios from 'axios'

const API_URL = import.meta.env.VITE_URL_API

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const store = createStore({
  state() {
    return {
      count: 0,
      products: [],
      carts: JSON.parse(localStorage.getItem('cart')) || [],
      loading: false,
      error: null
    }
  },
  getters: {
    countCart: state => state.carts.reduce((sum, item) => sum + item.quantity, 0),
    totalCart: state => state.carts.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrease(state) {
      state.count--
    },
    setProducts(state, products) {
      state.products = products
    },
    setLoading(state, value) {
      state.loading = value
    },
    setError(state, error) {
      state.error = error
    },
    add_cart(state, payload) {
      const existItem = state.carts.find(item => item.id === payload.id)
      if (existItem) existItem.quantity++
      else state.carts.push({ ...payload, quantity: 1 })
      localStorage.setItem('cart', JSON.stringify(state.carts))
    },
    remove_cart(state, id) {
      state.carts = state.carts.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(state.carts))
    },
    decrease_cart(state, id) {
      const item = state.carts.find(p => p.id === id)
      if (item && item.quantity > 1) item.quantity--
      else state.carts = state.carts.filter(p => p.id !== id)
      localStorage.setItem('cart', JSON.stringify(state.carts))
    },
    clear_cart(state) {
      state.carts = []
      localStorage.removeItem('cart')
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    },
    async incrementAsync({ commit }) {
      await sleep(3000)
      commit('increment')
    },
    async fetchProducts({ commit }) {
      try {
        commit('setLoading', true)
        const res = await axios.get(`${API_URL}/products`)
        commit('setProducts', res.data)
      } catch (err) {
        commit('setError', err.message)
      } finally {
        commit('setLoading', false)
      }
    }
  }
})

export default store
