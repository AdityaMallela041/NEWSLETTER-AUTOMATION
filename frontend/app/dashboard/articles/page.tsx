"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type Article = { id: string; title: string; link: string; snippet: string; source?: string }

export default function ArticlesPage() {
  const [q, setQ] = useState("")
  const { data, isLoading, mutate } = useSWR<Article[]>(
    `/api/articles${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    fetcher,
  )
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Input placeholder="Search articles..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={() => mutate()}>Refresh</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? (isLoading ? new Array(4).fill(null) : [])).map((a, i) =>
          a ? (
            <Card key={a.id} className="bg-card">
              <CardHeader>
                <CardTitle className="text-pretty">{a.title}</CardTitle>
                <CardDescription className="truncate">{a.link}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.snippet}</p>
                <a className="text-primary underline text-sm" href={a.link} target="_blank" rel="noreferrer">
                  Read original
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card key={i} className="bg-card h-40 animate-pulse" />
          ),
        )}
      </div>
    </div>
  )
}
