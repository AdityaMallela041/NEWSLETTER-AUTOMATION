"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Wand2 } from "lucide-react"
import type { Event } from "@/lib/seed-data"
import { useToast } from "@/hooks/use-toast"

interface MyEventsSectionProps {
  events: Event[]
  onGenerateNewsletter?: (selectedEvents: Event[]) => void
}

export function MyEventsSection({ events, onGenerateNewsletter }: MyEventsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const handleToggleEvent = (eventId: string) => {
    const newSelected = new Set(selectedEvents)
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId)
    } else {
      newSelected.add(eventId)
    }
    setSelectedEvents(newSelected)
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

    const selected = events.filter((e) => selectedEvents.has(e.id))
    onGenerateNewsletter?.(selected)
  }

  return (
    <div className="px-3 py-4 border-t border-border/30">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold text-foreground">My Events</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 space-y-2"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                id={`event-${event.id}`}
                checked={selectedEvents.has(event.id)}
                onCheckedChange={() => handleToggleEvent(event.id)}
                className="mt-1"
                aria-label={`Select ${event.title}`}
              />
              <label htmlFor={`event-${event.id}`} className="flex-1 cursor-pointer">
                <div className="text-xs font-medium text-foreground leading-tight">{event.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {new Date(event.date).toLocaleDateString()} • {event.location}
                </div>
              </label>
            </motion.div>
          ))}

          <Button
            onClick={handleGenerateNewsletter}
            className="w-full mt-3 bg-gradient-to-r from-primary to-ring text-white hover:opacity-90"
            size="sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Newsletter
          </Button>
        </motion.div>
      )}
    </div>
  )
}
