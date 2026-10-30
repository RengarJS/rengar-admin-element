export {}

import type { ElementDialogService } from '@/utils/elementDialog'

interface LoadingBarService {
  start: () => void
  finish: () => void
  error: () => void
}

declare global {
  interface Window {
    $loadingBar?: LoadingBarService
    $dialog: ElementDialogService
    $message: typeof import('element-plus').ElMessage
    $notification: typeof import('element-plus').ElNotification
  }
}
