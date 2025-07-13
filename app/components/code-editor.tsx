"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Save, Play, Code, Eye, EyeOff } from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  content?: string
}

interface CodeEditorProps {
  file: FileItem | null
  onFileChange: (file: FileItem) => void
}

export function CodeEditor({ file, onFileChange }: CodeEditorProps) {
  const [content, setContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  useEffect(() => {
    if (file?.content) {
      setContent(file.content)
      updateLineNumbers(file.content)
    } else {
      setContent("")
      setLineNumbers([])
    }
  }, [file])

  const updateLineNumbers = (text: string) => {
    const lines = text.split("\n").length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    updateLineNumbers(newContent)

    if (file) {
      const updatedFile = { ...file, content: newContent }
      onFileChange(updatedFile)
    }
  }

  const getLanguage = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
        return "javascript"
      case "ts":
        return "typescript"
      case "jsx":
      case "tsx":
        return "typescript"
      case "css":
        return "css"
      case "html":
        return "html"
      case "json":
        return "json"
      default:
        return "text"
    }
  }

  const renderPreview = () => {
    if (!file) return null

    const language = getLanguage(file.name)

    if (language === "typescript" && content.includes("export default")) {
      return (
        <div className="p-4 bg-white border rounded-lg">
          <div className="text-sm text-gray-600 mb-2">React Component Preview</div>
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-center text-gray-500">Component preview would render here</div>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4">
        <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto">
          <code>{content}</code>
        </pre>
      </div>
    )
  }

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Code className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{getLanguage(file.name)}</Badge>
          <span className="text-sm text-gray-600">{file.path}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className={isPreview ? "bg-blue-100 text-blue-700" : ""}
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <ScrollArea className="h-full">{renderPreview()}</ScrollArea>
        ) : (
          <div className="h-full flex">
            <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="py-2">
                  {lineNumbers.map((num) => (
                    <div key={num} className="h-6 flex items-center justify-center text-xs text-gray-500 font-mono">
                      {num}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none"
                placeholder="Start typing..."
                spellCheck={false}
                style={{
                  lineHeight: "1.5",
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
