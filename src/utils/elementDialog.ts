import 'element-plus/es/components/message-box/style/css.mjs'
import { ElMessageBox } from 'element-plus'
import type { AppContext } from 'vue'

type DialogActionResult = boolean | void | Promise<boolean | void>

export interface ElementDialogOptions {
  title?: string
  content?: string
  positiveText?: string
  negativeText?: string
  onPositiveClick?: () => DialogActionResult
  onNegativeClick?: () => DialogActionResult
}

export interface ElementDialogInstance {
  loading: boolean
}

export interface ElementDialogService {
  warning(options: ElementDialogOptions): ElementDialogInstance
  success(options: ElementDialogOptions): ElementDialogInstance
}

export function createElementDialogService(appContext?: AppContext | null): ElementDialogService {
  function open(type: 'warning' | 'success', options: ElementDialogOptions): ElementDialogInstance {
    let loading = false
    let updateConfirmButtonLoading: (value: boolean) => void = () => {}

    const dialogInstance: ElementDialogInstance = {
      get loading() {
        return loading
      },
      set loading(value: boolean) {
        loading = value
        updateConfirmButtonLoading(value)
      },
    }

    void ElMessageBox(
      {
        message: options.content ?? '',
        title: options.title,
        type,
        confirmButtonText: options.positiveText,
        cancelButtonText: options.negativeText,
        showCancelButton: Boolean(options.negativeText),
        closeOnClickModal: true,
        closeOnPressEscape: true,
        beforeClose(action, instance, done) {
          updateConfirmButtonLoading = (value) => {
            instance.confirmButtonLoading = value
          }
          updateConfirmButtonLoading(loading)

          const callback =
            action === 'confirm' ? options.onPositiveClick : action === 'cancel' ? options.onNegativeClick : undefined
          if (!callback) {
            done()
            return
          }

          void Promise.resolve()
            .then(callback)
            .then((shouldClose) => {
              if (shouldClose === false) {
                dialogInstance.loading = false
                return
              }
              done()
            })
            .catch(() => {
              dialogInstance.loading = false
            })
        },
      },
      appContext,
    ).catch(() => {})

    return dialogInstance
  }

  return {
    warning: (options) => open('warning', options),
    success: (options) => open('success', options),
  }
}
