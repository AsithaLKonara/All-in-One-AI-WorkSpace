"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Code, 
  Search, 
  Hammer, 
  Sparkles, 
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Globe,
  BarChart3
} from "lucide-react"
import { OnboardingWizard } from "./onboarding-wizard"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

export default function LandingPage({ onWorkspaceReady }: { onWorkspaceReady: () => void }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState<any>(null)

  const features: Feature[] = [
    {
      title: "Multi-Model AI Chat",
      description: "Chat with Claude, GPT-4, Gemini, and more in one interface",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      title: "Code Development",
      description: "Write, debug, and deploy code with AI assistance",
      icon: <Code className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      title: "Research & Analysis",
      description: "Research topics and analyze data with powerful AI tools",
      icon: <Search className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      title: "Build Applications",
      description: "Create full applications and prototypes with AI guidance",
      icon: <Hammer className="w-6 h-6" />,
      color: "bg-orange-500"
    },
    {
      title: "Prompt Management",
      description: "Organize, version, and share your AI prompts",
      icon: <Sparkles className="w-6 h-6" />,
      color: "bg-pink-500"
    },
    {
      title: "Team Collaboration",
      description: "Work together with shared workspaces and real-time sync",
      icon: <Users className="w-6 h-6" />,
      color: "bg-indigo-500"
    }
  ]

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 workspace",
        "2 AI agents",
        "Basic chat features",
        "Community support"
      ]
    },
    {
      name: "Pro",
      price: "$15",
      description: "For power users and developers",
      features: [
        "Unlimited workspaces",
        "Unlimited AI agents",
        "Export capabilities",
        "Prompt versioning",
        "Priority support",
        "Advanced analytics"
      ],
      popular: true
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams and collaboration",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared agent pool",
        "Usage analytics",
        "Admin controls",
        "API access"
      ]
    }
  ]

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data)
    setShowOnboarding(false)
    // Here you would typically save the onboarding data and redirect to workspace
    onWorkspaceReady()
  }

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Workspace</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              🚀 The Ultimate AI Development Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Build the Future with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              The all-in-one platform for AI-powered development. Chat, code, research, and build with the world's most advanced AI models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowOnboarding(true)}>
                <Zap className="w-5 h-5 mr-2" />
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15+</div>
              <div className="text-muted-foreground">AI Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-muted-foreground">Prompts Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Build with AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From simple chat to complex applications, AI Workspace provides all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Goal</h3>
              <p className="text-muted-foreground">
                Select what you want to build: chat, code, research, or applications
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Select AI Models</h3>
              <p className="text-muted-foreground">
                Choose from 15+ AI models including Claude, GPT-4, Gemini, and more
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Building</h3>
              <p className="text-muted-foreground">
                Begin creating with your personalized AI workspace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "$0" && <span className="text-muted-foreground ml-1">/month</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                    {plan.price === "$0" ? "Get Started" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build the Future?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers already building with AI Workspace
          </p>
          <Button size="lg" onClick={() => setShowOnboarding(true)}>
            <Zap className="w-5 h-5 mr-2" />
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Workspace</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate platform for AI-powered development.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 AI Workspace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
