import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    totalNewsletters: 24,
    totalSubscribers: 1250,
    publishedThisMonth: 8,
    totalReach: 5420,
  })
}
