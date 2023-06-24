<template>
  <div class="flex flex-col h-full">
    <div class="sticky top-0 h-[40px] flex items-center box-border">
      <chat-search v-model="searchKey"></chat-search>
    </div>
    <div class="flex flex-col flex-1 wrapper" style="height: calc(100% - 40px);">
      <el-scrollbar class="bg-white-300">
        <template v-for="item in filtered_friends" :key="item.nickname">
            <chat-item :dialog-info="item" :use-type="canSelect ? 'select' : 'address'"
                       v-model="checkedFriendIds[item.userId]" @dbClick="gotoDialog(item)"/>
        </template>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import ChatItem from '../../../common/components/ChatItem.vue';
import ChatSearch from '@/common/components/ChatSearch.vue';
import getSelectFriendsHooks from "@/utils/hooks/getSelectFriendsHooks.js";

const props = defineProps({
  canSelect: {
    type: Boolean,
    default: false
  },
})
const store = useStore()
const router = useRouter()

const {checkedFriendIds, filtered_friends, searchKey} = getSelectFriendsHooks()

const gotoDialog = async (item) => {
  await invokeDialog(item)
}
const invokeDialog = async (item) => {
  store.commit('updateChatList', {
    type: 'Single',
    id: item.userId,
    onTop: false
  })
  store.commit('setCurrentDialog', {
    type: 'Single',
    id: item.userId,
    nickname: item.nickname,
    avatar: item.avatar
  })
  await router.push({
    name: 'home'
  })
}


</script>
<style>
::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-track {
  background: rebeccapurple;
}
</style>