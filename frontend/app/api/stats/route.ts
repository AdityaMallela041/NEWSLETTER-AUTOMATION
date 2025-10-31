import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeader(req: NextRequest): Record<string, string> {
  const authCookie = req.cookies.get("auth_token")?.value
  return authCookie ? { Authorization: `Bearer ${authCookie}` } : {}
}

export async function GET(req: NextRequest) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    // Call backend for overview stats
    const response = await fetch(`${BACKEND_URL}/analytics/overview`, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      // Fallback to dummy data if backend fails
      return NextResponse.json({
        total: 132,
        summaries: 548,
        topics: 27,
        updatedAt: new Date().toISOString(),
      })
    }

    const data = await response.json()

    // Map backend data to frontend format
    return NextResponse.json({
      total: data?.total_newsletters || 132,
      summaries: data?.total_subscribers || 548,
      topics: data?.total_sent || 27,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GET /api/stats error:", error)
    
    // Fallback to dummy data on error
    return NextResponse.json({
      total: 132,
      summaries: 548,
      topics: 27,
      updatedAt: new Date().toISOString(),
    })
  }
}
