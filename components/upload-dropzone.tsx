"use client"

import * as React from "react"
import { Upload, Music, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  isAnalyzing: boolean
  uploadedFile: File | null
  onClear: () => void
}

export function UploadDropzone({ 
  onFileSelect, 
  isAnalyzing, 
  uploadedFile,
  onClear 
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && isAudioFile(file)) {
      onFileSelect(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isAudioFile(file)) {
      onFileSelect(file)
    }
  }

  const isAudioFile = (file: File) => {
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac', 'audio/aac']
    return audioTypes.includes(file.type) || file.name.match(/\.(mp3|wav|ogg|flac|aac)$/i)
  }

  // Analyzing state
  if (isAnalyzing) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated waveform */}
          <div className="mb-6 flex items-end gap-1 h-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-primary"
                style={{
                  animation: `waveform 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                  height: '100%',
                }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-lg font-medium">Analyzing Acoustic Features...</span>
          </div>
          
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            Extracting mel-spectrogram, computing CNN embeddings, and finding similar tracks
          </p>
          
          {/* Progress dots */}
          <div className="mt-6 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-primary/60"
                style={{
                  animation: `pulse 1.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes waveform {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    )
  }

  // File uploaded state (before analyzing)
  if (uploadedFile) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
            <Music className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{uploadedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  // Default dropzone state
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-12 transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-accent/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.flac,.aac"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
          isDragging ? "bg-primary/20" : "bg-muted"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <h3 className="mt-5 text-lg font-medium text-foreground">
          Upload Your Own Track
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Drag and drop your audio file here, or click to browse
        </p>
        
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground/70 px-2 py-1 rounded-full bg-muted">
            MP3
          </span>
          <span className="text-xs text-muted-foreground/70 px-2 py-1 rounded-full bg-muted">
            WAV
          </span>
          <span className="text-xs text-muted-foreground/70 px-2 py-1 rounded-full bg-muted">
            FLAC
          </span>
          <span className="text-xs text-muted-foreground/70 px-2 py-1 rounded-full bg-muted">
            OGG
          </span>
        </div>
      </div>
    </div>
  )
}
