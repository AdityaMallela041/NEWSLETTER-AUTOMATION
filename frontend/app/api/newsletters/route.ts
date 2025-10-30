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

    let url = `${BACKEND_URL}/newsletters/?skip=${skip}&limit=${limit}`
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
        { error: "Failed to fetch newsletters" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: Array.isArray(data) ? data : [data],
        message: "Retrieved newsletter(s)",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/newsletters error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const backendData = {
      title: body.eventName || body.title,
      subject: body.eventName || body.title || "Untitled",
      content_html: body.description || "",
      content_text: body.description || "",
      template_id: body.template_id || null,
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    const response = await fetch(`${BACKEND_URL}/newsletters/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(backendData),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { success: false, error: error.detail || "Failed to create newsletter" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: "Newsletter created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/newsletters error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
