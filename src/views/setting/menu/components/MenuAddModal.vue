<template>
  <ElDialog v-model="show" :title="type === 1 ? '添加顶级菜单' : '添加子菜单'" width="500px" @closed="handleClose">
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="my-8"
      size="small"
      label-position="left"
      label-width="auto"
    >
      <ElFormItem v-if="type === 2" label="上级菜单">
        <ElInput :model-value="parent?.name" disabled />
      </ElFormItem>

      <ElFormItem label="菜单名称" prop="name">
        <ElInput v-model="formData.name" placeholder="菜单名称" @input="validateFieldOnInput('name')" />
      </ElFormItem>

      <ElFormItem label="排序" prop="sort">
        <ElInputNumber
          v-model="formData.sort"
          :min="1"
          :precision="0"
          placeholder="序号"
          @change="validateFieldOnInput('sort')"
        />
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
import { menuAddApi } from '@/api/setting/menu'
import type { FormInstance, FormRules } from 'element-plus'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { parent, type } = defineProps<{
  type: 1 | 2
  parent?: Api.Setting.Menu
}>()

const emit = defineEmits<{
  success: []
}>()

const formData = ref<Recordable>({
  type: 1,
})

const formRef = useTemplateRef<FormInstance>('formRef')
const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] }],
  sort: [{ required: true, message: '请输入排序', type: 'number', trigger: ['blur', 'change'] }],
  status: [{ required: true, message: '请选择状态', type: 'number', trigger: ['blur', 'change'] }],
}

function validateFieldOnInput(field: string) {
  const validation = formRef.value?.validateField(field)
  void validation?.catch(() => {})
}

const loading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(
    menuAddApi({
      ...unref(formData as unknown as Api.Setting.Menu),
      parentId: type === 1 ? 0 : parent!.id,
    }),
  )
  loading.value = false
  if (err) return false
  window.$message?.success('新增成功')
  emit('success')
  return true
}

async function handleConfirm() {
  if (await handleSubmit()) {
    show.value = false
  }
}

function handleClose() {
  for (const key in formData.value) {
    formData.value[key] = null
  }
  formData.value.type = 1
}
</script>

<style scoped></style>
