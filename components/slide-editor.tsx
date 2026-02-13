"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { GripVertical, Trash2, Plus, Copy } from "lucide-react"
import type { SlideData } from "@/lib/types"

interface SlideEditorProps {
  slides: SlideData[]
  activeSlideIndex: number
  onUpdateSlide: (id: string, field: keyof SlideData, value: string) => void
  onRemoveSlide: (id: string) => void
  onAddSlide: () => void
  onDuplicateSlide: (id: string) => void
  onSetActiveSlide: (index: number) => void
}

export function SlideEditor({
  slides,
  activeSlideIndex,
  onUpdateSlide,
  onRemoveSlide,
  onAddSlide,
  onDuplicateSlide,
  onSetActiveSlide,
}: SlideEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`group rounded-lg border-2 transition-all cursor-pointer ${
            index === activeSlideIndex
              ? "border-primary bg-card shadow-sm"
              : "border-transparent bg-card/50 hover:border-border hover:bg-card"
          }`}
          onClick={() => onSetActiveSlide(index)}
        >
          <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {index + 1}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Slide {index + 1}
            </span>
          </div>
          <div className="flex items-start gap-3 p-4">
            {/* Fields */}
            <div className="flex flex-1 flex-col gap-3">
              <Input
                placeholder="Slide title"
                value={slide.title}
                onChange={(e) => onUpdateSlide(slide.id, "title", e.target.value)}
                className="border-input bg-background text-foreground font-semibold placeholder:text-muted-foreground"
              />
              <Textarea
                placeholder="Slide content in **markdown**..."
                value={slide.description}
                onChange={(e) => onUpdateSlide(slide.id, "description", e.target.value)}
                rows={4}
                className="resize-none border-input bg-background text-foreground font-mono text-xs leading-relaxed placeholder:text-muted-foreground"
              />
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateSlide(slide.id)
                }}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              {slides.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveSlide(slide.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add slide button */}
      <Button
        variant="outline"
        className="h-12 w-full border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
        onClick={onAddSlide}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Slide
      </Button>
    </div>
  )
}
