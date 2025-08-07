import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
      }

      if (data.user) {
        const { error: upsertError } = await supabase
          .from("users")
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
            avatar_url: data.user.user_metadata?.avatar_url || null,
          })
          .select()

        if (upsertError) {
          console.error("User upsert error:", upsertError)
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/`)
    } catch (error) {
      console.error("Unexpected auth error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
}
