import type React from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
