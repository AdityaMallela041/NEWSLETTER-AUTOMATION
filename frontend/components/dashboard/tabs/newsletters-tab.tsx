"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit2, Trash2, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { NewsletterPreviewModal } from "../newsletter-preview-modal"
import { seedNewsletters, seedEvents } from "@/lib/seed-data"
import type { Newsletter, Event } from "@/lib/seed-data"

const fetcher = (u: string) => fetch(u).then((r) => r.json())
const ITEMS_PER_PAGE = 10

export function NewslettersTab() {
  const { data, mutate } = useSWR("/api/newsletters", fetcher, { fallbackData: [] })
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const allNewsletters = seedNewsletters

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return allNewsletters.filter((n) => {
      const okQuery = !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)
      return okQuery
    })
  }, [query])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleViewNewsletter = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter)
    setShowPreview(true)
  }

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      toast({
        title: "Success",
        description: "Newsletter deleted successfully",
      })
      setDeleteId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete newsletter",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getEventsForNewsletter = (newsletter: Newsletter): Event[] => {
    return seedEvents.filter((e) => newsletter.events.includes(e.id))
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Newsletters</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your published newsletters</p>
        </div>

        <Card className="glass-panel border-border/40">
          <CardHeader>
            <CardTitle>Newsletter List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or excerpt…"
                className="glass-panel placeholder-glow flex-1"
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40 hover:bg-transparent">
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((newsletter: Newsletter, idx: number) => (
                      <TableRow key={newsletter.id} className="border-border/40 hover:bg-white/30">
                        <TableCell className="font-mono text-sm">
                          {String(idx + 1 + (currentPage - 1) * ITEMS_PER_PAGE).padStart(3, "0")}
                        </TableCell>
                        <TableCell className="font-medium">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <button className="text-primary underline hover:no-underline">{newsletter.title}</button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 glass-panel">
                              <p className="text-sm font-medium">{newsletter.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{newsletter.excerpt}</p>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(newsletter.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">{newsletter.events.length} event(s)</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleViewNewsletter(newsletter)}
                              aria-label="View newsletter"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(newsletter.id)}
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No newsletters found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filtered.length} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="glass-panel bg-transparent"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="glass-panel bg-transparent"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="glass-panel">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this newsletter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="glass-panel">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <NewsletterPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        newsletter={selectedNewsletter}
        events={selectedNewsletter ? getEventsForNewsletter(selectedNewsletter) : []}
      />
    </>
  )
}
