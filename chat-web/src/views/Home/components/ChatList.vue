<template>
  <div class="flex  overflow-x-hidden overflow-y-auto flex-col h-full pt-3">
    <chat-item v-for="item in recentChatIds" :key="item.id" :class="activeDialogId == item.id ? 'bg-dark-400-active' : ''"
      @click="chooseDialog(item.id)" :dialog-info="getUnreadMsg(item.id)" :msg="getUnreadMsg1(item.id)" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ChatItem from '../../../common/components/ChatItem.vue'
import store from "@/store/index.js";
const friends = computed(() => store.getters.friends)
const activeDialogId = computed(() => store.getters.currentDialogUserId)
const totalMsgMap = computed(() => store.getters.totalMsgMap)
const recentChatIds = computed(() => store.getters.recentChatIds)
const unreadMsgMap = computed(() => store.getters.unreadMsgMap)

const getUnreadMsg = (userId) => {
  const arr = totalMsgMap.value[userId] || []
  const unreadmsg = unreadMsgMap.value[userId] || []
  const friendInfo = friends.value.find(item => item.userId == userId)
  return {
    avatar: friendInfo?.avatar,
    nickname: friendInfo?.nickname,
    msgInfo: {
      count: unreadmsg.length,
      timestamp: arr.length > 0 ? arr[arr.length - 1].timestamp : ''
    }
  }
}

const getUnreadMsg1 = (userId) => {
  const arr = totalMsgMap.value[userId] || []
  let msg = {
    content: '',
    type: 'text'
  }
  if (arr.length > 0) {
    msg = arr[arr.length - 1];
  }
  return msg
}

const chooseDialog = (id) => {
  store.commit('setCurrentDialog', id)
}
</script>

<style scoped></style>