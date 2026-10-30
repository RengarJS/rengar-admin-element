<template>
  <ElDialog
    v-model="show"
    :title="record ? '编辑角色' : '新增角色'"
    width="500px"
    @opened="handleOpen"
    @closed="handleClose"
  >
    <ElForm ref="formRef" :model="formData" :rules class="my-8" size="small" label-position="left" label-width="auto">
      <ElFormItem label="角色名称" prop="name">
        <ElInput v-model="formData.name" placeholder="角色名称" @input="validateFieldOnInput('name')" />
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
      <ElButton type="primary" :loading="loading" @click="handleConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { roleAddApi, roleEditApi } from '@/api/setting/role'
import type { FormInstance, FormRules } from 'element-plus'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { record } = defineProps<{
  record?: Api.Setting.Role
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Api.Setting.Role>({
  id: 0,
  name: '',
  status: 1,
})

const formRef = useTemplateRef<FormInstance>('formRef')
const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

function validateFieldOnInput(field: string) {
  const validation = formRef.value?.validateField(field)
  void validation?.catch(() => {})
}

function handleOpen() {
  if (record) {
    formData.value = record
  }
}

function handleClose() {
  formData.value = {
    id: 0,
    name: '',
    status: 1,
  }
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(record ? roleEditApi(unref(formData)) : roleAddApi(unref(formData)))
  loading.value = false
  if (err) return false
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
