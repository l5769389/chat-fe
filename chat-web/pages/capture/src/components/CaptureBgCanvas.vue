<script setup>
const canvasSizeRef = inject('screenSize')
const bgImgDataUrl = inject('bgImgDataUrl')
const scaleFactor = inject('scaleFactor')
const captureBgCanvasRef = ref()

class CaptureBgCanvas {
  ctx = null
  constructor(width = canvasSizeRef.value.width * scaleFactor, height = canvasSizeRef.value.height * scaleFactor) {
    this.ctx = captureBgCanvasRef.value.getContext('2d')
    captureBgCanvasRef.value.width = width
    captureBgCanvasRef.value.height = height
  }

  img2canvas(img) {
    this.ctx.drawImage(img, 0, 0)
  }

  getPixelData(x, y, w = 1, h = 1) {
    const imgData = this.ctx.getImageData(x, y, w, h).data;
    return `${imgData[0]},${imgData[1]},${imgData[2]}`
  }
}
let captureBgCanvas = ref(null);
const setBgImg = () => {
  const img = new Image()
  captureBgCanvas.value = new CaptureBgCanvas()
  img.src = bgImgDataUrl.value
  img.onload = () => {
    console.log('loaded')
    captureBgCanvas.value.img2canvas(img)
  }
}
onMounted(() => {
  setBgImg()
})

defineExpose({
  captureBgCanvas
})
</script>

<template>
  <canvas ref="captureBgCanvasRef" class="z-30"></canvas>
</template>

<style scoped>

</style>