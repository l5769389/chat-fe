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
                            v-model="checkedFriendIds[item.userId]" @db-click="gotoDialog" />
                    </div> 
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ChatItem from '../../../common/components/ChatItem.vue';
import ChatSearch from '@/common/components/ChatSearch.vue';
defineProps({
    canSelect: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:checked'])

const store = useStore()
const router = useRouter()
const friends = computed(() => store.getters.friends)
const friendsList = computed(() => friends.value.map(item => {
    return {
        avatar: item.avatar,
        nickname: item.nickname,
        userId: item.userId
    }
}))
const checkedFlag = ref(false)

const checkedFriendIds = reactive({})

const checkedFriendsInfo = computed(() => {
    let arr = [];
    for (const [id, v] of Object.entries(checkedFriendIds)) {
        if (!v) {
            continue;
        }
        const friend = friendsList.value.find(item => item.userId == id)
        arr.push({
            userId: id,
            avatar: friend.avatar,
            nickname: friend.nickname
        })
    }
    return arr;
})

watch(checkedFriendsInfo, (newVal) => {
    emit('update:checked', newVal)
})


const totalChatList = computed(() => store.getters.totalChatList)
const gotoDialog = (userId) => {
    if (totalChatList.value.includes(userId)) {
        invokeDialog(userId)
    } else {
        createDialog(userId)
    }
}
const invokeDialog = (userId) => {
    store.commit('setCurrentDialog', userId)
    store.commit('updateChatList', userId)
    router.push({
        name: 'home'
    })
}
const createDialog = (userId) => {
    store.commit('addChatList', userId)
    store.commit('setCurrentDialog', userId)
    router.push({
        name: 'home'
    })
}


const searchKey = ref('')

const filtered_friends = computed(() => {
   return friendsList.value.filter(item => {
        const { userId, nickname } = item;
        if (userId.toString().includes(searchKey.value)) {
            return item
        } else if (nickname.toString().includes(searchKey.value)) {
            return item
        }
    })
})

</script>
<style scope></style>