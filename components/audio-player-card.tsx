"use client"

import * as React from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface AudioPlayerCardProps {
  track: {
    label: string
    genre: string
    value: string
    audioUrl?: string
  }
  className?: string
  isUploadedTrack?: boolean
  audioFile?: File | null
}

export function AudioPlayerCard({ track, className, isUploadedTrack, audioFile }: AudioPlayerCardProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [duration, setDuration] = React.useState(30)
  const [volume, setVolume] = React.useState([75])

  // Resolve the src: uploaded file takes precedence, then library audioUrl
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile)
      setObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setObjectUrl(null)
    }
  }, [audioFile])

  const src = objectUrl ?? (track.audioUrl ? `http://127.0.0.1:8000${track.audioUrl}` : null)

  // Reset when track/src changes
  React.useEffect(() => {
    setIsPlaying(false)
    setProgress(0)
  }, [src])

  // Sync volume to audio element
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  // Play / pause
  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, src])

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setProgress(audio.currentTime)
    if (audio.duration) setDuration(audio.duration)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio && audio.duration) setDuration(audio.duration)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
  }

  const handleSeek = (val: number[]) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = val[0]
    setProgress(val[0])
  }

  const handleSkipBack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const handleSkipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + 10)
  }

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds)
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex gap-6">
        {/* Album Art Placeholder */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-4 border-primary/30" />
            <div className="absolute h-6 w-6 rounded-full bg-primary/40" />
          </div>
          {/* Animated ring when playing */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 animate-ping rounded-full border border-primary/20" />
            </div>
          )}
        </div>

        {/* Track Info & Controls */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  {track.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isUploadedTrack ? "Uploaded Track • Your Library" : "Queried Track • GTZAN Dataset"}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                {track.genre}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={duration}
              step={0.1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSkipBack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                size="icon"
                disabled={!src}
                className="h-11 w-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 disabled:opacity-40"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSkipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real hidden audio element — always mounted when src is available */}
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
      )}
    </div>
  )
}
