<template>
      <div class="flex overflow-auto flex-col h-full">
          <chat-item v-for="item in arr" :key="item" :content="item"/>
      </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import ChatItem from './ChatItem.vue'
const arr = reactive([
    {
        id:1,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:2,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
    {
        id:3,
        url:'',
        nickname:'爱妃',
        recentMsg:'aaa',
        time: '20:21'
    },
])
</script>

<style scoped>

</style>