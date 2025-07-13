"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Brain, 
  Zap, 
  Sparkles, 
  Code, 
  Palette, 
  MessageSquare,
  Copy,
  Download,
  Send,
  Bot,
  Lightbulb,
  Wrench,
  TestTube,
  FileText,
  Check,
  AlertCircle,
  User
} from "lucide-react"

interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model: string
  action?: string
}

interface AIToolsPanelProps {
  onAIAction: (action: string, prompt: string, model: string) => void
  messages: AIMessage[]
  isLoading: boolean
}

const AI_MODELS = [
  {
    id: "gpt4",
    name: "GPT-4",
    description: "Most capable model for complex tasks",
    color: "bg-emerald-500",
    capabilities: ["Code Generation", "Analysis", "Optimization"]
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's helpful AI assistant",
    color: "bg-amber-600",
    capabilities: ["Code Analysis", "Documentation", "Best Practices"]
  },
  {
    id: "devin",
    name: "Devin AI",
    description: "Autonomous software engineering",
    color: "bg-purple-600",
    capabilities: ["Complex Components", "Architecture", "Testing"]
  },
  {
    id: "cursor",
    name: "Cursor Agent",
    description: "Advanced code editing and refactoring",
    color: "bg-blue-600",
    capabilities: ["Code Optimization", "Refactoring", "TypeScript"]
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    description: "React/Next.js UI generation specialist",
    color: "bg-black",
    capabilities: ["React Components", "shadcn/ui", "Tailwind CSS"]
  }
]

const AI_ACTIONS = [
  {
    id: "fix",
    name: "Fix Code",
    description: "Identify and fix bugs, errors, and issues",
    icon: Wrench,
    color: "bg-red-500 hover:bg-red-600"
  },
  {
    id: "explain",
    name: "Explain Code",
    description: "Get detailed explanation of how the code works",
    icon: Lightbulb,
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    id: "optimize",
    name: "Optimize",
    description: "Improve performance, readability, and best practices",
    icon: Zap,
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    id: "test",
    name: "Generate Tests",
    description: "Create comprehensive unit tests",
    icon: TestTube,
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    id: "document",
    name: "Document",
    description: "Add comprehensive comments and documentation",
    icon: FileText,
    color: "bg-orange-500 hover:bg-orange-600"
  }
]

export function AIToolsPanel({ onAIAction, messages, isLoading }: AIToolsPanelProps) {
  const [selectedModel, setSelectedModel] = useState("v0")
  const [prompt, setPrompt] = useState("")
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const handleAction = (actionId: string) => {
    if (!prompt.trim()) return
    
    setSelectedAction(actionId)
    onAIAction(actionId, prompt, selectedModel)
    setPrompt("")
  }

  const handleCopyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const selectedModelData = AI_MODELS.find(model => model.id === selectedModel)

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${model.color}`} />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModelData && (
              <div className="text-xs text-muted-foreground">
                {selectedModelData.description}
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe what you want to do</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Fix the button styling, explain this component, optimize for performance..."
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
          </div>

          {/* AI Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Actions</label>
            <div className="grid grid-cols-2 gap-2">
              {AI_ACTIONS.map((action) => {
                const Icon = action.icon
                const isSelected = selectedAction === action.id
                
                return (
                  <Button
                    key={action.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAction(action.id)}
                    disabled={!prompt.trim() || isLoading}
                    className={`text-xs h-auto p-2 ${isSelected ? action.color : ""}`}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {action.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Chat History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI Responses</label>
              <Badge variant="outline" className="text-xs">
                {messages.length}
              </Badge>
            </div>
            
            <ScrollArea className="h-48 border rounded-lg p-2">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-2 text-xs ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "assistant" ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="font-medium">
                          {message.role === "assistant" ? "AI" : "You"}
                        </span>
                        {message.action && (
                          <Badge variant="outline" className="text-xs">
                            {message.action}
                          </Badge>
                        )}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="flex items-center gap-1 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {message.role === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    <span className="text-xs">AI is thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Actions</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat History
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Auto-Select Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 