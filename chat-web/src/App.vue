<script setup>
import {sockInitHook} from '@/utils/hooks/hooks.js'
import ConnectRtcDialog from "@/common/components/ConnectRtcDialog.vue";
sockInitHook()

</script>

<template>
    <router-view></router-view>
    <connect-rtc-dialog/>
</template>

<style lang="css" scoped>

</style>
