<template>
  <ElDialog
    v-model="show"
    :title="record ? '编辑用户' : '新增用户'"
    width="500px"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <ElForm
      ref="formRef"
      v-loading="detailLoading"
      :model="formData"
      :rules
      element-loading-text="正在加载用户信息"
      class="my-4"
      size="small"
      label-position="left"
      label-width="auto"
    >
      <ElFormItem label="账户名" prop="username">
        <ElInput v-model="formData.username" placeholder="账户名" @input="validateFieldOnInput('username')" />
      </ElFormItem>
      <ElFormItem v-if="!record" label="密码" prop="password">
        <ElInput v-model="formData.password" placeholder="密码" @input="validateFieldOnInput('password')" />
      </ElFormItem>
      <ElFormItem v-if="!record" label="确认密码" prop="confirmPassword">
        <ElInput
          v-model="formData.confirmPassword"
          placeholder="确认密码"
          @input="validateFieldOnInput('confirmPassword')"
        />
      </ElFormItem>
      <ElFormItem label="角色绑定" prop="roleIds">
        <ElSelect v-model="formData.roleIds" multiple placeholder="请绑定角色">
          <ElOption v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="1">启用</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="show = false">取消</ElButton>
      <ElButton type="primary" :disabled="detailLoading" :loading="loading" @click="handleConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { userAddApi, userEditApi, userDetailApi } from '@/api/setting/user'
import { roleListEnabledApi } from '@/api/setting/role'

import type { FormInstance, FormRules } from 'element-plus'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.User
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Recordable>({
  username: '',
  status: 1,
  roleIds: [],
})

const formRef = useTemplateRef<FormInstance>('formRef')
const detailLoading = ref(false)
const rules: FormRules = {
  username: [{ required: true, message: '请输入账户名', trigger: ['blur', 'change'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: ['blur', 'change'] }],
  roleIds: [{ required: true, type: 'array', message: '请绑定角色', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

function validateFieldOnInput(field: string) {
  const validation = formRef.value?.validateField(field)
  void validation?.catch(() => {})
}

const roleList = ref<Api.Setting.Role[]>([])

async function getRoleList() {
  const [err, data] = await to(roleListEnabledApi())
  if (err) {
    roleList.value = []
    return
  }
  roleList.value = data
}

getRoleList()

function handleOpen() {
  if (record) {
    void getDetail(record.id)
  }
}

let detailRequestId = 0

async function getDetail(userId: Api.Setting.User['id']) {
  const requestId = ++detailRequestId
  detailLoading.value = true
  const [err, res] = await to(userDetailApi(userId))
  if (requestId !== detailRequestId) return
  detailLoading.value = false
  if (err) return
  formData.value = res
}

function handleClose() {
  detailRequestId += 1
  detailLoading.value = false
  for (const key in formData.value) {
    formData.value[key] = null
  }
}

const loading = ref(false)
async function handleSubmit() {
  if (detailLoading.value) return false
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(
    record ? userEditApi(unref(formData) as Api.Setting.User) : userAddApi(unref(formData) as Api.Setting.User),
  )
  loading.value = false
  if (err) return
  window.$message?.success(`${record ? '编辑' : '新增'}成功`)
  emit('success')
  return true
}

async function handleConfirm() {
  if (await handleSubmit()) {
    show.value = false
  }
}
</script>

<style scoped></style>
