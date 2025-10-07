<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import JsFormatCard from "~/components/js-format-card.vue";
import {JsData, JsViewModel} from "~/viewmodels/js-viewmodel";
import {reactive} from "vue";

useHead({
  title: 'TS/JS',
  meta: [
    {name: 'description', content: 'TS/JS的技术点总结'}
  ],
});

const data = reactive(new JsData());

const vm = new JsViewModel(data);

init();

function init() {
  vm.getIntvqList();
}


</script>

<template>
  <el-row v-if="data.dataList.length > 0" :gutter="20" class="code-row">
    <template v-for="item of data.dataList">
      <el-col :xl="6" :lg="8" :md="12" :sm="24" :xs="24">
        <js-format-card :title="item.title" :code="item.code" :result="item.result"/>
      </el-col>
    </template>
  </el-row>
  <div v-else>
    <el-empty :description="data.err === '' ? '空数据':data.err"/>
  </div>
</template>

<style scoped>
.code-row .el-col {
  margin-bottom: 20px;
}
</style>