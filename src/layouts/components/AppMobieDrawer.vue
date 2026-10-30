<template>
  <ElDrawer v-model="show" direction="ltr" size="80%" title="系统菜单">
    <SysMenu v-model:active="menuStore.activeMenu" :data="menuStore.menuRoutes" @change="handleMenuChange" />
  </ElDrawer>
</template>

<script setup lang="ts">
import SysMenu from './common/SysMenu.vue'
import { useMenuStore, useAppStore } from '@/stores'
const show = defineModel<boolean>('show', {
  required: true,
})

const menuStore = useMenuStore()
const appStore = useAppStore()

function handleMenuChange() {
  appStore.toggleMenuDrawer(false)
}
</script>

<style scoped></style>
