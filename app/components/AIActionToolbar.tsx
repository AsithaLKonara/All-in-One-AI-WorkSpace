"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Wrench, 
  Lightbulb, 
  Zap, 
  TestTube, 
  Sparkles, 
  Code, 
  Eye,
  MessageSquare,
  ArrowRight,
  Check,
  AlertCircle
} from "lucide-react"

interface AIAction {
  id: string
  name: string
  description: string
  icon: any
  color: string
  model: string
}

interface AIActionToolbarProps {
  onAction: (action: AIAction, code: string) => void
  currentCode: string
  isLoading: boolean
}

const AI_ACTIONS: AIAction[] = [
  {
    id: "fix",
    name: "Fix Code",
    description: "Identify and fix bugs, errors, and issues",
    icon: Wrench,
    color: "bg-red-500 hover:bg-red-600",
    model: "claude"
  },
  {
    id: "explain",
    name: "Explain Code",
    description: "Get detailed explanation of how the code works",
    icon: Lightbulb,
    color: "bg-blue-500 hover:bg-blue-600",
    model: "v0"
  },
  {
    id: "optimize",
    name: "Optimize",
    description: "Improve performance, readability, and best practices",
    icon: Zap,
    color: "bg-green-500 hover:bg-green-600",
    model: "devin"
  },
  {
    id: "test",
    name: "Generate Tests",
    description: "Create unit tests and integration tests",
    icon: TestTube,
    color: "bg-purple-500 hover:bg-purple-600",
    model: "cursor"
  },
  {
    id: "enhance",
    name: "Enhance UI",
    description: "Improve styling, accessibility, and user experience",
    icon: Sparkles,
    color: "bg-pink-500 hover:bg-pink-600",
    model: "gpt4free"
  },
  {
    id: "document",
    name: "Add Comments",
    description: "Add comprehensive documentation and comments",
    icon: MessageSquare,
    color: "bg-orange-500 hover:bg-orange-600",
    model: "claude"
  }
]

export function AIActionToolbar({ onAction, currentCode, isLoading }: AIActionToolbarProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleActionClick = (action: AIAction) => {
    if (!currentCode.trim()) {
      return
    }
    
    setSelectedAction(action.id)
    onAction(action, currentCode)
  }

  const getModelBadge = (model: string) => {
    const modelColors = {
      claude: "bg-amber-100 text-amber-800",
      v0: "bg-black text-white",
      devin: "bg-purple-100 text-purple-800",
      cursor: "bg-blue-100 text-blue-800",
      gpt4free: "bg-emerald-100 text-emerald-800"
    }
    
    return (
      <Badge className={`text-xs ${modelColors[model as keyof typeof modelColors] || "bg-gray-100 text-gray-800"}`}>
        {model}
      </Badge>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use AI to improve your component with one click
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {AI_ACTIONS.map((action) => {
            const Icon = action.icon
            const isSelected = selectedAction === action.id
            const isDisabled = !currentCode.trim() || isLoading
            
            return (
              <Button
                key={action.id}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 transition-all ${
                  isSelected ? action.color : ""
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleActionClick(action)}
                disabled={isDisabled}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {isSelected && isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {getModelBadge(action.model)}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Button>
            )
          })}
        </div>

        {!currentCode.trim() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Generate a component first to use AI actions
              </span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              <span className="text-sm text-blue-800">
                AI is processing your request...
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-medium mb-2">💡 AI Action Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Fix Code: Automatically resolves syntax errors and common issues</li>
            <li>Explain Code: Provides detailed breakdown of component functionality</li>
            <li>Optimize: Improves performance, accessibility, and code quality</li>
            <li>Generate Tests: Creates comprehensive test suites</li>
            <li>Enhance UI: Upgrades styling and user experience</li>
            <li>Add Comments: Documents code with clear explanations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 