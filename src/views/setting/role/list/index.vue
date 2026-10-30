<template>
  <ElCard>
    <ElButton v-role="'btn0011'" type="primary" @click="handleAdd">新增角色</ElButton>
    <ElTable class="mt-4" style="min-width: 620px" v-loading="loading" :data="tableData">
      <ElTableColumn prop="id" label="id" width="120" />
      <ElTableColumn prop="name" label="角色名称" />
      <ElTableColumn label="状态" width="120">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <ElSpace>
            <ElButton v-role="'btn0012'" type="primary" @click="handleEdit(row)">编辑</ElButton>
            <ElButton v-role="'btn0014'" type="primary" @click="handleConfigPermmsion(row)">权限配置</ElButton>
            <ElButton v-role="'btn0013'" type="danger" @click="handleDelete(row)">删除</ElButton>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      v-model:current-page="pagination.page"
      class="mt-4 flex justify-end"
      :page-size="pagination.pageSize"
      :total="pagination.itemCount"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
    <AddOrEditModal v-model:show="showModal" :record @success="getPageList" />
  </ElCard>
</template>

<script setup lang="ts">
import { rolePageListApi, roleDeleteApi } from '@/api/setting/role'
import { to } from 'await-to-js'
import AddOrEditModal from './components/AddOrEditModal.vue'
import { useRouterHook } from '@/hooks/router'

const loading = ref(false)
const tableData = ref<Api.Setting.Role[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

async function getPageList() {
  loading.value = true
  const [err, data] = await to(
    rolePageListApi({
      current: pagination.page,
      size: pagination.pageSize,
    }),
  )
  loading.value = false
  if (err) {
    tableData.value = []
    return
  }
  tableData.value = data.records
  pagination.itemCount = data.total
}

getPageList()

function handlePageChange(page: number) {
  pagination.page = page
  getPageList()
}

const showModal = ref(false)
const record = ref<Api.Setting.Role>()

function handleAdd() {
  record.value = undefined
  showModal.value = true
}

function handleEdit(row: Api.Setting.Role) {
  record.value = row
  showModal.value = true
}

function handleDelete(data: Api.Setting.Role) {
  const dialogInstance = window.$dialog.warning({
    title: '温馨提示',
    content: `确定要删除“${data.name}”吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      dialogInstance.loading = true
      const [err] = await to(roleDeleteApi(data.id))
      dialogInstance.loading = false
      if (err) return false
      window.$message.success('删除成功')
      getPageList()
      return true
    },
  })
}

const { routerPushByName } = useRouterHook()
function handleConfigPermmsion(row: Api.Setting.Role) {
  routerPushByName('setting-role-config', {
    params: {
      id: row.id,
    },
  })
}
</script>

<style scoped></style>
