# 仓库协作约定

## 项目背景

- 本项目使用 Vue 3、TypeScript、Vite、Pinia 和 UnoCSS。
- 项目处于 Naive UI 向 Element Plus 逐步迁移阶段。迁移期间允许两套 UI 库并存；除非用户明确要求清理，否则不要卸载 `naive-ui`，也不要提前删除其 Provider、自动导入解析器、类型或构建配置。
- Element Plus UI 迁移计划见 [ELEMENT_PLUS_UI_REFACTOR_PLAN.md](./ELEMENT_PLUS_UI_REFACTOR_PLAN.md)。执行时按页面/组件分批替换。

## 业务边界

- 用户要求 UI 重构时，只调整组件、样式、主题接入和必要的 UI 适配层。
- 保持 API 路径、请求参数、DTO、表单校验、分页语义、权限码、路由名称/路径及 Pinia 业务状态转换不变。
- 优先复用现有事件处理函数、API 层、Store 和路由；不要把 UI 替换扩展成业务重写或无关重构。
- 迁移组件前先确认旧组件的事件、默认值、校验触发时机、加载/关闭行为和键盘交互，并在替换后保持一致。

## 代码生成后的格式与检查

- 每次生成或修改代码后，只对本次生成或修改的代码文件执行格式化和 lint；不要因此运行全仓库的 `pnpm format` 或 `pnpm lint`。
- 使用定向命令，例如 `pnpm exec prettier --write <本次变更文件>`，随后执行 `pnpm exec eslint --fix <本次变更文件>`。按文件类型选择适用的工具；不要把 Markdown 或其他非代码文件交给代码 lint。
- 运行前检查 `git status`，运行后检查 `git status` 和 diff；保留用户已有修改，并处理检查产生的无关改动。
- 如果格式化或 lint 失败，先修正本次改动并重新执行对应命令。若命令因环境或依赖问题无法运行，准确报告失败原因和未完成项，不要声称检查通过。
- 不因格式化或 lint 自动附加测试、类型检查或构建；只有用户要求时才新增或运行这些检查。

## 实现习惯

- 遵循 Vue 3 Composition API 与 `<script setup>`，使用精确的 TypeScript 类型。
- 保持请求逻辑在 `src/api/**`，UI 组件通过现有 API/Store 调用；不要在组件迁移时改变服务契约。
- 尊重生成文件顶部的说明。路由由文件路由插件生成时，不要手工重写生成结构。
- 完成后总结修改内容，并说明本次变更文件的格式化与 lint 执行结果。
