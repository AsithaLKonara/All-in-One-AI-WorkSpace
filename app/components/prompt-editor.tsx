"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download, Copy, Trash2, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PromptEditor() {
  const [promptData, setPromptData] = useState({
    name: "",
    platform: "",
    category: "",
    description: "",
    content: "",
    tags: [] as string[],
    version: "1.0.0",
  })

  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const { toast } = useToast()

  const platforms = [
    "Custom",
    "Vercel v0",
    "Cursor",
    "Bolt",
    "Lovable",
    "Devin AI",
    "Manus",
    "Windsurf",
    "Replit",
    "Claude",
    "ChatGPT",
    "GitHub Copilot",
  ]

  const categories = [
    "UI Generation",
    "Code Editing",
    "Full-Stack",
    "Web Development",
    "Autonomous Development",
    "Multi-Purpose",
    "Cloud Development",
    "Data Analysis",
    "DevOps",
    "Testing",
    "Documentation",
  ]

  const templates = {
    "basic-assistant": {
      name: "Basic AI Assistant",
      content: `You are a helpful AI assistant. You provide accurate, helpful, and concise responses to user queries.

Guidelines:
- Be helpful and informative
- Provide clear explanations
- Ask for clarification when needed
- Stay focused on the user's request
- Be honest about limitations

Response format:
- Use clear, structured responses
- Include examples when helpful
- Provide step-by-step instructions for complex tasks`,
    },
    "code-assistant": {
      name: "Code Assistant",
      content: `You are an expert programming assistant. You help users write, debug, and improve code across multiple programming languages.

Capabilities:
- Code generation and completion
- Bug fixing and debugging
- Code review and optimization
- Architecture and design guidance
- Best practices recommendations

Guidelines:
- Write clean, readable, and maintainable code
- Follow language-specific conventions
- Include comments for complex logic
- Suggest improvements and optimizations
- Explain your reasoning for code decisions`,
    },
    "ui-generator": {
      name: "UI Generator",
      content: `You are a UI/UX focused assistant that creates beautiful, responsive user interfaces.

Specializations:
- React/Next.js components
- Modern CSS and styling
- Responsive design principles
- Accessibility best practices
- Component libraries (shadcn/ui, Material-UI, etc.)

Guidelines:
- Create semantic, accessible HTML
- Use modern CSS techniques
- Implement responsive designs
- Follow design system principles
- Optimize for performance and usability`,
    },
  }

  const addTag = () => {
    if (newTag.trim() && !promptData.tags.includes(newTag.trim())) {
      setPromptData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPromptData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const loadTemplate = (templateKey: string) => {
    const template = templates[templateKey as keyof typeof templates]
    setPromptData((prev) => ({
      ...prev,
      name: template.name,
      content: template.content,
    }))
    toast({
      title: "Template loaded",
      description: `${template.name} template has been loaded.`,
    })
  }

  const savePrompt = () => {
    if (!promptData.name || !promptData.content) {
      toast({
        title: "Missing required fields",
        description: "Please provide at least a name and content for your prompt.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to a database
    const savedPrompts = JSON.parse(localStorage.getItem("savedPrompts") || "[]")
    const newPrompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    savedPrompts.push(newPrompt)
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts))

    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved successfully.",
    })
  }

  const exportPrompt = () => {
    const exportData = {
      ...promptData,
      exportedAt: new Date().toISOString(),
      version: promptData.version,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${promptData.name.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Prompt exported",
      description: "Your prompt has been exported as JSON.",
    })
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptData.content)
    toast({
      title: "Copied to clipboard",
      description: "Prompt content has been copied to your clipboard.",
    })
  }

  const clearForm = () => {
    setPromptData({
      name: "",
      platform: "",
      category: "",
      description: "",
      content: "",
      tags: [],
      version: "1.0.0",
    })
    toast({
      title: "Form cleared",
      description: "All fields have been reset.",
    })
  }

  const wordCount = promptData.content.split(/\s+/).filter((word) => word.length > 0).length
  const charCount = promptData.content.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompt Editor</h2>
          <p className="text-gray-600">Create and customize AI assistant prompts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearForm}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button variant="outline" onClick={copyPrompt}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={exportPrompt}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={savePrompt}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Prompt Metadata</CardTitle>
                <CardDescription>Basic information about your prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={promptData.name}
                    onChange={(e) => setPromptData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="My Custom Prompt"
                  />
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={promptData.platform}
                    onValueChange={(value) => setPromptData((prev) => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={promptData.category}
                    onValueChange={(value) => setPromptData((prev) => ({ ...prev, category: value }))}
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
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={promptData.version}
                    onChange={(e) => setPromptData((prev) => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={promptData.description}
                    onChange={(e) => setPromptData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what this prompt does..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {promptData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {tag}
                        <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
                <CardDescription>Write your prompt content here. Use clear instructions and examples.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={promptData.content}
                  onChange={(e) => setPromptData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="You are a helpful AI assistant..."
                  className="min-h-[500px] font-mono text-sm"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Templates</CardTitle>
              <CardDescription>Start with a pre-built template and customize it for your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(templates).map(([key, template]) => (
                  <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{template.content.substring(0, 100)}...</p>
                      <Button onClick={() => loadTemplate(key)} className="w-full">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Preview</CardTitle>
              <CardDescription>Preview how your prompt will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-semibold">{promptData.name || "Untitled Prompt"}</h3>
                  <div className="flex gap-2 mt-2">
                    {promptData.platform && <Badge variant="outline">{promptData.platform}</Badge>}
                    {promptData.category && <Badge variant="secondary">{promptData.category}</Badge>}
                    <Badge variant="outline">v{promptData.version}</Badge>
                  </div>
                  {promptData.description && <p className="text-gray-600 mt-2">{promptData.description}</p>}
                  {promptData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {promptData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Content:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                    {promptData.content || "No content yet..."}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
