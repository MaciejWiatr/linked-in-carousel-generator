"use client"

import { useEffect, useState, useRef } from "react"

interface ShikiCodeBlockProps {
  code: string
  language: string
  accentColor: string
  backgroundColor: string
  textColor: string
}

// Shared highlighter singleton (lazy-loaded)
let highlighterPromise: Promise<import("shiki").Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((mod) =>
      mod.createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "python",
          "rust",
          "go",
          "css",
          "html",
          "json",
          "bash",
          "markdown",
          "sql",
          "yaml",
          "c",
          "cpp",
          "java",
          "ruby",
          "php",
          "swift",
        ],
      })
    )
  }
  return highlighterPromise
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "")
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

export function ShikiCodeBlock({
  code,
  language,
  accentColor,
  backgroundColor,
  textColor,
}: ShikiCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const light = isLightColor(backgroundColor)
  const shikiTheme = light ? "github-light" : "github-dark"

  useEffect(() => {
    let cancelled = false

    getHighlighter().then((highlighter) => {
      if (cancelled) return

      // Determine if language is loaded, fallback to plaintext
      const loadedLangs = highlighter.getLoadedLanguages()
      const lang = loadedLangs.includes(language as never)
        ? language
        : "plaintext"

      const result = highlighter.codeToHtml(code.trim(), {
        lang,
        theme: shikiTheme,
      })

      if (!cancelled) {
        setHtml(result)
      }
    })

    return () => {
      cancelled = true
    }
  }, [code, language, shikiTheme])

  // Computed colors for the code block container
  const codeBg = light
    ? `color-mix(in srgb, ${backgroundColor} 85%, #000000 15%)`
    : `color-mix(in srgb, ${backgroundColor} 75%, #ffffff 5%)`

  if (!html) {
    // Fallback: plain unstyled code while Shiki loads
    return (
      <div
        className="overflow-hidden rounded-md"
        style={{ backgroundColor: codeBg }}
      >
        {language && language !== "plaintext" && (
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{
              borderBottom: `1px solid ${accentColor}20`,
            }}
          >
            <span
              className="text-[9px] font-semibold uppercase tracking-widest"
              style={{ color: accentColor, opacity: 0.7 }}
            >
              {language}
            </span>
          </div>
        )}
        <pre className="overflow-x-auto px-3 py-2.5">
          <code
            className="text-[11px] leading-[1.6]"
            style={{
              fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
              color: textColor,
              opacity: 0.8,
            }}
          >
            {code.trim()}
          </code>
        </pre>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="shiki-code-wrapper overflow-hidden rounded-md"
      style={{ backgroundColor: codeBg }}
    >
      {language && language !== "plaintext" && (
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{
            borderBottom: `1px solid ${accentColor}20`,
          }}
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-widest"
            style={{ color: accentColor, opacity: 0.7 }}
          >
            {language}
          </span>
        </div>
      )}
      <div
        className="shiki-html-container overflow-x-auto [&_pre]:!bg-transparent [&_pre]:px-3 [&_pre]:py-2.5 [&_code]:text-[11px] [&_code]:leading-[1.6]"
        style={
          {
            "--shiki-font": "'SF Mono', 'Fira Code', 'Consolas', monospace",
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
