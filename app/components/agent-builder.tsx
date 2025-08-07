"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bot, 
  MessageSquare, 
  Code, 
  Search, 
  Settings, 
  Save,
  Play,
  Sparkles,
  Upload,
  Download,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Globe
} from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  model: string
  tools: string[]
  avatar?: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface AIModel {
  id: string
  name: string
  description: string
  category: string
  capabilities: string[]
}

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
}

export default function AgentBuilder() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [currentAgent, setCurrentAgent] = useState<Partial<Agent>>({
    name: "",
    description: "",
    systemPrompt: "",
    model: "",
    tools: [],
    category: "General",
    isPublic: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const aiModels: AIModel[] = [
    {
      id: "claude-3",
      name: "Claude 3 Sonnet",
      description: "Anthropic's most capable model for complex reasoning",
      category: "General AI",
      capabilities: ["Complex reasoning", "Code generation", "Analysis", "Creative writing"]
    },
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "OpenAI's advanced language model",
      category: "General AI",
      capabilities: ["Text generation", "Code assistance", "Problem solving", "Creative tasks"]
    },
    {
      id: "gemini-pro",
      name: "Gemini Pro",
      description: "Google's multimodal AI model",
      category: "General AI",
      capabilities: ["Multimodal input", "Code generation", "Analysis", "Creative tasks"]
    },
    {
      id: "v0",
      name: "v0 by Vercel",
      description: "React/Next.js UI generation specialist",
      category: "UI Development",
      capabilities: ["React Components", "Next.js Apps", "shadcn/ui", "Tailwind CSS"]
    },
    {
      id: "cursor",
      name: "Cursor Agent",
      description: "Advanced code editing and refactoring",
      category: "Code Editor",
      capabilities: ["Code Analysis", "Refactoring", "Multi-file Editing", "Git Integration"]
    }
  ]

  const availableTools: Tool[] = [
    {
      id: "web-search",
      name: "Web Search",
      description: "Search the internet for current information",
      category: "Research",
      icon: <Search className="w-4 h-4" />
    },
    {
      id: "code-execution",
      name: "Code Execution",
      description: "Execute code in a sandboxed environment",
      category: "Development",
      icon: <Code className="w-4 h-4" />
    },
    {
      id: "file-operations",
      name: "File Operations",
      description: "Read, write, and manage files",
      category: "Development",
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: "database-access",
      name: "Database Access",
      description: "Query and manipulate databases",
      category: "Data",
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: "api-calls",
      name: "API Calls",
      description: "Make HTTP requests to external APIs",
      category: "Integration",
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: "image-generation",
      name: "Image Generation",
      description: "Generate images using AI models",
      category: "Creative",
      icon: <Sparkles className="w-4 h-4" />
    }
  ]

  const categories = [
    "General",
    "Development",
    "Research",
    "Creative",
    "Business",
    "Education",
    "Entertainment"
  ]

  const handleSaveAgent = () => {
    if (!currentAgent.name || !currentAgent.systemPrompt || !currentAgent.model) {
      alert("Please fill in all required fields")
      return
    }

    const newAgent: Agent = {
      id: isEditing ? currentAgent.id! : Date.now().toString(),
      name: currentAgent.name,
      description: currentAgent.description || "",
      systemPrompt: currentAgent.systemPrompt,
      model: currentAgent.model,
      tools: currentAgent.tools || [],
      category: currentAgent.category || "General",
      isPublic: currentAgent.isPublic || false,
      createdAt: isEditing ? agents.find(a => a.id === currentAgent.id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (isEditing) {
      setAgents(agents.map(a => a.id === newAgent.id ? newAgent : a))
    } else {
      setAgents([...agents, newAgent])
    }

    setCurrentAgent({
      name: "",
      description: "",
      systemPrompt: "",
      model: "",
      tools: [],
      category: "General",
      isPublic: false
    })
    setIsEditing(false)
  }

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent)
    setIsEditing(true)
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter(a => a.id !== agentId))
  }

  const handleToolToggle = (toolId: string) => {
    const currentTools = currentAgent.tools || []
    const newTools = currentTools.includes(toolId)
      ? currentTools.filter(id => id !== toolId)
      : [...currentTools, toolId]
    setCurrentAgent({ ...currentAgent, tools: newTools })
  }

  const getSelectedModel = () => {
    return aiModels.find(m => m.id === currentAgent.model)
  }

  const getSelectedTools = () => {
    return availableTools.filter(t => currentAgent.tools?.includes(t.id))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Builder</h1>
            <p className="text-muted-foreground">
              Create custom AI agents with specific capabilities and tools
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? "Edit Mode" : "Preview Mode"}
            </Button>
            <Button onClick={handleSaveAgent}>
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? "Update Agent" : "Save Agent"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Builder Panel */}
        <div className="w-1/2 border-r p-6 overflow-y-auto">
          <Tabs defaultValue="basic" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-name">Agent Name *</Label>
                  <Input
                    id="agent-name"
                    placeholder="My Custom Agent"
                    value={currentAgent.name}
                    onChange={(e) => setCurrentAgent({ ...currentAgent, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="agent-description">Description</Label>
                  <Textarea
                    id="agent-description"
                    placeholder="Describe what this agent does..."
                    value={currentAgent.description}
                    onChange={(e) => setCurrentAgent({ ...currentAgent, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="agent-category">Category</Label>
                  <Select
                    value={currentAgent.category}
                    onValueChange={(value) => setCurrentAgent({ ...currentAgent, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="agent-model">AI Model *</Label>
                  <Select
                    value={currentAgent.model}
                    onValueChange={(value) => setCurrentAgent({ ...currentAgent, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center">
                            <span>{model.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="public-agent"
                    checked={currentAgent.isPublic}
                    onCheckedChange={(checked) => setCurrentAgent({ ...currentAgent, isPublic: !!checked })}
                  />
                  <Label htmlFor="public-agent">Make this agent public</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompt" className="space-y-6">
              <div>
                <Label htmlFor="system-prompt">System Prompt *</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="You are a helpful AI assistant..."
                  value={currentAgent.systemPrompt}
                  onChange={(e) => setCurrentAgent({ ...currentAgent, systemPrompt: e.target.value })}
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Define the agent's personality, capabilities, and behavior
                </p>
              </div>

              {getSelectedModel() && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Selected Model: {getSelectedModel()?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {getSelectedModel()?.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getSelectedModel()?.capabilities.map((capability, index) => (
                        <Badge key={index} variant="secondary">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <div>
                <Label>Available Tools</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the tools this agent can use
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableTools.map((tool) => (
                  <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={currentAgent.tools?.includes(tool.id)}
                          onCheckedChange={() => handleToolToggle(tool.id)}
                        />
                        <div className="flex items-center space-x-2">
                          {tool.icon}
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-sm text-muted-foreground">{tool.description}</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-auto">
                          {tool.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div>
                <Label>Agent Configuration</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced settings for your agent
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selected Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  {getSelectedTools().length > 0 ? (
                    <div className="space-y-2">
                      {getSelectedTools().map((tool) => (
                        <div key={tool.id} className="flex items-center space-x-2">
                          {tool.icon}
                          <span className="text-sm">{tool.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tools selected</p>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-avatar">Avatar URL (Optional)</Label>
                  <Input
                    id="agent-avatar"
                    placeholder="https://example.com/avatar.png"
                    value={currentAgent.avatar}
                    onChange={(e) => setCurrentAgent({ ...currentAgent, avatar: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Agent Preview</h2>
              {currentAgent.name ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{currentAgent.name}</CardTitle>
                        <CardDescription>{currentAgent.description || "No description"}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <Badge variant="secondary">{currentAgent.category}</Badge>
                    </div>

                    {getSelectedModel() && (
                      <div>
                        <Label className="text-sm font-medium">AI Model</Label>
                        <div className="text-sm">{getSelectedModel()?.name}</div>
                      </div>
                    )}

                    {getSelectedTools().length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Tools</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {getSelectedTools().map((tool) => (
                            <Badge key={tool.id} variant="outline">
                              {tool.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentAgent.systemPrompt && (
                      <div>
                        <Label className="text-sm font-medium">System Prompt</Label>
                        <div className="text-sm bg-muted p-3 rounded mt-1 max-h-32 overflow-y-auto">
                          {currentAgent.systemPrompt}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Start building your agent to see a preview</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Saved Agents */}
            {agents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Saved Agents</h3>
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <Card key={agent.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-sm text-muted-foreground">{agent.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAgent(agent)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAgent(agent.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 