import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { date: "Jan", count: 12 },
    { date: "Feb", count: 19 },
    { date: "Mar", count: 15 },
    { date: "Apr", count: 25 },
    { date: "May", count: 22 },
    { date: "Jun", count: 28 },
  ])
}
