<template>
  <div class="relative overflow-hidden bg-primary-100 h-screen dark:bg-primary-900">
    <ElCard class="login-card absolute-center z-1 max-w-400px w-[90%]" shadow="hover">
      <div class="flex-center text-2xl text-primary">
        <ThemeControl />
      </div>

      <div class="mt-4 flex-center gap-4 text-primary">
        <SvgIcon local-icon="i-local-logo" class="text-6xl text-primary"></SvgIcon>
        <div class="text-3xl">{{ title }}</div>
      </div>

      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="auto"
        size="large"
        class="mt-6"
        @submit.prevent="handleSubmit"
      >
        <ElFormItem prop="username">
          <ElInput
            v-model="formData.username"
            placeholder="请输入用户名"
            clearable
            @input="validateFieldOnInput('username')"
            style="--el-input-border-radius: 6px"
          />
        </ElFormItem>
        <ElFormItem prop="password">
          <ElInput
            v-model="formData.password"
            placeholder="请输入密码"
            clearable
            show-password
            type="password"
            @input="validateFieldOnInput('password')"
            style="--el-input-border-radius: 6px"
          />
        </ElFormItem>

        <ElFormItem prop="captchaCode">
          <div class="h-full w-full flex gap-4">
            <ElInput
              v-model="formData.captchaCode"
              class="flex-1"
              placeholder="请输入验证码"
              clearable
              @input="validateFieldOnInput('captchaCode')"
              style="--el-input-border-radius: 6px"
            />

            <div v-loading="captchaLoading" class="captcha-image-container">
              <img class="h-10 w-[120px] cursor-pointer" :src="captchaImage" alt="验证码" @click="getChapter" />
            </div>
          </div>
        </ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :loading="loading" native-type="submit" round class="w-full">登录</ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>
    <TopWave />
    <BottomWave />
    <FooterInfo />
  </div>
</template>

<script setup lang="ts">
import { to } from 'await-to-js'
import { useAuthStore } from '@/stores'
import { useLoading } from '@/hooks/loading'
import { generateCaptchaApi } from '@/api/common/capcha'
import type { FormInstance, FormRules } from 'element-plus'
import BottomWave from './components/BottomWave.vue'
import TopWave from './components/TopWave.vue'
import ThemeControl from '@/layouts/components/common/ThemeControl.vue'
import FooterInfo from './components/FooterInfo.vue'

const title = import.meta.env.VITE_APP_TITLE

const formData = reactive({
  username: 'preview001',
  password: 'rengaradmin2025',
  captchaId: 0,
  captchaCode: '',
})
const formRef = useTemplateRef<FormInstance>('formRef')
const rules: FormRules = {
  username: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请输入用户名',
  },
  password: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请输入密码',
  },
  captchaCode: {
    required: true,
    trigger: ['change', 'blur'],
    message: '请输入验证码',
  },
}

function validateFieldOnInput(field: string) {
  const validation = formRef.value?.validateField(field)
  void validation?.catch(() => {})
}

const captchaLoading = ref(false)
const captchaImage = ref('')

async function getChapter() {
  captchaLoading.value = true
  formData.captchaCode = ''
  const [err, res] = await to(generateCaptchaApi())
  captchaLoading.value = false
  if (err) {
    formData.captchaCode = ''
    return
  }
  captchaImage.value = res.image
  formData.captchaId = res.captchaId
}

getChapter()

const authStore = useAuthStore()

const { loading, startLoading, endLoading } = useLoading()

const route = useRoute()
const router = useRouter()
const redirect = route.query.redirect ? decodeURIComponent(route.query.redirect as string) : undefined
async function handleSubmit() {
  startLoading()
  const [err] = await to(formRef.value!.validate())
  if (err) {
    endLoading()
    return
  }
  const [loginErr] = await to(authStore.authLoginAction(formData))
  if (loginErr) {
    getChapter()
    endLoading()
    return
  }
  window.$message.success('登录成功')
  router.replace(redirect || '/')
}
</script>

<style scoped>
.login-card {
  border: none;
  border-radius: 12px;
}

.captcha-image-container {
  width: 120px;
  height: 40px;
}

:deep(.login-card .el-card__body) {
  padding: 24px;
}
</style>
