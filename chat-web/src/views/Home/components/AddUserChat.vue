<template>
    <div class="w-full h-full pt-5 pl-2 pr-2 border-box divide-y-2 text-xs">
        <div class="grid grid-cols-3 pl-3 pr-3 pb-5 border-box gap-y-1">
            <div class="flex flex-col items-center">
                <el-avatar shape="square" :size="35" :src="currentDialogUserInfo.avatar" />
                <span class="text-xs mt-1 overflow-ellipsis overflow-hidden whitespace-nowrap w-full text-center">{{
                    currentDialogUserInfo.nickname }}</span>
            </div>

            <div class=" flex flex-col items-center" @click="addUserFlag = true">
                <add-three theme="outline" size="35" fill="#333" strokeLinejoin="miter" />
                <span class="text-xs mt-1">添加</span>
            </div>
        </div>
        <div class="flex justify-between pt-3 pb-3 items-center">
            <span>聊天记录</span>
            <right theme="outline" size="24" fill="#333" />
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

    <el-dialog class="no-header" v-model="addUserFlag" width="600px" :modal="false"
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
import { getDialogInfoHook } from '@/utils/hooks/hooks.js';
import { AddThree, Right } from '@icon-park/vue-next';
import {reactive, ref} from "vue";
import Removable from "@/common/components/Removable.vue";
import {ElAvatar} from "element-plus";
import AddressListWrapper from "@/views/Address/components/AddressListWrapper.vue";
import getSelectFriendsHooks from "@/utils/hooks/getSelectFriendsHooks.js";
import {useStore} from "vuex";
const { currentDialogUserInfo } = getDialogInfoHook()
const setting = reactive({
    noDisturb: false,
    onTop: false
})
const addUserFlag = ref(false)
const {checkedFriendsInfo,remove_checked,checkedFriendIds} = getSelectFriendsHooks()
const store = useStore()
const handleRemove = (item) => {
    remove_checked(item.userId)
}
const handleSubmit =async () => {
    const joinIds = Object.keys(checkedFriendIds)
    await store.dispatch('createRoom',joinIds)
}
</script>

<style lang="css" scoped>
    .radio {
     --el-switch-on-color: rgb(16,174,15);
    }
    .no-header .el-dialog__header {
        display: none;
    }

    .no-header .el-dialog__body {
        @apply pt-4 pb-4
    }
</style>