"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, X, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

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

interface TechNewsletterPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newsletter: Newsletter | null
}

export function TechNewsletterPreviewModal({ open, onOpenChange, newsletter }: TechNewsletterPreviewModalProps) {
  const { toast } = useToast()

  if (!newsletter) return null

  const handleCopyToClipboard = () => {
    const text = `${newsletter.eventName}\n${newsletter.description}\n\nLocation: ${newsletter.place}\nDate: ${new Date(newsletter.date).toLocaleDateString()}\nTime: ${newsletter.time}\n\nContact: ${newsletter.contactEmail}`
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Newsletter content copied to clipboard",
    })
  }

  const handlePublish = () => {
    toast({
      title: "Published",
      description: `Newsletter "${newsletter.eventName}" has been published`,
    })
    onOpenChange(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-panel p-0 border-border/40">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/20 flex flex-row items-center justify-between">
            <motion.div variants={contentVariants} className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gradient">{newsletter.eventName}</DialogTitle>
            </motion.div>
            <DialogClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="px-6 py-6 space-y-4">
            {/* Newsletter Preview */}
            <motion.div
              variants={contentVariants}
              className="bg-white rounded-lg p-6 border border-border/20 shadow-sm space-y-4"
            >
              {/* Title and Date */}
              <div className="border-b border-border/20 pb-4">
                <motion.h1 variants={contentVariants} className="text-2xl font-bold text-foreground mb-2">
                  {newsletter.eventName}
                </motion.h1>
                <motion.p variants={contentVariants} className="text-sm text-muted-foreground">
                  {new Date(newsletter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </motion.p>
              </div>

              {/* Content */}
              <motion.div variants={contentVariants} className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Description</p>
                  <p className="text-sm text-foreground mt-1">{newsletter.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Location</p>
                    <p className="text-sm text-foreground mt-1">{newsletter.place}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Time</p>
                    <p className="text-sm text-foreground mt-1">{newsletter.time}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Contact</p>
                  <p className="text-sm text-foreground mt-1">{newsletter.contactEmail}</p>
                </div>

                {newsletter.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newsletter.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Footer */}
              <motion.div
                variants={contentVariants}
                className="mt-6 pt-4 border-t border-border/20 text-center text-xs text-muted-foreground"
              >
                <p>© 2025 AI Chronical. All rights reserved.</p>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={contentVariants} className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="glass-panel">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button variant="outline" onClick={handleCopyToClipboard} className="glass-panel bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handlePublish}
                className="bg-gradient-to-r from-primary to-ring text-white hover:opacity-90"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
