import { NextResponse } from "next/server"

let STATE = { enabled: true, frequency: "weekly", time: "09:00" }

export async function GET() {
  return NextResponse.json(STATE)
}

export async function POST(req: Request) {
  const next = await req.json()
  STATE = { ...STATE, ...next }
  return NextResponse.json(STATE)
}
