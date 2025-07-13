"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Rocket, 
  Github, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle,
  Clock,
  Globe,
  Settings,
  Download,
  Share2,
  Eye,
  Code,
  Terminal
} from "lucide-react"

interface DeployPanelProps {
  onDeploy: () => void
  onExportGitHub: () => void
}

interface DeploymentStatus {
  status: "idle" | "building" | "deploying" | "success" | "error"
  progress: number
  message: string
  url?: string
  error?: string
}

export function DeployPanel({ onDeploy, onExportGitHub }: DeployPanelProps) {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: "idle",
    progress: 0,
    message: "Ready to deploy"
  })
  const [projectName, setProjectName] = useState("my-ai-ui-project")
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus({
      status: "building",
      progress: 0,
      message: "Building project..."
    })

    // Simulate deployment process
    const steps = [
      { progress: 20, message: "Installing dependencies..." },
      { progress: 40, message: "Building project..." },
      { progress: 60, message: "Optimizing bundle..." },
      { progress: 80, message: "Deploying to Vercel..." },
      { progress: 100, message: "Deployment successful!" }
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDeploymentStatus({
        status: i === steps.length - 1 ? "success" : "building",
        progress: steps[i].progress,
        message: steps[i].message,
        url: i === steps.length - 1 ? "https://my-ai-ui-project.vercel.app" : undefined
      })
    }

    setIsDeploying(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "building":
      case "deploying":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "building":
      case "deploying":
        return <Clock className="h-4 w-4" />
      default:
        return <Rocket className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Deploy to Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Project Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-ai-ui-project"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">Next.js 14</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Vercel</Badge>
              </div>
            </div>
          </div>

          {/* Deployment Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Deployment Status</h3>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(deploymentStatus.status)}`} />
                  <span className="text-sm font-medium">{deploymentStatus.message}</span>
                  {getStatusIcon(deploymentStatus.status)}
                </div>
                
                <Progress value={deploymentStatus.progress} className="mb-3" />
                
                {deploymentStatus.url && (
                  <div className="flex items-center gap-2 mt-3">
                    <Globe className="h-4 w-4 text-green-500" />
                    <a 
                      href={deploymentStatus.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {deploymentStatus.url}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(deploymentStatus.url!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Deployment Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Deployment Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Deploy to Vercel</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    One-click deployment with automatic CI/CD
                  </p>
                  <Button 
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full"
                  >
                    {isDeploying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Deploy Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:border-green-500 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Github className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Export to GitHub</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create a new repository with your code
                  </p>
                  <Button 
                    variant="outline"
                    onClick={onExportGitHub}
                    className="w-full"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Export Code
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                View Code
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Deployment History */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Recent Deployments</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <div className="text-sm font-medium">Production</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Preview</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 