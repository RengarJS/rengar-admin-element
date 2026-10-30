<template>
  <div class="max-w-[600px]">
    <ElCard v-loading="menuLoading">
      <template #header>
        <div class="flex items-center justify-between gap-2">
          <span>菜单管理</span>
          <ElButton v-role="'btn0014'" type="primary" :loading="saveLoading" @click="handleSave">保存</ElButton>
        </div>
      </template>

      <div class="my-4">
        <ElInput v-model="pattern" placeholder="搜索菜单" />
      </div>

      <ElTree
        v-if="menuTree.length"
        :key="treeRenderKey"
        ref="treeRef"
        :data="menuTree"
        :props="treeProps"
        :default-expanded-keys="expandedNodeIds"
        :default-checked-keys="checkedKeys"
        node-key="id"
        show-checkbox
        :expand-on-click-node="false"
        @check="handleCheck"
      >
        <template #default="{ data }">
          <ElText :type="highlightedNodeIds.has(data.id) ? 'primary' : undefined">{{ data.name }}</ElText>
        </template>
      </ElTree>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { menuButtonEnabledTreeApi } from '@/api/setting/menu'
import { roleConfigApi, roleConfigDetailApi } from '@/api/setting/role'
import type { TreeInstance } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { to } from 'await-to-js'

const route = useRoute<'setting-role-config'>()
const id = Number(route.params.id)
const checkedKeys = ref<number[]>([])
const menuTree = ref<Api.Setting.MenuTree[]>([])
const menuLoading = ref(false)
const saveLoading = ref(false)
const pattern = ref('')
const treeRef = useTemplateRef<TreeInstance>('treeRef')
const treeProps = {
  label: 'name',
  children: 'children',
}
const treeRenderKey = ref(0)
const expandedNodeIds = ref<number[]>([])
const highlightedNodeIds = ref(new Set<number>())

function extractLeafIds(nodes: Api.Setting.MenuTree[], rawIdSet: Set<number>): number[] {
  const leafIds: number[] = []

  function traverse(node: Api.Setting.MenuTree) {
    const isLeaf = !node.children || node.children.length === 0

    if (isLeaf) {
      if (rawIdSet.has(node.id)) {
        leafIds.push(node.id)
      }
    } else {
      node.children!.forEach(traverse)
    }
  }

  nodes.forEach(traverse)
  return leafIds
}

async function getMenuTree() {
  menuLoading.value = true
  const [err, tree] = await to(menuButtonEnabledTreeApi())
  const [detailErr, menuIds] = await to(roleConfigDetailApi(id))
  menuLoading.value = false

  if (err || detailErr) return

  menuTree.value = tree
  checkedKeys.value = extractLeafIds(tree, new Set(menuIds))
  treeRenderKey.value++
  await nextTick()
  updateTreeSearch(pattern.value)
}

getMenuTree()

function updateTreeSearch(value: string) {
  const keyword = value.toLowerCase()
  const expandedIds = new Set<number>()
  const highlightedIds = new Set<number>()

  function traverse(nodes: Api.Setting.MenuTree[], parentIds: number[]) {
    for (const node of nodes) {
      if (keyword && node.name.toLowerCase().includes(keyword)) {
        highlightedIds.add(node.id)
        parentIds.forEach((parentId) => expandedIds.add(parentId))
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

function handleCheck() {
  checkedKeys.value = (treeRef.value?.getCheckedKeys(false) ?? []) as number[]
}

async function handleSave() {
  saveLoading.value = true
  const halfIds = (treeRef.value?.getHalfCheckedKeys() ?? []) as number[]
  const [err] = await to(
    roleConfigApi({
      id,
      menuIds: [...new Set([...unref(checkedKeys), ...halfIds])],
    }),
  )

  saveLoading.value = false
  if (err) return
  window.$message.success('保存成功')
}
</script>

<style scoped></style>
