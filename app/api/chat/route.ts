import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { localAI } from "@/lib/local-ai-processor"
import { CreditManager } from "@/lib/credits"

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "v0", context } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const lastMessage = messages[messages.length - 1]
    const userPrompt = lastMessage.content
    const estimatedTokens = userPrompt.length * 1.3

    const creditCheck = await CreditManager.deductCredits(user.id, model, estimatedTokens)

    if (!creditCheck.success) {
      return NextResponse.json(
        {
          error: creditCheck.error,
          remainingCredits: creditCheck.remainingCredits,
          needsCredits: true,
        },
        { status: 402 },
      )
    }

    const response = await localAI.processRequest(model, userPrompt, {
      ...context,
      conversation: messages.slice(0, -1),
      user: { id: user.id, email: user.email },
    })

    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      model,
    }

    try {
      await supabase.from("chat_sessions").upsert({
        user_id: user.id,
        title: userPrompt.slice(0, 50) + (userPrompt.length > 50 ? "..." : ""),
        model,
        messages: [...messages, assistantMessage],
      })
    } catch (error) {
      console.warn("Failed to save chat session:", error)
    }

    return NextResponse.json({
      message: assistantMessage,
      model,
      remainingCredits: creditCheck.remainingCredits,
      usage: {
        prompt_tokens: Math.ceil(userPrompt.length / 4),
        completion_tokens: Math.ceil(response.length / 4),
        total_tokens: Math.ceil((userPrompt.length + response.length) / 4),
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

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

    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      sessions: sessions || [],
      total: sessions?.length || 0,
    })
  } catch (error) {
    console.error("Chat sessions API error:", error)
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 })
  }
}
