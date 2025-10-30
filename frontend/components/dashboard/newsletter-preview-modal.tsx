"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Event, Newsletter } from "@/lib/seed-data"
import { Download, Copy, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface NewsletterPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newsletter: Newsletter | null
  events?: Event[]
  isGenerated?: boolean
}

export function NewsletterPreviewModal({
  open,
  onOpenChange,
  newsletter,
  events = [],
  isGenerated = false,
}: NewsletterPreviewModalProps) {
  const { toast } = useToast()

  if (!newsletter) return null

  const handleCopyHTML = () => {
    const html = generateNewsletterHTML(newsletter, events)
    navigator.clipboard.writeText(html)
    toast({
      title: "Copied",
      description: "Newsletter HTML copied to clipboard",
    })
  }

  const handleDownloadHTML = () => {
    const html = generateNewsletterHTML(newsletter, events)
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-${newsletter.id}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded",
      description: "Newsletter HTML downloaded",
    })
  }

  const handleDuplicate = () => {
    toast({
      title: "Duplicated",
      description: "Newsletter duplicated and added to My Newsletters",
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

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-panel p-0 border-border/40">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/20">
            <motion.div variants={contentVariants}>
              <DialogTitle className="text-2xl font-bold text-gradient">{newsletter.title}</DialogTitle>
            </motion.div>
          </DialogHeader>

          <div className="px-6 py-6 space-y-4">
            {/* Newsletter Preview */}
            <motion.div
              variants={contentVariants}
              className="bg-white rounded-lg p-6 border border-border/20 shadow-sm"
            >
              <div className="text-center mb-6 pb-6 border-b border-border/20">
                <motion.h1 variants={itemVariants} custom={0} className="text-2xl font-bold text-foreground mb-2">
                  {newsletter.title}
                </motion.h1>
                <motion.p variants={itemVariants} custom={1} className="text-sm text-muted-foreground">
                  {new Date(newsletter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </motion.p>
              </div>

              {/* Events List */}
              {events.length > 0 && (
                <motion.div variants={contentVariants} className="space-y-4 mb-6">
                  <h2 className="font-semibold text-foreground">Featured Events</h2>
                  {events.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      custom={idx + 2}
                      className="border-l-4 border-primary pl-4 py-2"
                    >
                      <h3 className="font-medium text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.location}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Footer */}
              <motion.div
                variants={itemVariants}
                custom={events.length + 2}
                className="mt-6 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground"
              >
                <p>© 2025 AI Chronicle. All rights reserved.</p>
                <p className="mt-2">
                  <a href="#" className="text-primary hover:underline">
                    Unsubscribe
                  </a>{" "}
                  •
                  <a href="#" className="text-primary hover:underline ml-2">
                    Contact Us
                  </a>
                </p>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={contentVariants} className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="glass-panel">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              {isGenerated && (
                <Button variant="outline" onClick={handleDuplicate} className="glass-panel bg-transparent">
                  Duplicate
                </Button>
              )}
              <Button variant="outline" onClick={handleCopyHTML} className="glass-panel bg-transparent">
                <Copy className="w-4 h-4 mr-2" />
                Copy HTML
              </Button>
              <Button
                onClick={handleDownloadHTML}
                className="bg-gradient-to-r from-primary to-ring text-white hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

function generateNewsletterHTML(newsletter: Newsletter, events: Event[]): string {
  const eventsHTML = events
    .map(
      (event) => `
    <div style="border-left: 4px solid #0D6EFD; padding-left: 16px; margin-bottom: 24px;">
      <h3 style="font-weight: 600; color: #212529; margin: 0 0 8px 0;">${event.title}</h3>
      <p style="color: #495057; margin: 8px 0; font-size: 14px;">${event.description}</p>
      <div style="display: flex; gap: 16px; font-size: 12px; color: #6C757D; margin-top: 8px;">
        <span>${new Date(event.date).toLocaleDateString()}</span>
        <span>${event.location}</span>
      </div>
    </div>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #212529; background-color: #F8F9FA;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px;">
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #DEE2E6;">
      <h1 style="font-size: 24px; font-weight: 700; color: #212529; margin: 0 0 8px 0;">${newsletter.title}</h1>
      <p style="font-size: 14px; color: #6C757D; margin: 0;">
        ${new Date(newsletter.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
    
    ${
      events.length > 0
        ? `
      <div style="margin-bottom: 32px;">
        <h2 style="font-weight: 600; color: #212529; margin: 0 0 16px 0;">Featured Events</h2>
        ${eventsHTML}
      </div>
    `
        : ""
    }
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #DEE2E6; text-align: center; font-size: 12px; color: #6C757D;">
      <p style="margin: 0 0 8px 0;">© 2025 AI Chronicle. All rights reserved.</p>
      <p style="margin: 0;">
        <a href="#" style="color: #0D6EFD; text-decoration: none;">Unsubscribe</a> • 
        <a href="#" style="color: #0D6EFD; text-decoration: none; margin-left: 8px;">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
}
