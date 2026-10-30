<template>
  <ElSubMenu v-if="children.length" :index="menuIndex">
    <template #title>
      <MenuIcon :options="route.meta" />
      <span>{{ route.meta?.title }}</span>
    </template>
    <SysMenuItem v-for="child in children" :key="String(child.name ?? child.path)" :route="child" :children-field />
  </ElSubMenu>

  <ElMenuItem v-else-if="route.meta?.href" :index="menuIndex" @click="handleOpenExternal">
    <MenuIcon :options="route.meta" />
    <span>{{ route.meta?.title }}</span>
  </ElMenuItem>

  <RouterLink v-else :to="routeLocation" custom v-slot="{ navigate }">
    <ElMenuItem :index="menuIndex" @click="navigate()">
      <MenuIcon :options="route.meta" />
      <span>{{ route.meta?.title }}</span>
    </ElMenuItem>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

defineOptions({
  name: 'SysMenuItem',
})

const props = withDefaults(
  defineProps<{
    route: RouteRecordRaw
    childrenField?: string
  }>(),
  {
    childrenField: 'children',
  },
)

const routeRecord = computed(() => props.route as RouteRecordRaw & Record<string, unknown>)
const children = computed(() => {
  const customChildren = routeRecord.value[props.childrenField]
  if (Array.isArray(customChildren)) return customChildren as RouteRecordRaw[]
  return props.route.children ?? []
})

const menuIndex = computed(() => String(props.route.meta?.activeMenu ?? props.route.name ?? props.route.path))
const routeLocation = computed<RouteLocationRaw>(() => ({ name: props.route.name as RouteRecordName }))

function handleOpenExternal() {
  const href = routeRecord.value.meta?.href
  if (typeof href === 'string') window.open(href, '_blank', 'noopener,noreferrer')
}
</script>
