"use client"
import useSWR from "swr"
import { fetcher } from "@/lib/swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Template = { id: string; name: string; description: string }

export default function TemplatesPage() {
  const { data } = useSWR<Template[]>("/api/templates", fetcher)
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(data ?? []).map((t) => (
        <Card key={t.id} className="bg-card">
          <CardHeader>
            <CardTitle>{t.name}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Button variant="secondary">Preview</Button>
            <Button>Edit</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
