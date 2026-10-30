<template>
  <ElDialog v-model="show" title="修改密码" width="400px" align-center>
    <ElForm ref="formRef" :model="formValue" :rules label-position="left" label-width="auto" class="py-4">
      <ElFormItem prop="oldPassword" label="旧密码">
        <ElInput v-model="formValue.oldPassword" type="password" placeholder="请输入旧密码" />
      </ElFormItem>
      <ElFormItem prop="newPassword" label="新密码">
        <ElInput v-model="formValue.newPassword" type="password" placeholder="请输入新密码" />
      </ElFormItem>
      <ElFormItem prop="confirmPassword" label="确认密码">
        <ElInput v-model="formValue.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="show = false">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { authPasswordApi } from '@/api/common/auth'
import { to } from 'await-to-js'
import { useRouterHook } from '@/hooks/router'
import { useLoading } from '@/hooks/loading'
import { useAuthStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'

const show = defineModel<boolean>('show', {
  required: true,
})

const rules: FormRules = {
  oldPassword: {
    required: true,
    message: '请输入旧密码',
    trigger: ['blur', 'input'],
  },
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: ['blur', 'input'],
  },
  confirmPassword: {
    required: true,
    validator: (_, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
        return
      }
      if (value !== formValue.newPassword) {
        callback(new Error('两次输入的密码不一致'))
        return
      }
      callback()
    },
    trigger: ['blur', 'input'],
  },
}

const formValue = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const formRef = useTemplateRef<FormInstance>('formRef')

const { loading, startLoading, endLoading } = useLoading()
const { routerReplaceToLogin } = useRouterHook()
const authStore = useAuthStore()

const router = useRouter()
async function handleSubmit() {
  startLoading()
  const [err] = await to(formRef.value!.validate())

  if (err) {
    endLoading()
    return false
  }
  const [err1] = await to(authPasswordApi(toRaw(formValue)))
  endLoading()
  if (err1) {
    return false
  }
  window.$message.success('修改密码成功，请重新登录')
  authStore.reset()
  routerReplaceToLogin(router.currentRoute.value.fullPath)
  return true
}

async function handleConfirm() {
  if (await handleSubmit()) {
    show.value = false
  }
}
</script>

<style scoped></style>
