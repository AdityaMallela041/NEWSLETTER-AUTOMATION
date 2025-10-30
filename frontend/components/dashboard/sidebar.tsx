"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Mail, LogOut, Newspaper, Users2 } from "lucide-react"
import { useState } from "react"
import { NewsletterPreviewModal } from "./newsletter-preview-modal"
import type { Newsletter } from "@/lib/seed-data"

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tech-newsletters", label: "Tech Newsletters", icon: Newspaper },
  { href: "/dashboard/team", label: "Team Members", icon: Users },
  { href: "/dashboard/staff-members", label: "Staff Members", icon: Users2 },
  { href: "/dashboard/subscribers", label: "Subscribers", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()
  const [generatedNewsletter, setGeneratedNewsletter] = useState<Newsletter | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <nav
        aria-label="Sidebar"
        className="h-dvh sticky top-0 glass-panel-lg border-r border-border w-64 hidden md:flex flex-col bg-sidebar text-sidebar-foreground"
      >
        <div className="px-6 py-8 border-b border-border/30">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-ring flex items-center justify-center glow-effect">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg text-gradient">NewsHub</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </div>
          </motion.div>
        </div>

        <ul className="px-3 py-4 grid gap-2 flex-1">
          {items.map((it, idx) => {
            const active = pathname === it.href
            const Icon = it.icon
            return (
              <motion.li
                key={it.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={it.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-primary/10 to-ring/10 text-primary border border-border shadow-lg shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{it.label}</span>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-1 h-6 bg-gradient-to-b from-primary to-ring rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        <div className="px-3 py-4 border-t border-border/30">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </nav>

      <NewsletterPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        newsletter={generatedNewsletter}
        events={[]}
        isGenerated={true}
      />
    </>
  )
}
