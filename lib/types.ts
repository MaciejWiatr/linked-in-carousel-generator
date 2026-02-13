export interface SlideData {
  id: string
  title: string
  description: string
  slideNumber: number
}

export interface AuthorInfo {
  name: string
  tag: string
  thumbnailUrl: string
  swipeText: string
}

export type LayoutVariant =
  | "classic"
  | "centered"
  | "split"
  | "bold-number"
  | "minimal"
  | "editorial"

export interface CarouselTheme {
  backgroundColor: string
  textColor: string
  accentColor: string
  tagColor: string
  // extended style props
  layout: LayoutVariant
  fontStyle: "inter" | "geist" | "poppins" | "montserrat" | "google-sans"
  backgroundGradient?: string
  pattern?: "dots" | "grid" | "diagonal" | "circles" | "none"
  borderStyle?: "none" | "accent-top" | "accent-left" | "accent-bottom" | "full-border"
  titleSize?: "sm" | "md" | "lg" | "xl"
  slideNumberStyle?: "badge" | "large-watermark" | "minimal-dash" | "circle-outline" | "hidden"
  contentPadding?: number
  paddingBox?: boolean
  paddingBoxColor?: string
  paddingBoxRadius?: number
}

export interface ThemeEntry {
  name: string
  category: string
  theme: CarouselTheme
}

export const DEFAULT_THEMES: ThemeEntry[] = [
  {
    name: "Charcoal",
    category: "Dark",
    theme: {
      backgroundColor: "#18181b",
      textColor: "#fafafa",
      accentColor: "#a1a1aa",
      tagColor: "#3f3f46",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
    },
  },
  // ── Light Gradients ──
  {
    name: "Aurora",
    category: "Gradient",
    theme: {
      backgroundColor: "#c7d2fe",
      textColor: "#1e1b4b",
      accentColor: "#6366f1",
      tagColor: "#a5b4fc",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 120% 80% at 20% 30%, #818cf8cc 0%, transparent 70%), " +
        "radial-gradient(ellipse 100% 90% at 80% 20%, #a78bfacc 0%, transparent 60%), " +
        "radial-gradient(ellipse 90% 100% at 60% 80%, #93c5fdcc 0%, transparent 65%), " +
        "radial-gradient(ellipse 80% 70% at 30% 70%, #c4b5fdcc 0%, transparent 55%), " +
        "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 50%, #bfdbfe 100%)",
    },
  },
  {
    name: "Peach Mist",
    category: "Gradient",
    theme: {
      backgroundColor: "#ffe4e6",
      textColor: "#4c1d2e",
      accentColor: "#e11d48",
      tagColor: "#fecdd3",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 110% 80% at 25% 25%, #fda4afcc 0%, transparent 65%), " +
        "radial-gradient(ellipse 100% 90% at 75% 35%, #fdba74cc 0%, transparent 60%), " +
        "radial-gradient(ellipse 90% 80% at 50% 75%, #fecdd3cc 0%, transparent 55%), " +
        "radial-gradient(ellipse 80% 70% at 80% 80%, #fda4afcc 0%, transparent 50%), " +
        "linear-gradient(150deg, #ffe4e6 0%, #fed7aa 40%, #fecdd3 100%)",
    },
  },
  {
    name: "Honey Glow",
    category: "Gradient",
    theme: {
      backgroundColor: "#fef3c7",
      textColor: "#78350f",
      accentColor: "#d97706",
      tagColor: "#fde68a",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 110% 90% at 20% 25%, #fbbf24cc 0%, transparent 65%), " +
        "radial-gradient(ellipse 90% 80% at 80% 20%, #fb923ccc 0%, transparent 55%), " +
        "radial-gradient(ellipse 100% 85% at 60% 75%, #fcd34dcc 0%, transparent 60%), " +
        "radial-gradient(ellipse 80% 70% at 30% 80%, #fdba74cc 0%, transparent 50%), " +
        "linear-gradient(140deg, #fef3c7 0%, #ffedd5 50%, #fef9c3 100%)",
    },
  },
  // ── Dark Gradients ──
  {
    name: "Cosmic",
    category: "Gradient",
    theme: {
      backgroundColor: "#1e1b4b",
      textColor: "#e0e7ff",
      accentColor: "#a78bfa",
      tagColor: "#3730a3",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 120% 80% at 25% 20%, #7c3aedcc 0%, transparent 65%), " +
        "radial-gradient(ellipse 90% 100% at 75% 30%, #4338cacc 0%, transparent 60%), " +
        "radial-gradient(ellipse 100% 85% at 50% 80%, #6366f1cc 0%, transparent 55%), " +
        "radial-gradient(ellipse 80% 70% at 20% 75%, #4f46e5cc 0%, transparent 50%), " +
        "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)",
    },
  },
  {
    name: "Ocean Depths",
    category: "Gradient",
    theme: {
      backgroundColor: "#0c1a2e",
      textColor: "#cffafe",
      accentColor: "#22d3ee",
      tagColor: "#164e63",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 110% 85% at 20% 25%, #0369a1cc 0%, transparent 65%), " +
        "radial-gradient(ellipse 90% 90% at 80% 20%, #0e7490cc 0%, transparent 55%), " +
        "radial-gradient(ellipse 100% 80% at 55% 80%, #155e75cc 0%, transparent 60%), " +
        "radial-gradient(ellipse 80% 70% at 30% 70%, #0891b2cc 0%, transparent 50%), " +
        "linear-gradient(150deg, #0c1a2e 0%, #0c4a6e 40%, #0f172a 100%)",
    },
  },
  {
    name: "Ember",
    category: "Gradient",
    theme: {
      backgroundColor: "#1c0a00",
      textColor: "#fee2e2",
      accentColor: "#f97316",
      tagColor: "#7c2d12",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 120% 80% at 30% 20%, #dc2626cc 0%, transparent 65%), " +
        "radial-gradient(ellipse 90% 100% at 75% 30%, #ea580ccc 0%, transparent 60%), " +
        "radial-gradient(ellipse 100% 85% at 50% 80%, #b91c1ccc 0%, transparent 55%), " +
        "radial-gradient(ellipse 80% 70% at 20% 70%, #c2410ccc 0%, transparent 50%), " +
        "linear-gradient(135deg, #1c0a00 0%, #451a03 50%, #1c0a00 100%)",
    },
  },
  // ── ColorFlow Gradients ──
  {
    name: "Citrus Burst",
    category: "Gradient",
    theme: {
      backgroundColor: "#f59e0b",
      textColor: "#1c0a00",
      accentColor: "#dc2626",
      tagColor: "#fde68a",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 120% 90% at 0% 0%, #ef4444cc 0%, transparent 60%), " +
        "radial-gradient(ellipse 100% 80% at 90% 10%, #f97316cc 0%, transparent 55%), " +
        "radial-gradient(ellipse 110% 90% at 100% 100%, #84cc16cc 0%, transparent 65%), " +
        "radial-gradient(ellipse 90% 80% at 40% 60%, #eab308cc 0%, transparent 50%), " +
        "linear-gradient(135deg, #ef4444 0%, #f97316 30%, #eab308 60%, #84cc16 100%)",
    },
  },
  {
    name: "Magenta Bloom",
    category: "Gradient",
    theme: {
      backgroundColor: "#f3e8ff",
      textColor: "#3b0764",
      accentColor: "#c026d3",
      tagColor: "#e9d5ff",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 80% 90% at 45% 45%, #a21cafcc 0%, transparent 55%), " +
        "radial-gradient(ellipse 100% 80% at 60% 30%, #e11d48cc 0%, transparent 60%), " +
        "radial-gradient(ellipse 70% 70% at 35% 60%, #c026d3cc 0%, transparent 50%), " +
        "radial-gradient(ellipse 90% 60% at 75% 70%, #ef4444aa 0%, transparent 55%), " +
        "linear-gradient(180deg, #e2e8f0 0%, #f3e8ff 30%, #e2e8f0 100%)",
    },
  },
  {
    name: "Prism Wave",
    category: "Gradient",
    theme: {
      backgroundColor: "#0f0a2e",
      textColor: "#e0e7ff",
      accentColor: "#22d3ee",
      tagColor: "#1e1b4b",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 60% 40% at 15% 75%, #f97316aa 0%, transparent 70%), " +
        "radial-gradient(ellipse 50% 35% at 40% 80%, #22c55eaa 0%, transparent 65%), " +
        "radial-gradient(ellipse 50% 35% at 65% 70%, #06b6d4aa 0%, transparent 65%), " +
        "radial-gradient(ellipse 50% 40% at 90% 75%, #a855f7aa 0%, transparent 70%), " +
        "linear-gradient(180deg, #0f0a2e 0%, #0f0a2e 55%, #1a1145 75%, #2d1f6e 100%)",
    },
  },
  {
    name: "Cotton Candy",
    category: "Gradient",
    theme: {
      backgroundColor: "#fce7f3",
      textColor: "#3b0764",
      accentColor: "#8b5cf6",
      tagColor: "#e9d5ff",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 100% 60% at 10% 30%, #93c5fdcc 0%, transparent 60%), " +
        "radial-gradient(ellipse 90% 50% at 50% 35%, #a855f7cc 0%, transparent 55%), " +
        "radial-gradient(ellipse 70% 40% at 90% 40%, #f97316aa 0%, transparent 50%), " +
        "radial-gradient(ellipse 110% 70% at 50% 80%, #fb7185cc 0%, transparent 60%), " +
        "linear-gradient(180deg, #e0e7ff 0%, #c4b5fd 30%, #fda4af 70%, #fce7f3 100%)",
    },
  },
  {
    name: "Steel Ember",
    category: "Gradient",
    theme: {
      backgroundColor: "#1e293b",
      textColor: "#e2e8f0",
      accentColor: "#ef4444",
      tagColor: "#334155",
      layout: "minimal",
      fontStyle: "inter",
      pattern: "none",
      borderStyle: "none",
      titleSize: "xl",
      slideNumberStyle: "minimal-dash",
      paddingBox: true,
      contentPadding: 24,
      backgroundGradient:
        "radial-gradient(ellipse 80% 70% at 30% 40%, #b91c1caa 0%, transparent 55%), " +
        "radial-gradient(ellipse 100% 60% at 70% 20%, #cbd5e1aa 0%, transparent 60%), " +
        "radial-gradient(ellipse 70% 50% at 20% 90%, #dc2626aa 0%, transparent 50%), " +
        "radial-gradient(ellipse 90% 70% at 80% 80%, #1e3a5fcc 0%, transparent 55%), " +
        "linear-gradient(160deg, #475569 0%, #cbd5e1 30%, #94a3b8 60%, #1e293b 100%)",
    },
  },
]
