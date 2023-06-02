<script setup>
import _ from "lodash";
import {Check, Close} from '@icon-park/vue-next'
const canvasRef = ref(null);
const canvasWrapperRef = ref(null);
const canvasSizeRef = inject('screenSize')
const showIconsRef = ref(false)

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

  clearRect = (x = 0, y = 0, width = canvasSizeRef.value.width, height = canvasSizeRef.value.height) => {
    this.ctx.clearRect(x, y, width, height)
  }

  addListener = () => {
    canvasWrapperRef.value.addEventListener('mousedown', e => {
      this.isDown = true
      this.startPoint.x = e.clientX
      this.startPoint.y = e.clientY
    })
    canvasWrapperRef.value.addEventListener('mousemove', _.throttle(e => {
      showIconsRef.value = false
      if (!this.isDown) {
        return;
      }
      this.endPoint = {
        x: e.clientX,
        y: e.clientY
      }
      iconsPositionRef.value ={
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
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
    canvasWrapperRef.value.addEventListener('mouseup', e => {
      showIconsRef.value = true;
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
const initCaptureCanvas = (screenWidth = canvasSizeRef.value.width, screenHeight = canvasSizeRef.value.height) => {
  const captureCanvas = new CaptureCanvas(screenWidth, screenHeight)
  captureCanvas.drawBg(screenWidth, screenHeight)
}
onMounted(() => {
  initCaptureCanvas()
})

const icons = [
  {
    icon: Check,
  },
  {
    icon: Close,
  },
];

const iconsPositionRef = ref({
    left: 0,
    top: 0
})
</script>

<template>
  <div class="w-full h-full relative" ref="canvasWrapperRef">
    <canvas class="w-full h-full bg-transparent" ref="canvasRef"></canvas>
    <div class="absolute bg-white -z-1" :style="iconsPositionRef">
      <n-button-group>
        <n-button ghost v-for="item in icons" :key="item.icon">
          <template #icon>
            <component :is="item.icon" theme="outline" size="24" fill="#333"></component>
          </template>
        </n-button>
      </n-button-group>
    </div>
  </div>

</template>

<style scoped>

</style>