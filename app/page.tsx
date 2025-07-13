"use client"

import { useState } from "react"
import { BuilderLayout } from "./components/ai-ui-builder/BuilderLayout"
import { AIToolsPanel } from "./components/ai-ui-builder/AIToolsPanel"
import { ComponentLibrary } from "./components/ai-ui-builder/ComponentLibrary"
import { DragDropWorkspace } from "./components/ai-ui-builder/DragDropWorkspace"
import { PreviewPanel } from "./components/ai-ui-builder/PreviewPanel"
import { DeployPanel } from "./components/ai-ui-builder/DeployPanel"
import { OnboardingBanner } from "./components/ai-ui-builder/OnboardingBanner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Code, 
  Palette, 
  Settings, 
  Download,
  Share2,
  Save,
  History,
  Zap,
  Brain,
  Eye,
  Rocket,
  Package,
  Grid3X3
} from "lucide-react"

interface AIMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model: string
  action?: string
}

interface WorkspaceElement {
  id: string
  type: string
  name: string
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface Component {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  isFavorite: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  downloads: number
  rating: number
  author: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("workspace")
  const [workspaceElements, setWorkspaceElements] = useState<WorkspaceElement[]>([])
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handleAIAction = async (action: string, prompt: string, model: string) => {
    setIsGenerating(true)
    
    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date(),
      model
    }
    setAiMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch("/api/ai-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          code: "", // Current workspace code
          model,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to perform AI action")
      }

      const data = await response.json()
      
      // Add AI response
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.result,
        timestamp: new Date(),
        model,
        action
      }
      setAiMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error("Error performing AI action:", error)
      alert("Failed to perform AI action")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleElementSelect = (element: WorkspaceElement) => {
    // Handle element selection for editing
    console.log("Selected element:", element)
  }

  const handleElementDelete = (elementId: string) => {
    setWorkspaceElements(prev => prev.filter(el => el.id !== elementId))
  }

  const handleGenerateCode = () => {
    // Generate code from workspace elements
    console.log("Generating code from workspace")
  }

  const handleComponentSelect = (component: Component) => {
    // Add component to workspace
    const newElement: WorkspaceElement = {
      id: `component-${Date.now()}`,
      type: component.category,
      name: component.name,
      props: {},
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 }
    }
    setWorkspaceElements(prev => [...prev, newElement])
  }

  const handleSaveComponent = (component: Partial<Component>) => {
    // Save component to library
    console.log("Saving component:", component)
  }

  const handleDeleteComponent = (componentId: string) => {
    // Delete component from library
    console.log("Deleting component:", componentId)
  }

  const handleDeploy = () => {
    // Handle deployment
    console.log("Deploying project")
  }

  const handleExportGitHub = () => {
    // Export to GitHub
    console.log("Exporting to GitHub")
  }

  const handleRefreshPreview = () => {
    // Refresh preview
    console.log("Refreshing preview")
  }

  const handleExportPreview = () => {
    // Export preview
    console.log("Exporting preview")
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    setShowOnboarding(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "workspace":
        return (
          <DragDropWorkspace
            onElementSelect={handleElementSelect}
            onElementDelete={handleElementDelete}
            onGenerateCode={handleGenerateCode}
          />
        )
      case "library":
        return (
          <ComponentLibrary
            onComponentSelect={handleComponentSelect}
            onSaveComponent={handleSaveComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        )
      case "preview":
        return (
          <PreviewPanel
            elements={workspaceElements}
            onRefresh={handleRefreshPreview}
            onExport={handleExportPreview}
          />
        )
      case "deploy":
        return (
          <DeployPanel
            onDeploy={handleDeploy}
            onExportGitHub={handleExportGitHub}
          />
        )
      case "ai-tools":
        return (
          <AIToolsPanel
            onAIAction={handleAIAction}
            messages={aiMessages}
            isLoading={isGenerating}
          />
        )
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a Tab</h3>
              <p className="text-sm">Choose a tab to get started</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen bg-background">
      {showOnboarding && (
        <OnboardingBanner
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      <BuilderLayout>
        {renderTabContent()}
      </BuilderLayout>
    </div>
  )
}
