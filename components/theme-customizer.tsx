"use client"

import type { CarouselTheme } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Square, SquareCheck } from "lucide-react"

interface ThemeCustomizerProps {
  theme: CarouselTheme
  onThemeChange: (theme: CarouselTheme) => void
}

const PADDING_OPTIONS = [
  { label: "None", value: 0 },
  { label: "S", value: 12 },
  { label: "M", value: 24 },
  { label: "L", value: 40 },
]

const RADIUS_OPTIONS = [
  { label: "None", value: 0 },
  { label: "S", value: 8 },
  { label: "M", value: 16 },
  { label: "L", value: 24 },
  { label: "XL", value: 32 },
]

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7 cursor-pointer rounded-md border border-border bg-transparent p-0.5"
      />
      <div className="flex flex-1 flex-col">
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <span className="font-mono text-[10px] text-foreground">{value}</span>
      </div>
    </div>
  )
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: number }[]
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "")
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export function ThemeCustomizer({ theme, onThemeChange }: ThemeCustomizerProps) {
  const update = (patch: Partial<CarouselTheme>) =>
    onThemeChange({ ...theme, ...patch })

  const currentPadding = theme.contentPadding || 0
  const boxEnabled = !!theme.paddingBox
  const boxColor = theme.paddingBoxColor || (isDarkColor(theme.backgroundColor) ? "#1c1c2e" : "#ffffff")
  const boxRadius = theme.paddingBoxRadius ?? 16

  return (
    <div className="flex flex-col gap-4">
      {/* Colors */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Colors
        </Label>
        <div className="flex flex-col gap-2">
          <ColorField
            label="Text"
            value={theme.textColor}
            onChange={(v) => update({ textColor: v })}
          />
          <ColorField
            label="Accent"
            value={theme.accentColor}
            onChange={(v) => update({ accentColor: v })}
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <Label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Padding
        </Label>
        <SegmentedControl
          options={PADDING_OPTIONS}
          value={currentPadding}
          onChange={(v) => update({ contentPadding: v })}
        />
      </div>

      {/* Padding Box */}
      <div>
        <button
          onClick={() => {
            const next = !boxEnabled
            update({
              paddingBox: next,
              contentPadding: next ? Math.max(currentPadding, 24) : currentPadding,
              paddingBoxColor: next ? boxColor : undefined,
            })
          }}
          className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            boxEnabled
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          {boxEnabled ? (
            <SquareCheck className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <div className="flex flex-1 flex-col">
            <span>Padding Box</span>
            <span className="text-[10px] font-normal opacity-60">
              Content card with rounded corners
            </span>
          </div>
        </button>

        {boxEnabled && (
          <div className="mt-3 flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <ColorField
              label="Box Color"
              value={boxColor}
              onChange={(v) => update({ paddingBoxColor: v })}
            />
            <div>
              <Label className="mb-1.5 block text-[10px] text-muted-foreground">
                Border Radius
              </Label>
              <SegmentedControl
                options={RADIUS_OPTIONS}
                value={boxRadius}
                onChange={(v) => update({ paddingBoxRadius: v })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
