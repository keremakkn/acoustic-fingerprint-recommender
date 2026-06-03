"use client"

import * as React from "react"
import { Play, Pause, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface TrackRowProps {
  track: {
    label: string
    genre: string
    similarity: number
    audioUrl?: string
  }
  index: number
}

export function TrackRow({ track, index }: TrackRowProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const src = track.audioUrl ? `http://127.0.0.1:8000${track.audioUrl}` : null

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!src) return
    setIsPlaying((prev) => !prev)
  }

  // Drive the audio element whenever isPlaying changes
  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const handleEnded = () => setIsPlaying(false)

  const getSimilarityColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-600 border-emerald-200"
    if (score >= 80) return "bg-blue-500/10 text-blue-600 border-blue-200"
    if (score >= 70) return "bg-amber-500/10 text-amber-600 border-amber-200"
    return "bg-muted text-muted-foreground border-border"
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200",
        isHovered ? "bg-accent/60" : "bg-transparent",
        "cursor-pointer"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTogglePlay}
    >
      {/* Index / Play Button */}
      <div className="flex h-8 w-8 items-center justify-center">
        {isHovered || isPlaying ? (
          <button
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              isPlaying
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/10 text-foreground hover:bg-foreground/20"
            )}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {index + 1}
          </span>
        )}
      </div>

      {/* Album Art Placeholder */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-muted to-accent">
        <Music className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h4 className="truncate font-medium text-foreground">{track.label}</h4>
        <p className="truncate text-sm text-muted-foreground">
          GTZAN Dataset • 30s clip
        </p>
      </div>

      {/* Genre */}
      <div className="hidden sm:block">
        <Badge variant="outline" className="font-normal">
          {track.genre}
        </Badge>
      </div>

      {/* Similarity Score */}
      <div className="flex-shrink-0">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tabular-nums",
            getSimilarityColor(track.similarity)
          )}
        >
          {track.similarity.toFixed(1)}%
        </span>
      </div>

      {/* Hidden audio element */}
      {src && (
        <audio ref={audioRef} src={src} onEnded={handleEnded} className="hidden" />
      )}
    </div>
  )
}
