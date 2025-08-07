"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Copy, Star, StarOff, Download, Upload } from "lucide-react"

interface PromptManagementProps {
  models: any
  roles: any[]
  user: any
}

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  usage: number
}

export function PromptManagement({ models, roles, user }: PromptManagementProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: "1",
      title: "Code Review Assistant",
      content:
        "You are an expert code reviewer. Please review the following code and provide constructive feedback on:\n1. Code quality and best practices\n2. Potential bugs or issues\n3. Performance optimizations\n4. Security considerations\n\nCode to review:\n{code}",
      category: "Development",
      tags: ["code-review", "development", "quality"],
      isFavorite: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
      usage: 45,
    },
    {
      id: "2",
      title: "UI Component Generator",
      content:
        "Create a React component with the following specifications:\n- Component name: {componentName}\n- Props: {props}\n- Styling: Use Tailwind CSS\n- Accessibility: Include proper ARIA labels\n- TypeScript: Use proper typing\n\nRequirements:\n{requirements}",
      category: "UI/UX",
      tags: ["react", "component", "ui", "typescript"],
      isFavorite: false,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-18"),
      usage: 32,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreating, setIsCreating] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const [newPrompt, setNewPrompt] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
  })

  const categories = ["all", ...Array.from(new Set(prompts.map((p) => p.category)))]

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreatePrompt = () => {
    const prompt: Prompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      content: newPrompt.content,
      category: newPrompt.category,
      tags: newPrompt.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      usage: 0,
    }

    setPrompts((prev) => [...prev, prompt])
    setNewPrompt({ title: "", content: "", category: "General", tags: "" })
    setIsCreating(false)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setNewPrompt({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(", "),
    })
  }

  const handleUpdatePrompt = () => {
    if (!editingPrompt) return

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === editingPrompt.id
          ? {
              ...p,
              title: newPrompt.title,
              content: newPrompt.content,
              category: newPrompt.category,
              tags: newPrompt.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              updatedAt: new Date(),
            }
          : p,
      ),
    )

    setEditingPrompt(null)
    setNewPrompt({ title: "", content: "", category: "General", tags: "" })
  }

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleToggleFavorite = (id: string) => {
    setPrompts((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)))
  }

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Prompt Management</h1>
            <p className="text-muted-foreground">Create, organize, and manage your AI prompts</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          {(isCreating || editingPrompt) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPrompt ? "Edit Prompt" : "Create New Prompt"}</CardTitle>
                <CardDescription>
                  {editingPrompt ? "Update your existing prompt" : "Create a new prompt template"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPrompt.title}
                      onChange={(e) => setNewPrompt((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter prompt title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newPrompt.category}
                      onChange={(e) => setNewPrompt((prev) => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Development, Writing, Analysis"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Prompt Content</Label>
                  <Textarea
                    id="content"
                    value={newPrompt.content}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your prompt template here. Use {variable} for placeholders."
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newPrompt.tags}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., code, review, development"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
                    disabled={!newPrompt.title || !newPrompt.content}
                  >
                    {editingPrompt ? "Update Prompt" : "Create Prompt"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingPrompt(null)
                      setNewPrompt({ title: "", content: "", category: "General", tags: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <Badge variant="outline">{prompt.category}</Badge>
                        {prompt.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {prompt.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardDescription>
                        Created {prompt.createdAt.toLocaleDateString()} • Used {prompt.usage} times
                      </CardDescription>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleToggleFavorite(prompt.id)}>
                        {prompt.isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleCopyPrompt(prompt.content)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditPrompt(prompt)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeletePrompt(prompt.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {prompt.content.length > 200 ? `${prompt.content.substring(0, 200)}...` : prompt.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">No prompts found</p>
                  <p>Try adjusting your search or create a new prompt</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 border-l border-border p-6 bg-muted/20">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Prompts
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Prompts
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Prompts</span>
                  <span className="font-medium">{prompts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Favorites</span>
                  <span className="font-medium">{prompts.filter((p) => p.isFavorite).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <span className="font-medium">{categories.length - 1}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(prompts.flatMap((p) => p.tags)))
                  .slice(0, 10)
                  .map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
