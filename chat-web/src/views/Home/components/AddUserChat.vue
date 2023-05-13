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


</template>
<script setup>
import { getDialogInfoHook } from '@/utils/hooks';
import { AddThree, Right } from '@icon-park/vue-next';
const { currentDialogUserId, currentDialogUserInfo } = getDialogInfoHook()
import AddressListWrapper from '@/views/Address/components/AddressListWrapper.vue';
const setting = reactive({
    noDisturb: false,
    onTop: false
})
const addUserFlag = ref(false)

</script>

<style lang="css" scoped>
    .radio {
     --el-switch-on-color: rgb(16,174,15);
    }
</style>