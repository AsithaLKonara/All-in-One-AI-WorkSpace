"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Users, Star, Download, Brain } from "lucide-react"

export function ModelAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("usage")

  const usageData = [
    { name: "v0", usage: 45000, growth: 12, satisfaction: 4.9, downloads: 15420 },
    { name: "Cursor", usage: 38000, growth: 8, satisfaction: 4.8, downloads: 12350 },
    { name: "Bolt", usage: 32000, growth: 15, satisfaction: 4.7, downloads: 9870 },
    { name: "Lovable", usage: 18000, growth: 22, satisfaction: 4.6, downloads: 8540 },
    { name: "Devin", usage: 8000, growth: 5, satisfaction: 4.5, downloads: 7230 },
    { name: "Manus", usage: 12000, growth: 18, satisfaction: 4.4, downloads: 6890 },
  ]

  const trendData = [
    { month: "Jan", v0: 35000, cursor: 32000, bolt: 25000, lovable: 12000 },
    { month: "Feb", v0: 38000, cursor: 34000, bolt: 27000, lovable: 14000 },
    { month: "Mar", v0: 42000, cursor: 36000, bolt: 30000, lovable: 16000 },
    { month: "Apr", v0: 45000, cursor: 38000, bolt: 32000, lovable: 18000 },
  ]

  const categoryData = [
    { name: "UI Generation", value: 35, color: "#8884d8" },
    { name: "Code Editing", value: 25, color: "#82ca9d" },
    { name: "Full-Stack", value: 20, color: "#ffc658" },
    { name: "Autonomous", value: 10, color: "#ff7300" },
    { name: "Multi-Purpose", value: 10, color: "#00ff88" },
  ]

  const performanceData = [
    { subject: "Code Quality", v0: 95, cursor: 92, bolt: 88, lovable: 85 },
    { subject: "Speed", v0: 90, cursor: 85, bolt: 92, lovable: 88 },
    { subject: "Ease of Use", v0: 95, cursor: 75, bolt: 85, lovable: 90 },
    { subject: "Features", v0: 85, cursor: 95, bolt: 90, lovable: 80 },
    { subject: "Reliability", v0: 92, cursor: 88, bolt: 85, lovable: 87 },
    { subject: "Support", v0: 90, cursor: 85, bolt: 80, lovable: 85 },
  ]

  const topModels = [
    { name: "v0 by Vercel", category: "UI Generation", users: "50K+", growth: "+12%", rating: 4.9 },
    { name: "Cursor Agent", category: "Code Editing", users: "100K+", growth: "+8%", rating: 4.8 },
    { name: "Bolt", category: "Full-Stack", users: "75K+", growth: "+15%", rating: 4.7 },
    { name: "Lovable", category: "Web Development", users: "30K+", growth: "+22%", rating: 4.6 },
  ]

  const metrics = [
    { label: "Total Users", value: "1.2M+", change: "+15%", icon: Users, color: "text-blue-600" },
    { label: "Active Models", value: "25", change: "+3", icon: Brain, color: "text-green-600" },
    { label: "Avg Rating", value: "4.7", change: "+0.1", icon: Star, color: "text-yellow-600" },
    { label: "Total Downloads", value: "500K+", change: "+25%", icon: Download, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Model Analytics</h2>
          <p className="text-gray-600">Insights and performance metrics for AI models</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-sm ${metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {metric.change} from last period
                  </p>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Usage Comparison</CardTitle>
                <CardDescription>Monthly active users by model</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Models</CardTitle>
                <CardDescription>Ranked by user satisfaction and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-600">{model.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{model.users}</Badge>
                          <Badge variant={model.growth.startsWith("+") ? "default" : "destructive"}>
                            {model.growth}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{model.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
              <CardDescription>Multi-dimensional performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="v0" dataKey="v0" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                  <Radar name="Cursor" dataKey="cursor" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                  <Radar name="Bolt" dataKey="bolt" stroke="#ffc658" fill="#ffc658" fillOpacity={0.1} />
                  <Radar name="Lovable" dataKey="lovable" stroke="#ff7300" fill="#ff7300" fillOpacity={0.1} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Monthly usage trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="v0" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="cursor" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="bolt" stroke="#ffc658" strokeWidth={2} />
                  <Line type="monotone" dataKey="lovable" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Average ratings by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "UI Generation", rating: 4.8, models: 3 },
                    { name: "Code Editing", rating: 4.7, models: 5 },
                    { name: "Full-Stack", rating: 4.6, models: 4 },
                    { name: "Autonomous Development", rating: 4.5, models: 2 },
                    { name: "Multi-Purpose", rating: 4.4, models: 6 },
                  ].map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-gray-600">{category.models} models</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={category.rating * 20} className="flex-1" />
                        <span className="text-sm font-medium">{category.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
