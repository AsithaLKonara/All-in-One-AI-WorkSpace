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
  Clock, 
  Code, 
  Palette, 
  Layout, 
  FormInput,
  Navigation,
  MessageSquare,
  ShoppingCart,
  User,
  Settings,
  Heart,
  Bookmark,
  Trash2
} from "lucide-react"

interface Component {
  id: string
  name: string
  description: string
  category: string
  jsx: string
  metadata: {
    framework: string
    styling: string
    complexity: string
    tags: string[]
  }
  isFavorite: boolean
  createdAt: string
}

interface SidebarProps {
  onComponentSelect: (component: Component) => void
  onNewComponent: () => void
}

const SAMPLE_COMPONENTS: Component[] = [
  {
    id: "login-form",
    name: "Login Form",
    description: "Modern login form with email and password fields",
    category: "forms",
    jsx: `<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
    </div>
    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
      Sign In
    </button>
  </form>
</div>`,
    metadata: {
      framework: "React",
      styling: "Tailwind CSS",
      complexity: "simple",
      tags: ["form", "authentication", "login"]
    },
    isFavorite: false,
    createdAt: "2024-01-01"
  },
  {
    id: "navigation-header",
    name: "Navigation Header",
    description: "Responsive navigation header with logo and menu",
    category: "navigation",
    jsx: `<header className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Logo</h1>
        </div>
        <nav className="hidden md:ml-6 md:flex space-x-8">
          <a href="#" className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium">Home</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">About</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Services</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  </div>
</header>`,
    metadata: {
      framework: "React",
      styling: "Tailwind CSS",
      complexity: "medium",
      tags: ["navigation", "header", "responsive"]
    },
    isFavorite: true,
    createdAt: "2024-01-02"
  },
  {
    id: "product-card",
    name: "Product Card",
    description: "Product card with image, title, price, and add to cart",
    category: "ecommerce",
    jsx: `<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="aspect-w-1 aspect-h-1 w-full">
    <img src="https://via.placeholder.com/300x200" alt="Product" className="w-full h-48 object-cover" />
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Name</h3>
    <p className="text-gray-600 text-sm mb-3">Product description goes here with some details about the item.</p>
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold text-gray-900">$29.99</span>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>
  </div>
</div>`,
    metadata: {
      framework: "React",
      styling: "Tailwind CSS",
      complexity: "simple",
      tags: ["ecommerce", "product", "card"]
    },
    isFavorite: false,
    createdAt: "2024-01-03"
  },
  {
    id: "dashboard-sidebar",
    name: "Dashboard Sidebar",
    description: "Dashboard sidebar with navigation links and icons",
    category: "dashboard",
    jsx: `<div className="bg-gray-900 text-white w-64 min-h-screen p-4">
  <div className="mb-8">
    <h2 className="text-xl font-bold">Dashboard</h2>
  </div>
  <nav className="space-y-2">
    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-gray-800 text-white">
      <Layout className="h-5 w-5" />
      <span>Overview</span>
    </a>
    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
      <User className="h-5 w-5" />
      <span>Users</span>
    </a>
    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
      <ShoppingCart className="h-5 w-5" />
      <span>Orders</span>
    </a>
    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
      <MessageSquare className="h-5 w-5" />
      <span>Messages</span>
    </a>
    <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white">
      <Settings className="h-5 w-5" />
      <span>Settings</span>
    </a>
  </nav>
</div>`,
    metadata: {
      framework: "React",
      styling: "Tailwind CSS",
      complexity: "medium",
      tags: ["dashboard", "sidebar", "navigation"]
    },
    isFavorite: true,
    createdAt: "2024-01-04"
  }
]

const CATEGORIES = [
  { id: "all", name: "All", icon: Code },
  { id: "forms", name: "Forms", icon: FormInput },
  { id: "navigation", name: "Navigation", icon: Navigation },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
  { id: "dashboard", name: "Dashboard", icon: Layout },
  { id: "ui", name: "UI Elements", icon: Palette }
]

export function Sidebar({ onComponentSelect, onNewComponent }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("saved")

  const filteredComponents = SAMPLE_COMPONENTS.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || component.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId)
    return category?.icon || Code
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Components</span>
          <Button size="sm" onClick={onNewComponent}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <h4 className="text-sm font-medium">My Components</h4>
                <Badge variant="outline" className="text-xs">
                  {SAMPLE_COMPONENTS.filter(c => c.isFavorite).length}
                </Badge>
              </div>
              
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 p-4">
                  {SAMPLE_COMPONENTS.filter(c => c.isFavorite).map((component) => (
                    <div
                      key={component.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onComponentSelect(component)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{component.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {component.metadata.framework}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {component.metadata.complexity}
                            </Badge>
                          </div>
                        </div>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="samples" className="mt-4">
            <div className="space-y-2">
              {/* Category Filter */}
              <div className="px-4">
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="text-xs"
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {category.name}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2 p-4">
                  {filteredComponents.map((component) => {
                    const CategoryIcon = getCategoryIcon(component.category)
                    return (
                      <div
                        key={component.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onComponentSelect(component)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-4 w-4 text-gray-500" />
                              <h5 className="font-medium text-sm">{component.name}</h5>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {component.metadata.framework}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {component.metadata.complexity}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(component.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {filteredComponents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p className="text-sm">No components found</p>
                      <p className="text-xs">Try adjusting your search or category filter</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 