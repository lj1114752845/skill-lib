<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">

import {NwData, NwViewModel} from "~/viewmodels/nw-viewmodel";
import {highlight, languages} from "prismjs";
import beautify from "js-beautify";

useHead({
  title: 'nuxt组件',
  meta: [
    {name: 'description', content: 'nuxt的组件介绍页'}
  ],
})
const data: NwData = reactive({
  dataList: [],
  err: ''
});

const vm = new NwViewModel(data);

init();

function init() {
  vm.getWidgets();
}

function formatCode(code: string) {
  return highlight(beautify(code, {
    indent_size: 2,
    space_in_empty_paren: true,
  }), languages.js as any, 'js')
}

</script>

<template>
  
  <el-collapse>
    <template v-for="item of data.dataList">
      <el-collapse-item :title="item.name" :name="item.id">
        <div v-html="`<p>${formatCode(item.code)}</p>`"></div>
        <p class="desc">{{ item.desc }}</p>
      </el-collapse-item>
    </template>
  </el-collapse>
</template>

<style scoped>
.desc {
  font-size: 14px;
  color: var(--el-color-primary);
}
</style>