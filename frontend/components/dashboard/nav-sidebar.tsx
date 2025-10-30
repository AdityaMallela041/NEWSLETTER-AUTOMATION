"use client"

import { useUIStore } from "@/lib/state"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Newspaper, Plus, Users, Mail, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { key: "overview", label: "Dashboard", icon: Home },
  { key: "add-newsletter", label: "Add Event", icon: Plus },
  { key: "newsletters", label: "My Newsletters", icon: Newspaper },
  { key: "team-members", label: "Team Members", icon: Users },
  { key: "subscribers", label: "Subscribers", icon: Mail },
  { key: "logout", label: "Sign Out", icon: LogOut },
]

export function NavSidebar() {
  const { sidebarOpen, activeTab, setActiveTab } = useUIStore()

  return (
    <aside className="h-[calc(100dvh-64px)] sticky top-[64px] z-20">
      <AnimatePresence initial={false}>
        {sidebarOpen ? (
          <motion.div
            key="sidebar-open"
            initial={{ x: -220, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -220, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="glass-panel m-4 p-3 w-[240px] hidden md:block"
            aria-label="Sidebar"
          >
            <nav className="flex flex-col gap-1" aria-label="Primary">
              {items.map((it) => {
                const Icon = it.icon
                const active = activeTab === it.key
                return (
                  <button
                    key={it.key}
                    onClick={() => setActiveTab(it.key)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover-glow transition-all",
                      active ? "brand-gradient text-white" : "hover:bg-muted text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className={cn("h-5 w-5", active && "text-white")} />
                    <span className={cn("text-sm font-medium", active && "text-white")}>{it.label}</span>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        ) : (
          <motion.div
            key="sidebar-collapsed"
            initial={{ x: -72, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -72, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="glass-panel m-4 p-2 w-[64px] hidden md:block"
            aria-label="Sidebar collapsed"
          >
            <nav className="flex flex-col gap-2">
              {items.map((it) => {
                const Icon = it.icon
                const active = activeTab === it.key
                return (
                  <button
                    key={it.key}
                    onClick={() => setActiveTab(it.key)}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md hover-glow transition-all",
                      active ? "brand-gradient text-white" : "hover:bg-muted text-foreground",
                    )}
                    aria-label={it.label}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className={cn("h-5 w-5", active && "text-white")} />
                  </button>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
