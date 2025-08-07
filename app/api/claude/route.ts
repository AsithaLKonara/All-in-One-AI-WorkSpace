import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "claude-3-sonnet", maxTokens = 4000 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      model,
      maxTokens,
      task: "general_assistance",
    }

    const response = await localAI.processRequest("cluely", prompt, context)

    return NextResponse.json({
      content: [
        {
          type: "text",
          text: response,
        },
      ],
      model: "claude-local",
      usage: {
        input_tokens: prompt.length,
        output_tokens: response.length,
      },
    })
  } catch (error) {
    console.error("Claude processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
