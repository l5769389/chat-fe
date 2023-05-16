<template>
    <div class="flex flex-col h-full">
        <div class="sticky top-0 h-[50px] flex items-center box-border">
            <chat-search v-model="searchKey"></chat-search>
        </div>
        <div class="flex flex-col flex-1" style="height: calc(100% - 100px);">
            <div class="h-full overflow-y-auto overflow-x-hidden">
                <template v-for="item in filtered_friends" :key="item.nickname">
                    <div>
                        <chat-item :dialog-info="item" :use-type="canSelect ? 'select' : 'address'"
                                   v-model="checkedFriendIds[item.userId]" @dbClick="gotoDialog"/>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import {computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import ChatItem from '../../../common/components/ChatItem.vue';
import ChatSearch from '@/common/components/ChatSearch.vue';
import getSelectFriendsHooks from "@/utils/hooks/getSelectFriendsHooks.js";

defineProps({
    canSelect: {
        type: Boolean,
        default: false
    }

})
const store = useStore()
const router = useRouter()

const {checkedFriendIds, filtered_friends, searchKey} = getSelectFriendsHooks()


const totalChatList = computed(() => store.getters.totalChatList)
const gotoDialog =async (userId) => {
    // if (totalChatList.value.includes(userId)) {
    //     invokeDialog(userId)
    // } else {
    //     createDialog(userId)
    // }
   await createDialog(userId)
}

const invokeDialog = (userId) => {
    store.commit('setCurrentDialog', {
        type:'Single',
        id: userId
    })
    store.commit('updateChatList', userId)
    router.push({
        name: 'home'
    })
}
const createDialog =async (userId) => {
    await store.dispatch('updateRecentChat',{
        toUserId:userId
    })
    store.commit('addChatList', userId)
    store.commit('setCurrentDialog', {
        type:'Single',
        id: userId
    })
    await router.push({
        name: 'home'
    })
}


</script>
<style scoped></style>