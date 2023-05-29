<template>
  <div class="flex p-1 items-center" :class="selfMessageFlag ? 'justify-end': 'justify-start'">
    <div class="w-30 p-3" :class="selfMessageFlag ? ' order-2' : 'order-1'">
      <el-avatar shape="square" :size="35" :src="avatar"/>
    </div>
    <div class="max-w-[250px] flex flex-col justify-center" :class="selfMessageFlag ? 'order-1' : 'order-2 '">
      <div
          :class="getMsgBgClass()"
          class="p-2 rounded-xl flex flex-wrap relative">
        <span v-if="props.type === 'text'">{{ message }}</span>
        <img v-else-if="type === 'img'" :src="message"/>
        <template v-else-if="type === 'file'">
          <div class="flex w-[200px]">
            <div class="flex flex-col mr-3 w-full">
              <span class="text-sm">{{ message.file.name }}</span>
              <span class="text-xs text-gray">{{ formatSize(message.file.size) }}</span>
            </div>
            <align-text-both-one theme="outline" size="35" fill="#333"/>
          </div>
        </template>
      </div>
    </div>
    <div
        v-if="props.type ==='file' && !selfMessageFlag && !isDownloadRef"
        @click="handleDownload"
        class="w-[20px] h-[20px] order-3 bg-green rounded-full flex justify-center items-center ml-2 hover:bg-green-hover">
        <arrow-down theme="outline" size="16" fill="#fff"/>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import store from "@/store/index.js";
import {AlignTextBothOne,ArrowDown} from "@icon-park/vue-next";
import {formatSize} from "@/utils/utils.js";
import API from "@/api/request.js";

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
  if (selfMessageFlag.value) {
    if (props.type === 'file') {
      // 文件类型的自己消息
      return 'bg_white right self-end'
    } else {
      return 'bg_green right  self-end'
    }
  } else {
    if (props.type === 'file') {
      return 'bg_white left self-start'
    } else {
      return 'bg_white left self-start'
    }
  }
}
const isDownloadRef = ref(false)

const avatar = computed(() => {
  if (selfMessageFlag.value) {
    return my_avatar.value
  } else {
    return props.avatar
  }
})

const handleDownload = () => {
  API.downloadFile(props.message.filePath);
  isDownloadRef.value = true;
}
</script>

<style scoped>
.left,
.right {
  position: relative;
}

/**
白色背景 左边

 */
.left::before {
  left: -5px;
}

.right::before {
  right: -5px;
}

.bg_white {
  @apply bg-white hover:bg-dark-200-hover
}

.bg_green {
  @apply bg-green-100 hover:bg-green-100-hover
}

.bg_white::before {
  @apply bg-white hover:bg-dark-200-hover
}

.bg_green::before {
  @apply bg-green-100 hover:bg-green-100-hover
}


.left::before,
.right::before {
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