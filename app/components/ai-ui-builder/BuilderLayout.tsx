"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Code, 
  Palette, 
  Eye, 
  Rocket, 
  Brain,
  Settings,
  Bell,
  User,
  Plus,
  Grid3X3,
  Package,
  History,
  Zap,
  Moon,
  Sun,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"

interface BuilderLayoutProps {
  children: React.ReactNode
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState("workspace")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark")

  const tabs = [
    { id: "workspace", label: "Workspace", icon: Grid3X3 },
    { id: "library", label: "Library", icon: Package },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "deploy", label: "Deploy", icon: Rocket },
    { id: "ai-tools", label: "AI Tools", icon: Brain },
  ]

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // Apply theme to document
    const root = document.documentElement
    root.classList.remove("light", "dark")
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(newTheme)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Sticky Top Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h1 className="text-lg font-bold">AI UI Builder</h1>
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </div>
          </div>

          {/* Center Section - Tabs */}
          <div className="flex items-center">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
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
                <Monitor className="h-3 w-3" />
              </Button>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`border-r bg-muted/50 transition-all duration-300 ${
          sidebarCollapsed ? "w-12" : "w-64"
        }`}>
          <div className="p-4 space-y-4">
            {/* Add Component Button */}
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {!sidebarCollapsed && "Add Component"}
            </Button>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                <div className="space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Code className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Import from Library
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <History className="h-4 w-4 mr-2" />
                    Recent Components
                  </Button>
                </div>
              </div>
            )}

            {/* Component Palette */}
            {!sidebarCollapsed && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Button", "Input", "Card", "Table", "Modal", "Nav", "Form", "List"].map((component) => (
                    <Button
                      key={component}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                    >
                      {component}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Canvas */}
          <div className="flex-1 bg-background p-4 overflow-auto">
            {children}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className={`border-l bg-muted/50 transition-all duration-300 ${
          rightSidebarCollapsed ? "w-12" : "w-80"
        }`}>
          <div className="p-4 space-y-4">
            {/* Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              className="w-full"
            >
              {rightSidebarCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Collapse
                </>
              )}
            </Button>

            {!rightSidebarCollapsed && (
              <Tabs defaultValue="props" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="props">Props</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="ai">AI Tools</TabsTrigger>
                </TabsList>

                <TabsContent value="props" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Component Properties</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Text</label>
                        <input
                          type="text"
                          placeholder="Enter text..."
                          className="w-full px-2 py-1 text-xs border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Variant</label>
                        <select className="w-full px-2 py-1 text-xs border rounded">
                          <option>Default</option>
                          <option>Primary</option>
                          <option>Secondary</option>
                          <option>Destructive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Tailwind Classes</h3>
                    <textarea
                      placeholder="Enter Tailwind classes..."
                      className="w-full h-24 px-2 py-1 text-xs border rounded resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" className="text-xs">Apply</Button>
                      <Button size="sm" variant="outline" className="text-xs">Reset</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">AI Tools</h3>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Fix Code
                      </Button>
                      <Button size="sm" className="w-full text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        Explain
                      </Button>
                      <Button size="sm" className="w-full text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Optimize
                      </Button>
                      <Button size="sm" className="w-full text-xs">
                        <Code className="h-3 w-3 mr-1" />
                        Generate Tests
                      </Button>
                      <Button size="sm" className="w-full text-xs">
                        <Palette className="h-3 w-3 mr-1" />
                        Document
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 