"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect } from "react"
import { useUIStore } from "@/lib/state"
import { Newspaper, Users, TrendingUp, Calendar } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  const mv = useMotionValue(0)
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => mv.set(v),
    })
    return () => controls.stop()
  }, [value, mv])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-6 hover-glow rounded-lg"
      role="region"
      aria-label={label}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <motion.div className="text-3xl font-bold mt-2">{Math.round(mv.get())}</motion.div>
        </div>
        <div className="text-primary/40">{Icon}</div>
      </div>
    </motion.div>
  )
}

export function OverviewTab() {
  const { setActiveTab } = useUIStore()
  const { data: stats } = useSWR("/api/admin/stats", fetcher, {
    fallbackData: {
      totalNewsletters: 24,
      totalSubscribers: 1250,
      publishedThisMonth: 8,
      totalReach: 5420,
    },
  })

  const { data: recentNewsletters } = useSWR("/api/newsletters?limit=5", fetcher, {
    fallbackData: [],
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Admin. Here's your newsletter overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Newsletters"
          value={stats?.totalNewsletters ?? 0}
          icon={<Newspaper className="h-8 w-8" />}
        />
        <StatCard label="Total Subscribers" value={stats?.totalSubscribers ?? 0} icon={<Users className="h-8 w-8" />} />
        <StatCard
          label="Published This Month"
          value={stats?.publishedThisMonth ?? 0}
          icon={<Calendar className="h-8 w-8" />}
        />
        <StatCard label="Total Reach" value={stats?.totalReach ?? 0} icon={<TrendingUp className="h-8 w-8" />} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-panel border-border/40">
          <CardHeader>
            <CardTitle className="text-gradient">Recent Newsletters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(recentNewsletters as any[]).length > 0 ? (
              (recentNewsletters as any[]).map((newsletter, i) => (
                <motion.div
                  key={newsletter.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-3 hover-glow"
                >
                  <div className="font-medium text-sm">{newsletter.eventName}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(newsletter.date).toLocaleDateString()} • {newsletter.place}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No newsletters yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/40">
          <CardHeader>
            <CardTitle className="text-gradient">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full brand-gradient text-white hover:opacity-90"
              onClick={() => setActiveTab("add-newsletter")}
            >
              + Create New Newsletter
            </Button>
            <Button
              variant="outline"
              className="w-full glass-panel bg-transparent"
              onClick={() => setActiveTab("newsletters")}
            >
              View All Newsletters
            </Button>
            <Button
              variant="outline"
              className="w-full glass-panel bg-transparent"
              onClick={() => setActiveTab("analytics")}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
