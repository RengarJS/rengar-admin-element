import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import 'element-plus/theme-chalk/el-message.css'

import './assets/styles/main.css'

import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { createApp } from 'vue'
import { setupPinia } from './stores'
import { setupRouter } from './router'
import { setupPlugins } from './plugins'
import { createElementDialogService } from './utils/elementDialog'

import AppLoading from './components/AppLoading/index.vue'
import AppProvider from './components/AppProvider/index.vue'

async function bootstrap() {
  const loadingApp = createApp(AppLoading)
  loadingApp.mount('#app-loading')
  const app = createApp(AppProvider)
  const appContext = app._context
  ElMessage._context = appContext
  ElMessageBox._context = appContext
  ElNotification._context = appContext
  window.$dialog = createElementDialogService(appContext)
  window.$message = ElMessage
  window.$notification = ElNotification
  setupPinia(app)
  setupPlugins(app)
  await setupRouter(app)
  app.mount('#app')
  loadingApp.unmount()
}

bootstrap()
