<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import type {EChartsType} from "echarts";
import * as echarts from 'echarts';

const prop = withDefaults(defineProps<{
  option: Record<string, any>
}>(), {});

const chartSkillRef = ref();

let chart: EChartsType | null = null;

watch(chartSkillRef, () => {
  chart = echarts.init(chartSkillRef.value);
  chart.setOption(prop.option);
}, {once: true});

watch(prop, () => {
  if (chart) {
    chart.setOption(prop.option);
  }
});

function redraw() {
  if (chart) {
    chart.resize();
  }
}

onMounted(() => {
  window.addEventListener('resize', redraw);
});

onUnmounted(() => {
  window.removeEventListener('resize', redraw);
});

</script>

<template>
  <div ref="chartSkillRef" class="chart-item"></div>
</template>

<style scoped>


/* 当视口高度 > 宽度时（竖屏）生效 */
@media (orientation: portrait) {
  .chart-item {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
}

/* 反之，宽度 > 高度时（横屏）生效 */
@media (orientation: landscape) {
  .chart-item {
    width: 60%;
    aspect-ratio: 1 / 1;
  }
}
</style>