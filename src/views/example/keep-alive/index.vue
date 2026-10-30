<template>
  <ElCard class="h-full">
    <ElSpace align="center">
      <ElText type="primary">当前计数：{{ count }}</ElText>
      <ElButton type="primary" @click="count++">增加</ElButton>
    </ElSpace>
  </ElCard>
</template>

<script setup lang="ts">
const count = ref(0)
</script>

<style scoped></style>
