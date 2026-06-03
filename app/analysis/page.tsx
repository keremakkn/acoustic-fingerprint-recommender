import { Sidebar } from "@/components/sidebar"
import { AudioWaveform, Layers, Binary, GitCompare, GraduationCap } from "lucide-react"

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Acoustic Watermark */}
      <div className="acoustic-watermark" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="relative ml-64 min-h-screen">
        <div className="mx-auto max-w-4xl px-8 py-12">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-2 text-primary">
              <AudioWaveform className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Technical Deep Dive
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Extracting the
              <br />
              <span className="text-primary">Acoustic Fingerprint</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Understanding how deep learning transforms raw audio into meaningful 
              representations for intelligent music recommendation.
            </p>
          </div>

          {/* Step 1: Audio Processing */}
          <section className="mb-16">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AudioWaveform className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  1. Audio Preprocessing
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Each track in the GTZAN dataset consists of a 30-second audio clip. 
                  We first convert the raw waveform into a Mel-Spectrogram representation, 
                  which captures the frequency content over time in a way that aligns with 
                  human auditory perception.
                </p>
              </div>
            </div>

            {/* Mel-Spectrogram Placeholder */}
            <div className="mt-6 ml-14 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-accent/30 p-8">
              <div className="aspect-[2/1] w-full rounded-lg bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5 relative overflow-hidden">
                {/* Spectrogram visualization */}
                <div className="absolute inset-0 flex items-end justify-around gap-0.5 p-4">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t"
                      style={{
                        height: `${20 + Math.sin(i * 0.3) * 30 + Math.random() * 40}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 left-4 text-xs text-muted-foreground">
                  Time (s)
                </div>
                <div className="absolute top-4 left-2 text-xs text-muted-foreground -rotate-90 origin-left">
                  Frequency (Hz)
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Mel-Spectrogram Visualization (128 Mel bands × 1292 time frames)
              </p>
            </div>
          </section>

          {/* Step 2: CNN Architecture */}
          <section className="mb-16">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  2. Convolutional Neural Network
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  The spectrogram is fed into a Convolutional Neural Network (CNN) 
                  specifically designed for audio classification. The network learns 
                  hierarchical features—from low-level spectral patterns to high-level 
                  musical concepts like rhythm, timbre, and harmony.
                </p>
              </div>
            </div>

            {/* CNN Architecture Placeholder */}
            <div className="mt-6 ml-14 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-accent/30 p-8">
              <div className="flex items-center justify-center gap-4">
                {/* Input */}
                <div className="flex flex-col items-center">
                  <div className="h-24 w-16 rounded-lg bg-gradient-to-b from-primary/40 to-primary/20 border border-primary/30" />
                  <span className="mt-2 text-xs text-muted-foreground">Input</span>
                </div>
                
                {/* Arrow */}
                <div className="h-0.5 w-6 bg-border" />
                
                {/* Conv Layers */}
                {[64, 128, 256, 512].map((filters, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="rounded-lg bg-gradient-to-b from-primary/60 to-primary/30 border border-primary/40"
                        style={{
                          height: `${60 + idx * 10}px`,
                          width: `${40 - idx * 4}px`,
                        }}
                      />
                      <span className="mt-2 text-xs text-muted-foreground">
                        Conv{idx + 1}
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        {filters}
                      </span>
                    </div>
                    <div className="h-0.5 w-4 bg-border" />
                  </div>
                ))}
                
                {/* FC Layer */}
                <div className="flex flex-col items-center">
                  <div className="h-20 w-6 rounded-lg bg-gradient-to-b from-primary/50 to-primary/25 border border-primary/35" />
                  <span className="mt-2 text-xs text-muted-foreground">FC</span>
                </div>
                
                {/* Arrow */}
                <div className="h-0.5 w-6 bg-border" />
                
                {/* Output */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-4 rounded-lg bg-gradient-to-b from-emerald-500/50 to-emerald-500/25 border border-emerald-500/40" />
                  <span className="mt-2 text-xs text-muted-foreground">256-D</span>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                CNN Architecture: 4 Convolutional Blocks → Global Average Pooling → Dense Layer (256 units)
              </p>
            </div>
          </section>

          {/* Step 3: Embedding Vector */}
          <section className="mb-16">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Binary className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  3. 256-Dimensional Embedding
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  The CNN&apos;s penultimate layer outputs a dense 256-dimensional vector 
                  that serves as the &quot;acoustic fingerprint&quot; of each track. This compact 
                  representation encodes the essential characteristics of the music, 
                  allowing for efficient similarity comparisons across the entire dataset.
                </p>
              </div>
            </div>

            {/* Embedding Visualization */}
            <div className="mt-6 ml-14 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-accent/30 p-8">
              <div className="flex flex-wrap gap-1 justify-center">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor: `hsl(${340 + i * 0.5}, ${50 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
                      opacity: 0.5 + Math.random() * 0.5,
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Sample embedding vector visualization (64 of 256 dimensions shown)
              </p>
            </div>
          </section>

          {/* Step 4: Cosine Similarity */}
          <section className="mb-16">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GitCompare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  4. Cosine Similarity Matching
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  To find similar tracks, we compute the cosine similarity between 
                  the query track&apos;s embedding and all other embeddings in our database. 
                  This measure captures the angular similarity between vectors, making 
                  it robust to differences in magnitude while focusing on the direction 
                  (i.e., the relative feature importance).
                </p>
              </div>
            </div>

            {/* Formula */}
            <div className="mt-6 ml-14 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-accent/30 p-8">
              <div className="text-center font-mono text-lg text-foreground">
                similarity(A, B) = (A · B) / (||A|| × ||B||)
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Cosine Similarity Formula — values range from -1 (opposite) to 1 (identical)
              </p>
            </div>
          </section>

          {/* Academic Footer */}
          <section className="mt-20 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Academic Background
                </h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  This project was developed as a TÜBİTAK 2209-A supported graduation 
                  project for the Mathematical Engineering program at Istanbul Technical 
                  University (ITU). The research explores the intersection of deep learning, 
                  signal processing, and music information retrieval.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    TÜBİTAK 2209-A
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    ITU Mathematical Engineering
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Deep Learning
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Music Information Retrieval
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
