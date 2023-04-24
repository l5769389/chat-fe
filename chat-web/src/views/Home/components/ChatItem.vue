<template>
  <div class="h-20 flex items-center  box-border p-3">
      <el-avatar shape="square" size="large" class="mr-2"/>
      <div class="flex-1">
          <div class="flex justify-between">
              <span class="text-black font-bold">nickName</span>
              <span class="text-gray-400">time</span>
          </div>
          <span>msg</span>
      </div>
  </div>
</template>

<script setup>
 defineProps({
     content: Object
 })

</script>

<style scoped>

</style>