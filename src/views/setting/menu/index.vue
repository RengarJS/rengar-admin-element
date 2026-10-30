<template>
  <div class="menu-management-grid">
    <ElCard v-loading="menuLoading">
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <span>菜单管理</span>
          <ElButton v-role="'btn0001'" type="primary" size="small" @click="handleAddMenu(1)">添加顶级菜单</ElButton>
        </div>
      </template>

      <div class="my-4">
        <ElInput v-model="pattern" placeholder="搜索菜单" />
      </div>

      <ElTree
        :key="treeRenderKey"
        :data="menuTree"
        :props="treeProps"
        :current-node-key="currentMenu?.id"
        :default-expanded-keys="expandedNodeIds"
        highlight-current
        :expand-on-click-node="false"
        node-key="id"
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div class="w-full flex items-center justify-between gap-2">
            <ElText :type="highlightedNodeIds.has(data.id) ? 'primary' : undefined">{{ data.name }}</ElText>
            <ElSpace align="center">
              <ElText class="text-sm" type="primary">{{ data.code }}</ElText>
              <button
                type="button"
                class="i-tabler:copy cursor-pointer text-base text-primary"
                aria-label="复制菜单编码"
                @click.stop="handleCopy(data.code)"
              ></button>
            </ElSpace>
          </div>
        </template>
      </ElTree>
    </ElCard>

    <ElCard>
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <span>{{ currentMenu?.name }}</span>
          <ElSpace v-if="currentMenu">
            <ElButton v-role="'btn0002'" type="primary" plain size="small" @click="handleAddMenu(2)">
              添加子菜单
            </ElButton>
            <ElButton v-role="'btn0003'" type="danger" plain size="small" @click="handleRemoveMenu">删除</ElButton>
          </ElSpace>
        </div>
      </template>

      <ElAlert title="温馨提示" type="info">点击菜单开始</ElAlert>

      <ElForm
        v-if="currentMenu"
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="my-4"
        size="small"
        label-position="left"
        label-width="auto"
      >
        <ElFormItem label="菜单名称" prop="name">
          <ElInput v-model="formData.name" placeholder="菜单名称" @input="validateFieldOnInput('name')" />
        </ElFormItem>
        <ElFormItem label="菜单code" prop="code">
          <div class="w-full flex items-center gap-4">
            <ElInput v-model="formData.code" class="flex-1" disabled placeholder="菜单code" />
            <button
              type="button"
              class="i-tabler:copy cursor-pointer text-base text-primary"
              aria-label="复制菜单编码"
              @click="handleCopyCurrentMenuCode"
            ></button>
          </div>
        </ElFormItem>
        <ElFormItem label="排序" prop="sort">
          <ElInputNumber
            v-model="formData.sort"
            class="w-full"
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
        <ElFormItem>
          <div class="w-full flex-center">
            <ElButton v-role="'btn0004'" :loading="menuEditLoading" type="primary" size="small" @click="handleSubmit">
              保存
            </ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard>
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <span>按钮管理</span>
          <ElSpace v-if="currentMenu">
            <ElButton v-role="'btn0006'" type="primary" plain size="small" @click="handleButtonAdd">添加按钮</ElButton>
          </ElSpace>
        </div>
      </template>

      <ElAlert v-if="!currentMenu" title="温馨提示" type="info">点击菜单开始</ElAlert>
      <ElTable v-if="currentMenu" v-loading="buttonLoading" class="mt-4" size="small" :data="buttonList">
        <ElTableColumn prop="name" label="按钮名称" />
        <ElTableColumn label="按钮code">
          <template #default="{ row }">
            <ElSpace align="center">
              <ElText class="text-sm" type="info">{{ row.code }}</ElText>
              <button
                type="button"
                class="i-tabler:copy cursor-pointer text-base text-primary"
                aria-label="复制按钮编码"
                @click.stop="handleCopy(row.code)"
              ></button>
            </ElSpace>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="sort" label="排序" />
        <ElTableColumn label="状态">
          <template #default="{ row }">
            <ElTag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '启用' : '禁用' }}</ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="120">
          <template #default="{ row }">
            <ElSpace>
              <ElButton v-role="'btn0007'" text type="info" size="small" @click="handleButtonEdit(row)">编辑</ElButton>
              <ElButton v-role="'btn0008'" text type="danger" size="small" @click="handleButtonDelete(row)">
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <MenuAddModal v-model:show="showMemuModal" :type="addType" :parent="currentMenu" @success="getMenuTree" />
    <ButtonAddModal
      v-model:show="showButtonModal"
      :parent="currentMenu"
      :current-button="currentButton"
      @success="getButtonList"
    />
  </div>
</template>

<script setup lang="ts">
import { menuTreeApi, menuEditApi, menuDeleteApi, buttonListApi } from '@/api/setting/menu'
import type { FormInstance, FormRules } from 'element-plus'
import { useClipboard } from '@vueuse/core'
import { to } from 'await-to-js'
import { cloneDeep } from 'es-toolkit'
import MenuAddModal from './components/MenuAddModal.vue'
import ButtonAddModal from './components/ButtonAddModal.vue'

const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)
const treeProps = {
  label: 'name',
  children: 'children',
}
const treeRenderKey = ref(0)
const expandedNodeIds = ref<number[]>([])
const highlightedNodeIds = ref(new Set<number>())

const formData = ref<Api.Setting.Menu | Recordable>({})
const currentMenu = ref<Api.Setting.Menu>()
const pattern = ref('')

async function getMenuTree() {
  menuLoading.value = true
  const [err, data] = await to(menuTreeApi())
  menuLoading.value = false
  if (err) return
  menuTree.value = data
  updateTreeSearch(pattern.value)
}
getMenuTree()

const { copy } = useClipboard()
async function handleCopy(text: string) {
  const [err] = await to(copy(text))
  if (err) {
    window.$message?.error('复制失败')
  } else {
    window.$message?.success('复制成功')
  }
}

function updateTreeSearch(value: string) {
  const keyword = value.toLowerCase()
  const expandedIds = new Set<number>()
  const highlightedIds = new Set<number>()

  function traverse(nodes: Api.Setting.MenuTree[], parentIds: number[]) {
    for (const node of nodes) {
      if (keyword && node.name.toLowerCase().includes(keyword)) {
        highlightedIds.add(node.id)
        parentIds.forEach((id) => expandedIds.add(id))
      }
      if (node.children?.length) {
        traverse(node.children, [...parentIds, node.id])
      }
    }
  }

  traverse(menuTree.value, [])
  expandedNodeIds.value = [...expandedIds]
  highlightedNodeIds.value = highlightedIds
  if (keyword) treeRenderKey.value++
}

watch(pattern, updateTreeSearch)

function handleNodeClick(option: Api.Setting.MenuTree) {
  if (option.id === currentMenu.value?.id) {
    currentMenu.value = undefined
    return
  }
  currentMenu.value = option as Api.Setting.Menu
  formData.value = cloneDeep(option)
}

function handleCopyCurrentMenuCode() {
  handleCopy(formData.value.code)
}

function resetTreeSelect() {
  currentMenu.value = undefined
}

const showMemuModal = ref(false)
const addType = ref<1 | 2>(1)
function handleAddMenu(type: 1 | 2) {
  addType.value = type
  showMemuModal.value = true
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

const menuEditLoading = ref(false)
async function handleSubmit() {
  const [validErr] = await to(formRef.value!.validate())
  if (validErr) return
  menuEditLoading.value = true
  const [err] = await to(menuEditApi(formData.value as Api.Setting.Menu))
  menuEditLoading.value = false
  if (err) return
  window.$message?.success('保存成功')
  getMenuTree()
}

function handleRemoveMenu() {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${currentMenu.value?.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(menuDeleteApi(currentMenu.value!.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getMenuTree()
      resetTreeSelect()
      return true
    },
  })
}

const showButtonModal = ref(false)
const currentButton = ref<Api.Setting.Menu>()
const buttonList = ref<Api.Setting.Menu[]>([])
const buttonLoading = ref(false)

async function getButtonList() {
  buttonLoading.value = true
  const [err, data] = await to(buttonListApi(currentMenu.value!.id))
  buttonLoading.value = false
  if (err) {
    buttonList.value = []
    return
  }
  buttonList.value = data
}

function handleButtonAdd() {
  currentButton.value = undefined
  showButtonModal.value = true
}

watch(currentMenu, (value) => {
  if (!value) return
  getButtonList()
})

function handleButtonEdit(data: Api.Setting.Menu) {
  currentButton.value = data
  showButtonModal.value = true
}

function handleButtonDelete(data: Api.Setting.Menu) {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${data.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(menuDeleteApi(data.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getButtonList()
      return true
    },
  })
}
</script>

<style scoped>
.menu-management-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 800px) {
  .menu-management-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .menu-management-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
