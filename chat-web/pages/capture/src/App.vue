<script setup>
import _ from 'lodash'
import {ipcRenderer} from 'electron'
const test = import('./assets/bg.png')
const dragOpCanvasRef = ref(null);
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

class CaptureCanvas {
  ctx = null;
  width = 0
  height = 0;
  isDown = false;
  startPoint = {
    x: 0,
    y: 0,
  }
  endPoint = {
    x: 0,
    y: 0,
  }

  constructor(canvasWidth, canvasHeight) {
    this.ctx = dragOpCanvasRef.value.getContext('2d')
    dragOpCanvasRef.value.width = canvasWidth
    dragOpCanvasRef.value.height = canvasHeight
    this.addListener()
  }

  drawRect = ({
                lt, rb,
                lineWidth = '1px', strokeStyle = 'red', fillStyle = 'rgba(0, 136, 255, 0.2)',
                needFill = false,
                needClear = false
              }) => {
    const rect = [
      {
        x: lt.x,
        y: lt.y
      },
      {
        x: rb.x,
        y: lt.y
      },
      {
        x: rb.x,
        y: rb.y
      },
      {
        x: lt.x,
        y: rb.y
      }
    ]
    this.ctx.beginPath()
    rect.forEach((item, index) => {
      if (index === 0) {
        this.ctx.moveTo(item.x, item.y)
      } else {
        this.ctx.lineTo(item.x, item.y)
      }
    })
    this.ctx.closePath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineJoin = "round";
    this.ctx.fillStyle = fillStyle
    if (needFill) {
      this.ctx.fill();
    }
    if (needClear) {
      const x = Math.min(lt.x, rb.x);
      const y = Math.min(lt.y, rb.y);
      const width = Math.abs(lt.x - rb.x)
      const height = Math.abs(lt.y - rb.y)
      this.clearRect(x, y, width, height)
    }
    this.ctx.stroke();
  }

  clearRect = (x = 0, y = 0, width = canvasSizeRef.value.width, height = canvasSizeRef.value.height) => {
    this.ctx.clearRect(x, y, width, height)
  }

  addListener = () => {
    dragOpCanvasRef.value.addEventListener('mousedown', e => {
      this.isDown = true
      this.startPoint.x = e.clientX
      this.startPoint.y = e.clientY
    })
    dragOpCanvasRef.value.addEventListener('mousemove', _.throttle(e => {
      if (!this.isDown) {
        return;
      }
      this.endPoint = {
        x: e.clientX,
        y: e.clientY
      }
      this.clearRect()
      this.drawBg(canvasSizeRef.value.width, canvasSizeRef.value.height)
      this.drawRect({
        lt: this.startPoint,
        rb: this.endPoint,
        strokeStyle: 'blue',
        needClear: true
      })
    }, 16.6))
    dragOpCanvasRef.value.addEventListener('mouseup', e => {
      this.startPoint = {
        x: 0,
        y: 0,
      }
      this.isDown = false;
    })
  }

  drawBg = (width, height) => {
    this.drawRect({
      lt: {x: 0, y: 0},
      rb: {x: width, y: height},
      needFill: true
    });
  }
}

onMounted(() => {

})

ipcRenderer.on('capture', (event, args) => {
  setCaptureCanvas()
  setAmplifyCanvas()
  setBgImg(args)
})
const setCaptureCanvas = () => {
  const {width: screenWidth, height: screenHeight} = canvasWrapperRef.value.getBoundingClientRect()
  const captureCanvas = new CaptureCanvas(screenWidth, screenHeight)
  captureCanvas.drawBg(screenWidth, screenHeight)
  canvasSizeRef.value = {
    width: screenWidth,
    height: screenHeight
  }
}

const setAmplifyCanvas = () => {
  const amplifyCanvas = new AmplifyCanvas(150, 150)
  amplifyCanvas.drawCross();
}
const setBgImg = (imgDataUrl) => {
  // imgRef.value.style.backgroundImage = `url(${bgImg})`
  const img = new Image()
  img.src = imgDataUrl
  const captureBgCanvas = new CaptureBgCanvas()
  captureBgCanvas.img2canvas(img)
}


const popRef = ref();
const imgRef = ref()
const showPop = _.throttle((e) => {
  popRef.value.style.transform = `translate3d(${e.clientX + 20}px,${e.clientY + 20}px,0)`
  imgRef.value.style.transform = `translate3d(${-2 * e.clientX + 75}px,${-2 * e.clientY + 75}px,0)`
}, 20)


const amplifyCrossCanvasRef = ref();

class AmplifyCanvas {
  ctx = null;
  crossRectSize = {
    width: 150,
    height: 150
  }

  constructor(width, height) {
    this.ctx = amplifyCrossCanvasRef.value.getContext('2d')
    amplifyCrossCanvasRef.value.width = width
    amplifyCrossCanvasRef.value.height = height
    this.crossRectSize.width = width
    this.crossRectSize.height = height
  }

  drawCross = () => {
    amplifyCrossCanvasRef.value.width = this.crossRectSize.width
    amplifyCrossCanvasRef.value.height = this.crossRectSize.height
    this.ctx.beginPath()
    this.ctx.moveTo(0, 75)
    this.ctx.lineTo(150, 75)
    this.ctx.moveTo(75, 0);
    this.ctx.lineTo(75, 150);
    this.ctx.closePath();
    this.ctx.lineWidth = '1px';
    this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
  }
}

const captureBgCanvasRef = ref()

class CaptureBgCanvas {
  ctx = null

  constructor(width = canvasSizeRef.value.width * 2, height = canvasSizeRef.value.height * 2) {
    this.ctx = captureBgCanvasRef.value.getContext('2d')
    captureBgCanvasRef.value.width = width
    captureBgCanvasRef.value.height = height
  }

  img2canvas(img) {
    const img1 = new Image()
    img1.src = test;
    this.ctx.drawImage(img1, 0, 0)
  }
}

</script>
<template>
  <div class="w-full h-full p-0.5">
    <div class="w-full h-full relative" ref="canvasWrapperRef" @mousemove="showPop">
      <!--      绘制拖拽区域-->
      <canvas class="w-full h-full bg-transparent" ref="dragOpCanvasRef"></canvas>
      <!--      显示放大区域-->
      <div class="pop left-0 top-0" ref="popRef">
        <!--        放大后的图像-->
        <div ref="imgRef" class="img" :style="bgStyleRef">
          <canvas ref="captureBgCanvasRef" class="z-30"></canvas>
        </div>
        <!--        放大区域的十字区域-->
        <div class="amplify-canvas-wrapper">
          <canvas class="absolute z-20" ref="amplifyCrossCanvasRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pop {
  @apply h-[152px] w-[152px] absolute z-10 left-0 top-0 overflow-hidden
}

.img {
  @apply absolute top-0 left-0
}

.amplify-canvas-wrapper {
  border: 1px dashed red;
  @apply w-full h-full box-border absolute top-0 left-0
}
</style>
