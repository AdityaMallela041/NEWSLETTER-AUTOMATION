"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

interface AddNewsletterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewsletterAdded?: () => void
}

export function AddNewsletterModal({ open, onOpenChange, onNewsletterAdded }: AddNewsletterModalProps) {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    place: "",
    date: "",
    time: "",
    tags: "",
    image: null as File | null,
  })
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.eventName.trim()) newErrors.eventName = "Event name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.place.trim()) newErrors.place = "Place is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time) newErrors.time = "Time is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }))
    if (errors.description) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.description
        return newErrors
      })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleImageFile(files[0])
    }
  }

  const handleImageFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // Prepare form data for submission
      const submitData = {
        eventName: formData.eventName,
        description: formData.description,
        place: formData.place,
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
        image: imagePreview || "/placeholder.svg", // Use preview as image URL for mock API
        contactEmail: "admin@newsletter.com", // Default email
      }

      // Make API call
      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error("Failed to create newsletter")
      }

      const newNewsletter = await response.json()
      console.log("[v0] Newsletter created:", newNewsletter)

      // Show success message
      setMessage({ type: "success", text: "Newsletter added successfully!" })

      // Reset form
      setTimeout(() => {
        setFormData({
          eventName: "",
          description: "",
          place: "",
          date: "",
          time: "",
          tags: "",
          image: null,
        })
        setImagePreview(null)
        setErrors({})
        setMessage(null)
        onOpenChange(false)

        // Trigger refresh of newsletters list
        if (onNewsletterAdded) {
          onNewsletterAdded()
        }
      }, 1500)
    } catch (error) {
      console.error("[v0] Error creating newsletter:", error)
      setMessage({ type: "error", text: "Failed to create newsletter. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gradient">Add Newsletter</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Message Alert */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-accent/10 border border-accent/30 text-accent"
                      : "bg-destructive/10 border border-destructive/30 text-destructive"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              {/* Form */}
              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
Event Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Enter event name"
className={`glass-panel ${errors.eventName ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
{errors.eventName && <p className="text-xs text-destructive mt-1">{errors.eventName}</p>}
                </div>

                {/* Description with Rich Text Editor - LARGER */}
                <div>
                  <label className="block text-sm font-medium mb-2">
Description <span className="text-destructive">*</span>
                  </label>
                  <div
className={`glass-panel rounded-lg overflow-hidden border ${errors.description ? "border-destructive" : "border-border/30"}`}
                  >
                    <ReactQuill
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline"],
                          [{ size: ["small", false, "large", "huge"] }],
                          [{ color: [] }],
                          ["clean"],
                        ],
                      }}
                      theme="snow"
                      placeholder="Enter description (at least 6-8 lines)..."
className="bg-card min-h-48"
                      readOnly={loading}
                    />
                  </div>
{errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Image Upload</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      dragActive ? "border-primary bg-muted" : "border-border/30 hover:border-primary/50"
                    }`}
                  >
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-muted-foreground">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium">Drag and drop your image here</p>
                        <p className="text-xs text-muted-foreground">or click to select</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageFile(e.target.files[0])}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Place */}
                <div>
                  <label className="block text-sm font-medium mb-2">
Place <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="place"
                    value={formData.place}
                    onChange={handleInputChange}
                    placeholder="Enter place"
className={`glass-panel ${errors.place ? "border-destructive" : ""}`}
                    disabled={loading}
                  />
{errors.place && <p className="text-xs text-destructive mt-1">{errors.place}</p>}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
Date <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
className={`glass-panel ${errors.date ? "border-destructive" : ""}`}
                      disabled={loading}
                    />
{errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
Time <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
className={`glass-panel ${errors.time ? "border-destructive" : ""}`}
                      disabled={loading}
                    />
{errors.time && <p className="text-xs text-destructive mt-1">{errors.time}</p>}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (optional)</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                    className="glass-panel"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border/30">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-ring text-white hover:from-ring hover:to-primary disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
