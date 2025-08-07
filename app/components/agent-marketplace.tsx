"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Plus, 
  Star, 
  Download, 
  Share2, 
  Bot,
  Sparkles,
  Users,
  MessageSquare,
  Settings,
  Heart,
  Eye
} from "lucide-react"
import { useAuth } from "@/app/contexts/auth-context"

interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  model: string
  tools: string[]
  avatar?: string
  category: string
  isPublic: boolean
  isFavorite: boolean
  usageCount: number
  rating: number
  creator: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  updatedAt: string
}

export function AgentMarketplace() {
  const { user } = useAuth()
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "all",
    "general",
    "development",
    "research",
    "creative",
    "business",
    "education",
    "entertainment"
  ]

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Recently Created" },
    { value: "rating", label: "Highest Rated" },
    { value: "usage", label: "Most Used" }
  ]

  useEffect(() => {
    // Simulate loading agents
    const mockAgents: Agent[] = [
      {
        id: "1",
        name: "Code Assistant",
        description: "Specialized in helping with programming tasks, debugging, and code optimization",
        systemPrompt: "You are an expert software developer...",
        model: "gpt-4",
        tools: ["code-execution", "file-operations"],
        category: "development",
        isPublic: true,
        isFavorite: false,
        usageCount: 1250,
        rating: 4.8,
        creator: {
          id: "user1",
          name: "Alex Chen",
          image: "/placeholder-user.jpg"
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-20T14:45:00Z"
      },
      {
        id: "2",
        name: "Research Analyst",
        description: "Expert at analyzing data, conducting research, and generating insights",
        systemPrompt: "You are a research analyst...",
        model: "claude-3-sonnet",
        tools: ["web-search", "database-access"],
        category: "research",
        isPublic: true,
        isFavorite: true,
        usageCount: 890,
        rating: 4.9,
        creator: {
          id: "user2",
          name: "Sarah Johnson",
          image: "/placeholder-user.jpg"
        },
        createdAt: "2024-01-10T09:15:00Z",
        updatedAt: "2024-01-18T16:20:00Z"
      },
      {
        id: "3",
        name: "Creative Writer",
        description: "Helps with creative writing, storytelling, and content generation",
        systemPrompt: "You are a creative writer...",
        model: "gpt-4",
        tools: ["image-generation"],
        category: "creative",
        isPublic: true,
        isFavorite: false,
        usageCount: 650,
        rating: 4.7,
        creator: {
          id: "user3",
          name: "Mike Rodriguez",
          image: "/placeholder-user.jpg"
        },
        createdAt: "2024-01-12T11:00:00Z",
        updatedAt: "2024-01-19T13:30:00Z"
      }
    ]

    setAgents(mockAgents)
    setFilteredAgents(mockAgents)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let filtered = agents

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(agent => agent.category === selectedCategory)
    }

    // Sort agents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.usageCount - a.usageCount
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "rating":
          return b.rating - a.rating
        case "usage":
          return b.usageCount - a.usageCount
        default:
          return 0
      }
    })

    setFilteredAgents(filtered)
  }, [agents, searchQuery, selectedCategory, sortBy])

  const handleFavorite = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, isFavorite: !agent.isFavorite } : agent
    ))
  }

  const handleUseAgent = (agent: Agent) => {
    // Navigate to chat with this agent
    console.log("Using agent:", agent.name)
  }

  const handleShareAgent = (agent: Agent) => {
    // Share agent functionality
    navigator.clipboard.writeText(`${window.location.origin}/agent/${agent.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agent Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and use AI agents created by the community
            </p>
          </div>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="all" className="h-full">
          <TabsList>
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="my-agents">My Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className="card-enhanced hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={agent.avatar} />
                          <AvatarFallback>
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>{agent.description}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFavorite(agent.id)}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            agent.isFavorite ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{agent.category}</Badge>
                        <Badge variant="outline">{agent.model}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{agent.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{agent.usageCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={agent.creator.image} />
                            <AvatarFallback>
                              {agent.creator.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{agent.creator.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleUseAgent(agent)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Use Agent
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareAgent(agent)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or create a new agent.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your Favorites</h3>
              <p className="text-muted-foreground">
                Agents you've favorited will appear here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="my-agents" className="mt-4">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Agents</h3>
              <p className="text-muted-foreground">
                Agents you've created will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 