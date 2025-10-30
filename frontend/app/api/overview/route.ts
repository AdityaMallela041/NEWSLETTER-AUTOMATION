import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ articles: 18, summaries: 12, templates: 3, newsletters: 5 })
}
