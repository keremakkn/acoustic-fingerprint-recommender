"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, AudioWaveform, Info, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Discover", href: "/", icon: Compass },
  { name: "Acoustic Analysis", href: "/analysis", icon: AudioWaveform },
  { name: "About Project", href: "/about", icon: Info },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <AudioWaveform className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Acoustic AI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="border-t border-sidebar-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
          <Settings className="h-5 w-5 text-sidebar-foreground/50" />
          Settings
        </button>
      </div>
    </aside>
  )
}
