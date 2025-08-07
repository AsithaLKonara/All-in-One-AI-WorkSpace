"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Star, 
  Package, 
  Download,
  Edit,
  Trash2,
  Heart,
  Grid3X3,
  List,
  Filter,
  Tag,
  Clock,
  Eye,
  Copy
} from "lucide-react"

interface Component {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  isFavorite: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  previewUrl?: string
  downloads: number
  rating: number
  author: string
  price?: number
}

interface ComponentLibraryProps {
  onComponentSelect: (component: Component) => void
  onSaveComponent: (component: Partial<Component>) => void
  onDeleteComponent: (id: string) => void
}

const SAMPLE_COMPONENTS: Component[] = [
  {
    id: "login-form-1",
    name: "Modern Login Form",
    description: "Clean login form with social login options",
    category: "forms",
    tags: ["authentication", "login", "social"],
    isFavorite: true,
    isPublic: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    downloads: 1247,
    rating: 4.8,
    author: "Design System"
  },
  {
    id: "dashboard-card-1",
    name: "Analytics Card",
    description: "Dashboard card with charts and metrics",
    category: "dashboard",
    tags: ["analytics", "charts", "metrics"],
    isFavorite: false,
    isPublic: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-10"),
    downloads: 892,
    rating: 4.6,
    author: "UI Library"
  },
  {
    id: "navigation-1",
    name: "Responsive Navigation",
    description: "Mobile-first navigation with dropdown menus",
    category: "navigation",
    tags: ["responsive", "mobile", "dropdown"],
    isFavorite: true,
    isPublic: false,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-12"),
    downloads: 567,
    rating: 4.9,
    author: "Your Library"
  },
  {
    id: "pricing-table-1",
    name: "Pricing Table",
    description: "Three-tier pricing table with features",
    category: "ecommerce",
    tags: ["pricing", "features", "comparison"],
    isFavorite: false,
    isPublic: true,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-08"),
    downloads: 445,
    rating: 4.7,
    author: "Marketplace"
  }
]

const CATEGORIES = [
  { id: "all", name: "All", count: 0 },
  { id: "forms", name: "Forms", count: 0 },
  { id: "dashboard", name: "Dashboard", count: 0 },
  { id: "navigation", name: "Navigation", count: 0 },
  { id: "ecommerce", name: "E-commerce", count: 0 },
  { id: "ui", name: "UI Elements", count: 0 }
]

export function ComponentLibrary({ 
  onComponentSelect, 
  onSaveComponent, 
  onDeleteComponent 
}: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("my-components")
  const [showFavorites, setShowFavorites] = useState(false)

  // Filter components based on search and category
  const filteredComponents = SAMPLE_COMPONENTS.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory
    const matchesFavorites = !showFavorites || component.isFavorite
    return matchesSearch && matchesCategory && matchesFavorites
  })

  const handleComponentAction = (action: string, component: Component) => {
    switch (action) {
      case "select":
        onComponentSelect(component)
        break
      case "edit":
        // Handle edit
        break
      case "delete":
        onDeleteComponent(component.id)
        break
      case "favorite":
        // Handle favorite toggle
        break
      case "copy":
        // Handle copy
        break
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Component Library
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Component
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={showFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="my-components">My Components</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="my-components" className="mt-4">
              <div className="space-y-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="text-xs"
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {filteredComponents.filter(c => category.id === "all" || c.category === category.id).length}
                      </Badge>
                    </Button>
                  ))}
                </div>

                {/* Components Grid/List */}
                <ScrollArea className="h-96">
                  <div className={`${
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                      : "space-y-2"
                  }`}>
                    {filteredComponents.map((component) => (
                      <Card
                        key={component.id}
                        className={`cursor-pointer hover:shadow-md transition-all ${
                          viewMode === "list" ? "flex items-center p-3" : ""
                        }`}
                        onClick={() => handleComponentAction("select", component)}
                      >
                        {viewMode === "grid" ? (
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Preview Placeholder */}
                              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <Eye className="h-8 w-8 text-muted-foreground" />
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{component.name}</h4>
                                  {component.isFavorite && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                  {component.description}
                                </p>
                                
                                <div className="flex items-center gap-2">
                                  {component.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {component.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{component.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{component.author}</span>
                                  <span>{component.downloads} downloads</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{component.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {component.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {component.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleComponentAction("favorite", component)
                                }}
                              >
                                <Heart className={`h-4 w-4 ${component.isFavorite ? "text-red-500 fill-current" : ""}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleComponentAction("copy", component)
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleComponentAction("edit", component)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Marketplace Coming Soon</h3>
                <p className="text-sm">Browse and install components from the community</p>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Favorites Yet</h3>
                <p className="text-sm">Star components to see them here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 