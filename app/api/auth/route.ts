import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured")
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { action, email, password, name } = await request.json()

    switch (action) {
      case "signup":
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        })

        if (signUpError) {
          return NextResponse.json({ error: signUpError.message }, { status: 400 })
        }

        return NextResponse.json({ user: signUpData.user })

      case "signin":
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          return NextResponse.json({ error: signInError.message }, { status: 400 })
        }

        return NextResponse.json({ user: signInData.user, session: signInData.session })

      case "signout":
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) {
          return NextResponse.json({ error: signOutError.message }, { status: 400 })
        }

        return NextResponse.json({ message: "Signed out successfully" })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
