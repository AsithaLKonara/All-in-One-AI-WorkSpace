import { type NextRequest, NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "llama2", temperature = 0.7 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const context = {
      model,
      temperature,
      local: true,
    }

    const response = await localAI.processRequest("cluely", prompt, context)

    return NextResponse.json({
      response,
      model: "llama-local",
      done: true,
      context: [],
      total_duration: 2000000000,
      load_duration: 1000000,
      prompt_eval_count: prompt.length,
      eval_count: response.length,
    })
  } catch (error) {
    console.error("LLaMA processing error:", error)
    return NextResponse.json({ error: "Local LLaMA processing failed" }, { status: 500 })
  }
}
