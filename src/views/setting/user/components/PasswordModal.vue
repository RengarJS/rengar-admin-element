<template>
  <ElDialog v-model="show" title="修改密码" width="400px" align-center @opened="handleOpen" @closed="handleClose">
    <ElForm ref="formRef" :model="formValue" :rules class="my-4" size="small" label-position="left" label-width="auto">
      <ElFormItem prop="newPassword" label="新密码">
        <ElInput
          v-model="formValue.newPassword"
          type="password"
          placeholder="请输入新密码"
          @input="validateFieldOnInput('newPassword')"
        />
      </ElFormItem>
      <ElFormItem prop="confirmPassword" label="确认密码">
        <ElInput
          v-model="formValue.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          @input="validateFieldOnInput('confirmPassword')"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="show = false">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="tsx">
import { userPasswordApi } from '@/api/setting/user'

import type { FormInstance, FormRules } from 'element-plus'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.User
}>()

const formValue = ref<Api.Setting.PasswordDTO>({
  id: 0,
  newPassword: '',
  confirmPassword: '',
})
const formRef = useTemplateRef<FormInstance>('formRef')
const rules: FormRules = {
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: ['blur', 'change'],
  },
  confirmPassword: {
    required: true,
    validator: (_, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'))
        return
      }
      if (value !== formValue.value.newPassword) {
        callback(new Error('两次输入的密码不一致'))
        return
      }
      callback()
    },
    trigger: ['blur', 'change'],
  },
}

function handleClose() {
  formValue.value = {
    id: 0,
    newPassword: '',
    confirmPassword: '',
  }
}

function validateFieldOnInput(field: string) {
  const validation = formRef.value?.validateField(field)
  void validation?.catch(() => {})
}

function handleOpen() {
  if (record) {
    formValue.value.id = record.id
  }
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(userPasswordApi(unref(formValue)))
  loading.value = false
  if (err) return
  window.$message?.success('修改密码成功')
  return true
}

async function handleConfirm() {
  if (await handleSubmit()) {
    show.value = false
  }
}
</script>

<style scoped></style>
