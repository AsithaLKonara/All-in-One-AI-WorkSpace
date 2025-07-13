"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContrastIcon as Compare, Download, Star, Users, Clock } from "lucide-react"

export function PromptComparison() {
  const [selectedPrompt1, setSelectedPrompt1] = useState("")
  const [selectedPrompt2, setSelectedPrompt2] = useState("")

  const prompts = [
    { value: "v0-web", label: "v0 Web Development Assistant" },
    { value: "cursor-code", label: "Cursor Code Assistant" },
    { value: "bolt-fullstack", label: "Bolt Full-Stack Builder" },
    { value: "cline-terminal", label: "Cline Terminal Assistant" },
    { value: "replit-collab", label: "Replit Collaborative Coder" },
    { value: "windsurf-pair", label: "Windsurf AI Pair Programmer" },
  ]

  const comparisonData = {
    "v0-web": {
      name: "v0 Web Development Assistant",
      platform: "v0",
      rating: 4.9,
      users: 15000,
      lastUpdated: "2024-01-15",
      strengths: ["React/Next.js expertise", "shadcn/ui integration", "TypeScript support", "Responsive design"],
      weaknesses: ["Limited to web development", "Requires specific syntax"],
      features: ["Component generation", "Code editing", "Asset management", "Real-time preview"],
      complexity: "Advanced",
      tokenUsage: "High",
      responseTime: "Fast",
    },
    "cursor-code": {
      name: "Cursor Code Assistant",
      platform: "Cursor",
      rating: 4.8,
      users: 12000,
      lastUpdated: "2024-01-14",
      strengths: ["Multi-language support", "Intelligent completion", "Refactoring tools", "Context awareness"],
      weaknesses: ["Requires IDE integration", "Learning curve"],
      features: ["Code completion", "Refactoring", "Bug detection", "Documentation"],
      complexity: "Intermediate",
      tokenUsage: "Medium",
      responseTime: "Very Fast",
    },
  }

  const getPromptData = (promptId: string) => {
    return comparisonData[promptId as keyof typeof comparisonData] || null
  }

  const prompt1Data = getPromptData(selectedPrompt1)
  const prompt2Data = getPromptData(selectedPrompt2)

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Compare className="w-5 h-5 mr-2" />
            Compare AI Models
          </CardTitle>
          <CardDescription>
            Select two AI models to compare their features, performance, and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Model</label>
              <Select value={selectedPrompt1} onValueChange={setSelectedPrompt1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first model" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.value} value={prompt.value}>
                      {prompt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Second Model</label>
              <Select value={selectedPrompt2} onValueChange={setSelectedPrompt2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second model" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.value} value={prompt.value}>
                      {prompt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {prompt1Data && prompt2Data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[prompt1Data, prompt2Data].map((data, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{data.name}</CardTitle>
                  <Badge variant="outline">{data.platform}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold">{data.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="font-semibold">{data.users.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">Users</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-semibold">{data.responseTime}</span>
                    </div>
                    <p className="text-xs text-gray-600">Speed</p>
                  </div>
                </div>

                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="strengths">Pros</TabsTrigger>
                    <TabsTrigger value="weaknesses">Cons</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-2">
                    {data.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="strengths" className="space-y-2">
                    {data.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="weaknesses" className="space-y-2">
                    {data.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                        <span className="text-sm">{weakness}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Complexity</span>
                    <Badge
                      variant={
                        data.complexity === "Advanced"
                          ? "destructive"
                          : data.complexity === "Intermediate"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {data.complexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Token Usage</span>
                    <Badge variant="outline">{data.tokenUsage}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm">{data.lastUpdated}</span>
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Model
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!selectedPrompt1 || !selectedPrompt2) && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Compare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select two models to compare</p>
            <p className="text-gray-400">Choose models from the dropdowns above to see a detailed comparison</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
