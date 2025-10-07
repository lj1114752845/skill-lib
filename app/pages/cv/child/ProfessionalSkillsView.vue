<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">

import type {SkillModel} from "~/models/resume/skill-model.ts";

withDefaults(defineProps<{
  data: SkillModel[],
}>(), {});


function formatTime(num: number): string {
  if (num < 12) {
    return `${num}个月`
  }
  return `${Math.round(num / 12)}年`;
}
</script>

<template>
  <div class="professional-skills-view">
    <template v-for="item of data">
      <div class="item-view">
        <div>{{ item.name }}</div>
        <div>{{ item.level }}</div>
        <div>{{ formatTime(item.often) }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.item-view {
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 10px;
  background-color: var(--el-bg-color);
}

.professional-skills-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1px;
  padding: 1px;
  background-color: var(--el-border-color);
}
</style>