"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  Wrench,
  FileText,
  Code,
  Terminal,
  Globe,
  Database,
  Palette,
  Zap,
  Play,
  Settings,
  Search,
  RefreshCw,
} from "lucide-react"

interface ToolsPanelProps {
  activeModel: string
  modelTools: string[]
}

export function ToolsPanel({ activeModel, modelTools }: ToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const toolDefinitions = {
    file_create: {
      name: "Create File",
      description: "Create new files and directories",
      icon: FileText,
      category: "File Operations",
      color: "bg-blue-500",
    },
    file_edit: {
      name: "Edit File",
      description: "Modify existing files",
      icon: Code,
      category: "File Operations",
      color: "bg-green-500",
    },
    read_file: {
      name: "Read File",
      description: "Read and analyze file contents",
      icon: FileText,
      category: "File Operations",
      color: "bg-purple-500",
    },
    write_file: {
      name: "Write File",
      description: "Write content to files",
      icon: FileText,
      category: "File Operations",
      color: "bg-orange-500",
    },
    run_command: {
      name: "Run Command",
      description: "Execute terminal commands",
      icon: Terminal,
      category: "System",
      color: "bg-gray-700",
    },
    execute_command: {
      name: "Execute Command",
      description: "Run system commands with full access",
      icon: Terminal,
      category: "System",
      color: "bg-red-600",
    },
    browse_web: {
      name: "Browse Web",
      description: "Search and browse the internet",
      icon: Globe,
      category: "Research",
      color: "bg-blue-600",
    },
    browse_internet: {
      name: "Browse Internet",
      description: "Access web resources and documentation",
      icon: Globe,
      category: "Research",
      color: "bg-cyan-600",
    },
    component_generate: {
      name: "Generate Component",
      description: "Create React components",
      icon: Palette,
      category: "UI Generation",
      color: "bg-pink-500",
    },
    preview_update: {
      name: "Update Preview",
      description: "Refresh live preview",
      icon: RefreshCw,
      category: "Preview",
      color: "bg-indigo-500",
    },
    install_package: {
      name: "Install Package",
      description: "Install npm packages",
      icon: Database,
      category: "Package Management",
      color: "bg-yellow-600",
    },
    start_dev_server: {
      name: "Start Dev Server",
      description: "Launch development server",
      icon: Play,
      category: "Development",
      color: "bg-green-600",
    },
    run_tests: {
      name: "Run Tests",
      description: "Execute test suites",
      icon: Zap,
      category: "Testing",
      color: "bg-purple-600",
    },
    deploy_application: {
      name: "Deploy App",
      description: "Deploy to production",
      icon: Zap,
      category: "Deployment",
      color: "bg-red-500",
    },
    search_files: {
      name: "Search Files",
      description: "Search across project files",
      icon: Search,
      category: "Search",
      color: "bg-teal-500",
    },
    search_replace: {
      name: "Search & Replace",
      description: "Find and replace text in files",
      icon: Search,
      category: "Editing",
      color: "bg-amber-500",
    },
    analyze_project: {
      name: "Analyze Project",
      description: "Understand project structure",
      icon: Settings,
      category: "Analysis",
      color: "bg-slate-600",
    },
    refactor_code: {
      name: "Refactor Code",
      description: "Improve code structure",
      icon: Code,
      category: "Code Quality",
      color: "bg-emerald-600",
    },
  }

  const availableTools = modelTools
    .map((toolId) => ({
      id: toolId,
      ...toolDefinitions[toolId as keyof typeof toolDefinitions],
    }))
    .filter((tool) => tool.name)

  const groupedTools = availableTools.reduce(
    (groups, tool) => {
      const category = tool.category || "Other"
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(tool)
      return groups
    },
    {} as Record<string, any[]>,
  )

  const handleToolClick = (toolId: string) => {
    setActiveTool(activeTool === toolId ? null : toolId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-700">Tools</h3>
        </div>
        <p className="text-xs text-gray-500">Available tools for {activeModel}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">{category}</h4>
              <div className="space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  const isActive = activeTool === tool.id

                  return (
                    <Card
                      key={tool.id}
                      className={`cursor-pointer transition-all hover:shadow-sm ${
                        isActive ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => handleToolClick(tool.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm">{tool.name}</h5>
                            <p className="text-xs text-gray-600 truncate">{tool.description}</p>
                          </div>
                        </div>

                        {isActive && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Play className="h-3 w-3 mr-1" />
                                Execute
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {availableTools.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No tools available</p>
              <p className="text-xs">Tools will appear based on the active model</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
