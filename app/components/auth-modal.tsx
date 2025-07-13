"use client"

import { DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { X, Eye, EyeOff, Github, Mail, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubmit = async (type: "signin" | "signup") => {
    setIsLoading(true)
    setError("")

    try {
      if (type === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        await signUp(formData.email, formData.password, formData.name)
      } else {
        await signIn(formData.email, formData.password)
      }
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || "Social login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      setLoading(provider)
      await signIn(provider)
      onOpenChange(false)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign in to Asvia AI</DialogTitle>
          <DialogDescription>
            Choose your preferred sign-in method to access all AI tools and features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => handleSignIn("github")}
            disabled={loading !== null}
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            {loading === "github" ? "Connecting..." : "Continue with GitHub"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleSignIn("github")}
            disabled={loading === "github"}
          >
            <Github className="mr-2 h-4 w-4" />
            {loading === "github" ? "Connecting..." : "Continue with GitHub"}
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => handleSignIn("google")}
            disabled={loading === "google"}
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="relative">
            <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => onOpenChange(false)}>
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
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

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
                <Button variant="outline" onClick={() => handleSocialLogin("github")} disabled={isLoading}>
                  <Github className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing in..." : "Continue with GitHub"}
                </Button>
                <Button variant="outline" onClick={() => handleSocialLogin("google")} disabled={isLoading}>
                  <Mail className="h-4 w-4 mr-2" />
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  )
}
