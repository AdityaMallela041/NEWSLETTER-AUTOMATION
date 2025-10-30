"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Trash2, Edit } from "lucide-react"
import { seedNewsletters, seedEvents } from "@/lib/seed-data"
import { NewsletterPreviewModal } from "@/components/dashboard/newsletter-preview-modal"
import type { Newsletter } from "@/lib/seed-data"
import { useToast } from "@/hooks/use-toast"

// Example newsletters with status
const newslettersWithStatus = [
  {
    id: "nl-ex-001",
    title: "AI Weekly Digest",
    description: "Latest Trends in Deep Learning",
    date: "2024-03-15",
    status: "Published" as const,
  },
  {
    id: "nl-ex-002",
    title: "Tech Innovation Report",
    description: "Monthly Technology Updates",
    date: "2024-03-10",
    status: "Published" as const,
  },
  {
    id: "nl-ex-003",
    title: "Developer's Guide",
    description: "Best Practices & Tools",
    date: "2024-03-05",
    status: "Draft" as const,
  },
  ...seedNewsletters,
]

export default function MyNewslettersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  // Filter newsletters based on search query
  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) return newslettersWithStatus

    const query = searchQuery.toLowerCase()
    return newslettersWithStatus.filter(
      (nl) => nl.title.toLowerCase().includes(query) || nl.description.toLowerCase().includes(query),
    )
  }, [searchQuery])

  const handlePreview = (newsletter: any) => {
    const fullNewsletter: Newsletter = {
      id: newsletter.id,
      title: newsletter.title,
      date: newsletter.date,
      excerpt: newsletter.description,
      events: newsletter.events || [],
    }
    setSelectedNewsletter(fullNewsletter)
    setShowPreview(true)
  }

  const handleEdit = (newsletter: any) => {
    toast({
      title: "Edit Newsletter",
      description: `Editing "${newsletter.title}"`,
    })
  }

  const handleDelete = (newsletter: any) => {
    toast({
      title: "Newsletter Deleted",
      description: `"${newsletter.title}" has been deleted`,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Newsletters</h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 bg-white rounded-lg border border-border/30 shadow-sm px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search newsletters…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-base placeholder-muted-foreground focus:outline-none flex-1 min-w-0"
              aria-label="Search newsletters"
            />
          </div>
        </motion.div>

        {/* Newsletters Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNewsletters.map((newsletter, idx) => (
            <motion.div
              key={newsletter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="bg-white rounded-lg border border-border/30 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary/10 to-ring/10 flex items-center justify-center border-b border-border/20">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary text-lg font-bold">📰</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Newsletter Preview</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title and Status Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg text-foreground flex-1">{newsletter.title}</h3>
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      newsletter.status === "Published"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {newsletter.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{newsletter.description}</p>

                {/* Date */}
                <p className="text-xs text-muted-foreground mb-6">
                  {new Date(newsletter.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(newsletter)}
                    className="text-primary hover:bg-primary/10 gap-2 flex-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-medium">Preview</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(newsletter)}
                    className="text-primary hover:bg-primary/10 gap-2 flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-xs font-medium">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(newsletter)}
                    className="text-destructive hover:bg-destructive/10 gap-2 flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Delete</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredNewsletters.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-muted-foreground text-lg">No newsletters found matching your search.</p>
          </motion.div>
        )}
      </div>

      {/* Newsletter Preview Modal */}
      <NewsletterPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        newsletter={selectedNewsletter}
        events={selectedNewsletter ? seedEvents.filter((e) => selectedNewsletter.events.includes(e.id)) : []}
      />
    </div>
  )
}
