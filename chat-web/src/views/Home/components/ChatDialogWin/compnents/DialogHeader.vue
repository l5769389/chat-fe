<template>
    <div class="flex  items-center h-full box-border pl-[10px] pr-[10px]">
        <span class="overflow-ellipsis overflow-hidden whitespace-nowrap flex-1 mr-3">{{ currentDialogUserInfo.nickname }}sdfsdfsdfsdfsdfsddddddddddddddddddddddfdasfsadfsfdsfsdfsdfdddddddddd</span>
        <div class="w-[25px] h-full flex justify-center items-center" @click="toggleShowAddMoreHook">
            <more theme="outline" size="25" fill="#333" strokeLinejoin="miter"/>
        </div>
    </div>

</template>

<script setup>
import { getDialogInfoHook } from '@/utils/hooks';
import { More } from '@icon-park/vue-next';
import { ref } from 'vue';
import { toggleShowAddMoreHook } from '@/views/Home/homeHooks';
const { currentDialogUserInfo } = getDialogInfoHook()
</script>

<style scoped>

</style>