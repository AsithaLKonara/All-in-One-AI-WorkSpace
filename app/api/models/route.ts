import { NextResponse } from "next/server"
import { localAI } from "@/lib/local-ai-processor"

export async function GET() {
  try {
    const models = localAI.getAvailableModels()

    const formattedModels = models.map((model) => ({
      id: model.id,
      name: model.name,
      description: `Local ${model.name} model trained on specialized prompts`,
      capabilities: model.capabilities,
      category: model.category,
      color: getModelColor(model.category),
      tools: localAI.getModelInfo(model.id)?.tools || [],
      provider: "local",
      status: "available",
    }))

    return NextResponse.json({
      models: formattedModels,
      total: formattedModels.length,
    })
  } catch (error) {
    console.error("Models API error:", error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}

function getModelColor(category: string): string {
  const colors = {
    Development: "bg-blue-500",
    Analysis: "bg-green-500",
    Design: "bg-purple-500",
    Writing: "bg-orange-500",
    General: "bg-gray-500",
  }
  return colors[category as keyof typeof colors] || "bg-gray-500"
}
