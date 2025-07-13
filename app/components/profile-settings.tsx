"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Key, Shield, Bell, Download, Trash2, Eye, EyeOff, Copy, Plus } from "lucide-react"

interface ProfileSettingsProps {
  user: any
  onUserUpdate: (user: any) => void
  onLogin: () => void
}

export function ProfileSettings({ user, onUserUpdate, onLogin }: ProfileSettingsProps) {
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    groq: "",
    huggingface: "",
    custom: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false,
  })

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    website: "",
    location: "",
  })

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your profile settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onLogin} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleProfileUpdate = () => {
    onUserUpdate({ ...user, ...profile })
  }

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(apiKeys[key as keyof typeof apiKeys])
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              Pro User
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information and public details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={profile.website}
                      onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={profile.location}
                      onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate}>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for different AI providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(apiKeys).map(([provider, key]) => (
                  <div key={provider} className="space-y-2">
                    <Label className="capitalize">{provider} API Key</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          type={showApiKeys[provider] ? "text" : "password"}
                          value={key}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, [provider]: e.target.value }))}
                          placeholder={`Enter your ${provider} API key`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => toggleApiKeyVisibility(provider)}
                        >
                          {showApiKeys[provider] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Button variant="outline" size="icon" onClick={() => copyApiKey(provider)} disabled={!key}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Separator />

                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Provider
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Session Management</h4>
                      <p className="text-sm text-muted-foreground">Manage your active sessions across devices</p>
                    </div>
                    <Button variant="outline">Manage Sessions</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">Download your data and conversation history</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Product Updates</h4>
                    <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, updates: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-muted-foreground">Receive marketing emails and promotions</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your workspace appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Theme</h4>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Light
                    </Button>
                    <Button variant="outline" size="sm">
                      Dark
                    </Button>
                    <Button variant="outline" size="sm">
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
