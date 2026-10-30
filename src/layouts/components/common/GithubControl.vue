<template>
  <ElTooltip v-if="appStore.isPc" placement="bottom" content="github">
    <div class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="jumpToGithub">
      <IMdiGithub></IMdiGithub>
    </div>
  </ElTooltip>
  <div v-else class="flex-center cursor-pointer rounded-sm p-1 hover:text-primary" @click="jumpToGithub">
    <IMdiGithub></IMdiGithub>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores'
const appStore = useAppStore()

function jumpToGithub() {
  window.open('https://github.com/RengarJS/rengar-admin-element')
}
</script>

<style scoped></style>
