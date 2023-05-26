<template>
  <div class="flex p-1 justify-between">
    <div class="w-30 p-3" :class="selfMessageFlag ? ' order-2' : 'order-1'">
      <el-avatar shape="square" :size="35" :src="avatar" />
    </div>
    <div class="flex-1  flex flex-col justify-center" :class="selfMessageFlag ? 'order-1' : 'order-2 '">
      <div
        :class="getMsgBgClass()"
        class="p-3 rounded-2xl flex flex-wrap">
            <span v-if="props.type === 'text'">{{ message }}</span>
            <img v-else-if="type === 'img'" :src="message"/>
            <template v-else-if="type === 'file'">
                <div class="flex">
                  <div class="flex flex-col mr-3">
                    <span class="text-sm">{{message.file.name}}</span>
                    <span class="text-xs text-gray">{{formatSize(message.file.size)}}</span>
                  </div>
                  <align-text-both-one theme="outline" size="35" fill="#333"/>
                </div>
            </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import store from "@/store/index.js";
import {AlignTextBothOne} from "@icon-park/vue-next";
import {formatSize} from "@/utils/utils.js";

const props = defineProps({
  avatar: String,
  nickName: String,
  source: String,
  message: Object,
  type: String
})
const user = computed(() => store.getters.user)
const my_avatar = computed(() => user.value.avatar)
const selfMessageFlag = computed(() => props.source === 'self')

const getMsgBgClass = () => {
  if (props.type ==='file'){
    return ' bg-white my2 hover:bg-dark-200-hover self-end'
  }else if (selfMessageFlag){
    return ' bg-green-100 my1 hover:bg-green-100-hover self-end'
  }else {
    return  ' bg-white my hover:bg-dark-200-hover self-start'
  }
}


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
.my1,
.my2
  {
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
.my2::before{
  right: -5px;
  @apply bg-white hover:bg-dark-200-hover
}

.my::before,
.my1::before,
.my2::before {
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