<script setup lang="ts">
import Logo from "~/components/logo.vue";
import Light from "~/components/light.vue";
import Dark from "~/components/dark.vue";
import AppMenu from "~/components/app-menu.vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import Github from "~/components/github.vue";
import {Utils} from "~/utils/utils";

const phoneMenuRef = ref();
const swRef = ref();

const tourOpenRef = ref(false);
const menuDrawer = ref(false);
const isDark = ref(false);

function menuIconEvent() {
  menuDrawer.value = !menuDrawer.value;
}

function changeSkin() {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function checkTour() {
  const tour = localStorage.getItem('tour') ?? '';
  if (tour === '') {
    tourOpenRef.value = Utils.isMobile();
    localStorage.setItem("tour", 'true');
  }

}

onMounted(() => {
  changeSkin();
  checkTour();
});
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <menu-icon ref="phoneMenuRef" class="app-menu-icon" @click="menuIconEvent"/>
      <logo class="app-logo"></logo>
      <div class="header-fill"></div>
      <el-switch v-model="isDark" ref="swRef" class="skin" size="large" :active-action-icon="Dark"
                 :inactive-action-icon="Light"
                 @change="changeSkin"></el-switch>
      <Github/>
    </el-header>
    <el-container class="main-container">
      <el-aside class="app-aside">
        <app-menu/>
      </el-aside>
      <el-main>
        <nuxt-page/>
      </el-main>
    </el-container>
  </el-container>
  <el-drawer v-model="menuDrawer" direction="ltr" size="60%">
    <app-menu @item="()=>menuDrawer = false"/>
  </el-drawer>
  <el-tour v-model="tourOpenRef">
    <el-tour-step :target="phoneMenuRef?.$el" description="在这里打开菜单" title="提示" :prev-button-props="{children:'上一步'}" :next-button-props="{children:'下一步'}">
    </el-tour-step>
    <el-tour-step :target="swRef?.$el" title="提示" :prev-button-props="{children:'上一步'}" :next-button-props="{children:'完成'}">
      <el-text>切换皮肤</el-text>
    </el-tour-step>
  </el-tour>
</template>

<style scoped>
.skin :deep(.el-switch__core) {
  background: var(--el-bg-color-page);
}

.skin {
  --el-switch-on-color: var(--el-bg-color-page);
  --el-switch-off-color: var(--el-text-color-primary);
  --el-switch-border-color: var(--el-border-color-darker);
  margin-right: 15px;
}

.header-fill {
  width: 0;
  flex: 1;
}

.app-container {
  height: 100%;
}

.main-container {
  flex: 1;
  height: 0;
}

@media screen and (min-width: 850px) {
  .app-aside {
    display: block;
  }


  .app-menu-icon {
    display: none;
  }
}

@media screen and (max-width: 850px) {
  .app-aside {
    display: none;
  }


  .app-menu-icon {
    display: block;
  }
}

.app-aside {
  width: 180px;
  border-right: 1px solid var(--el-border-color);
  padding-top: 20px;
}


/* 头部样式 */
.app-header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}


</style>
