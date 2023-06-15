<script setup>
import {sockInitHook} from '@/utils/hooks/hooks.js'
import OperateHeader from "@/layout/OperateHeader.vue";
import {useStore} from "vuex";

sockInitHook()
const store = useStore()

store.dispatch('get_db_info')


</script>

<template>
  <header class="w-full h-[35px] flex">
    <operate-header></operate-header>
  </header>
  <main class="w-full" style="height: calc(100% - 35px)">
    <router-view></router-view>
  </main>
</template>

<style lang="css" scoped>

</style>
