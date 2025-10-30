import { NextResponse } from "next/server"

type SubStore = {
  subscribed: boolean
  topics: string[]
  totalReceived: number
}

const store: SubStore = {
  subscribed: true,
  topics: ["AI", "ML", "NLP"],
  totalReceived: 12,
}

export async function GET() {
  return NextResponse.json(store)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (typeof body?.subscribed === "boolean") {
    store.subscribed = body.subscribed
  }
  return NextResponse.json(store)
}
