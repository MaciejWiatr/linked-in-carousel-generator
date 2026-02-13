"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import { ShikiCodeBlock } from "@/components/shiki-code-block"
import type { SlideData, AuthorInfo, CarouselTheme } from "@/lib/types"

interface SlidePreviewProps {
  slide: SlideData
  author: AuthorInfo
  theme: CarouselTheme
  totalSlides: number
  exportMode?: boolean
}

/* ─── Pattern SVG backgrounds ─── */
function getPatternSvg(pattern: CarouselTheme["pattern"], color: string) {
  const encoded = encodeURIComponent(color)
  switch (pattern) {
    case "dots":
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='${encoded}' opacity='0.12'/%3E%3C/svg%3E")`
    case "grid":
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='${encoded}' stroke-width='0.5' opacity='0.08'/%3E%3Crect width='40' height='40' fill='none' stroke='${encoded}' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E")`
    case "diagonal":
      return `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 16L16 0M-4 4L4 -4M12 20L20 12' stroke='${encoded}' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E")`
    case "circles":
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='${encoded}' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E")`
    default:
      return "none"
  }
}

/* ─── Color luminance helper ─── */
function isDarkColor(hex: string): boolean {
  const c = hex.replace("#", "")
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

/* ─── Font family map ─── */
function getFontFamily(fontStyle: CarouselTheme["fontStyle"]) {
  switch (fontStyle) {
    case "geist":
      return "'Geist', 'Inter', system-ui, sans-serif"
    case "poppins":
      return "'Poppins', 'Inter', system-ui, sans-serif"
    case "montserrat":
      return "'Montserrat', 'Inter', system-ui, sans-serif"
    case "google-sans":
      return "'Google Sans Flex', 'Google Sans', 'Product Sans', 'Inter', system-ui, sans-serif"
    default:
      return "'Inter', 'Segoe UI', system-ui, sans-serif"
  }
}

/* ─── Title size map ─── */
function getTitleClasses(size: CarouselTheme["titleSize"]) {
  switch (size) {
    case "sm":
      return "text-xl font-bold leading-snug"
    case "md":
      return "text-2xl font-bold leading-snug"
    case "xl":
      return "text-[32px] font-extrabold leading-tight tracking-tight"
    default:
      return "text-[28px] font-extrabold leading-tight tracking-tight"
  }
}

/* ─── Slide number renderers ─── */
function SlideNumber({
  style,
  slideNumber,
  totalSlides,
  accentColor,
}: {
  style: CarouselTheme["slideNumberStyle"]
  slideNumber: number
  totalSlides: number
  accentColor: string
  textColor: string
}) {
  const num = String(slideNumber).padStart(2, "0")
  const total = String(totalSlides).padStart(2, "0")

  switch (style) {
    case "large-watermark":
      return null
    case "minimal-dash":
      return (
        <div className="flex shrink-0 items-center">
          <div className="h-px w-5" style={{ backgroundColor: accentColor }} />
          <span
            className="ml-2 text-[11px] font-medium leading-none tracking-widest"
            style={{ color: accentColor }}
            data-export-role="page-pill-label"
          >
            {num} / {total}
          </span>
        </div>
      )
    case "circle-outline":
      return (
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold"
          style={{ borderColor: accentColor, color: accentColor }}
        >
          {num}
        </span>
      )
    case "hidden":
      return null
    default:
      return (
        <span
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full px-2.5 py-1 text-[11px] font-bold leading-none"
          style={{ backgroundColor: accentColor, color: "#ffffff" }}
          data-export-role="page-pill"
        >
          {num} / {total}
        </span>
      )
  }
}

/* ─── Large watermark (absolute positioned) ─── */
function WatermarkNumber({
  style,
  slideNumber,
  accentColor,
}: {
  style: CarouselTheme["slideNumberStyle"]
  slideNumber: number
  accentColor: string
}) {
  if (style !== "large-watermark") return null
  return (
    <span
      className="pointer-events-none absolute right-6 top-4 select-none text-[80px] font-black leading-none"
      style={{ color: accentColor, opacity: 0.06 }}
    >
      {String(slideNumber).padStart(2, "0")}
    </span>
  )
}

/* ─── Helper: extract plain text from React children ─── */
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (!children) return ""
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("")
  }
  if (React.isValidElement(children)) {
    return extractTextFromChildren(
      (children.props as { children?: React.ReactNode }).children
    )
  }
  return ""
}

/* ─── Markdown renderer ─── */
function MarkdownBody({
  content,
  theme,
  exportMode = false,
}: {
  content: string
  theme: CarouselTheme
  exportMode?: boolean
}) {
  return (
    <div className="slide-markdown">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-2.5 text-[15px] leading-relaxed last:mb-0" style={{ color: theme.textColor, opacity: 0.85 }}>
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold" style={{ color: theme.accentColor }}>
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic opacity-90">{children}</em>,
          ul: ({ children }) => (
            <ul className="mb-2.5 ml-4 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2.5 ml-4 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[15px] leading-relaxed" style={{ color: theme.textColor, opacity: 0.85 }}>
              {children}
            </li>
          ),
          pre: ({ children }) => {
            // Extract code and language from the <code> child inside <pre>
            const codeChild = React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && child.type === "code"
            ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined

            if (!codeChild) {
              return <pre className="mb-2.5 overflow-x-auto rounded-md p-3 text-[11px]">{children}</pre>
            }

            const className = codeChild.props.className || ""
            const langMatch = className.match(/language-(\w+)/)
            const language = langMatch ? langMatch[1] : "plaintext"

            // Extract plain text from the code children
            const codeText = extractTextFromChildren(codeChild.props.children)

            if (exportMode) {
              return (
                <div className="mb-2.5 overflow-hidden rounded-md">
                  {language && language !== "plaintext" && (
                    <div
                      className="px-3 py-1.5"
                      style={{ borderBottom: `1px solid ${theme.accentColor}20` }}
                    >
                      <span
                        className="text-[9px] font-semibold uppercase tracking-widest"
                        style={{ color: theme.accentColor, opacity: 0.7 }}
                      >
                        {language}
                      </span>
                    </div>
                  )}
                  <pre
                    className="overflow-x-auto px-3 py-2.5 text-[12px] leading-[1.6]"
                    style={{
                      color: theme.textColor,
                      opacity: 0.85,
                      fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                    }}
                  >
                    <code>{codeText}</code>
                  </pre>
                </div>
              )
            }

            return (
              <div className="mb-2.5">
                <ShikiCodeBlock
                  code={codeText}
                  language={language}
                  accentColor={theme.accentColor}
                  backgroundColor={theme.backgroundColor}
                  textColor={theme.textColor}
                />
              </div>
            )
          },
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : ""}
              alt={typeof alt === "string" ? alt : ""}
              className="my-2 max-h-[220px] w-full rounded-md object-cover"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ),
          code: ({ className, children }) => {
            // If this code element has a language class, it's a fenced block
            // handled by the `pre` override above. Only render inline code here.
            const isBlock = className && /language-/.test(className)
            if (isBlock) {
              return <code className={className}>{children}</code>
            }
            return (
              <code
                className="rounded px-1.5 py-0.5 text-[12px]"
                style={{
                  backgroundColor: theme.accentColor + "22",
                  color: theme.accentColor,
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}
              >
                {children}
              </code>
            )
          },
          h1: ({ children }) => (
            <h1 className="mb-2 text-lg font-bold" style={{ color: theme.textColor }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 text-base font-bold" style={{ color: theme.textColor }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1.5 text-sm font-semibold" style={{ color: theme.textColor }}>
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="my-2.5 border-l-[3px] pl-3 italic [&_p]:mb-0"
              style={{ borderColor: theme.accentColor, opacity: 0.8 }}
              data-export-role="quote"
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content || "Add some content..."}
      </ReactMarkdown>
    </div>
  )
}

/* ─── Author footer ─── */
function AuthorFooter({
  author,
  theme,
  compact,
}: {
  author: AuthorInfo
  theme: CarouselTheme
  compact?: boolean
}) {
  const swipeLabel = author.swipeText || "Swipe"
  return (
    <div className="flex w-full items-center gap-3 overflow-hidden">
      {/* Avatar */}
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold ${compact ? "h-9 w-9 text-xs" : "h-10 w-10 text-sm"}`}
        style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
      >
        {author.thumbnailUrl ? (
          <img
            src={author.thumbnailUrl}
            alt={author.name}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          author.name.charAt(0).toUpperCase()
        )}
      </div>
      {/* Name & tag — truncates to prevent overflow */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={`block truncate font-semibold leading-[1.2] ${compact ? "text-[13px]" : "text-[14px]"}`}
          style={{ color: theme.textColor }}
          data-export-role="author-name"
        >
          {author.name || "Your Name"}
        </span>
        <span
          className={`mt-0.5 block truncate leading-[1.2] ${compact ? "text-[11px]" : "text-[12px]"}`}
          style={{ color: theme.textColor, opacity: 0.5 }}
          data-export-role="author-tag"
        >
          {author.tag || "@handle"}
        </span>
      </div>
      {/* Swipe button */}
      <div
        className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-semibold"
        style={{ backgroundColor: theme.accentColor + "1a", color: theme.accentColor }}
        data-export-role="swipe-pill"
      >
        <span className="leading-none" data-export-role="swipe-label">{swipeLabel}</span>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}

/* ─── Accent bar helper ─── */
function AccentBar({ position, theme }: { position: "top" | "bottom"; theme: CarouselTheme }) {
  const match =
    (position === "top" && theme.borderStyle === "accent-top") ||
    (position === "bottom" && theme.borderStyle === "accent-bottom")
  if (!match) return null
  return <div className="h-1 w-full shrink-0" style={{ backgroundColor: theme.accentColor }} />
}

/* ─── Layout: Classic ─── */
function ClassicLayout(props: SlidePreviewProps) {
  const { slide, author, theme, totalSlides, exportMode } = props
  return (
    <>
      <AccentBar position="top" theme={theme} />
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-8 pb-4 pt-8">
        <WatermarkNumber style={theme.slideNumberStyle} slideNumber={slide.slideNumber} accentColor={theme.accentColor} />
        <SlideNumber
          style={theme.slideNumberStyle}
          slideNumber={slide.slideNumber}
          totalSlides={totalSlides}
          accentColor={theme.accentColor}
          textColor={theme.textColor}
        />
        <h2 className={getTitleClasses(theme.titleSize)} style={{ color: theme.textColor }}>
          {slide.title || "Untitled Slide"}
        </h2>
        <div className="min-h-0 flex-1 overflow-hidden text-[15px] leading-relaxed">
          <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
        </div>
      </div>
      <div className="shrink-0 px-8 py-4" style={{ borderTop: `1px solid ${theme.textColor}12` }}>
        <AuthorFooter author={author} theme={theme} />
      </div>
      <AccentBar position="bottom" theme={theme} />
    </>
  )
}

/* ─── Layout: Centered ─── */
function CenteredLayout(props: SlidePreviewProps) {
  const { slide, author, theme, totalSlides, exportMode } = props
  return (
    <>
      <AccentBar position="top" theme={theme} />
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-10 text-center">
        <WatermarkNumber style={theme.slideNumberStyle} slideNumber={slide.slideNumber} accentColor={theme.accentColor} />
        <SlideNumber
          style={theme.slideNumberStyle}
          slideNumber={slide.slideNumber}
          totalSlides={totalSlides}
          accentColor={theme.accentColor}
          textColor={theme.textColor}
        />
        <h2 className={getTitleClasses(theme.titleSize)} style={{ color: theme.textColor }}>
          {slide.title || "Untitled Slide"}
        </h2>
        <div className="max-w-[400px] overflow-hidden text-[15px] leading-relaxed">
          <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
        </div>
      </div>
      <div className="shrink-0 px-8 py-4" style={{ borderTop: `1px solid ${theme.textColor}12` }}>
        <AuthorFooter author={author} theme={theme} />
      </div>
      <AccentBar position="bottom" theme={theme} />
    </>
  )
}

/* ─── Layout: Split ─── */
function SplitLayout(props: SlidePreviewProps) {
  const { slide, author, theme, totalSlides, exportMode } = props
  return (
    <div className="flex h-full w-full">
      {/* Left accent column */}
      <div
        className="flex w-[160px] shrink-0 flex-col items-center justify-between px-4 py-8"
        style={{ backgroundColor: theme.accentColor + "12" }}
      >
        <SlideNumber
          style={theme.slideNumberStyle}
          slideNumber={slide.slideNumber}
          totalSlides={totalSlides}
          accentColor={theme.accentColor}
          textColor={theme.textColor}
        />
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-xs font-bold"
            style={{ backgroundColor: theme.accentColor, color: "#ffffff" }}
          >
            {author.thumbnailUrl ? (
              <img
                src={author.thumbnailUrl}
                alt={author.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              author.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-center text-[11px] font-semibold leading-tight" style={{ color: theme.textColor }}>
            {author.name || "Your Name"}
          </span>
          <span className="text-[9px]" style={{ color: theme.textColor, opacity: 0.5 }}>
            {author.tag || "@handle"}
          </span>
        </div>
      </div>
      {/* Side border */}
      {theme.borderStyle === "accent-left" && (
        <div className="w-1 shrink-0" style={{ backgroundColor: theme.accentColor }} />
      )}
      {/* Right content */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-hidden px-7 py-8">
        <WatermarkNumber style={theme.slideNumberStyle} slideNumber={slide.slideNumber} accentColor={theme.accentColor} />
        <h2 className={getTitleClasses(theme.titleSize)} style={{ color: theme.textColor }}>
          {slide.title || "Untitled Slide"}
        </h2>
        <div className="min-h-0 flex-1 overflow-hidden text-[15px] leading-relaxed">
          <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
        </div>
      </div>
    </div>
  )
}

/* ─── Layout: Bold Number ─── */
function BoldNumberLayout(props: SlidePreviewProps) {
  const { slide, author, theme, exportMode } = props
  return (
    <>
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-8 pb-4 pt-8">
        {/* Giant watermark */}
        <span
          className="pointer-events-none absolute -right-2 -top-4 select-none text-[120px] font-black leading-none"
          style={{ color: theme.accentColor, opacity: 0.05 }}
        >
          {String(slide.slideNumber).padStart(2, "0")}
        </span>
        <div className="flex shrink-0 items-end gap-3">
          <span
            className="text-[36px] font-black leading-none"
            style={{ color: theme.accentColor }}
          >
            {String(slide.slideNumber).padStart(2, "0")}
          </span>
          <div className="mb-2 h-px flex-1" style={{ backgroundColor: theme.accentColor + "30" }} />
        </div>
        <h2 className={getTitleClasses(theme.titleSize)} style={{ color: theme.textColor }}>
          {slide.title || "Untitled Slide"}
        </h2>
        <div className="min-h-0 flex-1 overflow-hidden text-[15px] leading-relaxed">
          <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
        </div>
      </div>
      <div className="shrink-0 px-8 py-4" style={{ borderTop: `1px solid ${theme.textColor}12` }}>
        <AuthorFooter author={author} theme={theme} />
      </div>
    </>
  )
}

/* ─── Layout: Minimal ─── */
function MinimalLayout(props: SlidePreviewProps) {
  const { slide, author, theme, totalSlides, exportMode } = props
  return (
    <>
      <div className="relative flex min-h-0 flex-1 flex-col justify-center gap-5 overflow-hidden px-10 py-8">
        <WatermarkNumber style={theme.slideNumberStyle} slideNumber={slide.slideNumber} accentColor={theme.accentColor} />
        <SlideNumber
          style={theme.slideNumberStyle}
          slideNumber={slide.slideNumber}
          totalSlides={totalSlides}
          accentColor={theme.accentColor}
          textColor={theme.textColor}
        />
        <h2 className={getTitleClasses(theme.titleSize)} style={{ color: theme.textColor }}>
          {slide.title || "Untitled Slide"}
        </h2>
        <div className="h-[2px] w-10 shrink-0" style={{ backgroundColor: theme.accentColor }} />
        <div className="min-h-0 flex-1 overflow-hidden text-[15px] leading-relaxed">
          <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
        </div>
      </div>
      <div className="shrink-0 px-10 pb-8 pt-5">
        <AuthorFooter author={author} theme={theme} />
      </div>
    </>
  )
}

/* ─── Layout: Editorial ─── */
function EditorialLayout(props: SlidePreviewProps) {
  const { slide, author, theme, totalSlides, exportMode } = props
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {theme.borderStyle === "accent-left" && (
          <div className="w-1 shrink-0" style={{ backgroundColor: theme.accentColor }} />
        )}
        <div className="relative flex min-h-0 flex-1 flex-col gap-4 px-8 pb-4 pt-8">
          <WatermarkNumber style={theme.slideNumberStyle} slideNumber={slide.slideNumber} accentColor={theme.accentColor} />
          <SlideNumber
            style={theme.slideNumberStyle}
            slideNumber={slide.slideNumber}
            totalSlides={totalSlides}
            accentColor={theme.accentColor}
            textColor={theme.textColor}
          />
          <h2
            className={getTitleClasses(theme.titleSize)}
            style={{ color: theme.textColor }}
          >
            {slide.title || "Untitled Slide"}
          </h2>
          <div
            className="h-px w-full shrink-0"
            style={{ backgroundColor: theme.accentColor + "25" }}
          />
          <div className="min-h-0 flex-1 overflow-hidden text-[15px] leading-relaxed">
            <MarkdownBody content={slide.description} theme={theme} exportMode={exportMode} />
          </div>
        </div>
      </div>
      <div
        className="shrink-0 px-8 py-4"
        style={{
          borderTop: `1px solid ${theme.textColor}12`,
          ...(theme.borderStyle === "accent-left" ? { marginLeft: 4 } : {}),
        }}
      >
        <AuthorFooter author={author} theme={theme} />
      </div>
      <AccentBar position="bottom" theme={theme} />
    </div>
  )
}

/* ─── Main slide preview ─── */
export function SlidePreview({ slide, author, theme, totalSlides, exportMode = false }: SlidePreviewProps) {
  const bg = theme.backgroundGradient || theme.backgroundColor
  const patternBg = getPatternSvg(theme.pattern, theme.accentColor)
  const fontFamily = getFontFamily(theme.fontStyle)

  const borderMap: Record<string, string> = {
    "full-border": `2px solid ${theme.accentColor}40`,
  }
  const border = borderMap[theme.borderStyle || ""] || "none"

  function renderLayout() {
    const layoutProps = { slide, author, theme, totalSlides, exportMode }
    switch (theme.layout) {
      case "centered":
        return <CenteredLayout {...layoutProps} />
      case "split":
        return <SplitLayout {...layoutProps} />
      case "bold-number":
        return <BoldNumberLayout {...layoutProps} />
      case "minimal":
        return <MinimalLayout {...layoutProps} />
      case "editorial":
        return <EditorialLayout {...layoutProps} />
      default:
        return <ClassicLayout {...layoutProps} />
    }
  }

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: 540,
        height: 540,
        background: bg,
        color: theme.textColor,
        fontFamily,
        border,
      }}
    >
      {/* Pattern overlay */}
      {theme.pattern && theme.pattern !== "none" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: patternBg }}
          aria-hidden="true"
        />
      )}
      {/* Content */}
      <div
        className="relative z-10 flex h-full w-full flex-col"
        style={{ padding: theme.paddingBox ? (theme.contentPadding || 24) : (theme.contentPadding || 0) }}
      >
        {theme.paddingBox ? (
          <div
            className="flex h-full w-full flex-col overflow-hidden shadow-2xl"
            style={{
              backgroundColor: theme.paddingBoxColor || (isDarkColor(theme.backgroundColor) ? "#1c1c2e" : "#ffffff"),
              borderRadius: theme.paddingBoxRadius ?? 16,
            }}
          >
            {renderLayout()}
          </div>
        ) : (
          renderLayout()
        )}
      </div>
    </div>
  )
}
