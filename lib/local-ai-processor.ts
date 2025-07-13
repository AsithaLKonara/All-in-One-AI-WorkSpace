import fs from "fs"
import path from "path"

interface ModelConfig {
  name: string
  promptFile: string
  toolsFile?: string
  creditCost: number
  description: string
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  v0: {
    name: "v0",
    promptFile: "v0 Prompts and Tools/Prompt.txt",
    creditCost: 2,
    description: "Vercel v0 AI assistant for web development",
  },
  cursor: {
    name: "Cursor",
    promptFile: "Cursor Prompts/Agent Prompt.txt",
    toolsFile: "Cursor Prompts/Agent Tools v1.0.json",
    creditCost: 3,
    description: "Cursor AI coding assistant",
  },
  bolt: {
    name: "Bolt",
    promptFile: "Open Source prompts/Bolt/Prompt.txt",
    creditCost: 2,
    description: "Bolt AI development assistant",
  },
  lovable: {
    name: "Lovable",
    promptFile: "Lovable/Prompt.txt",
    creditCost: 4,
    description: "Lovable AI for app development",
  },
  devin: {
    name: "Devin",
    promptFile: "Devin AI/Prompt.txt",
    creditCost: 5,
    description: "Devin AI software engineer",
  },
  cluely: {
    name: "Cluely",
    promptFile: "Cluely/Default Prompt.txt",
    creditCost: 3,
    description: "Cluely AI assistant",
  },
  windsurf: {
    name: "Windsurf",
    promptFile: "Windsurf/Prompt.txt",
    toolsFile: "Windsurf/Tools.json",
    creditCost: 3,
    description: "Windsurf AI development environment",
  },
  replit: {
    name: "Replit",
    promptFile: "Replit/Prompt.txt",
    toolsFile: "Replit/Tools.json",
    creditCost: 2,
    description: "Replit AI coding assistant",
  },
}

export class LocalAIProcessor {
  private prompts: Map<string, string> = new Map()
  private tools: Map<string, any> = new Map()

  constructor() {
    this.loadPrompts()
  }

  private loadPrompts() {
    try {
      for (const [modelId, config] of Object.entries(MODEL_CONFIGS)) {
        try {
          const promptPath = path.join(process.cwd(), config.promptFile)
          if (fs.existsSync(promptPath)) {
            const promptContent = fs.readFileSync(promptPath, "utf-8")
            this.prompts.set(modelId, promptContent)
          } else {
            this.prompts.set(modelId, `You are ${config.name}, an AI assistant. Help users with their requests.`)
          }

          if (config.toolsFile) {
            const toolsPath = path.join(process.cwd(), config.toolsFile)
            if (fs.existsSync(toolsPath)) {
              const toolsContent = JSON.parse(fs.readFileSync(toolsPath, "utf-8"))
              this.tools.set(modelId, toolsContent)
            }
          }
        } catch (error) {
          console.error(`Error loading ${modelId} files:`, error)
          this.prompts.set(modelId, `You are ${config.name}, an AI assistant. Help users with their requests.`)
        }
      }
    } catch (error) {
      console.error("Error loading prompts:", error)
    }
  }

  async processRequest(modelId: string, userMessage: string, context?: any): Promise<string> {
    const config = MODEL_CONFIGS[modelId]
    if (!config) {
      throw new Error(`Model ${modelId} not found`)
    }

    const systemPrompt = this.prompts.get(modelId) || `You are ${config.name}, an AI assistant.`
    const tools = this.tools.get(modelId)

    const response = await this.generateResponse(systemPrompt, userMessage, tools, context)
    return response
  }

  private async generateResponse(
    systemPrompt: string,
    userMessage: string,
    tools?: any,
    context?: any,
  ): Promise<string> {
    const contextInfo = context ? `\n\nContext: ${JSON.stringify(context, null, 2)}` : ""
    const toolsInfo = tools ? `\n\nAvailable Tools: ${JSON.stringify(tools, null, 2)}` : ""

    const fullPrompt = `${systemPrompt}${contextInfo}${toolsInfo}\n\nUser: ${userMessage}\n\nAssistant:`

    try {
      const response = await this.simulateAIResponse(fullPrompt, userMessage)
      return response
    } catch (error) {
      console.error("Error generating response:", error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again later."
    }
  }

  private async simulateAIResponse(prompt: string, userMessage: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = [
      `I understand you're asking about: "${userMessage}". Based on my training, I can help you with this request. Let me provide a detailed response tailored to your needs.`,
      `Thank you for your question about "${userMessage}". I'll analyze this and provide you with a comprehensive solution that addresses your specific requirements.`,
      `I see you need assistance with "${userMessage}". Let me break this down and provide you with step-by-step guidance to help you achieve your goals.`,
      `Your request about "${userMessage}" is interesting. I'll provide you with detailed information and practical suggestions to help you move forward.`,
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    if (userMessage.toLowerCase().includes("code") || userMessage.toLowerCase().includes("develop")) {
      return `${randomResponse}\n\nHere's a code example that might help:\n\n\`\`\`javascript\n// Example implementation\nfunction handleRequest() {\n  console.log('Processing your request...');\n  return 'Success';\n}\n\`\`\`\n\nThis should give you a good starting point for your project.`
    }

    return randomResponse
  }

  getAvailableModels() {
    return Object.entries(MODEL_CONFIGS).map(([id, config]) => ({
      id,
      name: config.name,
      description: config.description,
      creditCost: config.creditCost,
      available: this.prompts.has(id),
    }))
  }

  getModelCost(modelId: string): number {
    return MODEL_CONFIGS[modelId]?.creditCost || 1
  }
}

export const localAI = new LocalAIProcessor()
