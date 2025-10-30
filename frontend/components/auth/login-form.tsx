"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWRMutation from "swr/mutation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

async function loginRequest(url: string, { arg }: { arg: { email: string; password: string; remember: boolean } }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Invalid credentials")
  return res.json()
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showAccessRestricted, setShowAccessRestricted] = useState(false)
  const { trigger, isMutating, error } = useSWRMutation("/api/auth/login", loginRequest)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await trigger({ email, password, remember })
      router.push("/dashboard")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-panel-lg border border-border shadow-lg">
          <CardHeader className="space-y-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <CardTitle className="text-2xl text-gradient">Admin Dashboard</CardTitle>
              <CardDescription className="text-muted-foreground">Newsletter Management System</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid gap-4">
              {showAccessRestricted && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      Access Restricted — Admin Login Only
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border/50 placeholder-glow"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/50 placeholder-glow"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-border bg-input/50"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="/forgot-password" className="text-sm text-primary hover:text-accent transition-colors">
                  Forgot Password?
                </a>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
                  Invalid email or password
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={isMutating}
                className="w-full text-white font-semibold hover-glow"
                style={{ background: "linear-gradient(var(--accent-gradient))" }}
              >
                {isMutating ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
