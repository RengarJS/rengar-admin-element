<template>
  <ElContainer class="overflow-hidden h-screen">
    <ElAside
      v-if="isPc"
      :width="numberToPx(systemConfig.asideCollapse ? systemConfig.asideCollapseWidth : userConfig.asideWidth)"
      class="layout-aside"
      :class="{ 'is-inverted': userConfig.invertedAside }"
    >
      <div class="h-full w-full flex flex-col">
        <div
          :style="{
            height: numberToPx(userConfig.headerHeight),
          }"
        >
          <SysLogo :show-title="!systemConfig.asideCollapse" />
        </div>

        <div class="hidden-scrollbar min-h-0 flex-1 overflow-y-auto">
          <SysMenu
            :inverted="userConfig.invertedAside"
            v-model:active="menuStore.activeMenu"
            :data="menuStore.menuRoutes"
            :collapsed="systemConfig.asideCollapse"
          />
        </div>
      </div>
    </ElAside>
    <ElContainer direction="vertical" class="min-w-0">
      <ElHeader
        :height="numberToPx(userConfig.headerHeight)"
        class="layout-header"
        :class="{ 'is-inverted': userConfig.invertedHeader }"
      >
        <AppHeader :show-logo="!isPc" :show-aside-control="showAsideControl">
          <AppBreadcrumb v-if="showAppBreadcrumb" />
        </AppHeader>
      </ElHeader>
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
import AppBreadcrumb from '@/layouts/components/AppBreadcrumb.vue'
import SysLogo from '@/layouts/components/common/SysLogo.vue'
import SysMenu from '@/layouts/components/common/SysMenu.vue'
import AppSearchModal from '@/layouts/components/AppSearchModal.vue'

const menuStore = useMenuStore()

const appStore = useAppStore()
const { userConfig, systemConfig, showConfigDrawer, isMobile, showMenuDrawer, showRouterView, isPc, showSearchModal } =
  storeToRefs(appStore)

const layoutContentStyle = computed(() => {
  const style = {
    padding: numberToPx(userConfig.value.gap),
  }
  return style
})

const showAppBreadcrumb = computed(() => {
  if (!userConfig.value.showBreadcrumb) return false
  if (isMobile.value) return false
  return true
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  return true
})
</script>

<style scoped>
.layout-aside {
  flex-shrink: 0;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 0.2s ease;
}

.layout-aside.is-inverted {
  background-color: #0f172a;
}

.layout-header {
  flex-shrink: 0;
  padding: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
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
