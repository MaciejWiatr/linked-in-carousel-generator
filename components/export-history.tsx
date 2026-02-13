"use client"

import { X } from "lucide-react"

export interface ExportRecord {
  id: string
  title: string
  thumbnail: string
  exportedAt: string
}

const STORAGE_KEY = "carousel-export-history"

export function loadHistory(): ExportRecord[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveToHistory(thumbnail: string, title: string) {
  const history = loadHistory()
  const record: ExportRecord = {
    id: Date.now().toString(36),
    title,
    thumbnail,
    exportedAt: new Date().toLocaleDateString(),
  }
  const updated = [record, ...history].slice(0, 20)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
  return updated
}

export function clearHistory() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

interface ExportHistoryProps {
  history: ExportRecord[]
  onClear: () => void
}

export function ExportHistory({ history, onClear }: ExportHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="shrink-0 border-t border-border bg-card">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Export History
        </span>
        <button
          onClick={onClear}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-3">
        {history.map((item) => (
          <div key={item.id} className="flex shrink-0 flex-col items-center gap-1">
            <div className="h-16 w-16 overflow-hidden rounded-lg border border-border shadow-sm">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="max-w-[64px] truncate text-[9px] text-muted-foreground">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
