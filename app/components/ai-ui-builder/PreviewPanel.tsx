"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Sun, 
  Moon, 
  Monitor as MonitorIcon,
  RefreshCw,
  Download,
  Share2,
  Copy,
  Check,
  Play,
  Pause
} from "lucide-react"

interface PreviewPanelProps {
  elements: any[]
  onRefresh: () => void
  onExport: () => void
}

export function PreviewPanel({ elements, onRefresh, onExport }: PreviewPanelProps) {
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // Apply theme to preview
    const previewElement = document.getElementById("preview-container")
    if (previewElement) {
      previewElement.className = `preview-container ${newTheme}`
    }
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getDeviceStyles = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-sm mx-auto border-8 border-gray-800 rounded-3xl"
      case "tablet":
        return "max-w-md mx-auto border-8 border-gray-800 rounded-2xl"
      case "desktop":
        return "max-w-4xl mx-auto border-2 border-gray-300 rounded-lg"
      default:
        return "max-w-4xl mx-auto"
    }
  }

  const renderPreview = () => {
    if (elements.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Components</h3>
            <p className="text-sm">Add components to your workspace to see the preview</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {elements.map((element) => {
          switch (element.type) {
            case "button":
              return (
                <button key={element.id} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  {element.props.text || "Button"}
                </button>
              )
            case "input":
              return (
                <input
                  key={element.id}
                  type={element.props.type || "text"}
                  placeholder={element.props.placeholder || "Enter text..."}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              )
            case "card":
              return (
                <div key={element.id} className="p-4 border rounded-lg shadow-sm">
                  <h3 className="font-medium mb-2">{element.props.title || "Card Title"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {element.props.content || "Card content..."}
                  </p>
                </div>
              )
            case "table":
              return (
                <div key={element.id} className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        {element.props.headers?.map((header: string, index: number) => (
                          <th key={index} className="px-4 py-2 text-left text-sm font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: element.props.rows || 3 }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {element.props.headers?.map((header: string, colIndex: number) => (
                            <td key={colIndex} className="px-4 py-2 text-sm">
                              {`${header} ${rowIndex + 1}`}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            default:
              return (
                <div key={element.id} className="p-4 border rounded-lg bg-muted">
                  <span className="text-sm font-medium">{element.name}</span>
                </div>
              )
          }
        })}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy URL"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Device Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Device:</span>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={deviceView === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceView("mobile")}
                  className="h-7 w-7 p-0"
                >
                  <Smartphone className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceView === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceView("tablet")}
                  className="h-7 w-7 p-0"
                >
                  <Tablet className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceView === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceView("desktop")}
                  className="h-7 w-7 p-0"
                >
                  <Monitor className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Theme:</span>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={theme === "light" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  className="h-7 w-7 p-0"
                >
                  <Sun className="h-3 w-3" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  className="h-7 w-7 p-0"
                >
                  <Moon className="h-3 w-3" />
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  className="h-7 w-7 p-0"
                >
                  <MonitorIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Animation Toggle */}
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>

          {/* Preview Area */}
          <div className="border rounded-lg overflow-hidden">
            <div className={`${getDeviceStyles()} bg-white`}>
              <div 
                id="preview-container"
                className={`preview-container ${theme} min-h-[400px]`}
              >
                {renderPreview()}
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Device: {deviceView}</span>
              <span>Theme: {theme}</span>
              <span>Components: {elements.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {deviceView === "mobile" ? "375px" : deviceView === "tablet" ? "768px" : "Full"}
              </Badge>
              <Badge variant="outline">
                {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 