import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, task = "code", complexity = "medium" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      task,
      complexity,
      autonomous: true,
    }

    const response = await localAI.processRequest("devin", prompt, context)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
        },
      ],
      model: "devin-local",
      task: {
        type: task,
        complexity,
        status: "completed",
      },
    })
  } catch (error) {
    console.error("Devin processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
