"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { X, Eye, EyeOff, Github, Mail, Loader2 } from "lucide-react"

interface AuthModalProps {
  onClose: () => void
  onLogin: (user: any) => void
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleSubmit = async (type: "signin" | "signup") => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const user = {
        id: "1",
        name: type === "signup" ? formData.name : "John Doe",
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
      }

      onLogin(user)
      setIsLoading(false)
    }, 1500)
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)

    // Simulate social login
    setTimeout(() => {
      const user = {
        id: "1",
        name: `User from ${provider}`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      }

      onLogin(user)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold">Asvia</span>
          </div>
          <CardTitle>Welcome to Asvia</CardTitle>
          <CardDescription>Sign in to your account or create a new one to get started</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleSubmit("signin")}
                  disabled={isLoading || !formData.email || !formData.password}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Sign In
                </Button>

                <div className="text-center">
                  <Button variant="link" className="text-sm">
                    Forgot your password?
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleSubmit("signup")}
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    formData.password !== formData.confirmPassword
                  }
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Account
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" onClick={() => handleSocialLogin("GitHub")} disabled={isLoading}>
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" onClick={() => handleSocialLogin("Google")} disabled={isLoading}>
                <Mail className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-xs">
              Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
