"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Music } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// GTZAN Dataset sample tracks
const gtzanTracks = [
  { value: "blues.00000", label: "Blues Track 001", genre: "Blues" },
  { value: "blues.00001", label: "Blues Track 002", genre: "Blues" },
  { value: "classical.00000", label: "Classical Symphony No.1", genre: "Classical" },
  { value: "classical.00001", label: "Piano Sonata in C", genre: "Classical" },
  { value: "country.00000", label: "Country Roads", genre: "Country" },
  { value: "disco.00000", label: "Disco Nights", genre: "Disco" },
  { value: "hiphop.00000", label: "Urban Beats", genre: "Hip-Hop" },
  { value: "hiphop.00001", label: "Street Poetry", genre: "Hip-Hop" },
  { value: "jazz.00000", label: "Midnight Jazz", genre: "Jazz" },
  { value: "jazz.00001", label: "Smooth Saxophone", genre: "Jazz" },
  { value: "metal.00000", label: "Thunder Storm", genre: "Metal" },
  { value: "pop.00000", label: "Summer Vibes", genre: "Pop" },
  { value: "pop.00001", label: "Dancing Tonight", genre: "Pop" },
  { value: "reggae.00000", label: "Island Breeze", genre: "Reggae" },
  { value: "rock.00000", label: "Electric Dreams", genre: "Rock" },
  { value: "rock.00001", label: "Highway Anthem", genre: "Rock" },
]

interface TrackSelectorProps {
  onSelect: (track: typeof gtzanTracks[0] | null) => void
  selectedTrack: typeof gtzanTracks[0] | null
}

export function TrackSelector({ onSelect, selectedTrack }: TrackSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-14 text-base bg-background border-border hover:bg-accent/50 transition-colors"
        >
          {selectedTrack ? (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Music className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <div className="font-medium">{selectedTrack.label}</div>
                <div className="text-xs text-muted-foreground">{selectedTrack.genre}</div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a track from GTZAN Library...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tracks..." className="h-12" />
          <CommandList>
            <CommandEmpty>No track found.</CommandEmpty>
            <CommandGroup>
              {gtzanTracks.map((track) => (
                <CommandItem
                  key={track.value}
                  value={track.label}
                  onSelect={() => {
                    onSelect(track)
                    setOpen(false)
                  }}
                  className="py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                      <Music className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{track.label}</div>
                      <div className="text-xs text-muted-foreground">{track.genre}</div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTrack?.value === track.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { gtzanTracks }
