<template>
  <ElTooltip v-if="appStore.isPc" placement="bottom">
    <template #content>
      <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
    </template>
    <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="toggle">
      <IOouiExitFullscreen v-if="isFullscreen"></IOouiExitFullscreen>
      <IOouiFullScreen v-else></IOouiFullScreen>
    </div>
  </ElTooltip>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/stores'
const appStore = useAppStore()
const { isFullscreen, toggle } = useFullscreen()
</script>

<style scoped></style>
