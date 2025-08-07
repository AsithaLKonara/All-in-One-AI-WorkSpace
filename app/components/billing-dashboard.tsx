"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Crown,
  Users,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Download,
  Settings,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/app/contexts/auth-context"

interface Subscription {
  id: string
  plan: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  limits: {
    workspaces: number
    agents: number
    messagesPerMonth: number
    exportEnabled: boolean
    advancedAnalytics: boolean
    apiAccess: boolean
    teamMembers?: number
  }
}

interface BillingData {
  user: {
    id: string
    email: string
    name: string
  }
  subscription: Subscription | null
  plan: Plan
  availablePlans: Plan[]
}

export function BillingDashboard() {
  const { user } = useAuth()
  const [billingData, setBillingData] = useState<BillingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      const response = await fetch("/api/billing")
      if (response.ok) {
        const data = await response.json()
        setBillingData(data)
      }
    } catch (error) {
      console.error("Error fetching billing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true)
    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/billing?success=true`,
          cancelUrl: `${window.location.origin}/billing?canceled=true`,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        if (url) {
          window.location.href = url
        }
      }
    } catch (error) {
      console.error("Error upgrading plan:", error)
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleCancel = async () => {
    try {
      await fetch("/api/billing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "cancel" }),
      })
      await fetchBillingData()
    } catch (error) {
      console.error("Error canceling subscription:", error)
    }
  }

  const handleReactivate = async () => {
    try {
      await fetch("/api/billing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "reactivate" }),
      })
      await fetchBillingData()
    } catch (error) {
      console.error("Error reactivating subscription:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!billingData) {
    return <div>Error loading billing data</div>
  }

  const { subscription, plan, availablePlans } = billingData
  const isActive = subscription?.status === "active"
  const isCanceled = subscription?.cancelAtPeriodEnd

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Billing & Subscription</h1>
            <p className="text-muted-foreground">
              Manage your subscription and billing information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {isCanceled && (
              <Badge variant="destructive">Canceling</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <span>Current Plan</span>
                </CardTitle>
                <CardDescription>
                  Your current subscription and plan details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-muted-foreground">
                        ${plan.price}/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={isActive ? "default" : "secondary"}>
                        {subscription?.status || "Free"}
                      </Badge>
                    </div>
                  </div>

                  {subscription && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Billing Period</p>
                        <p>
                          {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{" "}
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Billing</p>
                        <p>
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {subscription && subscription.stripeSubscriptionId && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Open Stripe customer portal
                          window.open("/api/billing/portal", "_blank")
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Billing
                      </Button>
                      {isCanceled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReactivate}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reactivate
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
                <CardDescription>
                  Your current usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {plan.limits.workspaces === -1 ? "∞" : plan.limits.workspaces}
                    </div>
                    <p className="text-sm text-muted-foreground">Workspaces</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {plan.limits.agents === -1 ? "∞" : plan.limits.agents}
                    </div>
                    <p className="text-sm text-muted-foreground">AI Agents</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {plan.limits.messagesPerMonth === -1 ? "∞" : plan.limits.messagesPerMonth}
                    </div>
                    <p className="text-sm text-muted-foreground">Messages/Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePlans.map((planOption) => (
                <Card
                  key={planOption.id}
                  className={`${
                    plan.id === planOption.id
                      ? "ring-2 ring-primary"
                      : "hover:shadow-lg"
                  } transition-all`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {planOption.name}
                      {planOption.id === "enterprise" && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      ${planOption.price}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {planOption.features.slice(0, 5).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {planOption.features.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{planOption.features.length - 5} more features
                          </p>
                        )}
                      </div>

                      <Button
                        className="w-full"
                        variant={plan.id === planOption.id ? "outline" : "default"}
                        disabled={plan.id === planOption.id || isUpgrading}
                        onClick={() => handleUpgrade(planOption.id)}
                      >
                        {plan.id === planOption.id ? (
                          "Current Plan"
                        ) : planOption.price === 0 ? (
                          "Downgrade"
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4 mr-2" />
                            {planOption.price > plan.price ? "Upgrade" : "Downgrade"}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Detailed usage statistics and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Usage Analytics</h3>
                  <p className="text-muted-foreground">
                    Detailed usage analytics will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  Your past invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Billing History</h3>
                  <p className="text-muted-foreground">
                    Billing history will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
