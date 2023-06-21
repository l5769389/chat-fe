<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'

const props = defineProps({
  menu: {
    type: Array
  },
  position: {}
})
const menuRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    menuRef.val.style.left = `${props.position.clientX}px`
    menuRef.val.style.right = `${props.position.clientY}px`
  },1000)
})
const handleClick = item => {
  console.log(item)
}
console.log(JSON.stringify(props.position))

</script>

<template>
  <teleport to="body">
    <div class="absolute" ref="menuRef" :style="{'left': `${props.position.clientX}px`, 'top': `${props.position.clientY}px`}">
      <div v-for="menuItem in menu"
           :key="menuItem.type"
           @click="handleClick(menuItem)"
      >
        {{ menuItem.label }}
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>