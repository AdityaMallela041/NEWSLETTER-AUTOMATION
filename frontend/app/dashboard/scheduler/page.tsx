"use client"
import useSWR from "swr"
import type React from "react"

import useSWRMutation from "swr/mutation"
import { fetcher } from "@/lib/swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Schedule = { enabled: boolean; frequency: "daily" | "weekly" | "monthly"; time: string }

async function saveSchedule(url: string, { arg }: { arg: Schedule }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Failed to save schedule")
  return res.json()
}

export default function SchedulerPage() {
  const { data } = useSWR<Schedule>("/api/schedule", fetcher)
  const { trigger, isMutating } = useSWRMutation("/api/schedule", saveSchedule)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    await trigger({
      enabled: formData.get("enabled") === "on",
      frequency: formData.get("frequency") as Schedule["frequency"],
      time: String(formData.get("time") || "09:00"),
    })
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Automation schedule</CardTitle>
        <CardDescription>Configure how often newsletters are generated</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 max-w-md" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="enabled">Enabled</Label>
            <Input id="enabled" name="enabled" type="checkbox" defaultChecked={Boolean(data?.enabled)} />
          </div>
          <div className="grid gap-2">
            <Label>Frequency</Label>
            <Select name="frequency" defaultValue={data?.frequency ?? "weekly"}>
              <SelectTrigger>
                <SelectValue placeholder="Select cadence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time (24h)</Label>
            <Input id="time" name="time" type="time" defaultValue={data?.time ?? "09:00"} />
          </div>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Saving..." : "Save schedule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
