<template>
  <ElDialog v-model="show" :title="currentButton ? '编辑按钮' : '添加按钮'" width="500px" @closed="handleClose">
    <ElForm
      ref="formRef"
      v-loading="detailLoading"
      :model="formData"
      :rules="rules"
      element-loading-text="正在加载按钮信息"
      class="my-8"
      size="small"
      label-position="left"
      label-width="auto"
    >
      <ElFormItem v-if="parent" label="上级菜单">
        <ElInput :model-value="parent?.name" disabled />
      </ElFormItem>

      <ElFormItem label="按钮名称" prop="name">
        <ElInput v-model="formData.name" placeholder="按钮名称" @input="validateFieldOnInput('name')" />
      </ElFormItem>

      <ElFormItem label="排序" prop="sort">
        <ElInputNumber
          v-model="formData.sort"
          :min="1"
          :precision="0"
          placeholder="排序"
          @change="validateFieldOnInput('sort')"
        />
      </ElFormItem>

      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="1">启用</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>

      <ElFormItem label="权限">
        <ElSelect v-model="formData.permissionId" clearable filterable>
          <ElOption
            v-for="permission in permissionOptions"
            :key="permission.id"
            :label="permission.path"
            :value="permission.id"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="show = false">取消</ElButton>
      <ElButton type="primary" :disabled="detailLoading" :loading="loading" @click="handleConfirm">确定</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { menuAddApi, menuEditApi, menuDetailApi } from '@/api/setting/menu'
import { permissionEnabledListApi } from '@/api/setting/permission'
import type { FormInstance, FormRules } from 'element-plus'
import { to } from 'await-to-js'

const show = defineModel<boolean>('show', {
  required: true,
})

const { parent, currentButton } = defineProps<{
  parent?: Api.Setting.Menu
  currentButton?: Api.Setting.Menu
}>()

const emit = defineEmits<{
  success: []
}>()

const permissionOptions = ref<Recordable[]>([])
async function getPermissionOptions() {
  const [err, res] = await to(permissionEnabledListApi())
  if (err) return
  permissionOptions.value = res ?? []
}
getPermissionOptions()

const formData = ref<Recordable>({
  type: 2,
})

const detailLoading = ref(false)
let detailRequestId = 0

watch(show, (val) => {
  if (val && currentButton) {
    void getDetail(currentButton.id)
  }
})

async function getDetail(buttonId: Api.Setting.Menu['id']) {
  const requestId = ++detailRequestId
  detailLoading.value = true
  const [err, res] = await to(menuDetailApi(buttonId))
  if (requestId !== detailRequestId) return
  detailLoading.value = false
  if (err) return
  formData.value = res
}

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
  if (detailLoading.value) return false
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return false
  loading.value = true
  const [err] = await to(
    currentButton
      ? menuEditApi(formData.value as Api.Setting.Menu)
      : menuAddApi({
          ...(formData.value as Api.Setting.Menu),
          parentId: parent!.id,
        }),
  )
  loading.value = false
  if (err) return false
  window.$message?.success(`${currentButton ? '编辑' : '新增'}成功`)
  emit('success')
  return true
}

async function handleConfirm() {
  if (await handleSubmit()) {
    show.value = false
  }
}

function handleClose() {
  detailRequestId += 1
  detailLoading.value = false
  for (const key in formData.value) {
    formData.value[key] = null
  }
  formData.value.type = 2
}
</script>

<style scoped></style>
