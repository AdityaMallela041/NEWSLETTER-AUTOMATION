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

    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/auth/me error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
