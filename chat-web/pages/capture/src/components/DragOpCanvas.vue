<script setup>
import _ from "lodash";
import {Check, Close, RectangleOne} from '@icon-park/vue-next'
import {ipcRenderer} from "electron";

const bgImgDataUrl = inject('bgImgDataUrl')
const scaleFactor = inject('scaleFactor')
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
let iconsPosition = {
  x: 0,
  y: 0
}
let captureCanvas = null;

class CaptureCanvas {
  ctx = null;
  width = 0
  height = 0;
  isDown = false; // 鼠标是否按下
  isMoving = false; //是否拖动过，用来辅助判断是否有绘制出的图形
  isDrawed = false; // 是否已经有绘制出来的图形。那么再次按下就是拖动。
  dragStartPoint = {
    x: 0,
    y: 0,
  }
  dragEndPoint = {
    x: 0,
    y: 0,
  }
  prePosition = {
    x: 0,
    y: 0
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
      if (this.isDrawed) {
        this.prePosition = {
          x: e.clientX,
          y: e.clientY
        }
      } else {
        this.dragStartPoint.x = e.clientX
        this.dragStartPoint.y = e.clientY
      }
    })
    canvasWrapperRef.value.addEventListener('mousemove', _.throttle(e => {
      hideIcons()
      this.confirmCursorPosition(e.clientX, e.clientY)
      if (!this.isDown) {
        return;
      }
      // 要修改框选区域的位置
      if (this.isDrawed) {
        this.moveRect(e)
        return;
      }
      this.dragRect(e)
    }, 16.6))
    canvasWrapperRef.value.addEventListener('mouseup', e => {
      if (this.isMoving) {
        this.isMoving = false
        this.isDrawed = true
      }
      showIcons()
      this.isDown = false;
    })
  }

  dragRect(e) {
    this.dragEndPoint = {
      x: e.clientX,
      y: e.clientY
    }

    this.moveIcons(e.clientX, e.clientY)
    this.clearRect()
    this.drawBg(canvasSizeRef.value.width, canvasSizeRef.value.height)
    this.isMoving = true;
    this.drawRect({
      lt: this.dragStartPoint,
      rb: this.dragEndPoint,
      strokeStyle: 'blue',
      needClear: true
    })
  }

  moveIcons(x, y) {
    const left = x - 100;
    const top = y + 10;
    iconsPosition = {
      x: x,
      y: y
    }
    iconsPositionRef.value = {
      left: `${left}px`,
      top: `${top}px`
    }
  }

  moveRect(e) {
    const moveDelta = {
      x: e.clientX - this.prePosition.x,
      y: e.clientY - this.prePosition.y,
    }
    this.dragStartPoint = {
      x: this.dragStartPoint.x + moveDelta.x,
      y: this.dragStartPoint.y + moveDelta.y
    }
    this.dragEndPoint = {
      x: this.dragEndPoint.x + moveDelta.x,
      y: this.dragEndPoint.y + moveDelta.y
    }
    this.moveIcons(iconsPosition.x + moveDelta.x, iconsPosition.y + moveDelta.y)
    this.prePosition = {
      x: e.clientX,
      y: e.clientY
    }
    this.clearRect()
    this.drawBg(canvasSizeRef.value.width, canvasSizeRef.value.height)
    this.drawRect({
      lt: this.dragStartPoint,
      rb: this.dragEndPoint,
      strokeStyle: 'blue',
      needClear: true
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
    const flag = (this.dragStartPoint.x - x) * (this.dragEndPoint.x - x) <= 0 && (this.dragStartPoint.y - y) * (this.dragEndPoint.y - y) <= 0;
    if (flag) {
      cursorStatusRef.value = 'move'
    } else {
      cursorStatusRef.value = ''
    }
    return flag;
  }
}

const imgShow = ref()

const initCaptureCanvas = (screenWidth = canvasSizeRef.value.width, screenHeight = canvasSizeRef.value.height) => {
  captureCanvas = new CaptureCanvas(screenWidth, screenHeight)
  captureCanvas.drawBg(screenWidth, screenHeight)
}

onMounted(() => {
  initCaptureCanvas()
})

const cancelCapture = () => {
  ipcRenderer.send('capture-cancel')
}

const saveCapture = () => {
  const img = new Image()
  img.src = bgImgDataUrl.value;
  img.onload = () => {
    const canvas1 = document.createElement('canvas')
    const ctx1 = canvas1.getContext('2d')
    canvas1.width = img.width / scaleFactor.value;
    canvas1.height = img.height / scaleFactor.value;
    console.log(canvas1.width, canvas1.height)
    ctx1.drawImage(img, 0, 0)

    const dragStartX = Math.abs(captureCanvas.dragStartPoint.x)
    const dragStartY = Math.abs(captureCanvas.dragStartPoint.y)
    const dragEndX = Math.abs(captureCanvas.dragEndPoint.x)
    const dragEndY = Math.abs(captureCanvas.dragEndPoint.y)
    console.log(captureCanvas.dragStartPoint, captureCanvas.dragEndPoint)
    let startX, startY
    if (dragStartX < dragEndX) {
      startX = dragStartX
    } else {
      startX = dragEndX
    }
    if (dragStartY < dragEndY) {
      startY = dragStartY
    } else {
      startY = dragEndY
    }
    const width = Math.abs(dragEndX - dragStartX)
    const height = Math.abs(dragEndY - dragStartY)
    const captureImg = ctx1.getImageData(startX * scaleFactor.value, startY * scaleFactor.value, width * scaleFactor.value, height * scaleFactor.value)
    const canvas2 = document.createElement('canvas')
    const ctx2 = canvas2.getContext('2d')
    canvas2.width = width * scaleFactor.value;
    canvas2.height = height * scaleFactor.value;
    ctx2.putImageData(captureImg, 0, 0)
    imgShow.value.src = canvas2.toDataURL()
    imgShow.value.style.transform = `scale(${1 / scaleFactor.value})`
  }
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
    <canvas class="w-full h-full bg-transparent" :class="cursorStatusRef === 'move' ? 'move': ''"
            ref="canvasRef"></canvas>
    <div class="absolute bg-white -z-1" :style="iconsPositionRef">
      <n-button-group>
        <n-button ghost v-for="item in icons" :key="item.icon" @click="item.handler">
          <template #icon>
            <component :is="item.icon" theme="outline" size="24" fill="#333"></component>
          </template>
        </n-button>
      </n-button-group>
    </div>
    <img id="test" ref="imgShow" class="absolute" style="bottom: 20px; right: 20px">
  </div>

</template>

<style scoped>
.move {
  @apply cursor-move;
}
</style>