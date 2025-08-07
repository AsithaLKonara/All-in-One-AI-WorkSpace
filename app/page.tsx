"use client"

import { useState, useEffect } from "react"
import LandingPage from "./components/landing-page"
import { WorkspaceHeader } from "./components/workspace-header"
import { RoleSidebar } from "./components/role-sidebar"
import { CodingWorkspace } from "./components/coding-workspace"
import { ChatWorkspace } from "./components/chat-workspace"
import { ProfileSettings } from "./components/profile-settings"
import { PromptManagement } from "./components/prompt-management"
import { AuthModal } from "./components/auth-modal"
import { PDFExporter } from "./components/pdf-exporter"
import { useTheme } from "next-themes"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AIModel {
  id: string
  name: string
  description: string
  category: string
  capabilities: string[]
  tools: any[]
  color: string
  systemPrompt: string
  isLocal: boolean
  apiEndpoint?: string
}

interface Role {
  id: string
  name: string
  icon: string
  description: string
  aiModel: string
  workspace: "coding" | "chat"
  isFavorite: boolean
  category: string
}

export default function AsviaWorkspace() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [activeRole, setActiveRole] = useState<string>("v0-developer")
  const [activeView, setActiveView] = useState<"landing" | "workspace" | "profile" | "prompts" | "pdf">("landing")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUser = localStorage.getItem("asvia-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setActiveView("workspace")
    }
  }, [])

  const aiModels: Record<string, AIModel> = {
    v0: {
      id: "v0",
      name: "v0 by Vercel",
      description: "React/Next.js UI generation specialist",
      category: "UI Development",
      capabilities: ["React Components", "Next.js Apps", "shadcn/ui", "Tailwind CSS", "TypeScript"],
      tools: ["generateText", "streamText", "createComponent", "previewComponent"],
      color: "bg-black",
      systemPrompt:
        "You are v0, Vercel's AI-powered assistant specialized in creating React components and Next.js applications with modern best practices.",
      isLocal: false,
      apiEndpoint: "/api/v0",
    },
    cursor: {
      id: "cursor",
      name: "Cursor Agent",
      description: "Advanced code editing and refactoring",
      category: "Code Editor",
      capabilities: ["Code Analysis", "Refactoring", "Multi-file Editing", "Terminal Access", "Git Integration"],
      tools: ["editFile", "searchReplace", "runCommand", "analyzeCode"],
      color: "bg-blue-600",
      systemPrompt:
        "You are Cursor, an AI coding assistant that excels at code editing, refactoring, and development workflows.",
      isLocal: false,
      apiEndpoint: "/api/cursor",
    },
    bolt: {
      id: "bolt",
      name: "Bolt",
      description: "Full-stack development in WebContainer",
      category: "Full-Stack",
      capabilities: ["WebContainer", "Full-Stack Apps", "Package Management", "Live Preview", "Deployment"],
      tools: ["createProject", "installPackages", "runServer", "deployApp"],
      color: "bg-orange-500",
      systemPrompt:
        "You are Bolt, a full-stack development assistant that can create complete applications in a WebContainer environment.",
      isLocal: false,
      apiEndpoint: "/api/bolt",
    },
    lovable: {
      id: "lovable",
      name: "Lovable",
      description: "AI editor for web applications",
      category: "Web Development",
      capabilities: ["Web Apps", "Component Library", "Design System", "Responsive Design", "Animation"],
      tools: ["createWebApp", "designComponent", "animateElement", "optimizePerformance"],
      color: "bg-pink-500",
      systemPrompt: "You are Lovable, an AI assistant focused on creating beautiful and functional web applications.",
      isLocal: false,
      apiEndpoint: "/api/lovable",
    },
    devin: {
      id: "devin",
      name: "Devin AI",
      description: "Autonomous software engineering",
      category: "Software Engineering",
      capabilities: ["Autonomous Development", "System Architecture", "Testing", "Debugging", "Documentation"],
      tools: ["planProject", "writeTests", "debugCode", "generateDocs"],
      color: "bg-purple-600",
      systemPrompt:
        "You are Devin, an autonomous software engineer capable of planning, building, and maintaining complex software systems.",
      isLocal: false,
      apiEndpoint: "/api/devin",
    },
    claude: {
      id: "claude",
      name: "Claude",
      description: "Anthropic's helpful AI assistant",
      category: "General AI",
      capabilities: ["Analysis", "Writing", "Reasoning", "Code Review", "Research"],
      tools: ["analyzeText", "writeContent", "reviewCode", "research"],
      color: "bg-amber-600",
      systemPrompt: "You are Claude, Anthropic's AI assistant focused on being helpful, harmless, and honest.",
      isLocal: false,
      apiEndpoint: "/api/claude",
    },
    llama: {
      id: "llama",
      name: "LLaMA Local",
      description: "Local open-source language model",
      category: "Local AI",
      capabilities: ["Local Processing", "Privacy", "Offline Mode", "Customizable", "Open Source"],
      tools: ["generateLocal", "customizeModel", "trainModel"],
      color: "bg-green-600",
      systemPrompt:
        "You are LLaMA, a local open-source language model running on the user's device for privacy and offline capabilities.",
      isLocal: true,
      apiEndpoint: "/api/llama",
    },
    gpt4free: {
      id: "gpt4free",
      name: "GPT-4 Free",
      description: "Free GPT-4 access via open APIs",
      category: "Free AI",
      capabilities: ["GPT-4 Access", "Free Usage", "Multiple Providers", "Rate Limited", "Community Driven"],
      tools: ["generateFree", "switchProvider", "checkLimits"],
      color: "bg-emerald-500",
      systemPrompt: "You are GPT-4 Free, providing access to GPT-4 capabilities through free community APIs.",
      isLocal: false,
      apiEndpoint: "/api/gpt4free",
    },
  }

  const roles: Role[] = [
    {
      id: "v0-developer",
      name: "UI Developer",
      icon: "⚛️",
      description: "Create React components and Next.js apps",
      aiModel: "v0",
      workspace: "coding",
      isFavorite: true,
      category: "Development",
    },
    {
      id: "cursor-editor",
      name: "Code Editor",
      icon: "📝",
      description: "Advanced code editing and refactoring",
      aiModel: "cursor",
      workspace: "coding",
      isFavorite: true,
      category: "Development",
    },
    {
      id: "bolt-fullstack",
      name: "Full-Stack Dev",
      icon: "🔧",
      description: "Complete application development",
      aiModel: "bolt",
      workspace: "coding",
      isFavorite: false,
      category: "Development",
    },
    {
      id: "lovable-designer",
      name: "Web Designer",
      icon: "🎨",
      description: "Beautiful web application design",
      aiModel: "lovable",
      workspace: "coding",
      isFavorite: false,
      category: "Design",
    },
    {
      id: "devin-engineer",
      name: "Software Engineer",
      icon: "🤖",
      description: "Autonomous software engineering",
      aiModel: "devin",
      workspace: "chat",
      isFavorite: false,
      category: "Engineering",
    },
    {
      id: "claude-assistant",
      name: "AI Assistant",
      icon: "🧠",
      description: "General purpose AI help",
      aiModel: "claude",
      workspace: "chat",
      isFavorite: true,
      category: "Assistant",
    },
    {
      id: "llama-local",
      name: "Local AI",
      icon: "🏠",
      description: "Private local AI processing",
      aiModel: "llama",
      workspace: "chat",
      isFavorite: false,
      category: "Privacy",
    },
    {
      id: "gpt4-free",
      name: "GPT-4 Free",
      icon: "🆓",
      description: "Free GPT-4 access",
      aiModel: "gpt4free",
      workspace: "chat",
      isFavorite: false,
      category: "Free",
    },
  ]

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0]
  const currentModel = aiModels[currentRole.aiModel]

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("asvia-user", JSON.stringify(userData))
    setShowAuthModal(false)
    setActiveView("workspace")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("asvia-user")
    setActiveView("landing")
  }

  const toggleFavorite = (roleId: string) => {
    console.log("Toggle favorite for role:", roleId)
  }

  if (!mounted) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (activeView === "landing") {
    return (
      <LandingPage
        onWorkspaceReady={() => setActiveView("workspace")}
      />
    )
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <WorkspaceHeader
        user={user}
        currentRole={currentRole}
        currentModel={currentModel}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        theme={theme}
        onThemeChange={setTheme}
      />

      <div className="flex-1 flex overflow-hidden">
        <RoleSidebar
          roles={roles}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onToggleFavorite={toggleFavorite}
        />

        <main className="flex-1 overflow-hidden">
          {activeView === "workspace" && (
            <>
              {currentRole.workspace === "coding" ? (
                <CodingWorkspace role={currentRole} model={currentModel} user={user} />
              ) : (
                <ChatWorkspace role={currentRole} model={currentModel} user={user} />
              )}
            </>
          )}

          {activeView === "profile" && (
            <ProfileSettings user={user} onUserUpdate={setUser} onLogin={() => setShowAuthModal(true)} />
          )}

          {activeView === "prompts" && <PromptManagement models={aiModels} roles={roles} user={user} />}

          {activeView === "pdf" && <PDFExporter models={aiModels} roles={roles} user={user} />}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
    </div>
  )
}
