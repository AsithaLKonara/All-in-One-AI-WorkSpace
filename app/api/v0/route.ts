import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const response = await localAI.processRequest("v0", prompt, context)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
        },
      ],
      model: "v0-local",
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: response.length,
        total_tokens: prompt.length + response.length,
      },
    })
  } catch (error) {
    console.error("V0 processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function GET() {
  const modelInfo = localAI.getModelInfo("v0")
  return NextResponse.json({
    model: "v0-local",
    capabilities: modelInfo?.capabilities || [],
    category: modelInfo?.category || "Development",
  })
}
