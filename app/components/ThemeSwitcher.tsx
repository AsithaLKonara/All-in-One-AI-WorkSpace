"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Monitor, Palette } from "lucide-react"

type Theme = "light" | "dark" | "system"

interface ThemeSwitcherProps {
  onThemeChange?: (theme: Theme) => void
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>("system")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as Theme || "system"
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem("theme", theme)
    onThemeChange?.(theme)
  }, [theme, mounted, onThemeChange])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  const themes = [
    {
      id: "light" as Theme,
      name: "Light",
      icon: Sun,
      description: "Clean, bright interface",
      color: "bg-yellow-500"
    },
    {
      id: "dark" as Theme,
      name: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
      color: "bg-gray-800"
    },
    {
      id: "system" as Theme,
      name: "System",
      icon: Monitor,
      description: "Follows your OS preference",
      color: "bg-blue-500"
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your preferred color scheme
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon
            const isActive = theme === themeOption.id
            
            return (
              <Button
                key={themeOption.id}
                variant={isActive ? "default" : "outline"}
                className={`justify-start h-auto p-4 ${
                  isActive ? themeOption.color : ""
                }`}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{themeOption.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {themeOption.description}
                    </div>
                  </div>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Theme Preview</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white border rounded p-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
              <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-gray-900 border rounded p-2 text-xs text-white">
              <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
              <div className="w-full h-2 bg-gray-700 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-700 rounded"></div>
            </div>
            <div className="bg-gray-100 border rounded p-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full mb-1"></div>
              <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
              <div className="w-2/3 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">💡 Theme Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Light theme is great for daytime use and detailed work</li>
            <li>Dark theme reduces eye strain in low-light environments</li>
            <li>System theme automatically adapts to your OS preference</li>
            <li>Your choice is saved for future visits</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 