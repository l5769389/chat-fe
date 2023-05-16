<template>
    <div class="flex  overflow-x-hidden overflow-y-auto flex-col h-full pt-3 items-center">
        <chat-item v-for="item in recentChatIds" :key="item.id"
                   :class="activeDialogId == item.id ? 'bg-dark-400-active' : ''"
                   @click="chooseDialog(item)"
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
const activeDialogId = computed(() => store.getters.currentDialogId)
const totalMsgMap = computed(() => store.getters.totalMsgMap)
const recentChatIds = computed(() => store.getters.recentChatIds)
const unreadMsgMap = computed(() => store.getters.unreadMsgMap)
const groundFriends = computed(() => store.getters.groupFriends)
const getUnreadMsg = (item) => {
    const {type: chatType,id: chatId,joinIds,name} = item
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
                avatar: info.avatar,
                nickname: info.nickname,
                userId: info.userId
            }
        })
        return {
            avatar: '',
            nickname: name,
            msgInfo: {
                count: unreadmsg.length,
                timestamp: arr.length > 0 ? arr[arr.length - 1].timestamp : '',
            },
            group: friends
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
    store.commit('setCurrentDialog', item)
}
</script>

<style scoped></style>