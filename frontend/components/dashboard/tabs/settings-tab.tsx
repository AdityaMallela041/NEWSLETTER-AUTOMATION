"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SettingsTab() {
  const [dark, setDark] = useState(false)

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-gradient">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" className="glass-panel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" className="glass-panel" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dept">Department</Label>
            <Input id="dept" placeholder="Research" className="glass-panel" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="New password" className="glass-panel" />
          <div className="h-2 w-full rounded bg-black/5 overflow-hidden">
            <div className="h-full brand-gradient" style={{ width: "50%" }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Dark Mode</div>
            <div className="text-sm text-[var(--muted)]">Smooth color transition</div>
          </div>
          <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
        </div>

        <div className="flex gap-2">
          <Button className="brand-gradient text-white">Save</Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent className="glass-panel">
              <DialogHeader>
                <DialogTitle>Delete account?</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Confirm Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
