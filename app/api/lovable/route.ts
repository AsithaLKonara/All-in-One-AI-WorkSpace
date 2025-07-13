import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, appType = "web", framework = "react" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      appType,
      framework,
      task: "web_app_generation",
    }

    const response = await localAI.processRequest("lovable", prompt, context)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
        },
      ],
      model: "lovable-local",
      app: {
        type: appType,
        framework,
        components: [],
      },
    })
  } catch (error) {
    console.error("Lovable processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
