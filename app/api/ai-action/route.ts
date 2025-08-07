import { NextRequest, NextResponse } from "next/server"

interface AIActionRequest {
  action: "fix" | "explain" | "optimize" | "test" | "enhance" | "document"
  code: string
  model: string
  context?: string
}

interface AIActionResponse {
  result: string
  metadata: {
    action: string
    model: string
    improvements: string[]
    suggestions: string[]
  }
}

// Helper function to call different AI models for specific actions
async function callAIModelForAction(
  model: string, 
  action: string, 
  code: string, 
  context?: string
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  
  try {
    let endpoint = ""
    let requestBody = {}
    
    const actionPrompts = {
      fix: "Fix any bugs, errors, or issues in this React component. Return only the corrected code:",
      explain: "Explain how this React component works, its purpose, and key features. Provide a clear, detailed explanation:",
      optimize: "Optimize this React component for performance, readability, and best practices. Return the improved code:",
      test: "Generate comprehensive unit tests for this React component using Jest and React Testing Library:",
      enhance: "Enhance this React component with better styling, accessibility, and user experience. Return the improved code:",
      document: "Add comprehensive comments and documentation to this React component. Return the documented code:"
    }
    
    const prompt = actionPrompts[action as keyof typeof actionPrompts] || actionPrompts.explain
    
    switch (model) {
      case "claude":
        endpoint = "/api/claude"
        requestBody = {
          messages: [
            {
              role: "system",
              content: `You are an expert React developer. ${prompt}`
            },
            {
              role: "user",
              content: `Here's the component:\n\n${code}\n\n${context ? `Context: ${context}` : ""}`
            }
          ]
        }
        break
        
      case "devin":
        endpoint = "/api/devin"
        requestBody = {
          prompt: `${prompt}\n\nComponent:\n${code}\n\n${context ? `Context: ${context}` : ""}`,
          type: action
        }
        break
        
      case "v0":
        endpoint = "/api/v0"
        requestBody = {
          prompt: `${prompt}\n\n${code}`,
          action: action,
          context: context
        }
        break
        
      case "cursor":
        endpoint = "/api/cursor"
        requestBody = {
          messages: [
            {
              role: "system",
              content: `You are a React expert. ${prompt}`
            },
            {
              role: "user",
              content: `Component:\n${code}\n\n${context ? `Context: ${context}` : ""}`
            }
          ]
        }
        break
        
      case "gpt4free":
        endpoint = "/api/gpt4free"
        requestBody = {
          prompt: `${prompt}\n\n${code}\n\n${context ? `Context: ${context}` : ""}`,
          model: "gpt-4"
        }
        break
        
      default:
        endpoint = "/api/claude"
        requestBody = {
          messages: [
            {
              role: "system",
              content: `You are a React expert. ${prompt}`
            },
            {
              role: "user",
              content: `Component:\n${code}\n\n${context ? `Context: ${context}` : ""}`
            }
          ]
        }
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    
    if (!response.ok) {
      throw new Error(`AI model request failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.content || data.response || data.message || JSON.stringify(data)
    
  } catch (error) {
    console.error(`Error calling ${model} model for ${action}:`, error)
    throw new Error(`Failed to perform ${action} with ${model}: ${error}`)
  }
}

// Helper function to analyze code and extract improvements
function analyzeCode(code: string, action: string): { improvements: string[], suggestions: string[] } {
  const improvements: string[] = []
  const suggestions: string[] = []
  
  // Basic code analysis
  if (action === "fix") {
    if (code.includes("console.log")) {
      improvements.push("Removed console.log statements")
    }
    if (code.includes("var ")) {
      improvements.push("Replaced var with const/let")
    }
    if (code.includes("===") || code.includes("!==")) {
      improvements.push("Used strict equality operators")
    }
  }
  
  if (action === "optimize") {
    if (code.includes("useState") && code.includes("useEffect")) {
      suggestions.push("Consider using useMemo for expensive calculations")
    }
    if (code.includes("onClick") && !code.includes("useCallback")) {
      suggestions.push("Consider wrapping event handlers with useCallback")
    }
    if (code.includes("map(") && !code.includes("key=")) {
      suggestions.push("Ensure all mapped elements have unique keys")
    }
  }
  
  if (action === "enhance") {
    if (!code.includes("aria-")) {
      suggestions.push("Add ARIA attributes for better accessibility")
    }
    if (!code.includes("focus")) {
      suggestions.push("Add focus management for better UX")
    }
    if (!code.includes("transition") && !code.includes("animate")) {
      suggestions.push("Consider adding smooth transitions")
    }
  }
  
  if (action === "test") {
    suggestions.push("Test component rendering")
    suggestions.push("Test user interactions")
    suggestions.push("Test edge cases and error states")
    suggestions.push("Test accessibility features")
  }
  
  return { improvements, suggestions }
}

export async function POST(request: NextRequest) {
  try {
    const body: AIActionRequest = await request.json()
    const { action, code, model, context } = body
    
    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      )
    }
    
    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      )
    }
    
    if (!model) {
      return NextResponse.json(
        { error: "Model is required" },
        { status: 400 }
      )
    }
    
    // Validate action type
    const validActions = ["fix", "explain", "optimize", "test", "enhance", "document"]
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action type" },
        { status: 400 }
      )
    }
    
    // Perform AI action
    const result = await callAIModelForAction(model, action, code, context)
    
    // Analyze code for improvements and suggestions
    const { improvements, suggestions } = analyzeCode(code, action)
    
    const response: AIActionResponse = {
      result,
      metadata: {
        action,
        model,
        improvements,
        suggestions
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Error performing AI action:", error)
    return NextResponse.json(
      { error: "Failed to perform AI action" },
      { status: 500 }
    )
  }
} 