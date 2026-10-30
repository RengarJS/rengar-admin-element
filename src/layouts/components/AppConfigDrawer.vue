<template>
  <ElDrawer v-model="show" title="系统配置" size="min(400px, 100vw)">
    <div>
      <ElDivider>布局模式</ElDivider>

      <ElRow :gutter="16">
        <ElCol :span="8">
          <div
            class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
            :class="[userConfig.layoutMode === 'aside' ? ' border border-primary' : '']"
            @click="handleChangeLayout('aside')"
          >
            <div class="h-[80px] w-full flex gap-2">
              <div class="w-5 rounded bg-primary"></div>
              <div class="flex flex-1 flex-col gap-2">
                <div class="h-5 rounded bg-primary-300"></div>
                <div class="flex-1 rounded bg-primary-300"></div>
              </div>
            </div>
            <div>经典布局</div>
          </div>
        </ElCol>
        <ElCol :span="8">
          <div
            class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
            :class="[userConfig.layoutMode === 'top' ? ' border border-primary' : '']"
            @click="handleChangeLayout('top')"
          >
            <div class="h-[80px] w-full flex flex-col gap-2">
              <div class="h-5 rounded bg-primary"></div>
              <div class="flex-1 rounded bg-primary-300"></div>
            </div>
            <div>顶部菜单布局</div>
          </div>
        </ElCol>

        <ElCol :span="8">
          <div
            class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
            :class="[userConfig.layoutMode === 'top-aside' ? ' border border-primary' : '']"
            @click="handleChangeLayout('top-aside')"
          >
            <div class="h-[80px] w-full flex gap-2">
              <div class="w-5 rounded bg-primary"></div>
              <div class="flex flex-1 flex-col gap-2">
                <div class="h-5 rounded bg-primary"></div>
                <div class="flex-1 rounded bg-primary-300"></div>
              </div>
            </div>
            <div>一级菜单顶部</div>
          </div>
        </ElCol>

        <ElCol :span="8">
          <div
            class="flex flex-col cursor-pointer items-center gap-4 rounded p-2"
            :class="[userConfig.layoutMode === 'aside-double' ? ' border border-primary' : '']"
            @click="handleChangeLayout('aside-double')"
          >
            <div class="h-[80px] w-full flex gap-1">
              <div class="w-5 rounded bg-primary"></div>
              <div class="w-4 rounded bg-primary"></div>
              <div class="flex flex-1 flex-col gap-2">
                <div class="h-5 rounded bg-primary-300"></div>
                <div class="flex-1 rounded bg-primary-300"></div>
              </div>
            </div>
            <div>左侧双布局</div>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <div>
      <ElDivider>路由动画</ElDivider>
      <ElRadioGroup v-model="userConfig.transitionName">
        <ElRow :gutter="16">
          <ElCol v-for="item in transitionOptions" :key="item.value" :span="6">
            <ElRadioButton :value="item.value">{{ item.label }}</ElRadioButton>
          </ElCol>
        </ElRow>
      </ElRadioGroup>
    </div>

    <div>
      <ElDivider>主题色</ElDivider>
      <ElColorPicker
        v-model="appStore.themeOverrides.common!.primaryColor"
        :show-alpha="false"
        @change="handleChangePrimaryColor"
      />
    </div>

    <div>
      <ElDivider>网站配置</ElDivider>
      <ElSpace direction="vertical" :size="20" class="w-full">
        <div class="flex items-center justify-between">
          <div>头部高度</div>
          <ElInputNumber v-model="userConfig.headerHeight" :precision="0" />
        </div>
        <div class="flex items-center justify-between">
          <div>标签栏高度</div>
          <ElInputNumber v-model="userConfig.tabHeight" :precision="0" />
        </div>
        <div class="flex items-center justify-between">
          <div>侧边栏宽度</div>
          <ElInputNumber v-model="userConfig.asideWidth" :precision="0" />
        </div>

        <div class="flex items-center justify-between">
          <div>底部高度</div>
          <ElInputNumber v-model="userConfig.footerHeight" :precision="0" />
        </div>

        <div class="flex items-center justify-between">
          <div>间隙</div>
          <ElInputNumber v-model="userConfig.gap" :precision="0" />
        </div>

        <div class="flex items-center justify-between">
          <div>显示面包屑</div>
          <ElSwitch v-model="userConfig.showBreadcrumb" />
        </div>

        <div class="flex items-center justify-between">
          <div>显示标签栏</div>
          <ElSwitch v-model="userConfig.showTabs" />
        </div>

        <div class="flex items-center justify-between">
          <div>显示底部</div>
          <ElSwitch v-model="userConfig.showFooter" />
        </div>

        <div class="flex items-center justify-between">
          <div>头部颜色反转</div>
          <ElSwitch v-model="userConfig.invertedHeader" />
        </div>
        <div class="flex items-center justify-between">
          <div>侧边栏颜色反转</div>
          <ElSwitch v-model="userConfig.invertedAside" />
        </div>

        <div class="flex items-center justify-between">
          <div>全局水印</div>
          <ElSwitch v-model="userConfig.showWaterMark" />
        </div>
        <div class="flex items-center justify-between">
          <div>色弱模式</div>
          <ElSwitch v-model="userConfig.colorWeakMode" />
        </div>
        <div class="flex items-center justify-between">
          <div>灰色模式</div>
          <ElSwitch v-model="userConfig.grayMode" />
        </div>
      </ElSpace>
    </div>

    <template #footer>
      <div class="w-full flex justify-between">
        <ElButton type="primary" @click="handleCopy">复制</ElButton>
        <ElButton type="primary" plain @click="handleReset">重置</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
import { injectTailwindCssVarToGlobal } from '@/utils/theme'
import { useClipboard } from '@vueuse/core'

const show = defineModel<boolean>('show', {
  required: true,
})

const appStore = useAppStore()

const { userConfig } = storeToRefs(appStore)

function handleChangeLayout(layoutMode: App.LayoutMode) {
  appStore.layoutModeChangeAction(layoutMode)
}

const transitionOptions = [
  { label: '淡入淡出', value: 'fade' },
  { label: '从左滑入', value: 'slide-left' },
  { label: '从右滑入', value: 'slide-right' },
  { label: '从上滑入', value: 'slide-up' },
  { label: '从下滑入', value: 'slide-down' },
  { label: '缩放淡入', value: 'scale' },
  { label: '无动画', value: 'none' },
] as const

function handleChangePrimaryColor(color: string) {
  injectTailwindCssVarToGlobal(color, 'primary')
}

const { copy } = useClipboard()

function handleCopy() {
  const copyStr = `
const userConfig: App.UserConfig = {
  version: ${userConfig.value.version + 1},
  layoutMode: '${userConfig.value.layoutMode}',
  asideWidth: ${userConfig.value.asideWidth},
  headerHeight: ${userConfig.value.headerHeight},
  footerHeight: ${userConfig.value.footerHeight},
  tabHeight: ${userConfig.value.tabHeight},
  gap: ${userConfig.value.gap},
  showTabs: ${userConfig.value.showTabs},
  showBreadcrumb: ${userConfig.value.showBreadcrumb},
  showFooter: ${userConfig.value.showFooter},
  invertedHeader: ${userConfig.value.invertedHeader},
  invertedAside: ${userConfig.value.invertedAside}
}
  `
  copy(copyStr.trim())

  window.$dialog.success({
    title: '复制成功',
    content: '请手动粘贴到 src/config/modules/app.ts 中，覆盖userConfig',
    positiveText: '我知道了',
  })
}

function handleReset() {
  appStore.resetLayoutAndTheme()
}
</script>

<style scoped></style>
