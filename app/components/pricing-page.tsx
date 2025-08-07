"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckCircle, Star, Zap, Users, Shield, Globe, BarChart3 } from "lucide-react"

interface PricingPlan {
  name: string
  price: {
    monthly: string
    yearly: string
  }
  description: string
  features: string[]
  popular?: boolean
  cta: string
  limits: {
    workspaces: string
    agents: string
    exports: string
    support: string
  }
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: {
        monthly: "$0",
        yearly: "$0"
      },
      description: "Perfect for getting started with AI development",
      features: [
        "1 workspace",
        "2 AI agents",
        "Basic chat features",
        "Community support",
        "100 prompts per month",
        "Basic analytics"
      ],
      cta: "Get Started Free",
      limits: {
        workspaces: "1",
        agents: "2",
        exports: "None",
        support: "Community"
      }
    },
    {
      name: "Pro",
      price: {
        monthly: "$15",
        yearly: "$150"
      },
      description: "For power users and professional developers",
      features: [
        "Unlimited workspaces",
        "Unlimited AI agents",
        "Export capabilities",
        "Prompt versioning",
        "Priority support",
        "Advanced analytics",
        "Custom themes",
        "API access"
      ],
      popular: true,
      cta: "Start Pro Trial",
      limits: {
        workspaces: "Unlimited",
        agents: "Unlimited",
        exports: "Unlimited",
        support: "Priority"
      }
    },
    {
      name: "Team",
      price: {
        monthly: "$49",
        yearly: "$490"
      },
      description: "For teams and collaboration",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Shared agent pool",
        "Usage analytics",
        "Admin controls",
        "SSO integration",
        "Custom integrations",
        "Dedicated support"
      ],
      cta: "Start Team Trial",
      limits: {
        workspaces: "Unlimited",
        agents: "Unlimited",
        exports: "Unlimited",
        support: "Dedicated"
      }
    }
  ]

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName)
    // Here you would integrate with Stripe
    console.log(`Selected plan: ${planName}`)
  }

  const getCurrentPrice = (plan: PricingPlan) => {
    return isYearly ? plan.price.yearly : plan.price.monthly
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price.monthly === "$0") return null
    const monthly = parseInt(plan.price.monthly.replace("$", ""))
    const yearly = parseInt(plan.price.yearly.replace("$", ""))
    const savings = (monthly * 12 - yearly) / (monthly * 12) * 100
    return Math.round(savings)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            💰 Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all hover:shadow-lg ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{getCurrentPrice(plan)}</span>
                  {plan.price.monthly !== "$0" && (
                    <span className="text-muted-foreground ml-1">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {getSavings(plan) && (
                  <Badge variant="secondary" className="mt-2">
                    Save {getSavings(plan)}%
                  </Badge>
                )}
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Limits */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{plan.limits.workspaces}</div>
                    <div className="text-muted-foreground">Workspaces</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{plan.limits.agents}</div>
                    <div className="text-muted-foreground">AI Agents</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{plan.limits.exports}</div>
                    <div className="text-muted-foreground">Exports</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">{plan.limits.support}</div>
                    <div className="text-muted-foreground">Support</div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="text-center mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription className="text-lg">
                Custom solutions for large organizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-semibold">Advanced Security</div>
                  <div className="text-sm text-muted-foreground">SSO, SAML, Audit logs</div>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="font-semibold">Team Management</div>
                  <div className="text-sm text-muted-foreground">Role-based access, Permissions</div>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="font-semibold">Analytics</div>
                  <div className="text-sm text-muted-foreground">Usage insights, ROI tracking</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. No long-term contracts required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-muted-foreground">
                Yes, we use enterprise-grade security with encryption at rest and in transit.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers already building with AI Workspace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 