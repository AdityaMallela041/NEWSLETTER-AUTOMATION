"use client"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu } from "lucide-react"
import { useState, type FormEvent, useMemo } from "react"
import { searchItems } from "@/lib/search-engine"
import { seedEvents, seedNewsletters } from "@/lib/seed-data"
import { SearchResults } from "./search-results"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { SearchableItem } from "@/lib/search-engine"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/my-events": "My Events",
  "/dashboard/newsletters": "My Newsletters",
  "/dashboard/team": "Team Members",
  "/dashboard/subscribers": "Subscribers",
  "/dashboard/settings": "Settings",
}

export function Topbar() {
  const pathname = usePathname()
  const router = useRouter()
  const title = titles[pathname] ?? "Dashboard"
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const searchableItems: SearchableItem[] = useMemo(() => {
    return [
      ...seedEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        type: "event" as const,
        location: event.location,
        date: event.date,
        tags: [event.type],
      })),
      ...seedNewsletters.map((nl) => ({
        id: nl.id,
        title: nl.title,
        description: nl.excerpt,
        type: "newsletter" as const,
        date: nl.date,
      })),
    ]
  }, [])

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchItems(searchableItems, searchQuery).slice(0, 8)
  }, [searchQuery, searchableItems])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setIsOpen(true)
  }

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/newsletters?search=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-10 glass-panel border-b border-border/20 backdrop-blur-xl">
      <div className="mx-auto max-w-full px-6 py-4 flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-semibold text-gradient">
          {title}
        </motion.h1>

        <div className="flex items-center gap-4">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center gap-2 bg-input/30 rounded-lg px-3 py-2 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events, newsletters..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-transparent border-0 text-sm placeholder-muted-foreground focus:outline-none w-64"
                  aria-label="Search"
                />
              </form>
            </PopoverTrigger>
            {searchQuery.trim() && (
              <PopoverContent className="w-80 p-0 glass-panel border-border/40" align="end">
                <SearchResults results={searchResults} />
              </PopoverContent>
            )}
          </Popover>

          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
