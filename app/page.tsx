"use client"

import { useCallback, useEffect, useState } from "react"
import { SlideEditor } from "@/components/slide-editor"
import { MarkdownEditor } from "@/components/markdown-editor"
import { CarouselPreview } from "@/components/carousel-preview"
import { AuthorPanel } from "@/components/author-panel"
import { ThemePicker } from "@/components/theme-picker"
import { FontPicker } from "@/components/font-picker"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { ExportHistory, loadHistory, saveToHistory, clearHistory, type ExportRecord } from "@/components/export-history"
import { Button } from "@/components/ui/button"
import { DEFAULT_THEMES } from "@/lib/types"
import type { SlideData, AuthorInfo, CarouselTheme } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  FileText,
  LayoutList,
  FileCode2,
  ChevronDown,
  Palette,
  Type,
  User,
  Layers,
  Sliders,
  Eye,
} from "lucide-react"

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

const INITIAL_SLIDES: SlideData[] = [
  {
    id: generateId(),
    title: "5 Lessons I Learned Building Products",
    description:
      "After shipping **20+ products** over the past 5 years, here are the hard-won lessons I wish someone had told me from day one.\n\n> The best product is the one your users can't stop talking about.",
    slideNumber: 1,
  },
  {
    id: generateId(),
    title: "Start With the Problem",
    description:
      "Most founders fall in love with their solution. Instead:\n\n- **Talk to 50 users** before writing a single line of code\n- Identify the *pain* not the *feature*\n- Ask \"Would you pay for this?\" early\n\nThe best ideas come from **deep empathy**, not eureka moments.",
    slideNumber: 2,
  },
  {
    id: generateId(),
    title: "Ship Fast, Learn Faster",
    description:
      "Perfectionism is the enemy of progress.\n\nHere's my launch checklist:\n\n```typescript\nconst launch = async (idea: string) => {\n  const mvp = await build(idea, { weeks: 2 });\n  const feedback = await ship(mvp);\n  return iterate(feedback);\n};\n```\n\n`Speed wins.` Every time.",
    slideNumber: 3,
  },
  {
    id: generateId(),
    title: "Follow for More Tips",
    description:
      "If you found this valuable:\n\n- **Save** this post for later\n- **Share** it with a founder who needs this\n- **Follow me** for daily product insights\n\nLet's build something great together.",
    slideNumber: 4,
  },
]

const INITIAL_AUTHOR: AuthorInfo = {
  name: "Alex Morgan",
  tag: "@alexmorgan",
  thumbnailUrl: "",
  swipeText: "Swipe",
}

/* ─── Collapsible property section ─── */
function PropertySection({
  icon: Icon,
  title,
  defaultOpen = true,
  children,
}: {
  icon: React.ElementType
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

const AUTHOR_STORAGE_KEY = "carousel-author"

function loadAuthor(): AuthorInfo {
  if (typeof window === "undefined") return INITIAL_AUTHOR
  try {
    const stored = localStorage.getItem(AUTHOR_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return INITIAL_AUTHOR
}

export default function Page() {
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES)
  const [author, setAuthor] = useState<AuthorInfo>(INITIAL_AUTHOR)
  const [theme, setTheme] = useState<CarouselTheme>(
    DEFAULT_THEMES.find((t) => t.name === "Cotton Candy")!.theme
  )

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [editorMode, setEditorMode] = useState<"slides" | "markdown">("slides")
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([])
  const [mobileTab, setMobileTab] = useState<"slides" | "preview" | "design">("preview")
  const isMobile = useIsMobile()

  // Hydrate from localStorage on mount
  useEffect(() => {
    setAuthor(loadAuthor())
    setExportHistory(loadHistory())
  }, [])

  const handleUpdateSlide = useCallback(
    (id: string, field: keyof SlideData, value: string) => {
      setSlides((prev) =>
        prev.map((slide) =>
          slide.id === id ? { ...slide, [field]: value } : slide
        )
      )
    },
    []
  )

  const handleAddSlide = useCallback(() => {
    setSlides((prev) => {
      const newSlide: SlideData = {
        id: generateId(),
        title: "",
        description: "",
        slideNumber: prev.length + 1,
      }
      return [...prev, newSlide]
    })
    setActiveSlideIndex(slides.length)
  }, [slides.length])

  const handleRemoveSlide = useCallback(
    (id: string) => {
      setSlides((prev) => {
        const filtered = prev.filter((s) => s.id !== id)
        return filtered.map((s, i) => ({ ...s, slideNumber: i + 1 }))
      })
      setActiveSlideIndex((prev) => Math.max(0, Math.min(prev, slides.length - 2)))
    },
    [slides.length]
  )

  const handleDuplicateSlide = useCallback(
    (id: string) => {
      setSlides((prev) => {
        const index = prev.findIndex((s) => s.id === id)
        if (index === -1) return prev
        const original = prev[index]
        const duplicate: SlideData = {
          ...original,
          id: generateId(),
        }
        const updated = [...prev]
        updated.splice(index + 1, 0, duplicate)
        return updated.map((s, i) => ({ ...s, slideNumber: i + 1 }))
      })
    },
    []
  )

  const handleUpdateAuthor = useCallback(
    (field: keyof AuthorInfo, value: string) => {
      setAuthor((prev) => {
        const next = { ...prev, [field]: value }
        try { localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(next)) } catch {}
        return next
      })
    },
    []
  )

  const handleFontChange = useCallback(
    (fontStyle: CarouselTheme["fontStyle"]) => {
      setTheme((prev) => ({ ...prev, fontStyle }))
    },
    []
  )

  const handleExportComplete = useCallback(
    (thumbnail: string, title: string) => {
      setExportHistory(saveToHistory(thumbnail, title))
    },
    []
  )

  const handleClearHistory = useCallback(() => {
    clearHistory()
    setExportHistory([])
  }, [])

  /* ── Shared panel content ── */
  const slidesPanel = (
    <div className="flex flex-1 flex-col overflow-hidden bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Slides</span>
        </div>
        <div className="flex items-center rounded-md border border-border bg-muted/50 p-0.5">
          <Button
            variant={editorMode === "slides" ? "default" : "ghost"}
            size="sm"
            className="h-6 gap-1 px-2 text-[10px]"
            onClick={() => setEditorMode("slides")}
          >
            <LayoutList className="h-3 w-3" />
            Cards
          </Button>
          <Button
            variant={editorMode === "markdown" ? "default" : "ghost"}
            size="sm"
            className="h-6 gap-1 px-2 text-[10px]"
            onClick={() => setEditorMode("markdown")}
          >
            <FileCode2 className="h-3 w-3" />
            Markdown
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {editorMode === "slides" ? (
          <SlideEditor
            slides={slides}
            activeSlideIndex={activeSlideIndex}
            onUpdateSlide={handleUpdateSlide}
            onRemoveSlide={handleRemoveSlide}
            onAddSlide={handleAddSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onSetActiveSlide={setActiveSlideIndex}
          />
        ) : (
          <MarkdownEditor
            slides={slides}
            onSlidesChange={setSlides}
            onSetActiveSlide={setActiveSlideIndex}
          />
        )}
      </div>
    </div>
  )

  const previewPanel = (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto bg-muted/40 canvas-bg">
        <div className="flex min-h-full w-full items-center justify-center px-0 py-2 sm:p-4 md:p-8">
          <CarouselPreview
            slides={slides}
            author={author}
            theme={theme}
            activeSlideIndex={activeSlideIndex}
            onSetActiveSlide={setActiveSlideIndex}
            onExportComplete={handleExportComplete}
          />
        </div>
      </div>
      {!isMobile && (
        <ExportHistory history={exportHistory} onClear={handleClearHistory} />
      )}
    </div>
  )

  const designPanel = (
    <div className="flex flex-1 flex-col overflow-hidden bg-card">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <Palette className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">Design</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PropertySection icon={Palette} title="Theme">
          <ThemePicker activeTheme={theme} onSelectTheme={setTheme} />
        </PropertySection>
        <PropertySection icon={Sliders} title="Customize">
          <ThemeCustomizer theme={theme} onThemeChange={setTheme} />
        </PropertySection>
        <PropertySection icon={Type} title="Font">
          <FontPicker activeFont={theme.fontStyle} onSelectFont={handleFontChange} />
        </PropertySection>
        <PropertySection icon={User} title="Author">
          <AuthorPanel author={author} onUpdateAuthor={handleUpdateAuthor} />
        </PropertySection>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
        {/* ── Mobile header ── */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Carousel Generator</span>
          </div>
        </header>

        {/* ── Mobile content ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {mobileTab === "slides" && slidesPanel}
          {mobileTab === "preview" && previewPanel}
          {mobileTab === "design" && designPanel}
        </div>

        {/* ── Mobile tab bar ── */}
        <nav className="flex h-14 shrink-0 items-center justify-around border-t border-border bg-card">
          <button
            onClick={() => setMobileTab("slides")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors ${
              mobileTab === "slides"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Layers className="h-5 w-5" />
            Slides
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors ${
              mobileTab === "preview"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Eye className="h-5 w-5" />
            Preview
          </button>
          <button
            onClick={() => setMobileTab("design")}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors ${
              mobileTab === "design"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Palette className="h-5 w-5" />
            Design
          </button>
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* ── Toolbar ── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">LinkedIn Carousel Generator</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Created by{" "}
          <a
            href="https://www.linkedin.com/in/maciej-wiatr/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Maciej Wiatr
          </a>
        </span>
      </header>

      {/* ── Three-column layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel: Slides ── */}
        <div className="flex w-[360px] shrink-0 flex-col border-r border-border">
          {slidesPanel}
        </div>

        {/* ── Center: Canvas ── */}
        {previewPanel}

        {/* ── Right panel: Design ── */}
        <div className="flex w-[280px] shrink-0 flex-col border-l border-border">
          {designPanel}
        </div>
      </div>
    </div>
  )
}
