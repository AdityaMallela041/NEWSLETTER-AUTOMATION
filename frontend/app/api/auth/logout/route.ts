import { NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Clear auth cookies
    const resp = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    )

    resp.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Delete cookie
    })

    resp.cookies.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Delete cookie
    })

    return resp
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
