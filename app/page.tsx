"use client"

import * as React from "react"
import { Sidebar } from "@/components/sidebar"
import { TrackSelector } from "@/components/track-selector"
import { AudioPlayerCard } from "@/components/audio-player-card"
import { RecommendationsList } from "@/components/recommendations-list"
import { UploadDropzone } from "@/components/upload-dropzone"
import { Sparkles } from "lucide-react"

type TrackSource = "library" | "upload"

export default function DiscoverPage() {
  const [selectedTrack, setSelectedTrack] = React.useState<{
    label: string
    genre: string
    value: string
    audioUrl?: string
  } | null>(null)
  const [queriedAudioUrl, setQueriedAudioUrl] = React.useState<string | undefined>(undefined)
  
  const [trackSource, setTrackSource] = React.useState<TrackSource>("library")
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [recommendations, setRecommendations] = React.useState<any[]>([])

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file)
    setIsAnalyzing(true)
    setSelectedTrack(null)
    setTrackSource("upload")
    setRecommendations([])
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/v1/recommend/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) throw new Error("Upload failed")
      
      const data = await response.json()
      
      setSelectedTrack({
        label: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        genre: "Uploaded",
        value: `upload-${Date.now()}`,
      })
      setQueriedAudioUrl(undefined)
      
      // Map API response to match frontend component expected format
      const mappedRecs = (data.recommendations || []).map((r: any) => ({
        label: r.title,
        genre: r.genre,
        similarity: r.match_score,
        audioUrl: r.audio_url,
      }))
      setRecommendations(mappedRecs)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClearUpload = () => {
    setUploadedFile(null)
    setSelectedTrack(null)
    setTrackSource("library")
    setRecommendations([])
    setQueriedAudioUrl(undefined)
  }

  const handleLibrarySelect = async (track: typeof selectedTrack) => {
    if (!track) return
    setSelectedTrack(track)
    setTrackSource("library")
    setUploadedFile(null)
    setIsAnalyzing(true)
    setRecommendations([])

    try {
      const response = await fetch(`/api/v1/recommend/library?song_id=${track.value}`)
      if (!response.ok) throw new Error("Fetch failed")
      
      const data = await response.json()
      
      setQueriedAudioUrl(data.queried_audio_url ?? undefined)

      // Map API response to match frontend component expected format
      const mappedRecs = (data.recommendations || []).map((r: any) => ({
        label: r.title,
        genre: r.genre,
        similarity: r.match_score,
        audioUrl: r.audio_url,
      }))
      setRecommendations(mappedRecs)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const showResults = selectedTrack && !isAnalyzing

  return (
    <div className="min-h-screen bg-background">
      {/* Acoustic Watermark */}
      <div className="acoustic-watermark" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="relative ml-64 min-h-screen">
        <div className="mx-auto max-w-4xl px-8 py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                AI-Powered Discovery
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Discover Your Next
              <br />
              <span className="text-primary">Favorite Track</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Select a song from the GTZAN dataset or upload your own track. Our CNN-powered 
              acoustic fingerprint analysis will find the most similar tracks based on their 
              256-dimensional embedding vectors.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Upload Your Own Track
            </label>
            <UploadDropzone
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
              uploadedFile={trackSource === "upload" ? uploadedFile : null}
              onClear={handleClearUpload}
            />
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                or select from library
              </span>
            </div>
          </div>

          {/* Track Selector */}
          <div className="mb-8">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Select a Track from GTZAN Library
            </label>
            <TrackSelector 
              onSelect={handleLibrarySelect} 
              selectedTrack={trackSource === "library" ? selectedTrack : null} 
            />
          </div>

          {/* Audio Player Card - Show when track is selected and not analyzing */}
          {showResults && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AudioPlayerCard 
                track={{ ...selectedTrack, audioUrl: queriedAudioUrl }}
                isUploadedTrack={trackSource === "upload"}
                audioFile={trackSource === "upload" ? uploadedFile : null}
              />
              <RecommendationsList 
                queryTrack={selectedTrack} 
                isUploadedTrack={trackSource === "upload"}
                recommendations={recommendations}
              />
            </div>
          )}

          {/* Empty State */}
          {!selectedTrack && !isAnalyzing && (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-foreground">
                Ready to Explore
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Upload your own track or select one from the library to analyze 
                its acoustic fingerprint and discover similar songs.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
