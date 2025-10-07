<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
useHead({
  title: 'WebWork',
  meta: [
    {name: 'description', content: 'WebWork的应用'}
  ],
})

const progressRef = ref(0);
const sliderRef = ref(50);
const isStartRef = ref(false);
const data = reactive({
  min: 0,
  max: 0,
  size: 0,
});

let webWorker: Worker | null;

function exec() {
  if (isStartRef.value) {
    isStartRef.value = false;
    sliderRef.value = 50;
    progressRef.value = 0;
    data.size = 0;
    data.max = 0;
    data.min = 0;
    webWorker?.postMessage({type: 'stop'})
    webWorker?.terminate();
    webWorker = null;
  } else {
    webWorker = new Worker(new URL('~/workers/workers.js', import.meta.url));
    //
    webWorker.postMessage({type: ''})
    webWorker.addEventListener('message', (e) => {
      switch (e.data.type) {
        case 'progress':
          progressRef.value = e.data.value;
          break;
        case 'complete':
          data.size = e.data.size;
          data.min = e.data.min;
          data.max = e.data.max;
          isStartRef.value = false;
          ElMessage.success('计算完成');
          break;
      }
    });
    isStartRef.value = true;
  }
}

onUnmounted(() => {
  if (webWorker) {
    webWorker.terminate();
    webWorker = null;
  }
});
</script>

<template>
  <div class="web-worker-container">
    <h1>WebWorker获取偶数演示</h1>
    <h3>这个演示使用WebWorker在后台计算1至Number.MAX_SAFE_INTEGER之间的所有偶数。
      计算过程中可以拖动下方滑块，证明UI不会被阻塞。</h3>
    <el-button :type="isStartRef ? 'danger':'primary'" @click="exec">{{ isStartRef ? '停止计算' : '开始计算' }}
    </el-button>
    <el-progress style="width: 80%;" :text-inside="true" :stroke-width="26" :percentage="progressRef"/>
    <h4>计算结果</h4>
    <p>
      1-1000000025 之间偶数共:{{ data.size }}个<br/>
      最小的偶数:{{ data.min }}<br/>
      最大的偶数:{{ data.max }}<br/>
    </p>
    <h4>计算结果</h4>
    <p>计算过程中可拖动滑块没有阻塞UI</p>
    <el-slider style="width: 50%;" v-model="sliderRef"/>
  </div>
</template>

<style scoped>


.web-worker-container h3 {
  color: var(--el-text-color-regular);
}

.web-worker-container h1 {
  color: var(--el-color-primary);
}

.web-worker-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: var(--el-text-color-primary);
}
</style>