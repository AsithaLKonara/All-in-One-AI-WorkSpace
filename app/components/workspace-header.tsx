"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, User, LogOut, FileText, Download, Code, MessageSquare } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"

interface WorkspaceHeaderProps {
  user: any
  currentRole: any
  currentModel: any
  activeView: string
  onViewChange: (view: string) => void
  onLogin: () => void
  onLogout: () => void
  theme?: string
  onThemeChange?: (theme: string) => void
}

export function WorkspaceHeader({
  user,
  currentRole,
  currentModel,
  activeView,
  onViewChange,
  onLogin,
  onLogout,
  theme,
  onThemeChange,
}: WorkspaceHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="text-xl font-bold">Asvia</span>
          <Badge variant="secondary" className="ml-2">
            Beta
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant={activeView === "workspace" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("workspace")}
            className="flex items-center space-x-2"
          >
            {currentRole?.workspace === "coding" ? <Code className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            <span>Workspace</span>
          </Button>
          <Button
            variant={activeView === "prompts" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("prompts")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Prompts
          </Button>
          <Button variant={activeView === "pdf" ? "default" : "ghost"} size="sm" onClick={() => onViewChange("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {currentRole && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
            <span className="text-lg">{currentRole.icon}</span>
            <span className="text-sm font-medium">{currentRole.name}</span>
            <div className={`w-2 h-2 ${currentModel?.color} rounded-full`}></div>
          </div>
        )}

        <ThemeSwitcher variant="icon" size="sm" />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewChange("profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("prompts")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={onLogin}>Sign In</Button>
        )}
      </div>
    </header>
  )
}
