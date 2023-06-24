<script setup lang="ts">
import {computed, defineProps, onMounted, onUnmounted, ref} from 'vue'
import store from '@/store/index.js'

const props = defineProps({
  position: {},
  chatId: {
    type: Number || String
  },
  menuType: {
    validator(value: string): boolean {
      return ['menu', 'menu_address'].indexOf(value) !== -1;
    }
  },
  onTop: {
    type:Boolean
  }
})

const onTopHandler = () => {
  store.commit('onTopChatList',props.chatId)
}
const cancelOnTopHandler = () => {

}
const onNoDisturbHandler = () => {
}
const onDeleteChatHandler = () => {
  store.dispatch('deleteMsgByChatId', {
    'chatId': props.chatId
  })
}
const onSendMsgHandler = () => {
}
const onDeleteFriendHandler = () => {
}

const menuRef = computed(() => {
  if (props.menuType === 'menu_address'){
    return menu_address;
  }else {
    const onTopMenu = !props.onTop ?  {
      type: 'onTop',
      label: '置顶',
      handler: onTopHandler,
    }: {
      type: 'cancelOnTop',
      label: '取消置顶',
      handler: cancelOnTopHandler,
    }
    return [onTopMenu,...[
      {
        type: 'noDisturb',
        label: '勿扰',
        handler: onNoDisturbHandler,
      },
      {
        type: 'delete',
        label: '删除聊天',
        handler: onDeleteChatHandler,
      },
    ]]
  }
})
const menu_address = [
  {
    type: 'chat',
    label: '发消息',
    handler: onSendMsgHandler,
  },
  {
    type: 'delete',
    label: '删除朋友',
    handler: onDeleteFriendHandler,
  },
]


</script>

<template>
  <teleport to="body">
    <div class="absolute shadow-sm bg-white w-[100px] flex flex-col z-10 space-y-1"
         :style="{'left': `${props.position.clientX}px`, 'top': `${props.position.clientY}px`}">
      <div v-for="menuItem in menuRef"
           :key="menuItem.type"
           @click="menuItem.handler"
           class="flex justify-center hover:bg-white-300 p-1"
      >
        {{ menuItem.label }}
      </div>
    </div>
  </teleport>
</template>

<style scoped>

</style>