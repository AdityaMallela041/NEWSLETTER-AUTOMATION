import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeader(req: NextRequest): Record<string, string> {
  const authCookie = req.cookies.get("auth_token")?.value
  return authCookie ? { Authorization: `Bearer ${authCookie}` } : {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body // "subscribe" or "unsubscribe"

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    // Determine endpoint based on action
    const endpoint = action === "unsubscribe" ? "unsubscribe" : "subscribe"

    const response = await fetch(`${BACKEND_URL}/subscription/${endpoint}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email: body.email,
        full_name: body.full_name,
        token: body.token, // for unsubscribe
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || `Failed to ${action}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: `${action === "subscribe" ? "Subscribed" : "Unsubscribed"} successfully`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("POST /api/subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
