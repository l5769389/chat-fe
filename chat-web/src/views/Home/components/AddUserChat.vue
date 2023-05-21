<template>
    <div class="w-full h-full pt-5 pl-2 pr-2 border-box divide-y-2 text-xs">
        <div class="grid grid-cols-3 pl-3 pr-3 pb-5 border-box gap-y-1">
            <template v-if="currentDialogInfo.type === 'Single'">
                <div class="flex flex-col items-center">
                    <el-avatar shape="square" :size="35" :src="currentDialogInfo.avatar"/>
                    <span class="text-xs mt-1 overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-center">{{
                        currentDialogInfo.nickname
                        }}</span>
                </div>
            </template>
            <template v-else-if="currentDialogInfo.type === 'Multi'">
                <div class="flex flex-col items-center" v-for="id in currentDialogInfo.joinIds">
                    <el-avatar shape="square" :size="35" :src="groupFriends[id].avatar"/>
                    <span class="text-xs mt-1 overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-center">{{
                        groupFriends[id].nickname
                        }}</span>
                </div>
            </template>
            <div class=" flex flex-col items-center" @click="handleShowModal">
                <add-three theme="outline" size="35" fill="#333" strokeLinejoin="miter"/>
                <span class="text-xs mt-1">添加</span>
            </div>
        </div>
        <div class="flex justify-between pt-3 pb-3 items-center">
            <span>聊天记录</span>
            <right theme="outline" size="24" fill="#333"/>
        </div>

        <div class="pt-3 pb-3">
            <div class="flex justify-between items-center">
                <span>消息免打扰</span>
                <el-switch v-model="setting.noDisturb" class="radio"/>
            </div>
            <div class="flex justify-between items-center">
                <span>置顶</span>
                <el-switch v-model="setting.onTop" class="radio"/>
            </div>
        </div>

        <div class="pt-3 flex justify-center">
            <el-button text type="danger">删除聊天记录</el-button>
        </div>
    </div>

    <el-dialog class="no-header1" v-model="addUserFlag" width="600px"
               :modal="false"
               @close="handleClose"
               :show-close="false">
        <div class="h-[400px] w-full divide-x-2 flex overflow-hidden">
            <div class="flex-1 w-0 border-box">
                <address-list-wrapper :canSelect="true"></address-list-wrapper>
            </div>
            <div class="flex-1 flex flex-col w-0 pl-2">
                <div class="flex-1">
                    <div class="flex justify-between">
                        <span>选择联系人</span>
                        <span>已选择 {{ checkedFriendsInfo.length }}个联系人</span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-3 max-h-[200px] justify-items-center items-center">
                        <div class="w-min" v-for="(item, index) in checkedFriendsInfo" :key="index">
                            <removable @remove="handleRemove(item)">
                                <div class="flex flex-col justify-center items-center">
                                    <el-avatar shape="square" :src="item.avatar" :size="30"></el-avatar>
                                    <span class="max-w-[50px] overflow-ellipsis overflow-hidden whitespace-nowrap">{{
                                        item.nickname
                                        }}</span>
                                </div>
                            </removable>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center">
                    <el-button @click="handleSubmit">完成</el-button>
                    <el-button @click="addUserFlag = false">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script setup>
import {getDialogInfoHook} from '@/utils/hooks/hooks.js';
import {AddThree, Right} from '@icon-park/vue-next';
import {computed, nextTick, reactive, ref, watch} from "vue";
import Removable from "@/common/components/Removable.vue";
import {ElAvatar} from "element-plus";
import AddressListWrapper from "@/views/Address/components/AddressListWrapper.vue";
import getSelectFriendsHooks from "@/utils/hooks/getSelectFriendsHooks.js";
import {useStore} from "vuex";

const store = useStore()

const currentDialogInfo = computed(() => store.getters.currentDialogInfo)
const {checkedFriendsInfo, remove_checked, checkedFriendIds, setExceptUserId, reset} = getSelectFriendsHooks()
const user = computed(() => store.getters.user);
const setting = reactive({
    noDisturb: false,
    onTop: false
})
const groupFriends = computed(() => {
    return store.getters.groupFriends
})
const addUserFlag = ref(false)
const handleRemove = (item) => {
    remove_checked(item.userId)
}

const joinUserIds = computed(() => {
    let ans = [];
    const ids = Object.keys(checkedFriendIds.value)
    if (ids){
        ans.push(ids)
    }
    if (currentDialogInfo.value.type === 'Single') {
        return [...ans, currentDialogInfo.value.id,Number.parseInt(user.value.userId)]
    } else if (currentDialogInfo.value.type === 'Multi') {
        return [...ans, ...currentDialogInfo.value.joinIds,Number.parseInt(user.value.userId)]
    }
})


const handleSubmit = async () => {
    if (joinUserIds.value.length <= 2){
        return
    }
    addUserFlag.value = false
    try {
        const {roomId,  chatRoomName} = await store.dispatch('createRoom', joinUserIds.value)
    } catch (e) {

    }
}
const handleShowModal = () => {
    setExceptUserId(joinUserIds.value)
    addUserFlag.value = true
}
const handleClose = () => {
    reset()
}


</script>

<style lang="css" scoped>
.radio {
    --el-switch-on-color: rgb(16, 174, 15);
}

.no-header1 .el-dialog__header {
    display: none;
}

.no-header1 .el-dialog__body {
    @apply pt-4 pb-4
}
</style>