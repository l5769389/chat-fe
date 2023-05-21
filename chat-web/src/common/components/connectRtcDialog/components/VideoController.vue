<script setup>
import {CloseSmall, PhoneCall, Voice} from "@icon-park/vue-next";

</script>

<template>
  <div class="flex">
    <div class="item">
        <span  class="w-[40px] h-[40px]  rounded-full flex justify-center items-center">
          <phone-call theme="outline" size="24" fill="#fff"/>
        </span>
      <span class="block mt-1">切到语音聊天</span>
    </div>

    <div class="item">
        <span class="w-[40px] h-[40px] bg-red rounded-full">
          <close-small theme="outline" size="40" fill="#fff"/>
        </span>
      <span class="block mt-1">取消</span>
    </div>

    <div class="item">
        <span class="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center">
          <voice theme="outline" size="25" fill="#333"/>
        </span>
      <span class="block mt-1">麦克风已开</span>
    </div>
  </div>
</template>

<style scoped>
.item {
  @apply flex flex-col items-center flex-1
}
</style>