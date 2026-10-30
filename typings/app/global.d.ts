export {}

import type { ElementDialogService } from '@/utils/elementDialog'

declare global {
  interface Window {
    $loadingBar?: import('naive-ui').LoadingBarProviderInst
    $dialog: ElementDialogService
    $message: typeof import('element-plus').ElMessage
    $notification: typeof import('element-plus').ElNotification
  }
}
