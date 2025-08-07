"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreditsDisplayProps {
  userId?: string
  showBuyButton?: boolean
}

export function CreditsDisplay({ userId, showBuyButton = true }: CreditsDisplayProps) {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      fetchCredits()
    }
  }, [userId])

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits")
      const data = await response.json()

      if (response.ok) {
        setCredits(data.credits)
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={credits > 10 ? "default" : "destructive"} className="flex items-center space-x-1">
        <Zap className="h-3 w-3" />
        <span>{credits}</span>
      </Badge>
      {showBuyButton && credits < 20 && (
        <Button size="sm" variant="outline" onClick={() => router.push("/dashboard/billing")}>
          <Plus className="h-3 w-3 mr-1" />
          Buy Credits
        </Button>
      )}
    </div>
  )
}
