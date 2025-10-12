<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();

const emit = defineEmits(['item']);

function menuEvent(event: PointerEvent) {
  const a = (event.target as HTMLDivElement).closest('a');
  if (a) {
    emit('item', a.href);
  }
}
</script>

<template>
  <div class="app-menu" @click="menuEvent">
    <nuxt-link to="/" :class="{ 'active-link': route.path === '/' }">
      我的简历
    </nuxt-link>
    <nuxt-link to="/js" :class="{ 'active-link': route.path === '/js' }">
      技术点
    </nuxt-link>
    <nuxt-link to="/nuxtwidget" :class="{ 'active-link': route.path === '/nuxtwidget' }">
      Nuxt原生组件
    </nuxt-link>
    <nuxt-link to="/websocket" :class="{ 'active-link': route.path === '/websocket' }">
      WebSocket聊天室
    </nuxt-link>
    <nuxt-link to="/webworke" :class="{ 'active-link': route.path === '/webworke' }">
      WebWorker测试
    </nuxt-link>
    <nuxt-link to="/canvas" :class="{ 'active-link': route.path === '/canvas' }">
      canvas画板
    </nuxt-link>
  </div>
</template>

<style scoped>

.app-menu a {
  text-decoration: none;
  color: var(--el-text-color-regular);
  padding: 8px 16px;
  margin: 0 8px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

/* 激活链接样式 */
.app-menu a.active-link {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
  font-weight: 500;
}

.app-menu a:hover:not(.active-link) {
  background-color: transparent;
}

.app-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

</style>