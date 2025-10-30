import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { name: "Week 1", subscribers: 1200, reach: 2400 },
    { name: "Week 2", subscribers: 1500, reach: 2800 },
    { name: "Week 3", subscribers: 1800, reach: 3200 },
    { name: "Week 4", subscribers: 2100, reach: 3800 },
  ])
}
