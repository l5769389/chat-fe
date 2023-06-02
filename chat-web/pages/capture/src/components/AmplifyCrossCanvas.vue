<script setup>
const amplifyCrossCanvasRef = ref();
let amplifyCanvas

class AmplifyCanvas {
  ctx = null;
  crossRectSize = {
    width: 150,
    height: 150
  }

  constructor(width = 150, height = 150) {
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

onMounted(() => {
  amplifyCanvas = new AmplifyCanvas(150, 150)
  amplifyCanvas.drawCross();
})

</script>

<template>
  <canvas class="absolute z-20" ref="amplifyCrossCanvasRef"></canvas>

</template>

<style scoped>

</style>