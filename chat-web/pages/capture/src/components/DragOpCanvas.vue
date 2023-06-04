<script setup>
import _ from "lodash";
import {Check, Close, RectangleOne} from '@icon-park/vue-next'
import {ipcRenderer} from "electron";

const canvasRef = ref(null);
const canvasWrapperRef = ref(null);
const canvasSizeRef = inject('screenSize')
const showIconsRef = ref(false)
const showIcons = () => {
  showIconsRef.value = true
}
const hideIcons = () => {
  showIconsRef.value = false
}

const cursorStatusRef = ref('')


class CaptureCanvas {
  ctx = null;
  width = 0
  height = 0;
  isDown = false; // 鼠标是否按下
  isMoved = false; //是否拖动过，用来辅助判断是否有绘制出的图形
  isDrawed = false; // 是否已经有绘制出来的图形。那么再次按下就是拖动。
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
      hideIcons()
      // 要修改框选区域的位置
      if (this.isDrawed) {
        console.log(this.confirmCursorPosition(e.clientX, e.clientY))
        return;
      }
      // 第一次拖动中
      if (!this.isDown) {
        return;
      }
      this.endPoint = {
        x: e.clientX,
        y: e.clientY
      }
      iconsPositionRef.value = {
        left: `${e.clientX - 100}px`,
        top: `${e.clientY + 10}px`
      }
      this.clearRect()
      this.drawBg(canvasSizeRef.value.width, canvasSizeRef.value.height)
      this.isMoved = true;
      this.drawRect({
        lt: this.startPoint,
        rb: this.endPoint,
        strokeStyle: 'blue',
        needClear: true
      })
    }, 16.6))
    canvasWrapperRef.value.addEventListener('mouseup', e => {
      if (this.isMoved) {
        this.isDrawed = true
      }
      showIcons()
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

  confirmCursorPosition(x, y) {
    const flag = (this.startPoint.x - x) * (this.endPoint.x - x) <= 0 && (this.startPoint.y - y) * (this.endPoint.y - y) <= 0;
    if (flag) {
      cursorStatusRef.value = 'move'
    } else {
      cursorStatusRef.value = ''
    }
    return flag;
  }
}

const initCaptureCanvas = (screenWidth = canvasSizeRef.value.width, screenHeight = canvasSizeRef.value.height) => {
  const captureCanvas = new CaptureCanvas(screenWidth, screenHeight)
  captureCanvas.drawBg(screenWidth, screenHeight)
}
onMounted(() => {
  initCaptureCanvas()
})

const cancelCapture = () => {
  ipcRenderer.send('capture-cancel')
}
const saveCapture = () => {
}

const icons = [
  {
    icon: RectangleOne,
    handler: cancelCapture
  },
  {
    icon: Close,
    handler: cancelCapture
  },
  {
    icon: Check,
    handler: saveCapture
  },
];

const iconsPositionRef = ref({
  left: 0,
  top: 0
})
</script>

<template>
  <div class="w-full h-full relative" ref="canvasWrapperRef">
    <canvas class="w-full h-full bg-transparent test" ref="canvasRef"></canvas>
    <div class="absolute bg-white -z-1" :style="iconsPositionRef">
      <n-button-group>
        <n-button ghost v-for="item in icons" :key="item.icon" @click="item.handler">
          <template #icon>
            <component :is="item.icon" theme="outline" size="24" fill="#333"></component>
          </template>
        </n-button>
      </n-button-group>
    </div>
  </div>

</template>

<style scoped>
  .test{
    @apply cursor-move;
  }
</style>