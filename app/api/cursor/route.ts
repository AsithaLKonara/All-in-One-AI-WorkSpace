import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, files = [], context = "" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const fullContext = {
      files,
      context,
      task: "code_assistance",
    }

    const response = await localAI.processRequest("cursor", prompt, fullContext)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
        },
      ],
      model: "cursor-local",
      usage: {
        prompt_tokens: prompt.length,
        completion_tokens: response.length,
        total_tokens: prompt.length + response.length,
      },
    })
  } catch (error) {
    console.error("Cursor processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function GET() {
  const modelInfo = localAI.getModelInfo("cursor")
  return NextResponse.json({
    model: "cursor-local",
    capabilities: modelInfo?.capabilities || [],
    category: modelInfo?.category || "Development",
    tools: modelInfo?.tools || [],
  })
}
