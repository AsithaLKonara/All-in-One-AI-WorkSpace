"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Settings, Eye, BookOpen, Code, MessageSquare } from "lucide-react"

interface PDFExporterProps {
  models: any
  roles: any[]
  user: any
}

export function PDFExporter({ models, roles, user }: PDFExporterProps) {
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    models: true,
    roles: true,
    prompts: false,
    conversations: false,
    settings: false,
  })

  const [exportSettings, setExportSettings] = useState({
    title: "Asvia AI Workspace Documentation",
    author: user?.name || "Anonymous",
    includeTimestamp: true,
    includeTableOfContents: true,
    format: "pdf",
  })

  const sections = [
    {
      id: "overview",
      title: "Platform Overview",
      description: "Introduction to Asvia and its capabilities",
      icon: <BookOpen className="h-4 w-4" />,
      pages: 2,
    },
    {
      id: "models",
      title: "AI Models",
      description: "Documentation of all integrated AI models",
      icon: <Settings className="h-4 w-4" />,
      pages: Object.keys(models).length * 2,
    },
    {
      id: "roles",
      title: "AI Roles",
      description: "Complete role definitions and use cases",
      icon: <Code className="h-4 w-4" />,
      pages: roles.length,
    },
    {
      id: "prompts",
      title: "Prompt Library",
      description: "Your custom prompts and templates",
      icon: <FileText className="h-4 w-4" />,
      pages: 5,
    },
    {
      id: "conversations",
      title: "Chat History",
      description: "Export of your conversation history",
      icon: <MessageSquare className="h-4 w-4" />,
      pages: 10,
    },
    {
      id: "settings",
      title: "Configuration",
      description: "Your workspace settings and preferences",
      icon: <Settings className="h-4 w-4" />,
      pages: 3,
    },
  ]

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const handleExport = () => {
    // Simulate PDF generation
    console.log("Exporting PDF with sections:", selectedSections)
    console.log("Export settings:", exportSettings)

    // In a real implementation, this would generate and download the PDF
    const selectedCount = Object.values(selectedSections).filter(Boolean).length
    alert(`Generating PDF with ${selectedCount} sections...`)
  }

  const handlePreview = () => {
    console.log("Opening preview...")
  }

  const totalPages = sections
    .filter((section) => selectedSections[section.id as keyof typeof selectedSections])
    .reduce((total, section) => total + section.pages, 0)

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PDF Exporter</h1>
            <p className="text-muted-foreground">Generate comprehensive documentation of your workspace</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleExport} disabled={totalPages === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>Configure your PDF export options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    value={exportSettings.title}
                    onChange={(e) => setExportSettings((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={exportSettings.author}
                    onChange={(e) => setExportSettings((prev) => ({ ...prev, author: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamp"
                    checked={exportSettings.includeTimestamp}
                    onCheckedChange={(checked) =>
                      setExportSettings((prev) => ({ ...prev, includeTimestamp: checked as boolean }))
                    }
                  />
                  <Label htmlFor="timestamp">Include timestamp</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="toc"
                    checked={exportSettings.includeTableOfContents}
                    onCheckedChange={(checked) =>
                      setExportSettings((prev) => ({ ...prev, includeTableOfContents: checked as boolean }))
                    }
                  />
                  <Label htmlFor="toc">Table of contents</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
              <CardDescription>Select which sections to include in your export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections[section.id as keyof typeof selectedSections]}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <div>
                          <Label htmlFor={section.id} className="font-medium cursor-pointer">
                            {section.title}
                          </Label>
                          <p className="text-sm text-muted-foreground">{section.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{section.pages} pages</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-80 border-l border-border p-6 bg-muted/20">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Export Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Selected Sections</span>
                  <span className="font-medium">
                    {Object.values(selectedSections).filter(Boolean).length} / {sections.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Pages</span>
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Format</span>
                  <span className="font-medium">PDF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">File Size</span>
                  <span className="font-medium">~{Math.ceil(totalPages * 0.5)}MB</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quick Templates</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    setSelectedSections({
                      overview: true,
                      models: true,
                      roles: true,
                      prompts: false,
                      conversations: false,
                      settings: false,
                    })
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Basic Documentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    setSelectedSections({
                      overview: true,
                      models: true,
                      roles: true,
                      prompts: true,
                      conversations: true,
                      settings: true,
                    })
                  }
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Complete Export
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() =>
                    setSelectedSections({
                      overview: false,
                      models: false,
                      roles: false,
                      prompts: true,
                      conversations: true,
                      settings: false,
                    })
                  }
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  User Data Only
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recent Exports</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Complete Export</span>
                  <span>2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Basic Documentation</span>
                  <span>1 week ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Prompt Library</span>
                  <span>2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
