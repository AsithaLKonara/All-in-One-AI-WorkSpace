"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, Save, FolderOpen, File, Plus, X, Terminal, Eye, Code2 } from "lucide-react"

interface CodingWorkspaceProps {
  role: any
  model: any
  user: any
}

interface FileTab {
  id: string
  name: string
  content: string
  language: string
  isModified: boolean
}

export function CodingWorkspace({ role, model, user }: CodingWorkspaceProps) {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: "1",
      name: "app.tsx",
      content: `import React from 'react'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hello, Asvia!</h1>
      <p className="text-muted-foreground">
        Start coding with ${role.name} powered by ${model.name}
      </p>
    </div>
  )
}

export default App`,
      language: "typescript",
      isModified: false,
    },
  ])

  const [activeFileId, setActiveFileId] = useState("1")
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "Welcome to Asvia Coding Workspace",
    `Active Role: ${role.name}`,
    `AI Model: ${model.name}`,
    "Ready to code!",
  ])
  const [previewContent, setPreviewContent] = useState("")

  const editorRef = useRef<HTMLTextAreaElement>(null)

  const activeFile = files.find((f) => f.id === activeFileId) || files[0]

  const handleFileContentChange = (content: string) => {
    setFiles((prev) => prev.map((file) => (file.id === activeFileId ? { ...file, content, isModified: true } : file)))
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setConsoleOutput((prev) => [...prev, `Running ${activeFile.name}...`])

    setTimeout(() => {
      setConsoleOutput((prev) => [...prev, "Code executed successfully!"])
      setPreviewContent(activeFile.content)
      setIsRunning(false)
    }, 1000)
  }

  const handleSaveFile = () => {
    setFiles((prev) => prev.map((file) => (file.id === activeFileId ? { ...file, isModified: false } : file)))
    setConsoleOutput((prev) => [...prev, `Saved ${activeFile.name}`])
  }

  const handleNewFile = () => {
    const newFile: FileTab = {
      id: Date.now().toString(),
      name: "untitled.tsx",
      content: "// New file\n",
      language: "typescript",
      isModified: false,
    }
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  const handleCloseFile = (fileId: string) => {
    if (files.length === 1) return

    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFileId === fileId) {
      setActiveFileId(files[0].id === fileId ? files[1].id : files[0].id)
    }
  }

  const handleClearConsole = () => {
    setConsoleOutput([])
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
            {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Stop" : "Run"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleSaveFile}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleNewFile}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 ${model.color} rounded-full`}></div>
            <span>{model.name}</span>
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer */}
        <div className="w-64 border-r border-border bg-muted/20">
          <div className="p-3 border-b border-border">
            <h3 className="text-sm font-semibold flex items-center">
              <FolderOpen className="h-4 w-4 mr-2" />
              Files
            </h3>
          </div>
          <ScrollArea className="h-full">
            <div className="p-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                    activeFileId === file.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    {file.isModified && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                  </div>
                  {files.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloseFile(file.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="h-10 border-b border-border flex items-center bg-muted/10">
            <div className="flex">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-2 px-4 py-2 border-r border-border cursor-pointer ${
                    activeFileId === file.id ? "bg-background" : "hover:bg-accent"
                  }`}
                  onClick={() => setActiveFileId(file.id)}
                >
                  <span className="text-sm">{file.name}</span>
                  {file.isModified && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                  {files.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloseFile(file.id)
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4">
                <textarea
                  ref={editorRef}
                  value={activeFile.content}
                  onChange={(e) => handleFileContentChange(e.target.value)}
                  className="w-full h-full resize-none bg-transparent border-none outline-none font-mono text-sm"
                  placeholder="Start coding..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="w-1/2 border-l border-border">
              <Tabs defaultValue="preview" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </TabsTrigger>
                  <TabsTrigger value="console" className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4" />
                    <span>Console</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="flex-1 m-0">
                  <div className="h-full bg-white border rounded-lg m-4 p-4 overflow-auto">
                    {previewContent ? (
                      <div className="prose max-w-none">
                        <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                          <code>{previewContent}</code>
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Run your code to see the preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="console" className="flex-1 m-0">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b border-border">
                      <span className="text-sm font-medium">Console Output</span>
                      <Button size="sm" variant="outline" onClick={handleClearConsole}>
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-1 font-mono text-sm">
                        {consoleOutput.map((line, index) => (
                          <div key={index} className="text-muted-foreground">
                            <span className="text-primary mr-2">$</span>
                            {line}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
