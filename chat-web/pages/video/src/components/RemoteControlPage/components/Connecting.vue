<script setup>
import VideoController from "./VideoController.vue";
</script>

<template>
  <div class="w-full h-full relative">
    <div class="w-[100px] h-[50px] absolute left-2 top-10 z-10">
      <video id="origin" autoplay playsinline ref="myRef"  class="h-full object-contain"></video>
    </div>

    <div class="w-full h-full absolute top-0 left-0 bg-dark">
      <video  ref="oppositeRef"  autoplay playsinline class="h-full object-contain"></video>
    </div>

    <div class="w-5/6 absolute bottom-1/4 left-1/2 bg-black" style="transform: translateX(-50%)">
      <video-controller/>
    </div>

  </div>
</template>

<style scoped>

</style>