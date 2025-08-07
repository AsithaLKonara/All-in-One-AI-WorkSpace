"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Check, X, Globe, Users } from "lucide-react"

export function ModelComparison() {
  const [selectedModels, setSelectedModels] = useState(["v0", "cursor", "bolt"])
  const [comparisonType, setComparisonType] = useState("features")

  const models = {
    v0: {
      name: "v0 by Vercel",
      platform: "Vercel",
      category: "UI Generation",
      rating: 4.9,
      users: "50K+",
      pricing: "Free/Pro",
      description: "AI-powered UI generation with React and Next.js",
      strengths: ["Excellent UI generation", "shadcn/ui integration", "Real-time preview", "TypeScript support"],
      weaknesses: ["Limited to UI/frontend", "Requires Vercel ecosystem", "No backend logic"],
      features: {
        "Code Generation": 95,
        "UI/UX Design": 98,
        "Real-time Preview": 95,
        "Multi-language Support": 70,
        "File Operations": 80,
        Deployment: 90,
        Collaboration: 75,
        "Learning Curve": 85,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: false },
        { name: "Database Integration", supported: false },
        { name: "File System Access", supported: false },
        { name: "Terminal Commands", supported: false },
      ],
    },
    cursor: {
      name: "Cursor Agent",
      platform: "Cursor",
      category: "Code Editing",
      rating: 4.8,
      users: "100K+",
      pricing: "Free/Pro",
      description: "Advanced code editing and refactoring assistant",
      strengths: ["Excellent code analysis", "Multi-file editing", "Git integration", "IDE integration"],
      weaknesses: ["Steep learning curve", "Resource intensive", "Limited UI generation"],
      features: {
        "Code Generation": 92,
        "UI/UX Design": 70,
        "Real-time Preview": 60,
        "Multi-language Support": 95,
        "File Operations": 98,
        Deployment: 70,
        Collaboration: 85,
        "Learning Curve": 65,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: true },
        { name: "Database Integration", supported: true },
        { name: "File System Access", supported: true },
        { name: "Terminal Commands", supported: true },
      ],
    },
    bolt: {
      name: "Bolt",
      platform: "Bolt",
      category: "Full-Stack",
      rating: 4.7,
      users: "75K+",
      pricing: "Free",
      description: "Full-stack development in WebContainer environment",
      strengths: ["Full-stack development", "Real-time preview", "No setup required", "Package management"],
      weaknesses: ["Browser limitations", "No native binaries", "Limited Python libraries"],
      features: {
        "Code Generation": 88,
        "UI/UX Design": 85,
        "Real-time Preview": 92,
        "Multi-language Support": 80,
        "File Operations": 90,
        Deployment: 85,
        Collaboration: 70,
        "Learning Curve": 75,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: true },
        { name: "Database Integration", supported: true },
        { name: "File System Access", supported: true },
        { name: "Terminal Commands", supported: true },
      ],
    },
    lovable: {
      name: "Lovable",
      platform: "Lovable",
      category: "Web Development",
      rating: 4.6,
      users: "30K+",
      pricing: "Pro",
      description: "AI editor for creating and modifying web applications",
      strengths: ["Real-time editing", "Component-focused", "Good TypeScript support", "Modern UI"],
      weaknesses: ["Limited to web apps", "Subscription required", "Smaller community"],
      features: {
        "Code Generation": 85,
        "UI/UX Design": 90,
        "Real-time Preview": 88,
        "Multi-language Support": 75,
        "File Operations": 85,
        Deployment: 80,
        Collaboration: 80,
        "Learning Curve": 80,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: true },
        { name: "Database Integration", supported: false },
        { name: "File System Access", supported: false },
        { name: "Terminal Commands", supported: false },
      ],
    },
    devin: {
      name: "Devin AI",
      platform: "Devin",
      category: "Autonomous Development",
      rating: 4.5,
      users: "15K+",
      pricing: "Enterprise",
      description: "Autonomous software engineer with real computer access",
      strengths: ["Full autonomy", "Real computer access", "Complex problem solving", "Production ready"],
      weaknesses: ["Very expensive", "Limited availability", "Requires supervision"],
      features: {
        "Code Generation": 90,
        "UI/UX Design": 75,
        "Real-time Preview": 70,
        "Multi-language Support": 95,
        "File Operations": 98,
        Deployment: 95,
        Collaboration: 60,
        "Learning Curve": 50,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: true },
        { name: "Database Integration", supported: true },
        { name: "File System Access", supported: true },
        { name: "Terminal Commands", supported: true },
      ],
    },
    manus: {
      name: "Manus Agent",
      platform: "Manus",
      category: "Multi-Purpose",
      rating: 4.4,
      users: "20K+",
      pricing: "Free/Pro",
      description: "Versatile AI agent for development and research",
      strengths: ["Multi-purpose", "Research capabilities", "Good documentation", "Flexible"],
      weaknesses: ["Jack of all trades", "Less specialized", "Newer platform"],
      features: {
        "Code Generation": 80,
        "UI/UX Design": 70,
        "Real-time Preview": 65,
        "Multi-language Support": 85,
        "File Operations": 85,
        Deployment: 75,
        Collaboration: 75,
        "Learning Curve": 70,
      },
      capabilities: [
        { name: "React Components", supported: true },
        { name: "Next.js Apps", supported: true },
        { name: "TypeScript", supported: true },
        { name: "Responsive Design", supported: true },
        { name: "Backend APIs", supported: true },
        { name: "Database Integration", supported: true },
        { name: "File System Access", supported: true },
        { name: "Terminal Commands", supported: true },
      ],
    },
  }

  const availableModels = Object.keys(models)

  const addModel = (modelId: string) => {
    if (!selectedModels.includes(modelId) && selectedModels.length < 4) {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const removeModel = (modelId: string) => {
    if (selectedModels.length > 2) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Model Comparison</h2>
          <p className="text-gray-600">Compare AI models side by side to find the best fit for your needs</p>
        </div>
        <div className="flex gap-2">
          <Select value="" onValueChange={addModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Add model to compare" />
            </SelectTrigger>
            <SelectContent>
              {availableModels
                .filter((id) => !selectedModels.includes(id))
                .map((id) => (
                  <SelectItem key={id} value={id}>
                    {models[id as keyof typeof models].name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={comparisonType} onValueChange={setComparisonType}>
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(models[selectedModels[0] as keyof typeof models]?.features || {}).map(([feature, _]) => (
              <Card key={feature}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedModels.map((modelId) => {
                      const model = models[modelId as keyof typeof models]
                      const score = model.features[feature as keyof typeof model.features]
                      return (
                        <div key={modelId} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium">{model.name}</div>
                          <div className="flex-1">
                            <Progress value={score} className="h-2" />
                          </div>
                          <div className="w-12 text-sm text-right">{score}%</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeModel(modelId)}
                            disabled={selectedModels.length <= 2}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Capability Matrix</CardTitle>
              <CardDescription>Compare what each model can and cannot do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Capability</th>
                      {selectedModels.map((modelId) => (
                        <th key={modelId} className="text-center p-2 min-w-[120px]">
                          <div className="flex items-center justify-center gap-2">
                            {models[modelId as keyof typeof models].name}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeModel(modelId)}
                              disabled={selectedModels.length <= 2}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {models[selectedModels[0] as keyof typeof models]?.capabilities.map((capability, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{capability.name}</td>
                        {selectedModels.map((modelId) => {
                          const model = models[modelId as keyof typeof models]
                          const supported = model.capabilities.find((cap) => cap.name === capability.name)?.supported
                          return (
                            <td key={modelId} className="p-2 text-center">
                              {supported ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedModels.map((modelId) => {
              const model = models[modelId as keyof typeof models]
              return (
                <Card key={modelId} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{model.category}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModel(modelId)}
                        disabled={selectedModels.length <= 2}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {model.name}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{model.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {model.users} users
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {model.pricing}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="text-sm space-y-1">
                        {model.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Limitations</h4>
                      <ul className="text-sm space-y-1">
                        {model.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <X className="h-3 w-3 text-red-500" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
