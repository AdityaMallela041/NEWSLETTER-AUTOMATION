"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({})

  function validatePassword(password: string): string | null {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter"
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter"
    if (!/[0-9]/.test(password)) return "Password must contain a number"
    return null
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: typeof errors = {}

    // Validate new password
    const newPasswordError = validatePassword(newPassword)
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setNewPassword("")
      setConfirmPassword("")
      setIsSubmitted(false)
    }, 2000)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md border border-border/60 bg-card/60 backdrop-blur shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Enter your new password to reset your account access</CardDescription>
          </CardHeader>

          <CardContent>
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-8 gap-4"
              >
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>
                  <CheckCircle className="h-12 w-12 text-accent" />
                </motion.div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">Password Changed Successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password" className="text-foreground">
                    New Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (errors.newPassword) {
                        setErrors({ ...errors, newPassword: undefined })
                      }
                    }}
                    required
                    className={`glass-panel ${errors.newPassword ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.newPassword}
                    aria-describedby={errors.newPassword ? "new-password-error" : undefined}
                  />
                  {errors.newPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs text-destructive"
                      id="new-password-error"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.newPassword}
                    </motion.div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with uppercase, lowercase, and numbers
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Re-enter Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined })
                      }
                    }}
                    required
                    className={`glass-panel ${errors.confirmPassword ? "border-destructive" : ""}`}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  />
                  {errors.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs text-destructive"
                      id="confirm-password-error"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </motion.div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-white mt-2"
                  style={{ background: "linear-gradient(var(--accent-gradient))" }}
                >
                  Change Password
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
