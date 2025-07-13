import { NextRequest, NextResponse } from "next/server"

interface GenerateUIRequest {
  prompt: string
  model: string
  framework?: string
  styling?: string
}

interface ComponentMetadata {
  name: string
  description: string
  framework: string
  styling: string
  complexity: "simple" | "medium" | "complex"
  tags: string[]
}

interface GenerateUIResponse {
  jsx: string
  metadata: ComponentMetadata
}

// Helper function to call different AI models
async function callAIModel(model: string, prompt: string, options: any = {}): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  
  try {
    let endpoint = ""
    let requestBody = {}
    
    switch (model) {
      case "claude":
        endpoint = "/api/claude"
        requestBody = {
          messages: [
            {
              role: "system",
              content: `You are an expert React/Next.js UI developer. Generate clean, modern UI components using Tailwind CSS. 
              Return ONLY the JSX component code without any explanations or markdown formatting.
              Focus on accessibility, responsive design, and modern UI patterns.`
            },
            {
              role: "user",
              content: `Create a React component for: ${prompt}`
            }
          ]
        }
        break
        
      case "devin":
        endpoint = "/api/devin"
        requestBody = {
          prompt: `Generate a React component with Tailwind CSS for: ${prompt}`,
          type: "ui-generation"
        }
        break
        
      case "v0":
        endpoint = "/api/v0"
        requestBody = {
          prompt: `Create a modern React component using shadcn/ui and Tailwind CSS: ${prompt}`,
          framework: "react",
          styling: "tailwind"
        }
        break
        
      case "cursor":
        endpoint = "/api/cursor"
        requestBody = {
          messages: [
            {
              role: "system",
              content: "You are a React UI expert. Generate clean, accessible components."
            },
            {
              role: "user",
              content: `Generate a React component: ${prompt}`
            }
          ]
        }
        break
        
      case "gpt4free":
        endpoint = "/api/gpt4free"
        requestBody = {
          prompt: `Generate a React component with Tailwind CSS: ${prompt}`,
          model: "gpt-4"
        }
        break
        
      default:
        endpoint = "/api/claude"
        requestBody = {
          messages: [
            {
              role: "system",
              content: "Generate a React component with Tailwind CSS."
            },
            {
              role: "user",
              content: `Create: ${prompt}`
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
    console.error(`Error calling ${model} model:`, error)
    throw new Error(`Failed to generate UI with ${model}: ${error}`)
  }
}

// Helper function to extract component metadata
function extractMetadata(prompt: string, jsx: string, model: string): ComponentMetadata {
  // Extract component name from JSX
  const componentNameMatch = jsx.match(/function\s+(\w+)|const\s+(\w+)\s*=|export\s+default\s+function\s+(\w+)/)
  const componentName = componentNameMatch ? 
    (componentNameMatch[1] || componentNameMatch[2] || componentNameMatch[3]) : 
    "GeneratedComponent"
  
  // Determine complexity based on JSX structure
  const hasState = jsx.includes("useState") || jsx.includes("useEffect")
  const hasProps = jsx.includes("props") || jsx.includes("interface") || jsx.includes("type")
  const hasConditionals = jsx.includes("?") || jsx.includes("&&") || jsx.includes("||")
  const hasLoops = jsx.includes("map(") || jsx.includes("forEach")
  
  let complexity: "simple" | "medium" | "complex" = "simple"
  if (hasLoops || (hasState && hasProps && hasConditionals)) {
    complexity = "complex"
  } else if (hasState || hasProps || hasConditionals) {
    complexity = "medium"
  }
  
  // Extract tags from prompt
  const tags = prompt.toLowerCase().match(/\b(form|button|input|card|modal|nav|header|footer|sidebar|table|list|grid|flex|responsive|dark|light|animated|interactive)\b/g) || []
  
  return {
    name: componentName,
    description: prompt,
    framework: "React",
    styling: "Tailwind CSS",
    complexity,
    tags: [...new Set(tags)]
  }
}

// Helper function to clean and format JSX
function cleanJSX(jsx: string): string {
  // Remove markdown code blocks
  let cleaned = jsx.replace(/```jsx?\n?/g, "").replace(/```\n?/g, "")
  
  // Remove leading/trailing whitespace
  cleaned = cleaned.trim()
  
  // Ensure it starts with a proper React component
  if (!cleaned.startsWith("import") && !cleaned.startsWith("function") && !cleaned.startsWith("const") && !cleaned.startsWith("export")) {
    // Wrap in a function component if it's just JSX
    if (cleaned.startsWith("<")) {
      cleaned = `export default function GeneratedComponent() {
  return (
    ${cleaned}
  )
}`
    }
  }
  
  return cleaned
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateUIRequest = await request.json()
    const { prompt, model, framework = "react", styling = "tailwind" } = body
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }
    
    if (!model) {
      return NextResponse.json(
        { error: "Model is required" },
        { status: 400 }
      )
    }
    
    // Generate UI using selected AI model
    const rawJSX = await callAIModel(model, prompt, { framework, styling })
    
    // Clean and format the JSX
    const jsx = cleanJSX(rawJSX)
    
    // Extract metadata
    const metadata = extractMetadata(prompt, jsx, model)
    
    const response: GenerateUIResponse = {
      jsx,
      metadata
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Error generating UI:", error)
    return NextResponse.json(
      { error: "Failed to generate UI component" },
      { status: 500 }
    )
  }
} 