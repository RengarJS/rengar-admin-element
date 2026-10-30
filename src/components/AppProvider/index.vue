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
import { getCurrentInstance, h, reactive } from 'vue'
import App from '@/App.vue'
import AppWaterMark from '@/layouts/components/AppWaterMark.vue'
import AppRouteLoadingBar from '@/components/AppRouteLoadingBar/index.vue'
import { createElementDialogService } from '@/utils/elementDialog'

defineOptions({
  name: 'AppProvider',
})

const appStore = useAppStore()

const GlobalUiServices = defineComponent({
  name: 'GlobalUiServices',
  setup() {
    const appContext = getCurrentInstance()?.appContext ?? null
    const loadingBarState = reactive<{
      visible: boolean
      percentage: number
      status: 'exception' | undefined
    }>({
      visible: false,
      percentage: 0,
      status: undefined,
    })
    let progressTimer: number | undefined
    let finishTimer: number | undefined
    let runId = 0

    function clearLoadingBarTimers() {
      if (progressTimer !== undefined) window.clearInterval(progressTimer)
      if (finishTimer !== undefined) window.clearTimeout(finishTimer)
      progressTimer = undefined
      finishTimer = undefined
    }

    function startLoadingBar() {
      clearLoadingBarTimers()
      runId += 1
      loadingBarState.visible = true
      loadingBarState.percentage = 0
      loadingBarState.status = undefined
      progressTimer = window.setInterval(() => {
        if (loadingBarState.percentage >= 80) {
          if (progressTimer !== undefined) window.clearInterval(progressTimer)
          progressTimer = undefined
          return
        }
        const remaining = 80 - loadingBarState.percentage
        loadingBarState.percentage = Math.min(80, loadingBarState.percentage + Math.max(1, Math.ceil(remaining * 0.1)))
      }, 100)
    }

    function completeLoadingBar(status?: 'exception') {
      clearLoadingBarTimers()
      const completedRunId = ++runId
      loadingBarState.visible = true
      loadingBarState.percentage = 100
      loadingBarState.status = status
      finishTimer = window.setTimeout(() => {
        if (completedRunId !== runId) return
        loadingBarState.visible = false
        loadingBarState.percentage = 0
        loadingBarState.status = undefined
        finishTimer = undefined
      }, 400)
    }

    window.$loadingBar = {
      start: startLoadingBar,
      finish: () => completeLoadingBar(),
      error: () => completeLoadingBar('exception'),
    }
    ElMessage._context = appContext
    ElMessageBox._context = appContext
    ElNotification._context = appContext
    window.$dialog = createElementDialogService(appContext)
    window.$message = ElMessage
    window.$notification = ElNotification
    return () =>
      h(AppRouteLoadingBar, {
        visible: loadingBarState.visible,
        percentage: loadingBarState.percentage,
        status: loadingBarState.status,
      })
  },
})
</script>

<style scoped></style>
