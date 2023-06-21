<script setup>
import VideoController from "./VideoController.vue";
import hooks from '../../../hook/hooks.js'
import {SocketEvent} from "/common/types.ts";
import _ from 'lodash'

const oppositeRef = ref();
let deltaX = 0;
let deltaY = 0;
let oppositeSize = {
  width: 1680,
  height: 1050
}
let ratio = 1;
onMounted(() => {
  getRectSize()
  watchSizeChange();
})

const getRectSize = () => {
  document.addEventListener('keydown', handleKeyEvent)
  const {left, top} = oppositeRef.value.getBoundingClientRect();
  deltaX = left;
  deltaY = top;
  console.log(`left:${left},top:${top}`)
}

const watchSizeChange = () => {
  const resizeObserver = new ResizeObserver(_.debounce(entries => {
    const {width, height} = entries[0].contentRect
    calcCurrentRatio(width, height)
  }, 100))
  resizeObserver.observe(oppositeRef.value);
}

const calcCurrentRatio = (width, height) => {
  const widthRatio = Number.parseFloat((oppositeSize.width / width).toFixed(4));
  const heightRatio = Number.parseFloat((oppositeSize.height / height).toFixed(4));
  console.log(`width:${width},height:${height}, w_ratio:${widthRatio}, h_ratio:${heightRatio}`)
  ratio = Math.min(widthRatio, heightRatio)
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyEvent)
})
const {sendIpcMsg, invite_info,} = hooks();
const handleEvent = _.throttle((e) => {
  const msg = getMsg(e)
  sendIpcMsg(msg);
}, 20)
let mousedownFlag = false;
const getMsg = (e) => {
  const {type, clientX, clientY} = e;
  let ansType = type;
  if (type === 'mousedown') {
    mousedownFlag = true;
  } else if (type === 'mouseup') {
    mousedownFlag = false;
  } else if (type === 'mousemove' && mousedownFlag) {
    // 鼠标按下左键且拖动。
    ansType = 'dragMouse'
  }
  return {
    type: SocketEvent.REMOTE_CONTROL,
    data: {
      roomId: invite_info.value.videoRoomId,
      content: {
        type: ansType,
        clientX: (ratio * (clientX - deltaX)).toFixed(0),
        clientY: (ratio * (clientY - deltaY)).toFixed(0)
      }
    }
  }
}


const handleKeyEvent = _.throttle(e => {
  const msg = getKeydownMsg(e)
  console.log(JSON.stringify(msg))
  sendIpcMsg(msg);
}, 20)

const getKeydownMsg = (e) => {
  const {type, key} = e;
  return {
    type: SocketEvent.REMOTE_CONTROL,
    data: {
      roomId: invite_info.value.videoRoomId,
      content: {
        type,
        key
      }
    }
  }
}

</script>

<template>
  <div class="w-full h-full relative">
    <div class="video-wrapper">
      <video ref="oppositeRef"
             autoplay
             playsinline
             @click="handleEvent"
             @mousedown="handleEvent"
             @mousemove="handleEvent"
             @mouseup="handleEvent"
             class="video_container"
      ></video>
    </div>

<!--    <div class="w-5/6 absolute bottom-1/4 left-1/2 bg-black" style="transform: translateX(-50%)">-->
<!--      <video-controller/>-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.video-wrapper {
  @apply w-full h-full absolute top-0 left-0 bg-dark
}

.video_container {
  @apply h-full w-full cursor-none
}
</style>