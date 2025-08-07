"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  image?: string
  theme?: string
  onboardingCompleted?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (provider?: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (session?.user) {
      setUser({
        id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        theme: "system",
        onboardingCompleted: false,
      })
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [session, status])

  const login = async (provider?: string) => {
    try {
      await signIn(provider, { callbackUrl: "/workspace" })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/" })
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const updatedUser = await response.json()
      setUser(prev => ({ ...prev, ...updatedUser }))
    } catch (error) {
      console.error("Update user error:", error)
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/user")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Refresh user error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 