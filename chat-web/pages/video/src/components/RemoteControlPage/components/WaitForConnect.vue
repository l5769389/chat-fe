<script setup>
import VideoController from "./VideoController.vue";
import hooks from "@video/hook/hooks.js";

const {userInfo} = hooks();
const currentDialogInfo = computed(() => userInfo.oppositeUser)
</script>

<template>
  <div class="w-full h-full bg-black p-3 pt-5 pb-10 flex flex-col justify-between items-center">
    <div class="flex self-start">
      <el-avatar :src="currentDialogInfo.avatar" shape="square" :size="50"></el-avatar>
      <div class="flex flex-col ml-1">
        <span>{{ currentDialogInfo.nickname }}</span>
        <span>等待对方接受邀请...</span>
      </div>
    </div>

    <div class="w-5/6 items-center">
      <video-controller class="w-full h-full"/>
    </div>
  </div>
</template>

<style scoped>

</style>