import { generateTailwindColorByColor } from '@rengar-admin/color'
import { useAppStore } from '@/stores'

export function injectTailwindCssVarToGlobal(color: string, key = 'primary') {
  const colors = generateTailwindColorByColor(color)
  const appStore = useAppStore()

  const root = document.documentElement
  for (const colorKey in colors) {
    root.style.setProperty(
      `--color-${key}${colorKey === 'DEFAULT' ? '' : `-${colorKey}`}`,
      colors[colorKey as ThemeColorValue],
    )
  }

  if (key === 'primary') {
    const primaryColorRgb = [1, 3, 5]
      .map((start) => Number.parseInt(colors.DEFAULT.slice(start, start + 2), 16))
      .join(', ')
    root.style.setProperty('--el-color-primary-rgb', primaryColorRgb)
  }

  appStore.themeOverrides.common = {
    primaryColor: colors.DEFAULT,
    primaryColorHover: colors['400'],
    primaryColorPressed: colors['700'],
    primaryColorSuppl: colors['400'],
  }
}
