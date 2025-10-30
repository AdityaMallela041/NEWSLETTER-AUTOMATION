import { NextResponse, type NextRequest } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeader(req: NextRequest): Record<string, string> {
  const authCookie = req.cookies.get("auth_token")?.value
  return authCookie ? { Authorization: `Bearer ${authCookie}` } : {}
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""
    const skip = searchParams.get("skip") || "0"
    const limit = searchParams.get("limit") || "20"

    let url = `${BACKEND_URL}/articles/?skip=${skip}&limit=${limit}`
    if (q) url += `&search=${encodeURIComponent(q)}`

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
        { error: "Failed to fetch articles" },
        { status: response.status }
      )
    }

    const data = await response.json()

    const articles = (Array.isArray(data) ? data : [data]).map((article: any) => ({
      id: article.id,
      title: article.title,
      link: article.source_url || "#",
      snippet: article.summary || article.body?.substring(0, 100) || "",
      source: "Backend",
    }))

    return NextResponse.json(articles)
  } catch (error) {
    console.error("GET /api/articles error:", error)
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

    const response = await fetch(`${BACKEND_URL}/articles/`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        title: body.title,
        body: body.description || "",
        summary: body.snippet || "",
        source_url: body.link,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.detail || "Failed to create article" },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("POST /api/articles error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
