"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthorInfo } from "@/lib/types"
import { User } from "lucide-react"

interface AuthorPanelProps {
  author: AuthorInfo
  onUpdateAuthor: (field: keyof AuthorInfo, value: string) => void
}

export function AuthorPanel({ author, onUpdateAuthor }: AuthorPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail preview */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground">
          {author.thumbnailUrl ? (
            <img
              src={author.thumbnailUrl}
              alt="Author thumbnail"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="thumbnail-url" className="mb-1 text-[10px] text-muted-foreground">
            Thumbnail URL
          </Label>
          <Input
            id="thumbnail-url"
            placeholder="https://example.com/photo.jpg"
            value={author.thumbnailUrl}
            onChange={(e) => onUpdateAuthor("thumbnailUrl", e.target.value)}
            className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="author-name" className="mb-1 text-[10px] text-muted-foreground">
            Name
          </Label>
          <Input
            id="author-name"
            placeholder="Jane Doe"
            value={author.name}
            onChange={(e) => onUpdateAuthor("name", e.target.value)}
            className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <Label htmlFor="author-tag" className="mb-1 text-[10px] text-muted-foreground">
            Tag / Handle
          </Label>
          <Input
            id="author-tag"
            placeholder="@janedoe"
            value={author.tag}
            onChange={(e) => onUpdateAuthor("tag", e.target.value)}
            className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="swipe-text" className="mb-1 text-[10px] text-muted-foreground">
          Swipe Button Text
        </Label>
        <Input
          id="swipe-text"
          placeholder="Swipe"
          value={author.swipeText}
          onChange={(e) => onUpdateAuthor("swipeText", e.target.value)}
          className="h-8 border-input bg-background text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
