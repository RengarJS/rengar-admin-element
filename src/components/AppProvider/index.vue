<template>
  <NConfigProvider
    :theme-overrides="appStore.themeOverrides"
    :theme="appStore.theme === 'light' ? lightTheme : darkTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <NLoadingBarProvider>
            <ElConfigProvider :locale="elementPlusLocale">
              <GlobalUiServices />
              <AppWaterMark />
              <App />
            </ElConfigProvider>
            <NGlobalStyle></NGlobalStyle>
          </NLoadingBarProvider>
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import elementPlusLocale from 'element-plus/es/locale/lang/zh-cn'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { darkTheme, lightTheme, zhCN, dateZhCN } from 'naive-ui'
import { useAppStore } from '@/stores'
import { createTextVNode, getCurrentInstance } from 'vue'
import App from '@/App.vue'
import AppWaterMark from '@/layouts/components/AppWaterMark.vue'
import { createElementDialogService } from '@/utils/elementDialog'

defineOptions({
  name: 'AppProvider',
})

const appStore = useAppStore()

const GlobalUiServices = defineComponent({
  name: 'GlobalUiServices',
  setup() {
    const appContext = getCurrentInstance()?.appContext ?? null

    window.$loadingBar = useLoadingBar()
    ElMessage._context = appContext
    ElMessageBox._context = appContext
    ElNotification._context = appContext
    window.$dialog = createElementDialogService(appContext)
    window.$message = ElMessage
    window.$notification = ElNotification
    return () => createTextVNode()
  },
})
</script>

<style scoped></style>
