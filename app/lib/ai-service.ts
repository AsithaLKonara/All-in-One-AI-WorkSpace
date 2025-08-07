import OpenAI from "openai"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

// AI Model Configuration
export interface AIModel {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPer1kTokens: number
  capabilities: string[]
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost?: number
}

// AI Models Configuration
export const AI_MODELS: Record<string, AIModel> = {
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    maxTokens: 8192,
    costPer1kTokens: 0.03,
    capabilities: ["text-generation", "code-generation", "analysis", "creative-writing"]
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    maxTokens: 128000,
    costPer1kTokens: 0.01,
    capabilities: ["text-generation", "code-generation", "analysis", "creative-writing"]
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    maxTokens: 4096,
    costPer1kTokens: 0.002,
    capabilities: ["text-generation", "code-generation", "analysis"]
  },
  "claude-3-sonnet": {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "anthropic",
    maxTokens: 200000,
    costPer1kTokens: 0.015,
    capabilities: ["text-generation", "code-generation", "analysis", "complex-reasoning"]
  },
  "claude-3-haiku": {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    maxTokens: 200000,
    costPer1kTokens: 0.00025,
    capabilities: ["text-generation", "code-generation", "analysis"]
  },
  "gemini-pro": {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "google",
    maxTokens: 32768,
    costPer1kTokens: 0.0005,
    capabilities: ["text-generation", "code-generation", "multimodal", "analysis"]
  },
  "gemini-flash": {
    id: "gemini-flash",
    name: "Gemini Flash",
    provider: "google",
    maxTokens: 32768,
    costPer1kTokens: 0.000075,
    capabilities: ["text-generation", "code-generation", "fast-response"]
  }
}

// AI Service Class
export class AIService {
  private openai: OpenAI
  private anthropic: Anthropic
  private googleAI: GoogleGenerativeAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  }

  async chat(
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<ChatResponse> {
    const model = AI_MODELS[modelId]
    if (!model) {
      throw new Error(`Model ${modelId} not found`)
    }

    try {
      switch (model.provider) {
        case "openai":
          return await this.chatWithOpenAI(modelId, messages, options)
        case "anthropic":
          return await this.chatWithAnthropic(modelId, messages, options)
        case "google":
          return await this.chatWithGoogle(modelId, messages, options)
        default:
          throw new Error(`Provider ${model.provider} not supported`)
      }
    } catch (error) {
      console.error(`Error in AI chat with model ${modelId}:`, error)
      throw error
    }
  }

  private async chatWithOpenAI(
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<ChatResponse> {
    const openaiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    if (options?.systemPrompt) {
      openaiMessages.unshift({
        role: "system",
        content: options.systemPrompt
      })
    }

    const response = await this.openai.chat.completions.create({
      model: modelId,
      messages: openaiMessages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || AI_MODELS[modelId].maxTokens,
    })

    const content = response.choices[0]?.message?.content || ""
    const usage = response.usage

    return {
      content,
      model: modelId,
      usage: usage ? {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      } : undefined,
      cost: usage ? this.calculateCost(modelId, usage.total_tokens) : undefined,
    }
  }

  private async chatWithAnthropic(
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<ChatResponse> {
    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    }))

    const response = await this.anthropic.messages.create({
      model: modelId,
      max_tokens: options?.maxTokens || AI_MODELS[modelId].maxTokens,
      temperature: options?.temperature || 0.7,
      system: options?.systemPrompt,
      messages: anthropicMessages,
    })

    const content = response.content[0]?.text || ""
    const usage = response.usage

    return {
      content,
      model: modelId,
      usage: usage ? {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
      } : undefined,
      cost: usage ? this.calculateCost(modelId, usage.input_tokens + usage.output_tokens) : undefined,
    }
  }

  private async chatWithGoogle(
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<ChatResponse> {
    const model = this.googleAI.getGenerativeModel({ model: modelId })

    // Convert messages to Google format
    const googleMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }))

    const chat = model.startChat({
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxTokens || AI_MODELS[modelId].maxTokens,
      },
    })

    // Send all messages
    let response
    for (const message of googleMessages) {
      response = await chat.sendMessage(message.parts[0].text)
    }

    const content = response?.response?.text() || ""

    return {
      content,
      model: modelId,
      // Google doesn't provide token usage in the same way
      usage: undefined,
      cost: undefined,
    }
  }

  private calculateCost(modelId: string, totalTokens: number): number {
    const model = AI_MODELS[modelId]
    return (totalTokens / 1000) * model.costPer1kTokens
  }

  // Get available models
  getAvailableModels(): AIModel[] {
    return Object.values(AI_MODELS)
  }

  // Get model by ID
  getModel(modelId: string): AIModel | undefined {
    return AI_MODELS[modelId]
  }

  // Check if model is available
  isModelAvailable(modelId: string): boolean {
    return !!AI_MODELS[modelId]
  }

  // Get models by capability
  getModelsByCapability(capability: string): AIModel[] {
    return Object.values(AI_MODELS).filter(model =>
      model.capabilities.includes(capability)
    )
  }

  // Get cost estimate for a conversation
  estimateCost(modelId: string, messages: ChatMessage[]): number {
    const model = AI_MODELS[modelId]
    if (!model) return 0

    // Rough estimation: count characters and estimate tokens
    const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0)
    const estimatedTokens = Math.ceil(totalChars / 4) // Rough estimate: 4 chars per token
    const estimatedCost = (estimatedTokens / 1000) * model.costPer1kTokens

    return estimatedCost
  }
}

// Singleton instance
export const aiService = new AIService() 