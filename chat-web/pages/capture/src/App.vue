<script setup>
import _ from 'lodash'
import {ipcRenderer} from 'electron'
const canvasRef = ref(null);
const canvasWrapperRef = ref(null);
let canvasWidth = 0;
let canvasHeight = 0
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
    this.ctx = canvasRef.value.getContext('2d')
    canvasRef.value.width = canvasWidth
    canvasRef.value.height = canvasHeight
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

  clearRect = (x = 0, y = 0, width = canvasWidth, height = canvasHeight) => {
    this.ctx.clearRect(x, y, width, height)
  }

  addListener = () => {
    canvasRef.value.addEventListener('mousedown', e => {
      this.isDown = true
      this.startPoint.x = e.clientX
      this.startPoint.y = e.clientY
    })
    canvasRef.value.addEventListener('mousemove', _.throttle(e => {
      if (!this.isDown) {
        return;
      }
      this.endPoint = {
        x: e.clientX,
        y: e.clientY
      }
      this.clearRect()
      this.drawBg(canvasWidth, canvasWidth)
      this.drawRect({
        lt: this.startPoint,
        rb: this.endPoint,
        strokeStyle: 'blue',
        needClear: true
      })
    }, 16.6))
    canvasRef.value.addEventListener('mouseup', e => {
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

ipcRenderer.on('capture',(event, args)=> {
  const {width: screenWidth, height: screenHeight} = canvasWrapperRef.value.getBoundingClientRect()
  const captureCanvas = new CaptureCanvas(screenWidth, screenHeight)
  canvasWidth = screenWidth;
  canvasHeight = screenHeight;
  captureCanvas.drawBg(canvasWidth, canvasHeight)
  imgRef.value.style.backgroundImage = `url(${args})`
  nextTick(() => {
    showAmplify()
  })
})

const popRef = ref();
const imgRef = ref()
const showPop = _.throttle((e) => {
  popRef.value.style.transform = `translate3d(${e.clientX + 20}px,${e.clientY + 20}px,0)`
  imgRef.value.style.transform = `translate3d(${- 2 * e.clientX + 75 }px,${-2 * e.clientY + 75}px,0)`
},20)


const amplifyCanvasRef = ref();

const showAmplify = () => {
  amplifyCanvasRef.value.width = 150
  amplifyCanvasRef.value.height = 150
  const ctx = amplifyCanvasRef.value.getContext('2d')
  ctx.beginPath()
  ctx.moveTo(0,75)
  ctx.lineTo(150,75)
  ctx.moveTo(75,0);
  ctx.lineTo(75,150);
  ctx.closePath();
  ctx.lineWidth = '1px';
  ctx.strokeStyle = 'red';
  ctx.stroke();
}
</script>
<template>
  <div class="w-full h-full p-0.5">
    <div class="w-full h-full relative" ref="canvasWrapperRef" @mousemove="showPop">
<!--      绘制拖拽区域-->
      <canvas class="w-full h-full bg-transparent" ref="canvasRef"></canvas>
<!--      显示放大区域-->
      <div class="pop left-0 top-0" ref="popRef">
<!--        放大后的图像-->
        <div ref="imgRef" class="img -z-1">
        </div>
<!--        放大区域的十字区域-->
       <div class="amplify-canvas-wrapper">
         <canvas class="absolute z-20 w-[150px] h-[150px]" ref="amplifyCanvasRef"></canvas>
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
  background-repeat: no-repeat;
  background-size: cover;
  @apply absolute w-[3120px] h-[1984px] top-0 left-0
}
.amplify-canvas-wrapper{
  border: 1px dashed red;
  @apply w-full h-full box-border absolute top-0 left-0
}
</style>
