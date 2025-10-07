<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import {highlight, languages} from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import beautify from "js-beautify";

const props = withDefaults(defineProps<{
  title: string;
  code: string,
  result?: string,
}>(), {
  result: ''
});

const showCode = computed(() => {
  return highlighter(beautify(props.code, {
    indent_size: 2,
    space_in_empty_paren: true,
  }));
});

function highlighter(code: string) {
  return highlight(code, languages.js as any, 'js');
}
</script>

<template>
  <el-card class="code-card" shadow="always">
    <template #header>
      {{ title }}
    </template>
    <el-scrollbar>
      <pre v-html="showCode"></pre>
    </el-scrollbar>
    <template v-if="result && result !== ''" #footer>
      运行结果:{{ result }}
    </template>
  </el-card>
</template>

<style scoped>
.code-card {
  height: 100%;
  box-sizing: border-box;
}
</style>