<script setup>
import {sockInitHook} from '@/utils/hooks/hooks.js'
import ConnectRtcDialog from "@/common/components/connectRtcDialog/ConnectRtcDialog.vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
import OperateHeader from "@/layout/OperateHeader.vue";
sockInitHook()


const {videoModalFlag} = modalVideoHooks()

</script>

<template>
  <header class="w-full h-[35px] flex">
      <operate-header></operate-header>
  </header>
    <main class="w-full" style="height: calc(100% - 35px)">
      <router-view></router-view>
    </main>
    <div v-if="videoModalFlag">
        <connect-rtc-dialog v-model:showConnect="videoModalFlag"/>
    </div>
</template>

<style lang="css" scoped>

</style>
