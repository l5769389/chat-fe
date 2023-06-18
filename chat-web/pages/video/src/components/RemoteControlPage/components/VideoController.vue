<script setup>
import {CloseSmall, PhoneCall, Voice, VoiceOff, PhoneVideoCall} from "@icon-park/vue-next";
import hooks from "@video/hook/hooks.js";

const {
  videoOrAudioRef,
  muteRef,
  toggleVideoOrAudio,
  toggleMute,
  closeVideoConnectPositive,
} = hooks()

</script>

<template>
  <div class="flex">
<!--    <div class="item" @click="toggleVideoOrAudio">-->
<!--               <span class="w-[40px] h-[40px]  rounded-full flex justify-center items-center">-->
<!--                     <phone-call v-if="videoOrAudioRef" theme="outline" size="24" fill="#fff"/>-->
<!--                     <phone-video-call v-else theme="outline" size="24" fill="#fff"/>-->
<!--               </span>-->
<!--      <span v-if="videoOrAudioRef" class="block mt-1">切到语音聊天</span>-->
<!--      <span v-else class="block mt-1">切到视频聊天</span>-->
<!--    </div>-->

    <div class="item" @click="closeVideoConnectPositive">
        <span class="w-[40px] h-[40px] bg-red rounded-full">
          <close-small theme="outline" size="40" fill="#fff"/>
        </span>
      <span class="block mt-1">取消</span>
    </div>

<!--    <div class="item" @click="toggleMute">-->
<!--        <span class="w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center">-->
<!--            <voice v-if="!muteRef" theme="outline" size="25" fill="#333"/>-->
<!--            <voice-off v-else theme="outline" size="25" fill="#333"/>-->
<!--        </span>-->
<!--      <span v-if="!muteRef" class="block mt-1">麦克风已开</span>-->
<!--      <span v-else class="block mt-1">麦克风关闭</span>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.item {
  @apply flex flex-col items-center flex-1
}
</style>