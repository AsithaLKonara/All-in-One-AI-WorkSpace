"use client"

import { useState } from "react"
import { PromptForm } from "./components/PromptForm"
import { UIBlockPreview } from "./components/UIBlockPreview"
import { Sidebar } from "./components/Sidebar"
import { AIActionToolbar } from "./components/AIActionToolbar"
import { EditorWorkspace } from "./components/EditorWorkspace"
import { ThemeSwitcher } from "./components/ThemeSwitcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Code, 
  Palette, 
  Settings, 
  Download,
  Share2,
  Save,
  History,
  Zap
} from "lucide-react"

interface ComponentBlock {
  id: string
  name: string
  jsx: string
  metadata: {
    framework: string
    styling: string
    complexity: string
  }
  position: number
}

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState<any>(null)
  const [blocks, setBlocks] = useState<ComponentBlock[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPerformingAction, setIsPerformingAction] = useState(false)
  const [activeTab, setActiveTab] = useState("builder")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  const handleGenerateUI = async (prompt: string, model: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-ui", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate UI")
      }

      const data = await response.json()
      setCurrentComponent(data)
      
      // Add to blocks
      const newBlock: ComponentBlock = {
        id: `block-${Date.now()}`,
        name: data.metadata.name,
        jsx: data.jsx,
        metadata: data.metadata,
        position: blocks.length,
      }
      setBlocks([...blocks, newBlock])
      
    } catch (error) {
      console.error("Error generating UI:", error)
      alert("Failed to generate UI component")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAIAction = async (action: any, code: string) => {
    setIsPerformingAction(true)
    try {
      const response = await fetch("/api/ai-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action.id,
          code,
          model: action.model,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to perform AI action")
      }

      const data = await response.json()
      
      // Update current component with improved code
      if (currentComponent) {
        setCurrentComponent({
          ...currentComponent,
          jsx: data.result,
        })
      }
      
    } catch (error) {
      console.error("Error performing AI action:", error)
      alert("Failed to perform AI action")
    } finally {
      setIsPerformingAction(false)
    }
  }

  const handleBlockSelect = (block: ComponentBlock) => {
    // Convert ComponentBlock to Component format for Sidebar
    const component = {
      id: block.id,
      name: block.name,
      description: block.metadata.complexity,
      category: "custom",
      jsx: block.jsx,
      metadata: block.metadata,
      isFavorite: false,
      createdAt: new Date().toISOString()
    }
    
    setCurrentComponent({
      jsx: block.jsx,
      metadata: block.metadata,
    })
  }

  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
  }

  const handleBlockDuplicate = (block: ComponentBlock) => {
    const newBlock: ComponentBlock = {
      ...block,
      id: `block-${Date.now()}`,
      name: `${block.name} (Copy)`,
      position: blocks.length,
    }
    setBlocks([...blocks, newBlock])
  }

  const handleBlocksChange = (newBlocks: ComponentBlock[]) => {
    setBlocks(newBlocks)
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">AI UI Builder</h1>
            <Badge variant="outline" className="text-xs">
              v1.0
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="space-y-6">
                <Sidebar
                  onComponentSelect={handleBlockSelect}
                  onNewComponent={() => setActiveTab("builder")}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Prompt Form */}
                <PromptForm
                  onSubmit={handleGenerateUI}
                  isLoading={isGenerating}
                />

                {/* AI Action Toolbar */}
                <AIActionToolbar
                  onAction={handleAIAction}
                  currentCode={currentComponent?.jsx || ""}
                  isLoading={isPerformingAction}
                />

                {/* Component Preview */}
                <UIBlockPreview
                  component={currentComponent}
                  onRegenerate={() => {
                    if (currentComponent) {
                      handleGenerateUI(currentComponent.metadata.description, "v0")
                    }
                  }}
                  onSave={(component) => {
                    if (component) {
                      const newBlock: ComponentBlock = {
                        id: `block-${Date.now()}`,
                        name: component.metadata?.name || "Saved Component",
                        jsx: component.jsx,
                        metadata: component.metadata,
                        position: blocks.length,
                      }
                      setBlocks([...blocks, newBlock])
                    }
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workspace" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Workspace Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Recent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {blocks.slice(-5).reverse().map((block) => (
                        <div
                          key={block.id}
                          className="p-2 border rounded cursor-pointer hover:bg-muted"
                          onClick={() => handleBlockSelect(block)}
                        >
                          <div className="font-medium text-sm">{block.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {block.metadata.framework} • {block.metadata.complexity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workspace Main */}
              <div className="lg:col-span-3">
                <EditorWorkspace
                  blocks={blocks}
                  onBlocksChange={handleBlocksChange}
                  onBlockSelect={handleBlockSelect}
                  onBlockDelete={handleBlockDelete}
                  onBlockDuplicate={handleBlockDuplicate}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <ThemeSwitcher onThemeChange={handleThemeChange} />
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Theme Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-white">
                      <h4 className="font-medium mb-2">Light Theme</h4>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gray-900 text-white">
                      <h4 className="font-medium mb-2">Dark Theme</h4>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">AI Model Preferences</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure your preferred AI models for different tasks
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Export Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred export format and settings
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize keyboard shortcuts for faster workflow
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
