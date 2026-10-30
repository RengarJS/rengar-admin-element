import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'

import type { PluginOption } from 'vite'
export function setupAutoImportPlugin(): PluginOption[] {
  const plugins: PluginOption[] = [
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: path.resolve(process.cwd(), 'typings/app/auto-imports.d.ts'),
    }),
    Components({
      resolvers: [IconsResolver(), ElementPlusResolver()],
      dts: path.resolve(process.cwd(), 'typings/app/components.d.ts'),
      directoryAsNamespace: true,
    }),
  ]
  return plugins
}
