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

const props = defineProps({
    canSelect: {
        type: Boolean,
        default: false
    },
})
const store = useStore()
const router = useRouter()

const {checkedFriendIds, filtered_friends, searchKey} = getSelectFriendsHooks()

const gotoDialog =async (userId) => {
      await invokeDialog(userId)
}
const invokeDialog =async (userId) => {
    await store.dispatch('updateRecentChat',{
        type: 'Single',
        id: userId
    })
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