"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, MessageSquare, Zap, Shield, Globe, Star, Github, Moon, Sun } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
  theme?: string
  onThemeChange?: (theme: string) => void
}

const LandingPage = ({ onGetStarted, onLogin, theme, onThemeChange }: LandingPageProps) => {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Multi-Model AI Integration",
      description: "Access v0, Cursor, Bolt, Lovable, Devin AI, Claude, and more in one unified workspace",
      color: "bg-blue-500",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Dual Workspace Design",
      description: "Switch between coding environments and chat interfaces seamlessly",
      color: "bg-green-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Zero-Cost Architecture",
      description: "Built with free-tier services and open-source AI models for maximum accessibility",
      color: "bg-yellow-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy-First Design",
      description: "Local AI processing options and secure data handling for sensitive projects",
      color: "bg-purple-500",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "GitHub-Style Interface",
      description: "Familiar, professional design with smooth animations and responsive layout",
      color: "bg-indigo-500",
    },
  ]

  const aiModels = [
    { name: "v0 by Vercel", description: "React/Next.js specialist", color: "bg-black", icon: "⚛️" },
    { name: "Cursor Agent", description: "Code editing & refactoring", color: "bg-blue-600", icon: "📝" },
    { name: "Bolt", description: "Full-stack development", color: "bg-orange-500", icon: "🔧" },
    { name: "Lovable", description: "Web app design", color: "bg-pink-500", icon: "🎨" },
    { name: "Devin AI", description: "Autonomous engineering", color: "bg-purple-600", icon: "🤖" },
    { name: "Claude", description: "General AI assistance", color: "bg-amber-600", icon: "🧠" },
    { name: "LLaMA Local", description: "Privacy-focused local AI", color: "bg-green-600", icon: "🏠" },
    { name: "GPT-4 Free", description: "Community-driven access", color: "bg-emerald-500", icon: "🆓" },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full-Stack Developer",
      content: "Asvia has revolutionized my workflow. Having all AI models in one place saves me hours every day.",
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "UI/UX Designer",
      content: "The seamless switch between coding and chat workspaces is exactly what I needed for my design process.",
      avatar: "MR",
    },
    {
      name: "Emily Johnson",
      role: "Startup Founder",
      content: "Zero-cost deployment with enterprise-level features. Asvia is perfect for bootstrapped startups.",
      avatar: "EJ",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">Asvia</span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#models" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Models
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onThemeChange?.(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" onClick={onLogin}>
              Sign In
            </Button>
            <Button onClick={onGetStarted} className="btn-github">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-6">
            <Badge variant="outline" className="mb-4">
              🚀 Now in Public Beta
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Unified AI Workspace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Zero-cost, open-source AI multiplex workplace. Access multiple AI models, coding environments, and chat
              interfaces in one seamless platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="btn-github">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="btn-github bg-transparent">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-lg border border-border bg-card p-2 shadow-2xl">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground">Interactive Demo Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern AI-powered development in one unified platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeFeature === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="models" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Integrated AI Models</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access the best AI models from leading providers, all in one unified interface
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiModels.map((model, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 btn-github">
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${model.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl">{model.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Developers Say</h2>
            <p className="text-xl text-muted-foreground">Join thousands of developers already using Asvia</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold mt-4">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Access to 3 AI models
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Basic coding workspace
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Community support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Local AI processing
                  </li>
                </ul>
                <Button className="w-full mt-6 btn-github bg-transparent" variant="outline" onClick={onGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 ring-2 ring-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold mt-4">$19</div>
                <CardDescription>For professional developers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    All AI models included
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Advanced coding features
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Custom prompts & roles
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Team collaboration
                  </li>
                </ul>
                <Button className="w-full mt-6 btn-github" onClick={onGetStarted}>
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold mt-4">Custom</div>
                <CardDescription>For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Custom AI model training
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Advanced security
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    On-premise deployment
                  </li>
                </ul>
                <Button className="w-full mt-6 btn-github bg-transparent" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who are already building faster with Asvia's unified AI workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={onGetStarted} className="btn-github">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-github border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold">Asvia</span>
              </div>
              <p className="text-muted-foreground mb-4">Your unified AI workspace for modern development.</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#models" className="hover:text-foreground transition-colors">
                    AI Models
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Asvia. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
