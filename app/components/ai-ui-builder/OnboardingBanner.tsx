"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  MousePointer, 
  Eye, 
  Code, 
  Rocket,
  X,
  ArrowRight,
  Check,
  Play,
  Lightbulb,
  Zap,
  Brain
} from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
  completed: boolean
  action?: string
}

interface OnboardingBannerProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingBanner({ onComplete, onSkip }: OnboardingBannerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "welcome",
      title: "Welcome to AI UI Builder",
      description: "Generate beautiful UI components with AI in seconds",
      icon: Sparkles,
      completed: false
    },
    {
      id: "generate",
      title: "Generate with AI",
      description: "Describe your component and let AI create it for you",
      icon: Brain,
      completed: false,
      action: "Try AI Generation"
    },
    {
      id: "drag-drop",
      title: "Drag & Drop Layout",
      description: "Build your layout by dragging components into the workspace",
      icon: MousePointer,
      completed: false,
      action: "Start Building"
    },
    {
      id: "preview",
      title: "Live Preview",
      description: "See your components render in real-time across devices",
      icon: Eye,
      completed: false,
      action: "View Preview"
    },
    {
      id: "code",
      title: "Export Code",
      description: "Get clean, production-ready React/Tailwind code",
      icon: Code,
      completed: false,
      action: "Generate Code"
    },
    {
      id: "deploy",
      title: "Deploy Instantly",
      description: "Deploy your UI to production with one click",
      icon: Rocket,
      completed: false,
      action: "Deploy Now"
    }
  ])

  const handleStepComplete = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ))
    
    // Move to next step
    const currentIndex = steps.findIndex(step => step.id === stepId)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(currentIndex + 1)
    } else {
      onComplete()
    }
  }

  const handleStepAction = (step: OnboardingStep) => {
    handleStepComplete(step.id)
  }

  const completedSteps = steps.filter(step => step.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Welcome to AI UI Builder</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Let's get you started with building amazing UI components
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps}/{steps.length} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCurrent = index === currentStep
              const isCompleted = step.completed
              const isUpcoming = index > currentStep
              
              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    isCurrent 
                      ? "border-blue-500 bg-blue-50 shadow-md" 
                      : isCompleted 
                        ? "border-green-500 bg-green-50" 
                        : isUpcoming 
                          ? "border-gray-200 bg-gray-50 opacity-60" 
                          : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => !isUpcoming && handleStepAction(step)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCompleted 
                          ? "bg-green-500" 
                          : isCurrent 
                            ? "bg-blue-500" 
                            : "bg-gray-300"
                      }`}>
                        {isCompleted ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Icon className="h-4 w-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{step.title}</h4>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {step.description}
                        </p>
                        
                        {step.action && isCurrent && (
                          <Button size="sm" className="text-xs">
                            {step.action}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* Quick Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h4 className="text-sm font-medium">Pro Tips</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-yellow-600" />
                <span>Use natural language to describe your components</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer className="h-3 w-3 text-yellow-600" />
                <span>Drag and drop to arrange your layout</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3 text-yellow-600" />
                <span>Preview across different devices and themes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 