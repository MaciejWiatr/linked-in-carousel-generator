"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SlidePreview } from "@/components/slide-preview"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react"
import type { SlideData, AuthorInfo, CarouselTheme } from "@/lib/types"

interface CarouselPreviewProps {
  slides: SlideData[]
  author: AuthorInfo
  theme: CarouselTheme
  activeSlideIndex: number
  onSetActiveSlide: (index: number) => void
  onExportComplete?: (thumbnail: string, title: string) => void
}

export function CarouselPreview({
  slides,
  author,
  theme,
  activeSlideIndex,
  onSetActiveSlide,
  onExportComplete,
}: CarouselPreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const visibleSlideRef = useRef<HTMLDivElement | null>(null)
  const activeSlideIndexRef = useRef(activeSlideIndex)

  useEffect(() => {
    activeSlideIndexRef.current = activeSlideIndex
  }, [activeSlideIndex])

  const goToPrev = () => {
    if (activeSlideIndex > 0) {
      onSetActiveSlide(activeSlideIndex - 1)
    }
  }

  const goToNext = () => {
    if (activeSlideIndex < slides.length - 1) {
      onSetActiveSlide(activeSlideIndex + 1)
    }
  }

  const waitForFonts = useCallback(async () => {
    if (typeof document === "undefined" || !("fonts" in document)) return
    const fontSet = document.fonts as FontFaceSet
    await fontSet.ready
  }, [])

  const waitForImages = useCallback(async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll<HTMLImageElement>("img"))
    if (images.length === 0) return

    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve()
              return
            }

            const done = () => {
              img.removeEventListener("load", done)
              img.removeEventListener("error", done)
              resolve()
            }

            img.addEventListener("load", done, { once: true })
            img.addEventListener("error", done, { once: true })
          })
      )
    )
  }, [])

  const waitForSlideIndex = useCallback(async (targetIndex: number) => {
    let attempts = 0
    while (activeSlideIndexRef.current !== targetIndex && attempts < 60) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      attempts += 1
    }
  }, [])

  const exportToPdf = useCallback(async () => {
    setIsExporting(true)
    const previousIndex = activeSlideIndexRef.current
    try {
      if (!visibleSlideRef.current || slides.length === 0) {
        throw new Error("No slides available to export")
      }
      await waitForFonts()

      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ])

      const rawTitle = slides[0]?.title?.trim() || "linkedin-carousel"
      const safeTitle = rawTitle
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
      const fileName = `${safeTitle || "linkedin-carousel"}.pdf`

      const pdfSize = 540
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [pdfSize, pdfSize],
      })

      for (let i = 0; i < slides.length; i++) {
        onSetActiveSlide(i)
        await waitForSlideIndex(i)
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )

        if (!visibleSlideRef.current) {
          throw new Error("Slide preview is not ready")
        }
        await waitForImages(visibleSlideRef.current)

        const imageData = await toPng(visibleSlideRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: undefined,
        })
        if (i > 0) {
          pdf.addPage([pdfSize, pdfSize], "landscape")
        }
        pdf.addImage(imageData, "PNG", 0, 0, pdfSize, pdfSize)
      }

      pdf.save(fileName)

      // Capture thumbnail of first slide for history
      if (onExportComplete) {
        onSetActiveSlide(0)
        await waitForSlideIndex(0)
        await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
        if (visibleSlideRef.current) {
          const thumb = await toPng(visibleSlideRef.current, { cacheBust: true, pixelRatio: 0.5 })
          onExportComplete(thumb, slides[0]?.title || "Untitled")
        }
      }
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      onSetActiveSlide(previousIndex)
      setIsExporting(false)
    }
  }, [onSetActiveSlide, onExportComplete, slides, waitForFonts, waitForImages, waitForSlideIndex])

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Slide preview area */}
      <div className="relative w-full max-w-[540px]">
        {/* Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground hover:bg-muted"
              onClick={goToPrev}
              disabled={activeSlideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              {activeSlideIndex + 1} / {slides.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-border text-foreground hover:bg-muted"
              onClick={goToNext}
              disabled={activeSlideIndex === slides.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={exportToPdf}
            disabled={isExporting}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>

        {/* Visible preview */}
        <div className="overflow-hidden rounded-xl shadow-xl ring-1 ring-border">
          <div ref={visibleSlideRef} className="overflow-hidden">
            <SlidePreview
              slide={slides[activeSlideIndex]}
              author={author}
              theme={theme}
              totalSlides={slides.length}
            />
          </div>
        </div>

        {/* Slide dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === activeSlideIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => onSetActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
