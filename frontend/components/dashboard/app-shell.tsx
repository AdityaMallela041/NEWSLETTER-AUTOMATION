"use client"

import { NavTopbar } from "./nav-topbar"
import { NavSidebar } from "./nav-sidebar"
import { useUIStore } from "@/lib/state"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function AppShell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUIStore()
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      <NavTopbar />
      <div className="grid md:grid-cols-[auto_1fr] gap-0">
        <NavSidebar />
        <motion.main
          key={sidebarOpen ? "content-wide" : "content-full"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="p-4 md:p-6"
          role="main"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
