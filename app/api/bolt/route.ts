import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, projectType = "react", template = "vite" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      projectType,
      template,
      task: "full_stack_development",
    }

    const response = await localAI.processRequest("bolt", prompt, context)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: response,
          },
        },
      ],
      model: "bolt-local",
      project: {
        type: projectType,
        template,
        files: [],
      },
    })
  } catch (error) {
    console.error("Bolt processing error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
