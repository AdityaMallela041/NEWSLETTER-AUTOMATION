"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <Card className="w-full max-w-md border border-border/60 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your email to receive reset instructions</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-accent">
              If an account exists for {email}, you will receive an email shortly.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button
                type="submit"
                className="text-white"
                style={{ background: "linear-gradient(var(--accent-gradient))" }}
              >
                Send link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
