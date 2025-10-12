<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import {DrawBoard, Shape} from "~/canvas";
import type {DrawBoardOpt} from "~/canvas";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasBoxRef = ref<HTMLDivElement | null>(null);

const opts: DrawBoardOpt = reactive<DrawBoardOpt>({
  lineWidth: 3,
  lineColor: '#000000',
  shape: Shape.LINE
});

let drawBoard: DrawBoard | null = null;

let observer: ResizeObserver | null = null;

function initDrawBoard() {
  drawBoard = new DrawBoard(canvasRef.value!, opts);
}


watch(opts, () => {
  if (drawBoard) {
    drawBoard.setOpt(opts);
  }
});

function setCanvasSize() {
  if (!canvasBoxRef.value || !canvasRef.value) {
    return;
  }
  let width = canvasBoxRef.value.offsetWidth;
  let height = canvasBoxRef.value.offsetHeight;
  canvasRef.value.width = width;
  canvasRef.value.height = height;
}

function initObserver() {
  if (canvasBoxRef.value) {
    observer = new ResizeObserver(() => {
      setCanvasSize();
    });
    observer.observe(canvasBoxRef.value);
  }
}

onMounted(() => {
  setCanvasSize();
  initObserver();
  initDrawBoard();
});

onUnmounted(() => {
  if (drawBoard) {
    drawBoard.destroy();
  }
});
</script>

<template>
  <div class="canvas-container">
    <div class="canvas-menu">
      <el-form :inline="true">
        <el-form-item label="笔宽">
          <el-select v-model="opts.lineWidth" style="max-width: 120px;min-width: 80px">
            <el-option label="细" :value="1"></el-option>
            <el-option label="标准" :value="3"></el-option>
            <el-option label="加粗" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="形状">
          <el-select v-model="opts.shape" style="max-width: 120px;min-width: 80px">
            <el-option label="线" :value="Shape.LINE"></el-option>
            <el-option label="矩形" :value="Shape.RECT"></el-option>
            <el-option label="圆" :value="Shape.CIRCLE"></el-option>
            <el-option label="椭圆" :value="Shape.ELLIPSE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="笔色">
          <el-color-picker v-model="opts.lineColor"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">导出画板</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="canvas-box" ref="canvasBoxRef">
      <canvas ref="canvasRef" class="canvas"></canvas>
    </div>
  </div>
</template>

<style scoped>
.canvas-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.canvas-box {
  height: 0;
  flex: 1;
  border: var(--el-border-color) solid 1px;
}

.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>