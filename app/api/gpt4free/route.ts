import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider = "local", model = "gpt-4" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      provider,
      model,
      free: true,
    }

    const response = await localAI.processRequest("cluely", prompt, context)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
          finish_reason: "stop",
        },
      ],
      model: "gpt-4-local",
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: response.length,
        total_tokens: prompt.length + response.length,
      },
    })
  } catch (error) {
    console.error("GPT4Free processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
