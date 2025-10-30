"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Upload, X, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  eventName: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  place: z.string().min(2, "Place is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  contactEmail: z.string().email("Invalid email address"),
  tags: z.string().min(1, "At least one tag is required"),
  image: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Image is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          files?.[0]?.type
        ),
      "Only JPG, PNG, and WEBP formats are allowed"
    ),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function AddNewsletterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const imageFiles = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setValue("image", undefined as any);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      const imageFile = data.image[0];
      const imageBase64 = await fileToBase64(imageFile);

      const payload = {
        eventName: data.eventName,
        description: data.description,
        place: data.place,
        date: new Date(data.date).toISOString(),
        time: data.time,
        contactEmail: data.contactEmail,
        tags: data.tags.split(",").map((tag) => tag.trim()),
        image: imageBase64,
      };

      const response = await fetch("/api/newsletters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to create newsletter");
      }

      toast({
        title: "Success!",
        description: "Newsletter created successfully",
        variant: "default",
      });

      reset();
      setImagePreview("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating newsletter:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create newsletter",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 bg-card border border-border rounded-lg hover:bg-muted hover:border-muted-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
<h1 className="text-3xl font-bold text-foreground">Add New Newsletter</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
className="bg-card rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Newsletter Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("eventName")}
              type="text"
              placeholder="Enter newsletter title"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.eventName ? "border-destructive" : "border-border"
              }`}
            />
            {errors.eventName && (
<p className="mt-1 text-sm text-destructive">{errors.eventName.message}</p>
            )}
<p className="mt-1 text-xs text-muted-foreground">
              {watch("eventName")?.length || 0}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={6}
              placeholder="Enter newsletter description"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring resize-vertical ${
                errors.description ? "border-destructive" : "border-border"
              }`}
            />
            {errors.description && (
<p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
            )}
<p className="mt-1 text-xs text-muted-foreground">
              {watch("description")?.length || 0}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Place <span className="text-red-500">*</span>
            </label>
            <input
              {...register("place")}
              type="text"
              placeholder="Enter location"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.place ? "border-destructive" : "border-border"
              }`}
            />
            {errors.place && (
<p className="mt-1 text-sm text-destructive">{errors.place.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Publication Date <span className="text-red-500">*</span>
              </label>
              <input
                {...register("date")}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.date ? "border-destructive" : "border-border"
                }`}
              />
              {errors.date && (
<p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Publication Time <span className="text-red-500">*</span>
              </label>
              <input
                {...register("time")}
                type="time"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.time ? "border-destructive" : "border-border"
                }`}
              />
              {errors.time && (
<p className="mt-1 text-sm text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("contactEmail")}
              type="email"
              placeholder="contact@example.com"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.contactEmail ? "border-destructive" : "border-border"
              }`}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-destructive">{errors.contactEmail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tags <span className="text-red-500">*</span>
            </label>
            <input
              {...register("tags")}
              type="text"
              placeholder="Technology, Conference, AI (comma-separated)"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.tags ? "border-destructive" : "border-border"
              }`}
            />
            {errors.tags && (
<p className="mt-1 text-sm text-destructive">{errors.tags.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Newsletter Image <span className="text-red-500">*</span>
            </label>

            {!imagePreview ? (
              <div className="relative">
                <input
                  {...register("image")}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:bg-muted ${
                    errors.image ? "border-destructive bg-destructive/5" : "border-border bg-muted/50"
                  }`}
                >
                  <Upload className="w-12 h-12 text-primary mb-4" />
                  <p className="text-base text-foreground mb-1">
                    <span className="font-semibold text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
<p className="text-sm text-muted-foreground">
                    PNG, JPG or WEBP (max. 5MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative border-2 border-border rounded-lg p-4 bg-muted/50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-80 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-card rounded-full shadow-lg hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
<div className="mt-4 pt-4 border-t border-border">
<p className="text-sm font-medium text-foreground">
                    {imageFiles?.[0]?.name}
                  </p>
<p className="text-xs text-muted-foreground">
                    {imageFiles?.[0]?.size
                      ? `${(imageFiles[0].size / 1024).toFixed(2)} KB`
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {errors.image && (
<p className="mt-1 text-sm text-destructive">{errors.image.message as string}</p>
            )}
          </div>

<div className="flex flex-col-reverse md:flex-row gap-4 justify-end pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-muted hover:border-muted-foreground transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-ring shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Newsletter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
