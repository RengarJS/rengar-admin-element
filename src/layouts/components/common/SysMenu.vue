<template>
  <ElMenu
    ref="menuRef"
    :default-active="activeIndex"
    :mode
    :collapse="mode === 'vertical' && Boolean(collapsed)"
    :background-color="inverted ? '#0f172a' : undefined"
    :text-color="inverted ? '#f8fafc' : undefined"
    active-text-color="var(--el-color-primary)"
    class="border-0"
    @select="handleValueChange"
  >
    <SysMenuItem v-for="route in data" :key="String(route.name ?? route.path)" :route :children-field />
  </ElMenu>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import SysMenuItem from './SysMenuItem.vue'

const emit = defineEmits<{
  change: [val: RouteRecordName]
}>()

const {
  childrenField = 'children',
  mode = 'vertical',
  data,
  collapsed,
  inverted = false,
} = defineProps<{
  mode?: 'horizontal' | 'vertical'
  data: RouteRecordRaw[]
  collapsed?: boolean
  childrenField?: string
  inverted?: boolean
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
