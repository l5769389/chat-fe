<template>
  <div class="flex  overflow-x-hidden overflow-y-auto flex-col h-full pt-3 items-center">
    <chat-item v-for="item in recentChats" :key="item.id"
               :class="activeDialogId.id == item.id ? 'bg-dark-400-active' : ''"
               @click="chooseDialog(item)"
               class="hover:bg-dark-400-hover"
               :msgType="item.type"
               :dialog-info="getUnreadMsg(item)"
               :msg="getUnreadMsg1(item.id)"/>
  </div>
</template>

<script setup>
import {computed} from "vue";
import ChatItem from '../../../common/components/ChatItem.vue'
import store from "@/store/index.js";

const friends = computed(() => store.getters.friends)
const activeDialogId = computed(() => store.getters.currentDialogInfo)
const totalMsgMap = computed(() => store.getters.totalMsgMap)
const recentChats = computed(() => store.getters.chatList)
const unreadMsgMap = computed(() => store.getters.unreadMsgMap)
const groundFriends = computed(() => store.getters.groupFriends)
const getUnreadMsg = (item) => {
  const {type: chatType, id: chatId, joinIds, chatRoomName} = item
  const arr = totalMsgMap.value[chatId] || []
  const unreadmsg = unreadMsgMap.value[chatId] || []
  if (chatType === 'Single') {
    const friendInfo = friends.value.find(item => item.userId == chatId)
    return {
      avatar: friendInfo?.avatar,
      nickname: friendInfo?.nickname,
      msgInfo: {
        count: unreadmsg.length,
        timestamp: arr.length > 0 ? arr[arr.length - 1].timestamp : ''
      },
      group: null
    }
  } else if (chatType === 'Multi') {
    const friends = joinIds.map(item => {
      const info = groundFriends.value[item]
      return {
        avatar: info?.avatar,
        nickname: info?.nickname,
        userId: info?.userId
      }
    })
    return {
      avatar: '',
      nickname: chatRoomName,
      msgInfo: {
        count: unreadmsg.length,
        timestamp: arr.length > 0 ? arr[arr.length - 1].timestamp : '',
      },
      group: friends
    }
  }
}

const getClickedUserInfo = (item) => {
  const {type: chatType, id: chatId, joinIds, chatRoomName} = item
  if (chatType === 'Single') {
    const friendInfo = friends.value.find(item => item.userId == chatId)
    return {
      avatar: friendInfo?.avatar,
      nickname: friendInfo?.nickname,
      group: null,
      id: chatId,
      type: chatType,
    }
  } else if (chatType === 'Multi') {
    const friends = joinIds.map(item => {
      const info = groundFriends.value[item]
      return {
        avatar: info?.avatar,
        nickname: info?.nickname,
        userId: info?.userId
      }
    })
    return {
      avatar: '',
      nickname: chatRoomName,
      group: friends,
      id: chatId,
      type: chatType,
    }
  }
}

const getUnreadMsg1 = (id) => {
  const arr = totalMsgMap.value[id] || []
  let msg = {
    content: '',
    type: 'text'
  }
  if (arr.length > 0) {
    msg = arr[arr.length - 1];
  }
  return msg
}

const chooseDialog = (item) => {
  const res = getClickedUserInfo(item)
  store.commit('setCurrentDialog',res)
}
</script>

<style scoped></style>