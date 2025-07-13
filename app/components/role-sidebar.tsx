"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Star, StarOff } from "lucide-react"

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

interface RoleSidebarProps {
  roles: Role[]
  activeRole: string
  onRoleChange: (roleId: string) => void
  onToggleFavorite: (roleId: string) => void
}

export function RoleSidebar({ roles, activeRole, onRoleChange, onToggleFavorite }: RoleSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(roles.map((role) => role.category)))]

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || role.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const favoriteRoles = filteredRoles.filter((role) => role.isFavorite)
  const otherRoles = filteredRoles.filter((role) => !role.isFavorite)

  return (
    <div className="w-80 border-r border-border bg-muted/30 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {favoriteRoles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </h3>
              <div className="space-y-2">
                {favoriteRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    isActive={activeRole === role.id}
                    onSelect={() => onRoleChange(role.id)}
                    onToggleFavorite={() => onToggleFavorite(role.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {otherRoles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">All Roles</h3>
              <div className="space-y-2">
                {otherRoles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    isActive={activeRole === role.id}
                    onSelect={() => onRoleChange(role.id)}
                    onToggleFavorite={() => onToggleFavorite(role.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function RoleCard({
  role,
  isActive,
  onSelect,
  onToggleFavorite,
}: {
  role: Role
  isActive: boolean
  onSelect: () => void
  onToggleFavorite: () => void
}) {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
        isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent border-border"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{role.icon}</span>
          <span className="font-medium text-sm">{role.name}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
        >
          {role.isFavorite ? <Star className="h-3 w-3 fill-current" /> : <StarOff className="h-3 w-3" />}
        </Button>
      </div>

      <p className={`text-xs mb-2 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {role.description}
      </p>

      <div className="flex items-center justify-between">
        <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
          {role.workspace === "coding" ? "Code" : "Chat"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {role.category}
        </Badge>
      </div>
    </div>
  )
}
