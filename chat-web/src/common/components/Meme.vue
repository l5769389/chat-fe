<template>
  <div class="shadow-sm  w-full h-[200px]">
    <el-scrollbar class="bg-white p-2">
      <div class="grid grid-cols-10">
        <div v-for="item in list" :key="item" class="text-6xl h-[40px] hover:bg-white-300 hover:scale-125 flex justify-center items-center">{{item}}</div>
      </div>
    </el-scrollbar>

  </div>
</template>
<script setup>
import emojJson from '@/asset/emoj.js'
const list = emojJson.data.split(',')
</script>
<style scoped></style>
