<script setup>
import {sockInitHook} from '@/utils/hooks/hooks.js'
import ConnectRtcDialog from "@/common/components/connectRtcDialog/ConnectRtcDialog.vue";
import modalVideoHooks from "@/utils/hooks/modalVideoHooks.js";
sockInitHook()


const {videoModalFlag} = modalVideoHooks()

</script>

<template>
    <router-view></router-view>
    <div v-if="videoModalFlag">
        <connect-rtc-dialog v-model:showConnect="videoModalFlag"/>
    </div>
</template>

<style lang="css" scoped>

</style>
