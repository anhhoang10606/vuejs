<template>
  <div class="cart-overlay" @click="closeCart">
    <div class="cart-modal" @click.stop>
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="closeCart">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div v-if="cart.length === 0" class="empty-cart">
        <i class="pi pi-shopping-cart"></i>
        <p>Your cart is empty</p>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cart"
            :key="item.id"
            class="cart-item"
          >
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="loading"
                  class="qty-btn"
                >
                  <i class="pi pi-minus"></i>
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  :disabled="loading"
                  class="qty-btn"
                >
                  <i class="pi pi-plus"></i>
                </button>
              </div>
              <p class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</p>
              <button
                @click="removeItem(item.productId)"
                :disabled="loading"
                class="remove-btn"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>Items:</span>
              <span>{{ cartItemCount }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span class="total-amount">${{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button
              @click="handleClearCart"
              :disabled="loading"
              class="btn-clear"
            >
              Clear Cart
            </button>
            <button
              @click="checkout"
              :disabled="loading"
              class="btn-checkout"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ShoppingCart',
  computed: {
    ...mapState(['cart', 'loading']),
    ...mapGetters(['cartItemCount', 'cartTotal'])
  },
  methods: {
    ...mapActions(['removeFromCart', 'updateCartItemQuantity', 'clearCart']),
    closeCart() {
      this.$emit('close')
    },
    async removeItem(productId) {
      await this.removeFromCart(productId)
    },
    async increaseQuantity(item) {
      await this.updateCartItemQuantity({
        productId: item.productId,
        quantity: item.quantity + 1
      })
    },
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        await this.updateCartItemQuantity({
          productId: item.productId,
          quantity: item.quantity - 1
        })
      } else {
        await this.removeFromCart(item.productId)
      }
    },
    async handleClearCart() {
      if (confirm('Are you sure you want to clear the cart?')) {
        await this.clearCart()
      }
    },
    checkout() {
      alert(`Checkout Total: $${this.cartTotal.toFixed(2)}\nThank you for your order!`)
      this.clearCart()
      this.closeCart()
    }
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cart-modal {
  background: white;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.cart-header h2 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #1f2937;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.empty-cart i {
  font-size: 4rem;
  margin-bottom: 16px;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 12px;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.item-price {
  color: #10b981;
  font-weight: 600;
  margin: 0;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 8px;
  padding: 4px;
}

.qty-btn {
  background: #3b82f6;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background: #2563eb;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
}

.item-total {
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.remove-btn:hover:not(:disabled) {
  background: #dc2626;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-footer {
  border-top: 1px solid #e5e7eb;
  padding: 20px;
  background: #f9fafb;
}

.cart-summary {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #6b7280;
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  padding-top: 12px;
  border-top: 2px solid #e5e7eb;
}

.total-amount {
  color: #10b981;
}

.cart-actions {
  display: flex;
  gap: 12px;
}

.btn-clear,
.btn-checkout {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-clear {
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;
}

.btn-clear:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.btn-checkout {
  background: #10b981;
  color: white;
}

.btn-checkout:hover:not(:disabled) {
  background: #059669;
}

.btn-clear:disabled,
.btn-checkout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>