<template>
    <div class="overflow-auto h-full">
        <message-item v-for="item in messageRef.message" :avatar="messageRef.avatar" :nickName="messageRef.nickName"
            :source="item.source" :message="item.content" :key="item.messageId" :type="item.type"/>
    </div>
</template>

<script setup>
import MessageItem from "@/views/Home/components/ChatDialogWin/compnents/MessageItem.vue";
import { getDialogInfoHook} from '@/utils/hooks';
const { messageRef } = getDialogInfoHook()
</script>

<style scoped></style>