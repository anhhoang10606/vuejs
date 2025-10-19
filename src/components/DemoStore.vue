<script setup>
    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore()
    const demo = computed(() => store.state.count)
    console.log('demo', store)

const handleButtonIncrease = () => {
    //  store.commit('increment')
    store.dispatch('incrementAsync')
}

const handleButtonDecrease = () => {
     store.commit('decrease')
     store.dispatch("")
}
</script>

<template>
    <h1>demo vuex</h1>
    <h3>data here: {{ demo }}</h3>
    <button @click="handleButtonIncrease" class="btn btn-primary">+</button>
      <button @click="handleButtonDecrease" class="btn btn-primary">-</button>
</template>