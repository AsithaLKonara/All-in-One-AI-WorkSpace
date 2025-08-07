"use client"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Star, Users, Zap } from "lucide-react"

interface ModelSelectorProps {
  models: Record<string, any>
  activeModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ models, activeModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-gray-600" />
        <h3 className="font-semibold text-sm text-gray-700">AI Models</h3>
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {Object.values(models).map((model: any) => (
            <Card
              key={model.id}
              className={`cursor-pointer transition-all hover:shadow-sm ${
                activeModel === model.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => onModelChange(model.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${model.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    <p className="text-xs text-gray-600">{model.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {model.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">4.8</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {model.capabilities.slice(0, 2).map((capability: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                  {model.capabilities.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{model.capabilities.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>50K+ users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>{model.tools.length} tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
