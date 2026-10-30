<template>
  <div v-if="appStore.userConfig.showWaterMark" class="pointer-events-none fixed inset-0 z-50">
    <ElWatermark
      :content="content"
      :font="watermarkFont"
      :gap="[320, 200]"
      :width="320"
      :height="200"
      :offset="[12, 60]"
      :rotate="-15"
      class="h-full w-full"
    >
      <div class="h-full w-full"></div>
    </ElWatermark>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'

const content = import.meta.env.VITE_APP_TITLE

const appStore = useAppStore()
const watermarkFont = computed(() => ({
  fontSize: 16,
  color: appStore.theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.15)',
}))
</script>
