<template>
    <div class="overflow-auto h-full">
        <message-item v-for="item in currentDialogDetails"
                      :avatar="getUserInfoByUserId(item.userId).avatar"
                      :nickName="getUserInfoByUserId(item.userId).nickname"
                      :source="item.source"
                      :message="item.content"
                      :key="item.messageId"
                      :type="item.type"/>
    </div>
</template>

<script setup>
import MessageItem from "@/views/Home/components/ChatDialogWin/compnents/MessageItem.vue";
import { getDialogInfoHook} from '@/utils/hooks/hooks.js';
import {computed} from "vue";
import {useStore} from "vuex";
const store = useStore();
const { currentDialogDetails, currentDialogUserInfo} = getDialogInfoHook()
const groupFriends = computed(() => store.getters.groupFriends)
const chatType = currentDialogUserInfo.value.chatType;

const getUserInfoByUserId = (userId) => {
  if (chatType === 'Single'){
    return {
      avatar: currentDialogUserInfo.value.avatar,
      nickname: currentDialogUserInfo.value.nickname
    }
  }else {
    const friend = groupFriends.value[userId]
    return {
      avatar: friend.avatar,
      nickname: friend.nickname,
    }
  }
}
</script>

<style scoped></style>