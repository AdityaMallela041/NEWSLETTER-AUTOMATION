"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Zap } from "lucide-react"
import { seedEvents } from "@/lib/seed-data"
import { NewsletterPreviewModal } from "@/components/dashboard/newsletter-preview-modal"
import type { Newsletter } from "@/lib/seed-data"
import { useToast } from "@/hooks/use-toast"

export default function MyEventsPage() {
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [generatedNewsletter, setGeneratedNewsletter] = useState<Newsletter | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return seedEvents

    const query = searchQuery.toLowerCase()
    return seedEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const handleToggleEvent = (eventId: string) => {
    const newSelected = new Set(selectedEvents)
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId)
    } else {
      newSelected.add(eventId)
    }
    setSelectedEvents(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedEvents.size === filteredEvents.length) {
      setSelectedEvents(new Set())
    } else {
      setSelectedEvents(new Set(filteredEvents.map((e) => e.id)))
    }
  }

  const handleGenerateNewsletter = () => {
    if (selectedEvents.size === 0) {
      toast({
        title: "No events selected",
        description: "Please select at least one event to generate a newsletter.",
        variant: "destructive",
      })
      return
    }

    const selected = seedEvents.filter((e) => selectedEvents.has(e.id))
    const newsletter: Newsletter = {
      id: `nl-gen-${Date.now()}`,
      title: `Generated Newsletter - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split("T")[0],
      excerpt: `Newsletter featuring ${selected.length} event${selected.length !== 1 ? "s" : ""}`,
      events: selected.map((e) => e.id),
    }
    setGeneratedNewsletter(newsletter)
    setShowPreview(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Events</h1>
            <p className="text-muted-foreground">Select events to generate newsletters</p>
          </div>
          <Button
            onClick={handleGenerateNewsletter}
            className="bg-gradient-to-r from-primary to-ring text-white hover:opacity-90 gap-2"
            size="lg"
          >
            <Zap className="w-5 h-5" />
            Generate Newsletter {selectedEvents.size > 0 && `(${selectedEvents.size})`}
          </Button>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-lg border border-border/30 shadow-sm p-4">
            <div className="flex items-center gap-3 bg-input/30 rounded-lg px-4 py-3 border border-border/20">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-base placeholder-muted-foreground focus:outline-none flex-1"
                aria-label="Search events"
              />
            </div>
          </div>
        </motion.div>

        {/* Select All Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 bg-white rounded-lg border border-border/30 shadow-sm p-4"
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={selectedEvents.size === filteredEvents.length && filteredEvents.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all events"
            />
            <span className="text-sm font-medium text-foreground">
              Select all ({selectedEvents.size}/{filteredEvents.length})
            </span>
          </label>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="bg-white rounded-lg border border-border/30 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Checkbox and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <Checkbox
                    id={`event-${event.id}`}
                    checked={selectedEvents.has(event.id)}
                    onCheckedChange={() => handleToggleEvent(event.id)}
                    className="mt-1"
                    aria-label={`Select ${event.title}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{event.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                {/* Date and Location */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {event.location}
                  </div>
                </div>

                {/* Upcoming Tag */}
                <div className="flex justify-end">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    Upcoming
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-muted-foreground text-lg">No events found matching your search.</p>
          </motion.div>
        )}
      </div>

      {/* Newsletter Preview Modal */}
      <NewsletterPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        newsletter={generatedNewsletter}
        events={seedEvents.filter((e) => selectedEvents.has(e.id))}
        isGenerated={true}
      />
    </div>
  )
}
