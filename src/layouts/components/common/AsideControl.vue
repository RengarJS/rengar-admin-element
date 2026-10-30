<template>
  <ElTooltip placement="bottom">
    <template #content>
      <span>{{ appStore.systemConfig.asideCollapse ? '展开菜单' : '收起菜单' }}</span>
    </template>
    <div class="flex-center p-1 hover:bg-primary-100 dark:hover:bg-primary-700">
      <ILineMdMenuUnfoldLeft
        v-if="!appStore.systemConfig.asideCollapse"
        icon="i-line-md:menu-unfold-left"
        class="cursor-pointer text-xl text-primary"
        @click="appStore.toggleAsideCollapse"
      ></ILineMdMenuUnfoldLeft>

      <ILineMdMenuUnfoldRight
        v-else
        icon="i-line-md:menu-unfold-right"
        class="cursor-pointer text-2xl text-primary"
        @click="appStore.toggleAsideCollapse"
      ></ILineMdMenuUnfoldRight>
    </div>
  </ElTooltip>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
