"use client"

import { TrackRow } from "./track-row"

interface RecommendationsListProps {
  queryTrack: {
    label: string
    genre: string
    value: string
  }
  isUploadedTrack?: boolean
  recommendations: Array<{ label: string; genre: string; similarity: number; audioUrl?: string }>
}

export function RecommendationsList({ queryTrack, isUploadedTrack, recommendations }: RecommendationsListProps) {

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Distinct Recommendations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on acoustic fingerprint similarity using CNN embeddings
          </p>
        </div>
      </div>

      {/* Track List Header */}
      <div className="mb-2 flex items-center gap-4 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <div className="w-8 text-center">#</div>
        <div className="w-12" />
        <div className="flex-1">Title</div>
        <div className="hidden sm:block w-20">Genre</div>
        <div className="w-20 text-right">Match</div>
      </div>

      {/* Divider */}
      <div className="mb-2 border-b border-border" />

      {/* Track Rows */}
      <div className="space-y-1">
        {recommendations.map((track, index) => (
          <TrackRow key={index} track={track} index={index} />
        ))}
      </div>
    </div>
  )
}
