import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json([
    { id: "t1", name: "Weekly Digest", description: "Clean, two-column layout with hero section." },
    { id: "t2", name: "Faculty Update", description: "Formal letter style with departmental notes." },
    { id: "t3", name: "Student Highlights", description: "Casual tone, highlight cards for achievements." },
  ])
}
