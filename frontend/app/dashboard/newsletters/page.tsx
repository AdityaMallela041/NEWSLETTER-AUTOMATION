"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, Eye, Search } from "lucide-react"
import { motion } from "framer-motion"
import { NewsletterPreviewModal } from "@/components/dashboard/newsletter-preview-modal"

interface Newsletter {
  id: string
  eventName: string
  description: string
  place: string
  date: string
  time: string
  image: string
  status: "draft" | "published"
  tags?: string[]
}

export default function NewslettersPage() {
  const { data, mutate } = useSWR<Newsletter[]>("/api/newsletters", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleNewsletterAdded = useCallback(() => {
    mutate()
  }, [mutate])

  const filteredNewsletters = (data?.data ?? []).filter(
    (n) =>
      n.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.place.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePreviewNewsletter = (newsletter: Newsletter) => {
    setPreviewNewsletter({
      id: newsletter.id,
      title: newsletter.eventName,
      excerpt: newsletter.description.replace(/<[^>]*>/g, "").substring(0, 150),
      date: newsletter.date,
      content: newsletter.description.replace(/<[^>]*>/g, ""),
    })
    setShowPreview(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gradient">My Newsletters</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search newsletters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-panel"
          />
        </div>
      </div>

      {/* Newsletters Table */}
      <div className="glass-panel rounded-lg overflow-hidden border border-border/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30 bg-gradient-to-r from-muted to-background">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Event Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Place</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsletters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {data?.length === 0
                      ? "No newsletters yet. Create one to get started!"
                      : "No newsletters match your search."}
                  </td>
                </tr>
              ) : (
                filteredNewsletters.map((newsletter, index) => (
                  <motion.tr
                    key={newsletter.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{newsletter.eventName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">
                      <div className="truncate" title={newsletter.description}>
                        {newsletter.description.replace(/<[^>]*>/g, "").substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{newsletter.place}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(newsletter.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer"
                        onMouseEnter={() => setHoveredImage(newsletter.id)}
                        onMouseLeave={() => setHoveredImage(null)}
                      >
                        <img
                          src={newsletter.image || "/placeholder.svg"}
                          alt={newsletter.eventName}
                          className="w-full h-full object-cover"
                        />
                        {hoveredImage === newsletter.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center"
                          >
                            <Eye className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          newsletter.status === "published"
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {newsletter.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-ring"
                          onClick={() => handlePreviewNewsletter(newsletter)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-ring">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewsletterPreviewModal open={showPreview} onOpenChange={setShowPreview} newsletter={previewNewsletter} />
    </div>
  )
}
