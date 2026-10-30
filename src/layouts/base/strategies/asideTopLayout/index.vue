<template>
  <ElContainer direction="vertical" class="overflow-hidden h-screen">
    <ElHeader
      :height="numberToPx(userConfig.headerHeight)"
      class="layout-header"
      :class="{ 'is-inverted': userConfig.invertedHeader }"
    >
      <AppHeader :show-logo="true" :show-aside-control="showAsideControl">
        <SysMenu
          v-if="isPc"
          :inverted="userConfig.invertedHeader"
          mode="horizontal"
          :data="menuStore.menuRoutes"
          children-field="list"
          :selectable-parent="true"
          v-model:active="menuStore.topActiveName"
        />
      </AppHeader>
    </ElHeader>

    <ElContainer class="layout-body">
      <ElAside
        v-if="showAppAside"
        :width="numberToPx(systemConfig.asideCollapse ? systemConfig.asideCollapseWidth : userConfig.asideWidth)"
        class="layout-aside"
        :class="{ 'is-inverted': userConfig.invertedAside }"
      >
        <SysMenu
          :inverted="userConfig.invertedAside"
          v-model:active="menuStore.activeMenu"
          :data="menuStore.subMenuRoutes"
          :collapsed="systemConfig.asideCollapse"
        />
      </ElAside>

      <ElContainer direction="vertical" class="min-w-0">
        <ElHeader v-if="userConfig.showTabs" :height="numberToPx(userConfig.tabHeight)" class="layout-header">
          <AppTabs />
        </ElHeader>

        <ElMain
          class="layout-main"
          :style="layoutContentStyle"
          :ref="(el) => el && appStore.setLayoutContentRef(el as HTMLElement)"
        >
          <AppRouterView v-if="showRouterView" />
        </ElMain>

        <ElFooter v-if="userConfig.showFooter" :height="numberToPx(userConfig.footerHeight)" class="layout-footer">
          <AppFooter />
        </ElFooter>
      </ElContainer>
    </ElContainer>

    <AppConfigDrawer v-model:show="showConfigDrawer" />
    <AppMobieDrawer v-model:show="showMenuDrawer" />
    <AppSearchModal v-model:show="showSearchModal" />
  </ElContainer>
</template>

<script setup lang="ts">
import { useAppStore, useMenuStore } from '@/stores'
import { numberToPx } from '@/utils/tools'
import AppFooter from '@/layouts/components/AppFooter.vue'
import AppTabs from '@/layouts/components/AppTabs.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
import AppRouterView from '@/layouts/components/AppRouterView.vue'
import AppConfigDrawer from '@/layouts/components/AppConfigDrawer.vue'
import AppMobieDrawer from '@/layouts/components/AppMobieDrawer.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'
import AppSearchModal from '@/layouts/components/AppSearchModal.vue'

const appStore = useAppStore()
const { userConfig, systemConfig, showConfigDrawer, showMenuDrawer, showRouterView, isPc, showSearchModal } =
  storeToRefs(appStore)

const layoutContentStyle = computed(() => ({
  padding: numberToPx(userConfig.value.gap),
}))

const menuStore = useMenuStore()

const showAppAside = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length > 0) return true
  return false
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length === 0) return false
  return true
})
</script>

<style scoped>
.layout-body {
  min-height: 0;
  overflow: hidden;
}

.layout-aside {
  flex-shrink: 0;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-menu-bg-color);
  transition: width 0.28s cubic-bezier(0.2, 0, 0, 1);
}

.layout-aside.is-inverted {
  background-color: #0f172a;
}

.layout-header {
  flex-shrink: 0;
  padding: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-menu-bg-color);
}

.layout-header.is-inverted {
  color: #f8fafc;
  background-color: #0f172a;
}

.layout-main {
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.layout-footer {
  flex-shrink: 0;
  padding: 0;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
