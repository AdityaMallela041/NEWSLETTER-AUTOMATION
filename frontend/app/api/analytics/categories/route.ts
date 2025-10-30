import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Science", value: 20 },
    { name: "Other", value: 20 },
  ])
}
