"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Code, 
  Search, 
  Hammer, 
  Sparkles, 
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap
} from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

interface UserGoal {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

interface AIModel {
  id: string
  name: string
  description: string
  category: string
  capabilities: string[]
  isSelected: boolean
}

export function OnboardingWizard({ onComplete }: { onComplete: (data: any) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [userGoal, setUserGoal] = useState<string>("")
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [workspaceName, setWorkspaceName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const userGoals: UserGoal[] = [
    {
      id: "chat",
      title: "AI Chat & Conversation",
      description: "Have intelligent conversations with AI models",
      icon: <MessageSquare className="w-6 h-6" />,
      features: ["Multi-model chat", "Conversation history", "Export capabilities"]
    },
    {
      id: "code",
      title: "Code Development",
      description: "Build and debug code with AI assistance",
      icon: <Code className="w-6 h-6" />,
      features: ["Code editor", "AI suggestions", "Live preview", "Debug tools"]
    },
    {
      id: "research",
      title: "Research & Analysis",
      description: "Research topics and analyze data with AI",
      icon: <Search className="w-6 h-6" />,
      features: ["Data analysis", "Research tools", "Citation tracking", "Report generation"]
    },
    {
      id: "build",
      title: "Build Applications",
      description: "Create full applications and prototypes",
      icon: <Hammer className="w-6 h-6" />,
      features: ["App builder", "Component library", "Deployment tools", "Team collaboration"]
    }
  ]

  const aiModels: AIModel[] = [
    {
      id: "v0",
      name: "v0 by Vercel",
      description: "React/Next.js UI generation specialist",
      category: "UI Development",
      capabilities: ["React Components", "Next.js Apps", "shadcn/ui", "Tailwind CSS"],
      isSelected: false
    },
    {
      id: "cursor",
      name: "Cursor Agent",
      description: "Advanced code editing and refactoring",
      category: "Code Editor",
      capabilities: ["Code Analysis", "Refactoring", "Multi-file Editing", "Git Integration"],
      isSelected: false
    },
    {
      id: "claude",
      name: "Claude 3",
      description: "Anthropic's most capable AI model",
      category: "General AI",
      capabilities: ["Complex reasoning", "Code generation", "Analysis", "Creative writing"],
      isSelected: false
    },
    {
      id: "gpt4",
      name: "GPT-4",
      description: "OpenAI's advanced language model",
      category: "General AI",
      capabilities: ["Text generation", "Code assistance", "Problem solving", "Creative tasks"],
      isSelected: false
    },
    {
      id: "gemini",
      name: "Gemini Pro",
      description: "Google's multimodal AI model",
      category: "General AI",
      capabilities: ["Multimodal input", "Code generation", "Analysis", "Creative tasks"],
      isSelected: false
    },
    {
      id: "mistral",
      name: "Mistral AI",
      description: "Fast and efficient AI model",
      category: "General AI",
      capabilities: ["Quick responses", "Code generation", "Text analysis", "Efficient processing"],
      isSelected: false
    }
  ]

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to AI Workspace",
      description: "Let's set up your personalized AI development environment",
      component: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to Your AI Workspace</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The ultimate platform for AI-powered development. Let's customize your workspace to match your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userGoals.map((goal) => (
              <Card 
                key={goal.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  userGoal === goal.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setUserGoal(goal.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {goal.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {goal.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "models",
      title: "Choose Your AI Models",
      description: "Select the AI models that best fit your workflow",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select AI Models</h3>
            <p className="text-muted-foreground">
              Choose the AI models you want to work with. You can always change these later.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model) => (
              <Card 
                key={model.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedModels.includes(model.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => {
                  if (selectedModels.includes(model.id)) {
                    setSelectedModels(selectedModels.filter(id => id !== model.id))
                  } else {
                    setSelectedModels([...selectedModels, model.id])
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                    <Checkbox 
                      checked={selectedModels.includes(model.id)}
                      onChange={() => {}}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{model.category}</Badge>
                    <div className="space-y-1">
                      {model.capabilities.map((capability, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {capability}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "workspace",
      title: "Configure Your Workspace",
      description: "Set up your workspace name and preferences",
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Workspace Configuration</h3>
            <p className="text-muted-foreground">
              Customize your workspace settings and preferences.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="My AI Workspace"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theme" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm">Light Theme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-20 bg-white border-2 border-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm">Dark Theme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-20 bg-gray-900 border-2 border-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Layout</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-sm">Chat Focused</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-20 bg-blue-100 rounded"></div>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-sm">Code Focused</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-20 bg-green-100 rounded"></div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-save" defaultChecked />
                    <Label htmlFor="auto-save">Auto-save workspace changes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notifications" defaultChecked />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analytics" defaultChecked />
                    <Label htmlFor="analytics">Share usage analytics</Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )
    },
    {
      id: "complete",
      title: "Setup Complete!",
      description: "Your AI workspace is ready to use",
      component: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Your personalized AI workspace is ready. Start building amazing things!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {userGoals.find(g => g.id === userGoal)?.icon}
                  <span>{userGoals.find(g => g.id === userGoal)?.title}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {selectedModels.length} models selected
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Workspace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {workspaceName || "My AI Workspace"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const onboardingData = {
      userGoal,
      selectedModels,
      workspaceName: workspaceName || "My AI Workspace",
      completedAt: new Date().toISOString()
    }
    
    onComplete(onboardingData)
    setIsLoading(false)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userGoal !== ""
      case 1:
        return selectedModels.length > 0
      case 2:
        return true
      default:
        return true
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {steps[currentStep].component}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Setting up...
              </div>
            ) : currentStep === steps.length - 1 ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 