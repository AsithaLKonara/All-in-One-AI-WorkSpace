"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Zap, TrendingUp, Check, Star } from "lucide-react"
import { CREDIT_PLANS, type CreditPlan } from "@/lib/credit-plans"
import { PayHereForm } from "./payhere-form"
import { useToast } from "@/hooks/use-toast"

interface BillingDashboardProps {
  user: any
}

export function BillingDashboard({ user }: BillingDashboardProps) {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [paymentData, setPaymentData] = useState<any>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [userDetails, setUserDetails] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    phone: "",
    address: "",
    city: "",
    country: "US",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchCreditsData()
  }, [])

  const fetchCreditsData = async () => {
    try {
      const response = await fetch("/api/credits")
      const data = await response.json()

      if (response.ok) {
        setCredits(data.credits)
        setHistory(data.history)
        setPurchases(data.purchases)
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (plan: CreditPlan) => {
    setPurchasing(plan.id)

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, userDetails }),
      })

      const data = await response.json()

      if (response.ok) {
        setPaymentData(data)
        setShowPaymentForm(true)
      } else {
        throw new Error(data.error || "Failed to create payment")
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Unable to process your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPurchasing(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Credits</h1>
          <p className="text-muted-foreground">Manage your AI credits and billing</p>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="text-2xl font-bold">{credits}</span>
          <span className="text-muted-foreground">credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits}</div>
            <Progress value={Math.min((credits / 100) * 100, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {history.filter((h) => new Date(h.timestamp).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-muted-foreground">AI requests made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.reduce((sum, p) => sum + p.credits, 0)}</div>
            <p className="text-xs text-muted-foreground">credits purchased</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Credit Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CREDIT_PLANS.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground"> / {plan.credits} credits</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Model Access:</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.modelAccess.map((model) => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        disabled={purchasing === plan.id}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {purchasing === plan.id ? "Processing..." : `Purchase ${plan.credits} Credits`}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Your Purchase</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={userDetails.firstName}
                              onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={userDetails.lastName}
                              onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={userDetails.phone}
                            onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={userDetails.address}
                            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={userDetails.city}
                              onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={userDetails.country}
                              onChange={(e) => setUserDetails({ ...userDetails, country: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button onClick={() => handlePurchase(plan)} className="w-full">
                          Proceed to Payment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Usage</CardTitle>
              <CardDescription>Your AI model usage history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Credits Used</TableHead>
                    <TableHead>Tokens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((usage, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(usage.timestamp)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{usage.model}</Badge>
                      </TableCell>
                      <TableCell>{usage.credits_used}</TableCell>
                      <TableCell>{usage.tokens_processed?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>Your credit purchase transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(purchase.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.plan_id}</Badge>
                      </TableCell>
                      <TableCell>{purchase.credits}</TableCell>
                      <TableCell>${purchase.amount}</TableCell>
                      <TableCell>
                        <Badge variant={purchase.status === "completed" ? "default" : "secondary"}>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showPaymentForm && paymentData && (
        <PayHereForm
          paymentData={paymentData.paymentData}
          paymentUrl={paymentData.paymentUrl}
          onSubmit={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  )
}
