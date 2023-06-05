<script setup>
import _ from 'lodash'
import {ipcRenderer} from 'electron'
import DragOpCanvas from "./components/DragOpCanvas.vue";
import AmplifyCrossCanvas from "./components/AmplifyCrossCanvas.vue";
import CaptureBgCanvas from "./components/CaptureBgCanvas.vue";
const canvasWrapperRef = ref(null);
const canvasSizeRef = ref({
  width: 0,
  height: 0
})
const bgStyleRef = computed(() => {
  return {
    width: `${canvasSizeRef.value.width * 2}px`,
    height: `${canvasSizeRef.value.height * 2}px`
  }
})
const showDragOpCanvasRef = ref(false)
const bgImgDataUrlRef = ref(null);
const scaleFactorRef = ref(1)
const captureBgCanvasRef = ref(null);
const showIconsAndAmplifyRef = ref(false);

provide('screenSize', canvasSizeRef)
provide('bgImgDataUrl', bgImgDataUrlRef)
provide('scaleFactor',scaleFactorRef)
provide('showIconsAndAmplify',showIconsAndAmplifyRef)

const showCaptureInfoRef = ref(false)
ipcRenderer.on('capture', (event, args) => {
  // 初始化全屏的拖拽区域
  initDragOpCanvas()
  // 初始化 放大区域的图像。
  const { img, scaleFactor } = args;
  setBgImg(img,scaleFactor)
  showCaptureInfoRef.value = true;
})
const initDragOpCanvas = () => {
  const {width: screenWidth, height: screenHeight} = canvasWrapperRef.value.getBoundingClientRect()
  canvasSizeRef.value = {
    width: screenWidth,
    height: screenHeight
  }
  showDragOpCanvasRef.value = true
}

const setBgImg = (imgDataUrl,scaleFactor) => {
  bgImgDataUrlRef.value = imgDataUrl
  scaleFactorRef.value = scaleFactor
}

const currentColor = ref('')
const currentPosition = ref('')
const captureContainerRef = ref()
const bgContainerRef = ref()
const handleMousemove = _.throttle((e) => {
  if (captureContainerRef.value && bgContainerRef.value) {
    captureContainerRef.value.style.transform = `translate3d(${e.clientX + 20}px,${e.clientY + 20}px,0)`
    bgContainerRef.value.style.transform = `translate3d(${-2 * e.clientX + 75}px,${-2 * e.clientY + 75}px,0)`
  }
  if (captureBgCanvasRef.value) {
    currentColor.value = captureBgCanvasRef.value.captureBgCanvas.getPixelData(e.clientX * 2, e.clientY * 2)
    currentPosition.value = `${e.clientX},${e.clientY}`
  }
}, 20)

onMounted(() => {
  const body = document.querySelector('body')
  body.addEventListener('mouseleave', () => {
    showIconsAndAmplifyRef.value =false
  })
  body.addEventListener('mouseenter',() => {
    showIconsAndAmplifyRef.value = true
  })
})

</script>
<template>
  <div class="w-full h-full p-0.5">
    <div class="w-full h-full relative" ref="canvasWrapperRef" @mousemove="handleMousemove">
      <!--      绘制拖拽区域-->
      <drag-op-canvas v-if="showDragOpCanvasRef"/>
      <!--      显示放大区域-->
      <div v-if="showCaptureInfoRef" class="pop-container left-0 top-0" ref="captureContainerRef">
        <div class="pop-img-container">
          <!--        放大后的图像-->
          <div ref="bgContainerRef" class="img" :style="bgStyleRef">
            <capture-bg-canvas ref="captureBgCanvasRef"></capture-bg-canvas>
          </div>
          <!--        放大区域的十字区域-->
          <div class="amplify-canvas-wrapper" v-show="showIconsAndAmplifyRef">
            <amplify-cross-canvas/>
          </div>
        </div>
        <div class="pop-img-desc">
          <p>RGB: {{ (currentColor) }}</p>
          <p>POS: {{ currentPosition }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop-container {
  @apply h-[202px] w-[152px] absolute z-10 left-0 top-0 overflow-hidden
}

.pop-img-container {
  @apply h-[152px] w-[152px] absolute z-10 left-0 top-0 overflow-hidden
}

.pop-img-desc {
  @apply w-full h-[50px] absolute bottom-0 bg-black text-white
}

.img {
  @apply absolute top-0 left-0
}

.amplify-canvas-wrapper {
  border: 1px dashed red;
  @apply w-full h-full box-border absolute top-0 left-0
}
</style>
