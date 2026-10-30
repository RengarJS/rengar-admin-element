<template>
  <div class="app-route-loading-bar" :class="{ 'app-route-loading-bar--visible': visible }" aria-hidden="true">
    <ElProgress :percentage="percentage" :status="status" :stroke-width="2" :show-text="false" />
  </div>
</template>

<script setup lang="ts">
import { ElProgress } from 'element-plus'

defineOptions({ name: 'AppRouteLoadingBar' })

interface Props {
  visible: boolean
  percentage: number
  status?: 'exception'
}

defineProps<Props>()
</script>

<style scoped>
.app-route-loading-bar {
  position: fixed;
  z-index: 3000;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.app-route-loading-bar--visible {
  opacity: 1;
}

:deep(.el-progress),
:deep(.el-progress-bar) {
  width: 100%;
  height: 2px;
}

:deep(.el-progress-bar__outer) {
  height: 2px !important;
  background-color: transparent;
  border-radius: 0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 0;
  transition: width 200ms ease;
}
</style>
