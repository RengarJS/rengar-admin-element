<template>
  <ElSubMenu v-if="children.length" :index="menuIndex">
    <template #title>
      <MenuIcon :options="route.meta" />
      <span>{{ route.meta?.title }}</span>
    </template>
    <SysMenuItem v-for="child in children" :key="String(child.name ?? child.path)" :route="child" :children-field />
  </ElSubMenu>

  <ElMenuItem v-else :index="menuIndex">
    <MenuIcon :options="route.meta" />
    <a v-if="route.meta?.href" :href="route.meta.href" target="_blank">{{ route.meta.title }}</a>
    <RouterLink v-else :to="routeLocation">{{ route.meta?.title }}</RouterLink>
  </ElMenuItem>
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
</script>
