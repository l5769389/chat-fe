<template>
  <video
      ref="videoRef"
      class="w-full h-[calc(100vh- 120px)]"
       id="video"
      @click="handleClickVideo"
  ></video>
  <button  @click="handleClick">11111</button>
</template>

<script setup>

// const videoRef = ref(null)
// const constraints = {
//   video: true,
//   audio: true,
// }
// const handleClick = async () => {
//   const stream = await navigator.mediaDevices.getUserMedia( {
//     audio: {
//       mandatory: {
//         chromeMediaSource: 'desktop'
//       }
//     },
//     video: {
//       mandatory: {
//         chromeMediaSource: 'desktop'
//       }
//     }
//   })
//   const video = document.querySelector('video')
//   video.srcObject = stream
//   video.onloadedmetadata = (e) => video.play()
// }
//
// const handleClickVideo = e => {
//   console.log(e)
// }

// Move the mouse across the screen as a sine wave.

</script>

<style scoped>

</style>