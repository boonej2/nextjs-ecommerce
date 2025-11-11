import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (session?.user) {
      return NextResponse.json({
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        }
      })
    }
    
    return NextResponse.json({ user: null })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    )
  }
}

