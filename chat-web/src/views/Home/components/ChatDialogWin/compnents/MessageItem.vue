<template>
  <div class="flex p-1 justify-between">
    <div class="w-30 p-3" :class="selfMessageFlag ? ' order-2' : 'order-1'">
      <el-avatar shape="square" :size="35" :src="avatar" />
    </div>
    <div class="flex-1  flex flex-col justify-center" :class="selfMessageFlag ? 'order-1' : 'order-2 '">
      <!-- <p :class="selfMessageFlag ? 'self-end' : 'self-start'">zhangsan</p> -->
      <div
        :class="selfMessageFlag ? ' bg-green-100 my1 hover:bg-green-100-hover self-end' : ' bg-white my hover:bg-dark-200-hover self-start'"
        class="p-3 rounded-2xl flex flex-wrap">
            <span v-if="props.type === 'text'">{{ message }}</span>
            <img v-else-if="type === 'img'" :src="message"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import store from "@/store/index.js";
const props = defineProps({
  avatar: String,
  nickName: String,
  source: String,
  message: String,
  type: String
})
const user = computed(() => store.getters.user)
const my_avatar = computed(() => user.value.avatar)
const selfMessageFlag = computed(() => props.source === 'self')

const avatar = computed(() => {
  if (selfMessageFlag.value) {
    return my_avatar.value
  } else {
    return props.avatar
  }
})
</script>

<style scoped>
.my,
.my1 {
  position: relative;
}

.my::before {
  left: -5px;
  @apply bg-white hover:bg-dark-200-hover
}

.my1::before {
  right: -5px;
  @apply bg-green-100 hover:bg-green-100-hover
}

.my::before,
.my1::before {
  width: 10px;
  height: 10px;
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 20px;
  z-index: 0;
  border-bottom-color: transparent;
  border-right-color: transparent;
  transform: rotate(45deg);

}
</style>