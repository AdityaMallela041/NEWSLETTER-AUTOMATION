"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUIStore } from "@/lib/state"
import { Bell, Menu, LogOut, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AddNewsletterModal } from "./add-newsletter-modal"

export function NavTopbar() {
  const router = useRouter()
  const { toggleSidebar, notifications, setNotifications } = useUIStore()
  const [query, setQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  function handleSignOut() {
    router.push("/login")
  }

  const handleNewsletterAdded = useCallback(() => {
    // This will be passed to the modal to trigger a refresh
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b border-border"
        role="banner"
        aria-label="Top navigation"
      >
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu className="h-5 w-5" />
        </Button>

        <div className="font-sans text-sm md:text-base font-semibold text-gradient">AI Chronicle</div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-3 w-full max-w-md">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search newsletters…"
            className="placeholder-glow glass-panel"
            aria-label="Search"
          />
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-ring text-white hover:from-ring hover:to-primary"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          onClick={() => setNotifications(Math.max(0, notifications - 1))}
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span
              className="absolute -top-1 -right-1 brand-gradient text-white text-[10px] rounded-full px-1.5 py-0.5"
              aria-label={`${notifications} new notifications`}
            >
              {notifications}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </motion.header>

      <AddNewsletterModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onNewsletterAdded={handleNewsletterAdded}
      />
    </>
  )
}
