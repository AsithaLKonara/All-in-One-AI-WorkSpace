interface ModelRequest {
  model: string
  prompt?: string
  messages?: Array<{ role: string; content: string }>
  [key: string]: any
}

interface ModelResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  metadata?: {
    finish_reason: string
    model_name: string
  }
}

interface FetchModelOptions {
  timeout?: number
  retries?: number
  retryDelay?: number
}

const DEFAULT_OPTIONS: FetchModelOptions = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
}

export async function fetchModel(
  request: ModelRequest,
  options: FetchModelOptions = {}
): Promise<ModelResponse> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const { model, ...requestData } = request
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const endpoint = `/api/${model}`
  
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= config.retries!; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      
      // Normalize response format
      const normalizedResponse: ModelResponse = {
        content: data.content || data.response || data.message || data.text || JSON.stringify(data),
        model,
        usage: data.usage,
        metadata: data.metadata || {
          finish_reason: data.finish_reason || "stop",
          model_name: model,
        },
      }
      
      return normalizedResponse
      
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes("HTTP 4")) {
        throw error
      }
      
      // Log retry attempts
      if (attempt < config.retries!) {
        console.warn(`Attempt ${attempt} failed for ${model}:`, error)
        await new Promise(resolve => setTimeout(resolve, config.retryDelay! * attempt))
      }
    }
  }
  
  throw new Error(`Failed to fetch from ${model} after ${config.retries} attempts: ${lastError?.message}`)
}

// Helper function for UI generation
export async function generateUI(
  prompt: string,
  model: string = "v0",
  options?: {
    framework?: string
    styling?: string
    [key: string]: any
  }
): Promise<ModelResponse> {
  return fetchModel({
    model,
    prompt,
    ...options,
  })
}

// Helper function for AI actions
export async function performAIAction(
  action: string,
  code: string,
  model: string,
  context?: string
): Promise<ModelResponse> {
  return fetchModel({
    model,
    action,
    code,
    context,
  })
}

// Helper function for chat/messaging
export async function sendMessage(
  messages: Array<{ role: string; content: string }>,
  model: string = "claude"
): Promise<ModelResponse> {
  return fetchModel({
    model,
    messages,
  })
}

// Helper function to get available models
export function getAvailableModels(): Array<{
  id: string
  name: string
  description: string
  capabilities: string[]
}> {
  return [
    {
      id: "claude",
      name: "Claude",
      description: "Anthropic's helpful AI assistant",
      capabilities: ["UI Generation", "Code Analysis", "Design Patterns"],
    },
    {
      id: "devin",
      name: "Devin AI",
      description: "Autonomous software engineering",
      capabilities: ["Complex Components", "Architecture", "Best Practices"],
    },
    {
      id: "v0",
      name: "v0 by Vercel",
      description: "React/Next.js UI generation specialist",
      capabilities: ["React Components", "shadcn/ui", "Tailwind CSS"],
    },
    {
      id: "cursor",
      name: "Cursor Agent",
      description: "Advanced code editing and refactoring",
      capabilities: ["Code Optimization", "Refactoring", "TypeScript"],
    },
    {
      id: "gpt4free",
      name: "GPT-4 Free",
      description: "Free GPT-4 access via open APIs",
      capabilities: ["General UI", "Creative Design", "Rapid Prototyping"],
    },
  ]
}

// Helper function to validate model response
export function validateModelResponse(response: any): boolean {
  if (!response || typeof response !== "object") {
    return false
  }
  
  if (!response.content || typeof response.content !== "string") {
    return false
  }
  
  if (response.content.trim().length === 0) {
    return false
  }
  
  return true
}

// Helper function to extract code from response
export function extractCodeFromResponse(response: string): string {
  // Remove markdown code blocks
  let code = response.replace(/```jsx?\n?/g, "").replace(/```\n?/g, "")
  
  // Remove leading/trailing whitespace
  code = code.trim()
  
  // If it's just JSX without a function wrapper, wrap it
  if (code.startsWith("<") && !code.includes("function") && !code.includes("const") && !code.includes("export")) {
    code = `export default function GeneratedComponent() {
  return (
    ${code}
  )
}`
  }
  
  return code
} 