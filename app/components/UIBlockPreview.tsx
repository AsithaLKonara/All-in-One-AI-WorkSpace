"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, Code, Check, Download, RefreshCw } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface UIBlockPreviewProps {
  component: {
    jsx: string
    metadata?: {
      name: string
      description: string
      framework: string
      styling: string
      complexity: "simple" | "medium" | "complex"
    }
  } | null
  onRegenerate?: () => void
  onSave?: (component: any) => void
}

export function UIBlockPreview({ component, onRegenerate, onSave }: UIBlockPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

  const handleCopy = async () => {
    if (component?.jsx) {
      await navigator.clipboard.writeText(component.jsx)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (component?.jsx) {
      const blob = new Blob([component.jsx], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${component.metadata?.name || "component"}.tsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "complex":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!component) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Component Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generate a component to see the preview</p>
              <p className="text-sm">Describe your UI component in the prompt form above</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {component.metadata?.name || "Generated Component"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {component.metadata && (
              <Badge variant="outline" className={getComplexityColor(component.metadata.complexity)}>
                {component.metadata.complexity}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          </div>
        </div>
        {component.metadata?.description && (
          <p className="text-sm text-muted-foreground">{component.metadata.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Badge className="h-4 w-4" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-medium">Live Preview</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {component.metadata?.framework || "React"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {component.metadata?.styling || "Tailwind"}
                  </Badge>
                </div>
              </div>
              
              {/* Sandboxed Preview */}
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                <div 
                  className="preview-container"
                  dangerouslySetInnerHTML={{ 
                    __html: `
                      <div id="preview-root">
                        <style>
                          /* Reset styles for preview */
                          * { box-sizing: border-box; }
                          body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
                        </style>
                        ${component.jsx.replace(/<script>/g, '').replace(/<\/script>/g, '')}
                      </div>
                    ` 
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Generated Code</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="text-xs"
                  >
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSave}
                    className="text-xs"
                  >
                    Save Component
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="tsx"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    fontSize: "12px",
                    lineHeight: "1.4",
                  }}
                >
                  {component.jsx}
                </SyntaxHighlighter>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Component Information</h4>
              
              {component.metadata ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{component.metadata.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Framework</label>
                    <Badge variant="outline" className="text-xs">
                      {component.metadata.framework}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Styling</label>
                    <Badge variant="outline" className="text-xs">
                      {component.metadata.styling}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Complexity</label>
                    <Badge className={`text-xs ${getComplexityColor(component.metadata.complexity)}`}>
                      {component.metadata.complexity}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <p className="text-sm text-muted-foreground">{component.metadata.description}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No metadata available for this component</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 