"use client"

import type { CarouselTheme } from "@/lib/types"
import { Check } from "lucide-react"

interface FontPickerProps {
  activeFont: CarouselTheme["fontStyle"]
  onSelectFont: (font: CarouselTheme["fontStyle"]) => void
}

const FONT_OPTIONS: {
  id: CarouselTheme["fontStyle"]
  label: string
  fontFamily: string
}[] = [
  { id: "inter", label: "Inter", fontFamily: "'Inter', sans-serif" },
  { id: "geist", label: "Geist", fontFamily: "'Geist', sans-serif" },
  { id: "poppins", label: "Poppins", fontFamily: "'Poppins', sans-serif" },
  { id: "montserrat", label: "Montserrat", fontFamily: "'Montserrat', sans-serif" },
  { id: "google-sans", label: "Google Sans", fontFamily: "'Google Sans Flex', 'Google Sans', sans-serif" },
  { id: "geist-pixel", label: "Geist Pixel", fontFamily: "var(--font-geist-pixel-square)" },
]

export function FontPicker({ activeFont, onSelectFont }: FontPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {FONT_OPTIONS.map((font) => {
        const isActive = font.id === activeFont
        return (
          <button
            key={font.id}
            onClick={() => onSelectFont(font.id)}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <span style={{ fontFamily: font.fontFamily }} className="font-medium">
              {font.label}
            </span>
            {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
          </button>
        )
      })}
    </div>
  )
}
