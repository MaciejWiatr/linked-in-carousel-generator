"use client"

import { useCallback, useMemo } from "react"
import { Textarea } from "@/components/ui/textarea"
import type { SlideData } from "@/lib/types"

interface MarkdownEditorProps {
  slides: SlideData[]
  onSlidesChange: (slides: SlideData[]) => void
  onSetActiveSlide: (index: number) => void
}

// ─── Convert slides array -> single markdown string ───
function slidesToMarkdown(slides: SlideData[]): string {
  return slides
    .map((slide) => {
      const titleLine = slide.title ? `# ${slide.title}` : ""
      const body = slide.description || ""
      return titleLine ? `${titleLine}\n\n${body}` : body
    })
    .join("\n\n---\n\n")
}

// ─── Convert single markdown string -> slides array ───
let idCounter = 0
function nextId() {
  idCounter++
  return `md-${Date.now()}-${idCounter}`
}

function markdownToSlides(markdown: string): SlideData[] {
  const sections = markdown.split(/\n---\n/)

  if (sections.length === 0) {
    return [
      {
        id: nextId(),
        title: "",
        description: "",
        slideNumber: 1,
      },
    ]
  }

  return sections.map((section, index) => {
    const trimmed = section.trim()

    // Check if the section starts with a heading (# Title)
    const headingMatch = trimmed.match(/^#\s+(.+?)(?:\n|$)/)

    let title = ""
    let description = trimmed

    if (headingMatch) {
      title = headingMatch[1].trim()
      // Everything after the heading line is the description
      description = trimmed.slice(headingMatch[0].length).trim()
    }

    return {
      id: nextId(),
      title,
      description,
      slideNumber: index + 1,
    }
  })
}

export function MarkdownEditor({
  slides,
  onSlidesChange,
  onSetActiveSlide,
}: MarkdownEditorProps) {
  const markdown = useMemo(() => slidesToMarkdown(slides), [slides])

  const handleChange = useCallback(
    (value: string) => {
      const parsed = markdownToSlides(value)
      onSlidesChange(parsed)
    },
    [onSlidesChange]
  )

  // Figure out which slide the cursor is in based on `---` separators
  const handleCursorChange = useCallback(
    (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget
      const cursorPos = textarea.selectionStart
      const textBefore = textarea.value.slice(0, cursorPos)
      const separatorCount = (textBefore.match(/\n---\n/g) || []).length
      onSetActiveSlide(separatorCount)
    },
    [onSetActiveSlide]
  )

  const slideCount = slides.length

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
          {slideCount}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">
          {slideCount} {slideCount === 1 ? "slide" : "slides"}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Separate slides with <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">---</code> and use <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">{"# Heading"}</code> for titles
      </p>

      <div className="relative">
        <Textarea
          value={markdown}
          onChange={(e) => handleChange(e.target.value)}
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
          placeholder={`# Slide Title\n\nYour content in **markdown**...\n\n---\n\n# Next Slide\n\nMore content here...`}
          className="min-h-[500px] resize-none border-input bg-background font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
