<template>
  <ElContainer class="overflow-hidden h-screen">
    <ElAside
      v-if="isPc"
      :width="
        numberToPx(systemConfig.asideCollapse ? systemConfig.asideCollapseWidth : systemConfig.doubleFirstAideWidth)
      "
      class="layout-aside"
      :class="{ 'is-inverted': userConfig.invertedAside }"
      :style="{ zIndex: 2 }"
    >
      <div class="h-full w-full flex flex-col">
        <div :style="{ height: numberToPx(userConfig.headerHeight) }">
          <SysLogo :show-title="false" />
        </div>

        <div class="hidden-scrollbar min-h-0 flex-1 overflow-y-auto">
          <SysMenu
            :inverted="userConfig.invertedAside"
            v-model:active="menuStore.topActiveName"
            :data="menuStore.menuRoutes"
            @change="handleFirstLevenChange"
          />
        </div>
      </div>
    </ElAside>

    <ElAside
      v-if="isPc && userConfig.fixedSubMenu && showSecondAside"
      :width="numberToPx(systemConfig.asideCollapse ? systemConfig.asideCollapseWidth : userConfig.asideWidth)"
      class="layout-aside"
      :class="{ 'is-inverted': userConfig.invertedAside }"
      :style="{ zIndex: 2 }"
    >
      <div class="h-full w-full flex flex-col">
        <div :style="{ height: numberToPx(userConfig.headerHeight) }">
          <div class="h-full flex items-center justify-between px-4">
            <SysLogo v-if="!systemConfig.asideCollapse" :show-logo="false" />
            <div class="px-2">
              <ElTooltip content="取消固定" placement="bottom">
                <button
                  type="button"
                  class="flex-center p-1"
                  aria-label="取消固定子菜单"
                  @click="toggleFixedSubMenu(false)"
                >
                  <i class="i-pixel:thumbtack-solid cursor-pointer text-xl text-primary"></i>
                </button>
              </ElTooltip>
            </div>
          </div>
        </div>

        <div class="hidden-scrollbar min-h-0 flex-1 overflow-y-auto">
          <SysSubMenu
            :data="menuStore.subMenuRoutes"
            v-model:active="menuStore.activeMenu"
            :collapsed="appStore.systemConfig.asideCollapse"
          />
        </div>
      </div>
    </ElAside>

    <ElContainer direction="vertical" class="layout-main-container min-w-0">
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

      <div
        v-if="isPc && showSubMenu && !userConfig.fixedSubMenu && showSecondAside"
        ref="target"
        class="floating-submenu shadow-lg"
        :style="{ width: numberToPx(userConfig.asideWidth) }"
      >
        <ElHeader
          :height="numberToPx(userConfig.headerHeight)"
          class="layout-header"
          :class="{ 'is-inverted': userConfig.invertedAside }"
        >
          <div class="h-full flex items-center justify-between px-4">
            <SysLogo :show-logo="false" />
            <div class="px-2">
              <ElTooltip content="固定" placement="bottom">
                <button type="button" class="flex-center p-1" aria-label="固定子菜单" @click="toggleFixedSubMenu(true)">
                  <i class="i-pixel:thumbtack cursor-pointer text-xl text-primary"></i>
                </button>
              </ElTooltip>
            </div>
          </div>
        </ElHeader>
        <div class="floating-submenu-content" :class="{ 'is-inverted': userConfig.invertedAside }">
          <SysSubMenu
            :data="menuStore.subMenuRoutes"
            v-model:active="menuStore.activeMenu"
            @change="handleSubmenuChange"
          />
        </div>
      </div>
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
import SysMenu from './components/SysMenu.vue'
import AppSearchModal from '@/layouts/components/AppSearchModal.vue'
import SysSubMenu from './components/SysSubMenu.vue'

import { onClickOutside } from '@vueuse/core'

const menuStore = useMenuStore()

const appStore = useAppStore()
const { userConfig, systemConfig, showConfigDrawer, isMobile, showMenuDrawer, showRouterView, isPc, showSearchModal } =
  storeToRefs(appStore)

const layoutContentStyle = computed(() => ({
  padding: numberToPx(userConfig.value.gap),
}))

const showAppBreadcrumb = computed(() => {
  if (!userConfig.value.showBreadcrumb) return false
  if (isMobile.value) return false
  return true
})

const showAsideControl = computed(() => {
  if (!isPc.value) return false
  return true
})

const showSubMenu = ref(false)
const target = useTemplateRef<HTMLElement>('target')

onClickOutside(target, () => {
  showSubMenu.value = false
})

const showSecondAside = computed(() => {
  if (!isPc.value) return false
  if (menuStore.subMenuRoutes.length > 0) return true
  return false
})

function handleSubmenuChange() {
  showSubMenu.value = false
}

function toggleFixedSubMenu(fixed: boolean) {
  appStore.userConfig.fixedSubMenu = fixed
}

function handleFirstLevenChange(show: boolean) {
  showSubMenu.value = show
}
</script>

<style scoped>
.layout-aside {
  flex-shrink: 0;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 0.28s cubic-bezier(0.2, 0, 0, 1);
}

.layout-aside.is-inverted {
  background-color: #0f172a;
}

.layout-main-container {
  position: relative;
  overflow: hidden;
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

.floating-submenu {
  position: absolute;
  z-index: 10;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--el-bg-color);
}

.floating-submenu-content {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
}

.floating-submenu-content.is-inverted {
  background-color: #0f172a;
}
</style>
