<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">

</script>

<template>
  <div class="app-icon">
    <img src="/img/app_icon.jpeg" alt="商标01">
    <img src="/img/app.png" alt="商标02">
  </div>
</template>

<style scoped>
.app-icon > img:first-child {
  border-radius: 50%;
  height: 50%;
}

.app-icon > img:last-child {
  height: 65%;
}

.app-icon {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>