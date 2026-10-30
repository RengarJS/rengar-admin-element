<template>
  <ElMenu
    ref="menuRef"
    :default-active="activeIndex"
    :collapse="Boolean(collapsed)"
    :background-color="appStore.userConfig.invertedAside ? '#0f172a' : undefined"
    :text-color="appStore.userConfig.invertedAside ? '#f8fafc' : undefined"
    active-text-color="var(--el-color-primary)"
    class="border-0"
    @select="handleValueChange"
  >
    <SysMenuItem v-for="route in data" :key="String(route.name ?? route.path)" :route />
  </ElMenu>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores'
import SysMenuItem from '@/layouts/components/common/SysMenuItem.vue'
const appStore = useAppStore()

const emit = defineEmits<{
  change: [val: RouteRecordName]
}>()

const { data, collapsed = false } = defineProps<{
  data: RouteRecordRaw[]
  collapsed?: boolean
}>()

const value = defineModel<RouteRecordName>('active')
const menuRef = ref<{ updateActiveIndex: (index: string) => void }>()
const activeIndex = computed(() => String(value.value ?? ''))

function handleValueChange(val: RouteRecordName) {
  value.value = val
  emit('change', val)
}

watch(activeIndex, (index) => menuRef.value?.updateActiveIndex(index), { flush: 'post' })
</script>

<style scoped></style>
