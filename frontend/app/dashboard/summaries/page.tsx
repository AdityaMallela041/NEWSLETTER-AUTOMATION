"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Summary = { id: string; title: string; summary: string; model: string }

export default function SummariesPage() {
  const { data, isLoading } = useSWR<Summary[]>("/api/summaries", fetcher)
  return (
    <div className="grid gap-4">
      {(data ?? (isLoading ? new Array(5).fill(null) : [])).map((s, i) =>
        s ? (
          <Card key={s.id} className="bg-card">
            <CardHeader>
              <CardTitle className="text-pretty">{s.title}</CardTitle>
              <CardDescription className="text-xs">Model: {s.model}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{s.summary}</p>
            </CardContent>
          </Card>
        ) : (
          <Card key={i} className="bg-card h-36 animate-pulse" />
        ),
      )}
    </div>
  )
}
