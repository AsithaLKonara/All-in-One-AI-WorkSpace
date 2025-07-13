"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Eye } from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  content?: string
}

interface PreviewPanelProps {
  activeModel: string
  files: FileItem[]
  activeFile: FileItem | null
}

export function PreviewPanel({ activeModel, files, activeFile }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const getViewportSize = () => {
    switch (viewMode) {
      case "desktop":
        return "w-full h-full"
      case "tablet":
        return "w-80 h-96 mx-auto mt-4"
      case "mobile":
        return "w-64 h-96 mx-auto mt-4"
      default:
        return "w-full h-full"
    }
  }

  const renderPreview = () => {
    if (!activeFile || activeFile.type === "folder") {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <Eye className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No preview available</p>
            <p className="text-sm">Select a file to see the preview</p>
          </div>
        </div>
      )
    }

    const isReactComponent =
      activeFile.content?.includes("export default") &&
      (activeFile.name.endsWith(".tsx") || activeFile.name.endsWith(".jsx"))

    if (isReactComponent) {
      return (
        <div className={`bg-white border rounded-lg ${getViewportSize()}`}>
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">React Component</h3>
              <p className="text-gray-600 mb-4">Component preview for {activeFile.name}</p>
              <div className="bg-white p-4 rounded border shadow-sm">
                <div className="text-sm text-gray-500">Live preview would render here</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="h-full bg-gray-50 p-4">
        <div className="bg-white rounded border h-full">
          <div className="p-4 border-b">
            <h3 className="font-medium">{activeFile.name}</h3>
            <p className="text-sm text-gray-600">File preview</p>
          </div>
          <ScrollArea className="h-full p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">{activeFile.content || "// Empty file"}</pre>
          </ScrollArea>
        </div>
      </div>
    )
  }

  const renderConsole = () => {
    const logs = [
      { type: "info", message: "Application started successfully", timestamp: "10:30:15" },
      { type: "warn", message: "Component re-rendered 3 times", timestamp: "10:30:18" },
      { type: "error", message: "Failed to load resource: 404", timestamp: "10:30:22" },
      { type: "info", message: "Hot reload completed", timestamp: "10:30:25" },
    ]

    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-3 text-sm font-mono">
              <span className="text-gray-500 text-xs">{log.timestamp}</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  log.type === "error"
                    ? "bg-red-100 text-red-700"
                    : log.type === "warn"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {log.type.toUpperCase()}
              </span>
              <span className="flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    )
  }

  const renderNetwork = () => {
    const requests = [
      { method: "GET", url: "/api/users", status: 200, time: "245ms" },
      { method: "POST", url: "/api/auth", status: 201, time: "156ms" },
      { method: "GET", url: "/api/data", status: 404, time: "89ms" },
    ]

    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="space-y-2">
            {requests.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-3">
                  <Badge variant={req.method === "GET" ? "secondary" : "default"} className="text-xs">
                    {req.method}
                  </Badge>
                  <span className="font-mono">{req.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      req.status >= 400
                        ? "bg-red-100 text-red-700"
                        : req.status >= 300
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {req.status}
                  </span>
                  <span className="text-gray-500 text-xs">{req.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Preview</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="rounded-r-none"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tablet")}
                className="rounded-none border-x"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="rounded-l-none"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-2">
            <div className="h-full p-4">{renderPreview()}</div>
          </TabsContent>

          <TabsContent value="console" className="flex-1 overflow-hidden mt-2">
            <div className="h-full">{renderConsole()}</div>
          </TabsContent>

          <TabsContent value="network" className="flex-1 overflow-hidden mt-2">
            <div className="h-full">{renderNetwork()}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
