"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  Edit, 
  Eye,
  Plus,
  Layout,
  Grid3X3
} from "lucide-react"

interface ComponentBlock {
  id: string
  name: string
  jsx: string
  metadata: {
    framework: string
    styling: string
    complexity: string
  }
  position: number
}

interface EditorWorkspaceProps {
  blocks: ComponentBlock[]
  onBlocksChange: (blocks: ComponentBlock[]) => void
  onBlockSelect: (block: ComponentBlock) => void
  onBlockDelete: (blockId: string) => void
  onBlockDuplicate: (block: ComponentBlock) => void
}

function SortableBlock({ 
  block, 
  onSelect, 
  onDelete, 
  onDuplicate 
}: { 
  block: ComponentBlock
  onSelect: (block: ComponentBlock) => void
  onDelete: (blockId: string) => void
  onDuplicate: (block: ComponentBlock) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab hover:cursor-grabbing p-1"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </button>
          
          <div className="flex-1">
            <h4 className="font-medium text-sm">{block.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {block.metadata.framework}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {block.metadata.complexity}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(block)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(block)}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(block.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function EditorWorkspace({ 
  blocks, 
  onBlocksChange, 
  onBlockSelect, 
  onBlockDelete, 
  onBlockDuplicate 
}: EditorWorkspaceProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id)
      const newIndex = blocks.findIndex(block => block.id === over?.id)
      
      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      onBlocksChange(newBlocks)
    }

    setActiveId(null)
  }

  const activeBlock = blocks.find(block => block.id === activeId)

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Component Workspace
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <Layout className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder components
          </p>
          <Badge variant="outline">
            {blocks.length} component{blocks.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {blocks.length === 0 ? (
          <div className="text-center py-12">
            <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate your first component using the prompt form above
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Component
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
              <div className={`space-y-3 ${
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : ""
              }`}>
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onSelect={onBlockSelect}
                    onDelete={onBlockDelete}
                    onDuplicate={onBlockDuplicate}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && activeBlock ? (
                <div className="p-4 border rounded-lg bg-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-sm">{activeBlock.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activeBlock.metadata.framework}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {activeBlock.metadata.complexity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {blocks.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Workspace Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Layout
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 