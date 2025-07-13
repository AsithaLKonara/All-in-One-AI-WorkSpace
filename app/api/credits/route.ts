import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { CreditManager } from "@/lib/credits"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const credits = await CreditManager.getUserCredits(user.id)
    const { data: history } = await CreditManager.getCreditHistory(user.id)
    const { data: purchases } = await CreditManager.getPurchaseHistory(user.id)

    return NextResponse.json({
      credits,
      history,
      purchases,
    })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 })
  }
}
