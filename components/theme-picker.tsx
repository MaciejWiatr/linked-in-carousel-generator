"use client"

import { DEFAULT_THEMES, type CarouselTheme, type ThemeEntry } from "@/lib/types"
import { Check } from "lucide-react"

interface ThemePickerProps {
  activeTheme: CarouselTheme
  onSelectTheme: (theme: CarouselTheme) => void
}

function isSameTheme(a: CarouselTheme, b: CarouselTheme) {
  return (
    a.backgroundColor === b.backgroundColor &&
    a.accentColor === b.accentColor &&
    a.layout === b.layout
  )
}

const CATEGORY_ORDER = ["Dark", "Light", "Gradient"]

function groupByCategory(themes: ThemeEntry[]): Map<string, ThemeEntry[]> {
  const grouped = new Map<string, ThemeEntry[]>()
  for (const item of themes) {
    const list = grouped.get(item.category) || []
    list.push(item)
    grouped.set(item.category, list)
  }
  return grouped
}

export function ThemePicker({ activeTheme, onSelectTheme }: ThemePickerProps) {
  const grouped = groupByCategory(DEFAULT_THEMES)

  return (
    <div className="space-y-3">
      {CATEGORY_ORDER.map((category) => {
        const items = grouped.get(category)
        if (!items?.length) return null
        return (
          <div key={category}>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {category}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => {
                const isActive = isSameTheme(item.theme, activeTheme)
                return (
                  <button
                    key={item.name}
                    onClick={() => onSelectTheme(item.theme)}
                    className={`group relative flex flex-col items-center gap-1 rounded-md px-2 py-1.5 transition-all ${
                      isActive
                        ? "bg-accent ring-2 ring-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div
                      className="relative h-8 w-8 overflow-hidden rounded-md shadow-sm"
                      style={{
                        background: item.theme.backgroundGradient || item.theme.backgroundColor,
                        border: `1.5px solid ${item.theme.accentColor}40`,
                      }}
                    >
                      <div className="absolute inset-1 flex flex-col gap-0.5 opacity-60">
                        <div
                          className="h-0.5 w-3 rounded-full"
                          style={{ backgroundColor: item.theme.textColor }}
                        />
                        <div
                          className="h-0.5 w-4 rounded-full"
                          style={{ backgroundColor: item.theme.textColor, opacity: 0.4 }}
                        />
                      </div>
                      <div
                        className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.theme.accentColor }}
                      />
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-medium leading-none text-muted-foreground">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
