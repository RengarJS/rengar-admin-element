<template>
  <ElMenu
    ref="menuRef"
    :default-active="activeIndex"
    :mode
    :collapse="mode === 'vertical' && Boolean(collapsed)"
    :collapse-transition="true"
    :ellipsis="mode === 'horizontal'"
    :background-color="inverted ? '#0f172a' : undefined"
    :text-color="inverted ? '#f8fafc' : undefined"
    active-text-color="var(--el-color-primary)"
    class="sys-menu border-0"
    @select="handleValueChange"
  >
    <SysMenuItem
      v-for="route in data"
      :key="String(route.name ?? route.path)"
      :route
      :children-field
      :selectable-parent
    />
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
  selectableParent = false,
} = defineProps<{
  mode?: 'horizontal' | 'vertical'
  data: RouteRecordRaw[]
  collapsed?: boolean
  childrenField?: string
  inverted?: boolean
  selectableParent?: boolean
}>()

const value = defineModel<RouteRecordName>('active')
const menuRef = ref<{ updateActiveIndex: (index: string) => void }>()
const activeIndex = computed(() => String(value.value ?? ''))

function handleValueChange(val: string) {
  const routeName = val as RouteRecordName
  value.value = routeName
  emit('change', routeName)
}

watch(activeIndex, (index) => menuRef.value?.updateActiveIndex(index), { flush: 'post' })
</script>

<style scoped>
.sys-menu {
  border-right: none;
}

.sys-menu.el-menu--horizontal {
  flex: 1;
  width: 100%;
  min-width: 0;
  height: 100%;
  border-bottom: none;
}

.sys-menu.el-menu--horizontal :deep(.el-menu-item),
.sys-menu.el-menu--horizontal :deep(.el-sub-menu__title) {
  border-bottom: 2px solid transparent;
}
</style>
