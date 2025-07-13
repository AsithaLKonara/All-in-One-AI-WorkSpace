"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Plus, Trash2, Calendar, User, Star } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  type: string
  lastModified: string
  author: string
  starred: boolean
  status: "active" | "archived" | "draft"
}

interface ProjectManagerProps {
  currentProject: Project | null
  onProjectChange: (project: Project | null) => void
}

export function ProjectManager({ currentProject, onProjectChange }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Dashboard",
      description: "React dashboard with analytics",
      type: "React App",
      lastModified: "2 hours ago",
      author: "You",
      starred: true,
      status: "active",
    },
    {
      id: "2",
      name: "Landing Page",
      description: "Marketing website with animations",
      type: "Next.js",
      lastModified: "1 day ago",
      author: "You",
      starred: false,
      status: "active",
    },
    {
      id: "3",
      name: "API Documentation",
      description: "REST API docs with examples",
      type: "Documentation",
      lastModified: "3 days ago",
      author: "Team",
      starred: false,
      status: "draft",
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "React App",
  })

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        type: newProject.type,
        lastModified: "Just now",
        author: "You",
        starred: false,
        status: "active",
      }
      setProjects([project, ...projects])
      setNewProject({ name: "", description: "", type: "React App" })
      setIsCreateDialogOpen(false)
      onProjectChange(project)
    }
  }

  const toggleStar = (projectId: string) => {
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, starred: !p.starred } : p)))
  }

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
    if (currentProject?.id === projectId) {
      onProjectChange(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-yellow-100 text-yellow-700"
      case "archived":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-gray-600" />
            <h3 className="font-semibold text-sm text-gray-700">Projects</h3>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Start a new project with your preferred framework</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="My Awesome Project"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of your project"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Project Type</label>
                  <Select
                    value={newProject.type}
                    onValueChange={(value) => setNewProject({ ...newProject, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React App">React App</SelectItem>
                      <SelectItem value="Next.js">Next.js</SelectItem>
                      <SelectItem value="Vue.js">Vue.js</SelectItem>
                      <SelectItem value="Svelte">Svelte</SelectItem>
                      <SelectItem value="Node.js">Node.js</SelectItem>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateProject} className="flex-1">
                    Create Project
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-xs text-gray-500">{projects.length} projects</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {projects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm mb-2">No projects yet</p>
              <p className="text-xs">Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  currentProject?.id === project.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => onProjectChange(project)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{project.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(project.id)
                        }}
                      >
                        <Star
                          className={`h-3 w-3 ${project.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteProject(project.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {project.type}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{project.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{project.lastModified}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
