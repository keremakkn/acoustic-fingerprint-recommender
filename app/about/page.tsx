import { Sidebar } from "@/components/sidebar"
import { 
  Users, 
  Database, 
  Brain, 
  Target, 
  ExternalLink,
  Github,
  Linkedin,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide uppercase">
                About This Project
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Building Intelligent
              <br />
              <span className="text-primary">Music Discovery</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              A deep learning approach to understanding and recommending music 
              based on acoustic properties rather than metadata or collaborative filtering.
            </p>
          </div>

          {/* Project Overview */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Project Overview
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground">Objective</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Develop a content-based music recommendation system that analyzes 
                  the acoustic properties of audio files to find similar tracks, 
                  independent of user behavior or metadata.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground">Approach</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Utilize Convolutional Neural Networks trained on Mel-Spectrograms 
                  to extract high-level acoustic features and create a 256-dimensional 
                  embedding space for similarity matching.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground">Dataset</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  The GTZAN dataset contains 1,000 audio tracks, each 30 seconds long, 
                  divided equally among 10 genres: Blues, Classical, Country, Disco, 
                  Hip-Hop, Jazz, Metal, Pop, Reggae, and Rock.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <ExternalLink className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground">Applications</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Music streaming platforms, DJ software, music production tools, 
                  audio archival systems, and any application requiring intelligent 
                  audio similarity matching.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Technology Stack
            </h2>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">
                    Machine Learning
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      TensorFlow / Keras
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Librosa (Audio Processing)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      NumPy / SciPy
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Scikit-learn
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">
                    Frontend
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Next.js / React
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Tailwind CSS
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      shadcn/ui Components
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Lucide Icons
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground mb-3">
                    Infrastructure
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Vercel (Deployment)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Python Backend API
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Vector Database
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      GitHub Actions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Research Context */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Research Context
            </h2>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8">
              <p className="text-muted-foreground leading-relaxed mb-6">
                This work builds upon extensive research in Music Information Retrieval (MIR), 
                combining established techniques in audio signal processing with modern deep 
                learning architectures. Key influences include:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">VGGish by Google:</strong> Demonstrated 
                    the effectiveness of CNN architectures for audio embeddings
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">MusicNet:</strong> Large-scale dataset 
                    for music understanding that validated deep learning approaches
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span>
                    <strong className="text-foreground">MFCC & Mel-Spectrogram Research:</strong> Foundational 
                    work on perceptually-motivated audio representations
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact / Links */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Connect
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub Repository
              </Button>
              <Button variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </Button>
            </div>
          </section>

          {/* Footer Attribution */}
          <footer className="mt-20 border-t border-border pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © 2024 Acoustic AI — TÜBİTAK 2209-A Graduation Project
              <br />
              <span className="text-xs">
                Istanbul Technical University, Mathematical Engineering Department
              </span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
