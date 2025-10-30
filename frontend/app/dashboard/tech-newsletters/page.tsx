"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Zap, Search, Loader2, Eye } from "lucide-react"
import { useState, useMemo } from "react"
import useSWR from "swr"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useToast } from "@/hooks/use-toast"
import { TechNewsletterPreviewModal } from "@/components/dashboard/tech-newsletter-preview-modal"

interface Newsletter {
  id: string
  eventName: string
  description: string
  place: string
  date: string
  time: string
  contactEmail: string
  tags: string[]
  image: string
  status: "published" | "draft"
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const ITEMS_PER_PAGE = 10

export default function TechNewslettersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const { toast } = useToast()
  const { data, mutate } = useSWR<{ data: Newsletter[] }>("/api/newsletters", fetcher)

  const newsletters = data?.data ?? []

  // Filter newsletters based on search query
  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) return newsletters

    const query = searchQuery.toLowerCase()
    return newsletters.filter(
      (nl) =>
        nl.eventName.toLowerCase().includes(query) ||
        nl.description.toLowerCase().includes(query) ||
        nl.place.toLowerCase().includes(query),
    )
  }, [searchQuery, newsletters])

  // Calculate pagination
  const totalPages = Math.ceil(filteredNewsletters.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNewsletters = filteredNewsletters.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleRetrigger = async (newsletter: Newsletter) => {
    try {
      setLoadingId(newsletter.id)
      const response = await fetch(`/api/newsletters/${newsletter.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to retrigger newsletter")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: result.message || `Newsletter "${newsletter.eventName}" retriggered successfully!`,
      })

      // Refresh the newsletters list
      mutate()
    } catch (error) {
      console.error("Error retriggering newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to retrigger newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handlePreview = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter)
    setPreviewOpen(true)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tech Newsletters</h1>
            <p className="text-muted-foreground mt-1">Manage and view all your technology newsletters</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-panel border-border">
          <CardHeader>
            <CardTitle>All Newsletters</CardTitle>
            <CardDescription>Total: {filteredNewsletters.length} newsletters</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex items-center gap-3 bg-input/50 rounded-lg px-4 py-3 border border-border/50">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Search by name, description, or location..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-transparent border-0 text-base placeholder-muted-foreground focus:outline-none flex-1"
                  aria-label="Search newsletters"
                />
              </div>
            </div>

            {/* Newsletters Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Newsletter Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedNewsletters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {filteredNewsletters.length === 0 && searchQuery
                          ? "No newsletters match your search."
                          : "No newsletters available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedNewsletters.map((newsletter, idx) => (
                      <motion.tr
                        key={newsletter.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-border hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium">{newsletter.eventName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{newsletter.place}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(newsletter.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              newsletter.status === "published"
                                ? "bg-accent/20 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{newsletter.contactEmail}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(newsletter)}
                              className="text-primary hover:bg-primary/10 gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-xs font-medium">Preview</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetrigger(newsletter)}
                              disabled={loadingId === newsletter.id}
                              className="text-primary hover:bg-primary/10 gap-2"
                            >
                              {loadingId === newsletter.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Zap className="w-4 h-4" />
                              )}
                              <span className="text-xs font-medium">
                                {loadingId === newsletter.id ? "Retriggering..." : "Retrigger"}
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 pt-6 border-t border-border">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) setCurrentPage(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <TechNewsletterPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} newsletter={selectedNewsletter} />
    </div>
  )
}
