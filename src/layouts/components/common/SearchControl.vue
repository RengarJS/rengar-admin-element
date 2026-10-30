<template>
  <ElTooltip v-if="appStore.isPc" placement="bottom" content="搜索">
    <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.openSearchModal">
      <IRiSearchLine></IRiSearchLine>
    </div>
  </ElTooltip>
  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="appStore.openSearchModal">
    <IRiSearchLine></IRiSearchLine>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()
</script>

<style scoped></style>
