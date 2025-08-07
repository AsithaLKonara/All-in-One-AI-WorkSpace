"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { useEffect, useState } from "react"

interface ThemeSwitcherProps {
  variant?: "button" | "dropdown" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ThemeSwitcher({ variant = "dropdown", size = "md", className = "" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-md bg-muted animate-pulse ${className}`} />
    )
  }

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: <Sun className="w-4 h-4" />,
      description: "Light theme for bright environments"
    },
    {
      name: "Dark",
      value: "dark",
      icon: <Moon className="w-4 h-4" />,
      description: "Dark theme for low-light environments"
    },
    {
      name: "System",
      value: "system",
      icon: <Monitor className="w-4 h-4" />,
      description: "Follows your system preference"
    }
  ]

  if (variant === "button") {
    return (
      <div className="flex items-center space-x-2">
        {themes.map((themeOption) => (
          <Button
            key={themeOption.value}
            variant={theme === themeOption.value ? "default" : "outline"}
            size={size}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center space-x-2"
          >
            {themeOption.icon}
            <span>{themeOption.name}</span>
          </Button>
        ))}
      </div>
    )
  }

  if (variant === "icon") {
    const currentTheme = themes.find(t => t.value === theme) || themes[0]
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => {
          const currentIndex = themes.findIndex(t => t.value === theme)
          const nextIndex = (currentIndex + 1) % themes.length
          setTheme(themes[nextIndex].value)
        }}
        className={className}
      >
        {currentTheme.icon}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} className={className}>
          <Palette className="w-4 h-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {themeOption.icon}
            <div className="flex flex-col">
              <span className="font-medium">{themeOption.name}</span>
              <span className="text-xs text-muted-foreground">{themeOption.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 