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
    const limit = searchParams.get("limit") || "50"

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    const response = await fetch(
      `${BACKEND_URL}/templates/?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: headers,
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch templates" },
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
    console.error("GET /api/templates error:", error)
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

    const response = await fetch(`${BACKEND_URL}/templates/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name: body.name,
        description: body.description,
        html_content: body.html_content || body.content,
        thumbnail_url: body.thumbnail_url,
        is_default: body.is_default || false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Failed to create template" },
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
    console.error("POST /api/templates error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
