"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, Users, CalendarDays, TrendingUp, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useEffect, useState } from "react"


const kpiData = [
  {
    title: "Total Newsletters",
    value: "1,248",
    change: "+12.5%",
    positive: true,
    icon: Newspaper,
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Total Subscribers",
    value: "45,231",
    change: "+8.2%",
    positive: true,
    icon: Users,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Published This Month",
    value: "156",
    change: "+23.1%",
    positive: true,
    icon: CalendarDays,
    color: "from-red-400 to-orange-400",
  },
  {
    title: "Total Reach",
    value: "2.4M",
    change: "-4.3%",
    positive: false,
    icon: TrendingUp,
    color: "from-orange-400 to-yellow-500",
  },
]

const chartData = [
  { month: "Jan", newsletters: 120, subscribers: 2400 },
  { month: "Feb", newsletters: 145, subscribers: 2800 },
  { month: "Mar", newsletters: 168, subscribers: 3200 },
  { month: "Apr", newsletters: 192, subscribers: 3800 },
  { month: "May", newsletters: 215, subscribers: 4200 },
  { month: "Jun", newsletters: 248, subscribers: 4800 },
]

const engagementData = [
  { name: "Open Rate", value: 45 },
  { name: "Click Rate", value: 28 },
  { name: "Bounce Rate", value: 27 },
]

// Blue shades for Engagement Metrics
const COLORS = [
  "#1E40AF",  // Dark blue
  "#3B82F6",  // Medium blue
  "#93C5FD",  // Light blue
  "hsl(var(--sidebar))",
]

// Function to determine bar color based on value (blue shades)
function getSubscriberBarColor(value: number) {
  if (value < 2800) return "#93C5FD" // Light blue for low
  if (value < 4000) return "#3B82F6" // Medium blue for medium
  return "#1E40AF" // Dark blue for high
}

const recentActivity = [
  { id: 1, event: "Newsletter Published", status: "published", time: "2 hours ago" },
  { id: 2, event: "New Subscriber Added", status: "active", time: "4 hours ago" },
  { id: 3, event: "Campaign Scheduled", status: "scheduled", time: "6 hours ago" },
  { id: 4, event: "Draft Saved", status: "draft", time: "1 day ago" },
  { id: 5, event: "Team Member Invited", status: "active", time: "2 days ago" },
]

function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    const numValue = Number.parseInt(value.replace(/,/g, "").replace(/M/g, "000000"))
    const duration = 1000
    const steps = 60
    const stepValue = numValue / steps

    let current = 0
    const interval = setInterval(() => {
      current += stepValue
      if (current >= numValue) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current).toLocaleString())
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [value])

  return <span>{displayValue}</span>
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Cards with animated counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
<Card className="glass-panel border-border hover:border-muted-foreground/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/12">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-3xl font-bold mt-2">
                        <AnimatedCounter value={kpi.value} />
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {kpi.positive ? (
                          <ArrowUpRight className="w-4 h-4 text-accent" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-secondary" />
                        )}
                        <span className={kpi.positive ? "text-accent" : "text-secondary"}>{kpi.change}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-ring glow-effect">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Newsletter Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
<Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle className="text-blue-600">Newsletter Performance</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis className="stroke-muted-foreground" />
                  <YAxis className="stroke-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background) / 0.9)",
                      border: "1px solid hsl(var(--primary) / 0.3)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newsletters"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscriber Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle>Subscriber Growth</CardTitle>
              <CardDescription>Monthly growth</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis className="stroke-muted-foreground" />
                  <YAxis className="stroke-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background) / 0.9)",
                      border: "1px solid hsl(var(--primary) / 0.3)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="subscribers" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSubscriberBarColor(entry.subscribers)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Email performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="hsl(var(--muted))"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="glass-panel border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest 5 activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-border transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        activity.status === "published"
                          ? "bg-accent/20 text-accent"
                          : activity.status === "scheduled"
                            ? "bg-primary/20 text-primary"
                            : activity.status === "draft"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-sidebar/20 text-sidebar"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  )
}
