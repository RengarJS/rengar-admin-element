<template>
  <div class="flex-center flex-y gap-8 h-screen">
    <img :src="Icon" alt="" class="w-[280px]" />
    <span class="text-2xl text-gray">页面找不到了</span>
    <ElSpace :size="40">
      <ElButton type="primary" plain @click="handleBack">返回上一页</ElButton>
      <ElButton type="primary" @click="handleHome">返回首页</ElButton>
    </ElSpace>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/assets/svg-icons/404.svg'

const router = useRouter()

function handleBack() {
  router.back()
}

function handleHome() {
  router.replace('/')
}
</script>

<style scoped></style>
