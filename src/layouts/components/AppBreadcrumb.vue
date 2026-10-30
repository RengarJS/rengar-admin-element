<template>
  <ElBreadcrumb>
    <ElBreadcrumbItem v-for="item in breadcrumb" :key="item.name">
      <div class="flex items-center gap-1">
        <ElIcon>
          <MenuIcon :options="item.meta"></MenuIcon>
        </ElIcon>
        <span> {{ item.meta.title }}</span>
      </div>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script setup lang="ts">
const route = useRoute()
const breadcrumb = computed(() => {
  return route.matched
})
</script>

<style scoped></style>
