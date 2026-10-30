<template>
  <ElCard>
    <ElTable class="mt-4" style="min-width: 620px" v-loading="loading" :data="tableData">
      <ElTableColumn prop="id" label="id" width="120" />
      <ElTableColumn prop="name" label="权限名" />
      <ElTableColumn prop="path" label="路由" />
      <ElTableColumn label="状态" width="120">
        <template #default="{ row }">
          <ElTag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </ElTag>
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
  </ElCard>
</template>

<script setup lang="ts">
import { permissionPageListApi } from '@/api/setting/permission'
import { to } from 'await-to-js'

const loading = ref(false)
const tableData = ref<Api.Setting.Permission[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
})

async function getPageList() {
  loading.value = true
  const [err, data] = await to(
    permissionPageListApi({
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
</script>

<style scoped></style>
