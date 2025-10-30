"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

async function registerRequest(
  url: string,
  { arg }: { arg: { name: string; email: string; password: string; department: string } },
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Registration failed")
  return res.json()
}

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("CSE (AI & ML)")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const { trigger, isMutating, error } = useSWRMutation("/api/auth/register", registerRequest)

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])
  const passwordScore = useMemo(() => {
    let score = 0
    if (password.length >= 8) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9]/.test(password)) score += 25
    if (/[^A-Za-z0-9]/.test(password)) score += 25
    return score
  }, [password])
  const pwdMatch = password.length > 0 && password === confirm

  const formValid = name && emailValid && passwordScore >= 50 && pwdMatch

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formValid) return
    await trigger({ name, email, password, department })
    setShowSuccess(true)
    // Show success then redirect to login
    setTimeout(() => router.push("/login"), 1200)
  }

  useEffect(() => {
    if (error) setShowSuccess(false)
  }, [error])

  return (
    <main className="min-h-dvh flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border border-border/60 bg-card/60 backdrop-blur text-card-foreground">
        <CardHeader>
          <CardTitle className="text-balance">Create account</CardTitle>
          <CardDescription>Join the newsletter automation platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!emailValid && email.length > 0}
                required
              />
              {!emailValid && email.length > 0 ? (
                <p className="text-xs text-destructive">Enter a valid email address</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select name="department" value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE (AI & ML)">CSE (AI & ML)</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-describedby="password-help"
              />
              <Progress value={passwordScore} className="h-2" />
              <p id="password-help" className="text-xs text-muted-foreground">
                Use at least 8 characters with uppercase, numbers, and a symbol.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                aria-invalid={!pwdMatch && confirm.length > 0}
              />
              {!pwdMatch && confirm.length > 0 ? (
                <p className="text-xs text-destructive">Passwords do not match</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-destructive">Registration failed. Try again.</p> : null}
            {showSuccess ? (
              <p className="text-sm text-accent">
                Registration Successful! Check your inbox for verification.
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isMutating || !formValid}
              className="w-full text-white"
              style={{ background: "linear-gradient(var(--accent-gradient))" }}
            >
              {isMutating ? "Creating..." : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a className="text-primary underline" href="/login">
                Sign in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
