"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Sparkles, Wand2, Lightbulb, Zap } from "lucide-react"

interface PromptFormProps {
  onSubmit: (prompt: string, model: string) => void
  isLoading: boolean
}

const AI_MODELS = [
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic's helpful AI assistant",
    color: "bg-amber-600",
    capabilities: ["UI Generation", "Code Analysis", "Design Patterns"],
  },
  {
    id: "devin",
    name: "Devin AI",
    description: "Autonomous software engineering",
    color: "bg-purple-600",
    capabilities: ["Complex Components", "Architecture", "Best Practices"],
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    description: "React/Next.js UI generation specialist",
    color: "bg-black",
    capabilities: ["React Components", "shadcn/ui", "Tailwind CSS"],
  },
  {
    id: "cursor",
    name: "Cursor Agent",
    description: "Advanced code editing and refactoring",
    color: "bg-blue-600",
    capabilities: ["Code Optimization", "Refactoring", "TypeScript"],
  },
  {
    id: "gpt4free",
    name: "GPT-4 Free",
    description: "Free GPT-4 access via open APIs",
    color: "bg-emerald-500",
    capabilities: ["General UI", "Creative Design", "Rapid Prototyping"],
  },
]

const QUICK_PROMPTS = [
  "Create a modern login form with email and password fields",
  "Build a responsive navigation header with logo and menu items",
  "Design a product card with image, title, price, and add to cart button",
  "Generate a dashboard sidebar with navigation links and icons",
  "Create a contact form with name, email, message fields and submit button",
  "Build a hero section with heading, description, and call-to-action button",
  "Design a pricing table with three tiers and feature lists",
  "Generate a footer with links, social media icons, and copyright",
]

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("v0")
  const [isAdvanced, setIsAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim(), selectedModel)
    }
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
  }

  const selectedModelData = AI_MODELS.find(model => model.id === selectedModel)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI UI Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe your UI component in natural language and let AI generate it for you
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Model Selection */}
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{selectedModelData.description}</span>
              <div className="flex gap-1">
                {selectedModelData.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe your UI component</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a modern login form with email and password fields, social login buttons, and forgot password link"
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Prompts</label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(quickPrompt)}
                disabled={isLoading}
                className="text-xs"
              >
                {quickPrompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="text-xs"
          >
            {isAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
          
          {isAdvanced && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <label className="text-xs font-medium">Framework</label>
                <Select defaultValue="react">
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium">Styling</label>
                <Select defaultValue="tailwind">
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="styled">Styled Components</SelectItem>
                    <SelectItem value="emotion">Emotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate UI Component
              </>
            )}
          </Button>
        </form>

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">💡 Tips for better results:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be specific about styling, colors, and layout</li>
            <li>Mention responsive behavior if needed</li>
            <li>Include accessibility requirements</li>
            <li>Specify any interactive features</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 