"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useSWR from "swr"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { motion } from "framer-motion"

const fetcher = (u: string) => fetch(u).then((r) => r.json())
const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--sidebar))",
  "hsl(var(--muted-foreground))",
]

export function AnalyticsTab() {
  const { data: timeSeriesData } = useSWR("/api/analytics/newsletters-timeline", fetcher, {
    fallbackData: [
      { date: "Jan", count: 12 },
      { date: "Feb", count: 19 },
      { date: "Mar", count: 15 },
      { date: "Apr", count: 25 },
      { date: "May", count: 22 },
      { date: "Jun", count: 28 },
    ],
  })

  const { data: categoriesData } = useSWR("/api/analytics/categories", fetcher, {
    fallbackData: [
      { name: "Technology", value: 35 },
      { name: "Business", value: 25 },
      { name: "Science", value: 20 },
      { name: "Other", value: 20 },
    ],
  })

  const { data: reachData } = useSWR("/api/analytics/reach", fetcher, {
    fallbackData: [
      { name: "Week 1", subscribers: 1200, reach: 2400 },
      { name: "Week 2", subscribers: 1500, reach: 2800 },
      { name: "Week 3", subscribers: 1800, reach: 3200 },
      { name: "Week 4", subscribers: 2100, reach: 3800 },
    ],
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your newsletter performance and reach</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-panel border-border/40 h-full">
            <CardHeader>
              <CardTitle className="text-gradient">Newsletters Created Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData as any[]}>
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-panel border-border/40 h-full">
            <CardHeader>
              <CardTitle className="text-gradient">Newsletter Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoriesData as any[]} dataKey="value" nameKey="name" outerRadius={100} label>
                    {(categoriesData as any[]).map((_: any, i: number) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }} className="lg:col-span-2">
          <Card className="glass-panel border-border/40">
            <CardHeader>
              <CardTitle className="text-gradient">Subscribers & Reach</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reachData as any[]}>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="subscribers" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="reach" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
