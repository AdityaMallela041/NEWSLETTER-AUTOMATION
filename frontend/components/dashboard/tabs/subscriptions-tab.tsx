"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

const topics = ["Machine Learning", "AI Ethics", "Robotics", "Data Science"]

export function SubscriptionsTab() {
  const [on, setOn] = useState(true)
  const [freq, setFreq] = useState("Weekly")
  const [prefs, setPrefs] = useState<string[]>(["Machine Learning", "Data Science"])
  const { toast } = useToast()

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-gradient">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{on ? "Subscribed to Weekly Digest" : "Unsubscribed"}</div>
            <div className="text-sm text-[var(--muted)]">Toggle to subscribe or pause</div>
          </div>
          <Switch checked={on} onCheckedChange={setOn} aria-label="Subscription status" />
        </div>

        <div>
          <div className="font-medium mb-2">Frequency</div>
          <RadioGroup value={freq} onValueChange={setFreq} className="grid sm:grid-cols-3 gap-2">
            {["Daily", "Weekly", "Monthly"].map((f) => (
              <Label key={f} className="glass-panel px-3 py-2 rounded-md cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={f} id={`freq-${f}`} />
                  <span>{f}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div>
          <div className="font-medium mb-2">Topic preferences</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {topics.map((t) => {
              const checked = prefs.includes(t)
              return (
                <Label key={t} className="glass-panel px-3 py-2 rounded-md cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => setPrefs((prev) => (c ? [...prev, t] : prev.filter((x) => x !== t)))}
                    />
                    <span>{t}</span>
                  </div>
                </Label>
              )
            })}
          </div>
        </div>

        <Button
          className="brand-gradient text-white hover:opacity-90"
          onClick={() => toast({ title: "Preferences updated", description: "Your preferences have been updated!" })}
        >
          Save preferences
        </Button>
      </CardContent>
    </Card>
  )
}
