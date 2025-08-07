import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        theme: true,
        onboardingCompleted: true,
        createdAt: true,
        lastActive: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("GET /api/user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, theme, onboardingCompleted } = body

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(theme && { theme }),
        ...(onboardingCompleted !== undefined && { onboardingCompleted }),
        lastActive: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        theme: true,
        onboardingCompleted: true,
        createdAt: true,
        lastActive: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("PATCH /api/user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 