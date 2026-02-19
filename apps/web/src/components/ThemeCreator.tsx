import { createSignal, createEffect, For } from 'solid-js'
import { TabSwitch } from '@proyecto-viviana/ui'
import {
  type ThemeMode,
  generatePalette,
  generateBgPalette,
  generateAccentPalette,
  defaultColors,
  hexToOklch,
  oklchToHex,
} from '@/utils/color'

function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.179 ? '#06131d' : '#f4f8fa'
}

export interface ThemeCreatorProps {
  onThemeChange?: (cssVars: Record<string, string>) => void
}

export function ThemeCreator(props: ThemeCreatorProps) {
  const [mode, setMode] = createSignal<ThemeMode>('dark')
  const [primaryColor, setPrimaryColor] = createSignal(defaultColors.primary)
  const [bgColor, setBgColor] = createSignal(defaultColors.bg)
  const [accentColor, setAccentColor] = createSignal(defaultColors.accent)

  // Generate CSS variables whenever colors change
  createEffect(() => {
    const currentMode = mode()
    const primary = primaryColor()
    const bg = bgColor()
    const accent = accentColor()

    const primaryPalette = generatePalette(primary, currentMode)
    const bgPalette = generateBgPalette(bg, currentMode)
    const accentPalette = generateAccentPalette(accent)

    const cssVars: Record<string, string> = {
      // Background
      '--color-bg-100': bgPalette['100'],
      '--color-bg-200': bgPalette['200'],
      '--color-bg-300': bgPalette['300'],
      '--color-bg-400': bgPalette['400'],

      // Primary
      '--color-primary-100': primaryPalette['100'],
      '--color-primary-200': primaryPalette['200'],
      '--color-primary-300': primaryPalette['300'],
      '--color-primary-400': primaryPalette['400'],
      '--color-primary-500': primaryPalette['500'],
      '--color-primary-600': primaryPalette['600'],
      '--color-primary-700': primaryPalette['700'],
      '--color-primary-800': primaryPalette['800'],

      // Accent
      '--color-accent': accentPalette['500'],
      '--color-accent-200': accentPalette['200'],
      '--color-accent-300': accentPalette['300'],
      '--color-accent-500': accentPalette['500'],
      '--color-accent-highlight': accentPalette['highlight'],
    }

    props.onThemeChange?.(cssVars)
  })

  const [appearance, setAppearance] = createSignal<'dark' | 'light'>('dark')

  // Sync appearance with data-theme attribute
  createEffect(() => {
    document.documentElement.setAttribute('data-theme', appearance())
  })

  const modeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dim', label: 'Dim' },
    { value: 'dark', label: 'Dark' },
  ]

  const appearanceOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
  ]

  return (
    <div class="vui-theme-creator">
      <h3 class="text-lg font-semibold text-primary-200 mb-4">Theme Creator</h3>

      <div class="flex flex-wrap gap-6">
        {/* Appearance Selector (light/dark) */}
        <div class="flex flex-col gap-2">
          <label class="text-sm text-primary-300">Appearance</label>
          <TabSwitch
            options={appearanceOptions}
            value={appearance()}
            onChange={(v) => setAppearance(v as 'dark' | 'light')}
          />
        </div>

        {/* Palette Mode Selector */}
        <div class="flex flex-col gap-2">
          <label class="text-sm text-primary-300">Palette Mode</label>
          <TabSwitch
            options={modeOptions}
            value={mode()}
            onChange={(v) => setMode(v as ThemeMode)}
          />
        </div>

        {/* Primary Color */}
        <div class="flex flex-col gap-2">
          <label class="text-sm text-primary-300">Primary</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              aria-label="Primary color picker"
              value={primaryColor()}
              onInput={(e) => setPrimaryColor(e.currentTarget.value)}
              class="w-10 h-10 rounded cursor-pointer border border-primary-600 bg-transparent"
            />
            <div class="flex flex-col gap-1">
              <input
                type="text"
                aria-label="Primary color hex value"
                value={primaryColor()}
                onInput={(e) => {
                  const val = e.currentTarget.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setPrimaryColor(val)
                  }
                }}
                class="w-24 px-2 py-0.5 text-xs bg-bg-300 border border-primary-600 rounded text-primary-200 font-mono"
              />
              <span class="text-[10px] text-primary-400 font-mono">
                {(() => {
                  const o = hexToOklch(primaryColor())
                  return `L:${o.l.toFixed(2)} C:${o.c.toFixed(2)} H:${o.h.toFixed(0)}`
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Background Color */}
        <div class="flex flex-col gap-2">
          <label class="text-sm text-primary-300">Background</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              aria-label="Background color picker"
              value={bgColor()}
              onInput={(e) => setBgColor(e.currentTarget.value)}
              class="w-10 h-10 rounded cursor-pointer border border-primary-600 bg-transparent"
            />
            <div class="flex flex-col gap-1">
              <input
                type="text"
                aria-label="Background color hex value"
                value={bgColor()}
                onInput={(e) => {
                  const val = e.currentTarget.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setBgColor(val)
                  }
                }}
                class="w-24 px-2 py-0.5 text-xs bg-bg-300 border border-primary-600 rounded text-primary-200 font-mono"
              />
              <span class="text-[10px] text-primary-400 font-mono">
                {(() => {
                  const o = hexToOklch(bgColor())
                  return `L:${o.l.toFixed(2)} C:${o.c.toFixed(2)} H:${o.h.toFixed(0)}`
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div class="flex flex-col gap-2">
          <label class="text-sm text-primary-300">Accent</label>
          <div class="flex items-center gap-2">
            <input
              type="color"
              aria-label="Accent color picker"
              value={accentColor()}
              onInput={(e) => setAccentColor(e.currentTarget.value)}
              class="w-10 h-10 rounded cursor-pointer border border-primary-600 bg-transparent"
            />
            <div class="flex flex-col gap-1">
              <input
                type="text"
                aria-label="Accent color hex value"
                value={accentColor()}
                onInput={(e) => {
                  const val = e.currentTarget.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    setAccentColor(val)
                  }
                }}
                class="w-24 px-2 py-0.5 text-xs bg-bg-300 border border-primary-600 rounded text-primary-200 font-mono"
              />
              <span class="text-[10px] text-primary-400 font-mono">
                {(() => {
                  const o = hexToOklch(accentColor())
                  return `L:${o.l.toFixed(2)} C:${o.c.toFixed(2)} H:${o.h.toFixed(0)}`
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div class="flex flex-col gap-2 justify-end">
          <button
            onClick={() => {
              setPrimaryColor(defaultColors.primary)
              setBgColor(defaultColors.bg)
              setAccentColor(defaultColors.accent)
              setMode('dark')
              setAppearance('dark')
            }}
            class="px-3 py-2 text-sm bg-primary-700 text-primary-200 rounded hover:bg-primary-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Color Preview */}
      <div class="mt-4 flex gap-1">
        <For each={['100', '200', '300', '400', '500', '600', '700', '800']}>
          {(shade) => {
            const palette = () => generatePalette(primaryColor(), mode())
            return (
              <div
                class="w-8 h-8 rounded text-[10px] flex items-center justify-center font-mono"
                style={{ background: palette()[shade], color: contrastText(palette()[shade]) }}
              >
                {shade}
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}
