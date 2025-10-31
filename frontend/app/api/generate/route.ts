import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeader(req: NextRequest): Record<string, string> {
  const authCookie = req.cookies.get("auth_token")?.value
  return authCookie ? { Authorization: `Bearer ${authCookie}` } : {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(req),
    }

    const response = await fetch(`${BACKEND_URL}/generate/newsletter`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        template_id: body.template_id,
        categories: body.categories || [],
        tags: body.tags || [],
        num_articles: body.num_articles || 5,
        include_summaries: body.include_summaries || false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Failed to generate newsletter" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        data: data,
        message: "Newsletter generated successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("POST /api/generate error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
