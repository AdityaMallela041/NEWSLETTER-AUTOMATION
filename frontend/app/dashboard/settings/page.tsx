"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="grid gap-6 max-w-2xl">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Email provider</CardTitle>
          <CardDescription>Configure your SendGrid credentials</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sendgridKey">SendGrid API Key</Label>
            <Input id="sendgridKey" placeholder="SG.xxxxx" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fromEmail">From email</Label>
            <Input id="fromEmail" type="email" placeholder="no-reply@example.com" />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>AI models</CardTitle>
          <CardDescription>Configure summarization providers</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="groq">Groq API Key</Label>
            <Input id="groq" placeholder="gsk_xxxxx" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gemini">Google Gemini Key</Label>
            <Input id="gemini" placeholder="AIza..." />
          </div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
