"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp,
  Users,
  MessageSquare,
  Bot,
  DollarSign,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { useAuth } from "@/app/contexts/auth-context"

interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalConversations: number
  totalMessages: number
  totalAgents: number
  revenue: number
  growthRate: number
  topModels: Array<{ model: string; usage: number; cost: number }>
  dailyActivity: Array<{ date: string; users: number; messages: number; revenue: number }>
  userRetention: Array<{ cohort: string; retention: number }>
}

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading analytics data
    const mockData: AnalyticsData = {
      totalUsers: 1247,
      activeUsers: 892,
      totalConversations: 15420,
      totalMessages: 89234,
      totalAgents: 156,
      revenue: 15420.50,
      growthRate: 23.5,
      topModels: [
        { model: "GPT-4", usage: 4520, cost: 135.60 },
        { model: "Claude 3 Sonnet", usage: 3240, cost: 48.60 },
        { model: "Gemini Pro", usage: 2180, cost: 1.09 },
        { model: "GPT-3.5 Turbo", usage: 1890, cost: 3.78 }
      ],
      dailyActivity: [
        { date: "2024-01-15", users: 45, messages: 234, revenue: 125.50 },
        { date: "2024-01-16", users: 52, messages: 289, revenue: 142.30 },
        { date: "2024-01-17", users: 48, messages: 267, revenue: 138.90 },
        { date: "2024-01-18", users: 61, messages: 345, revenue: 167.20 },
        { date: "2024-01-19", users: 58, messages: 312, revenue: 158.40 },
        { date: "2024-01-20", users: 67, messages: 378, revenue: 182.10 },
        { date: "2024-01-21", users: 73, messages: 412, revenue: 198.60 }
      ],
      userRetention: [
        { cohort: "Week 1", retention: 85 },
        { cohort: "Week 2", retention: 72 },
        { cohort: "Week 3", retention: 68 },
        { cohort: "Week 4", retention: 65 }
      ]
    }

    setAnalyticsData(mockData)
    setIsLoading(false)
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analyticsData) {
    return <div>No data available</div>
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your AI workspace performance and user engagement
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{analyticsData.growthRate}% growth
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUp className="w-3 h-3 inline text-green-500" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUp className="w-3 h-3 inline text-green-500" />
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUp className="w-3 h-3 inline text-green-500" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <ArrowUp className="w-3 h-3 inline text-green-500" />
                +{analyticsData.growthRate}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">AI Usage</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>User activity over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyticsData.dailyActivity.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">{day.users} users</span>
                          <span className="text-sm">{day.messages} messages</span>
                          <span className="text-sm font-medium">${day.revenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top AI Models</CardTitle>
                  <CardDescription>Most used AI models and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.topModels.map((model) => (
                      <div key={model.model} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <span className="font-medium">{model.model}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{model.usage.toLocaleString()} uses</div>
                          <div className="text-xs text-muted-foreground">${model.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Usage</CardTitle>
                <CardDescription>Detailed breakdown of AI model usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topModels.map((model) => (
                    <div key={model.model} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{model.model}</span>
                          <span className="text-sm text-muted-foreground">
                            {((model.usage / analyticsData.totalMessages) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(model.usage / analyticsData.totalMessages) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{model.usage.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">${model.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Revenue growth and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        +{analyticsData.growthRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        ${(analyticsData.revenue / 30).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Daily Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        ${(analyticsData.revenue / analyticsData.totalUsers).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Per User</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>User retention rates by cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.userRetention.map((cohort) => (
                    <div key={cohort.cohort} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{cohort.cohort}</span>
                          <span className="text-sm text-muted-foreground">
                            {cohort.retention}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${cohort.retention}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 