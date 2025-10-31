import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeader(req: NextRequest): Record<string, string> {
  const authCookie = req.cookies.get("auth_token")?.value
  return authCookie ? { Authorization: `Bearer ${authCookie}` } : {}
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const skip = searchParams.get("skip") || "0"
    const limit = searchParams.get("limit") || "20"
    const status = searchParams.get("status")

    let url = `${BACKEND_URL}/schedule?skip=${skip}&limit=${limit}`
    if (status) url += `&status=${status}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch schedules" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: Array.isArray(data) ? data : [data],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/schedule error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    const response = await fetch(`${BACKEND_URL}/schedule`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        newsletter_id: body.newsletter_id,
        scheduled_for: body.scheduled_for,
        status: body.status || "pending",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Failed to create schedule" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/schedule error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
