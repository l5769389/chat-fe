<script setup>
import {sockInitHook} from '@/utils/hooks/hooks.js'
import OperateHeader from "@/layout/OperateHeader.vue";
import {useStore} from "vuex";

sockInitHook()
const store = useStore()


</script>

<template>
  <header class="w-full h-[23px] flex items-center">
    <operate-header></operate-header>
  </header>
  <main class="w-full" style="height: calc(100% - 23px)">
    <router-view></router-view>
  </main>
</template>

<style lang="css" scoped>

</style>
