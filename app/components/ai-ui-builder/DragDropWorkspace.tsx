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
  Grid3X3,
  Smartphone,
  Monitor,
  Tablet,
  Code,
  Download,
  Settings,
  Move,
  Resize
} from "lucide-react"

interface WorkspaceElement {
  id: string
  type: string
  name: string
  props: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
  children?: WorkspaceElement[]
}

interface DragDropWorkspaceProps {
  onElementSelect: (element: WorkspaceElement) => void
  onElementDelete: (elementId: string) => void
  onGenerateCode: () => void
}

const COMPONENT_PALETTE = [
  {
    id: "button",
    name: "Button",
    icon: "🔘",
    defaultProps: { text: "Button", variant: "default" }
  },
  {
    id: "input",
    name: "Input",
    icon: "📝",
    defaultProps: { placeholder: "Enter text...", type: "text" }
  },
  {
    id: "card",
    name: "Card",
    icon: "🃏",
    defaultProps: { title: "Card Title", content: "Card content..." }
  },
  {
    id: "table",
    name: "Table",
    icon: "📊",
    defaultProps: { headers: ["Name", "Email", "Role"], rows: 3 }
  },
  {
    id: "modal",
    name: "Modal",
    icon: "🪟",
    defaultProps: { title: "Modal Title", content: "Modal content..." }
  },
  {
    id: "nav",
    name: "Navigation",
    icon: "🧭",
    defaultProps: { items: ["Home", "About", "Contact"] }
  },
  {
    id: "form",
    name: "Form",
    icon: "📋",
    defaultProps: { fields: ["Name", "Email", "Message"] }
  },
  {
    id: "list",
    name: "List",
    icon: "📋",
    defaultProps: { items: ["Item 1", "Item 2", "Item 3"] }
  }
]

function SortableElement({ 
  element, 
  onSelect, 
  onDelete 
}: { 
  element: WorkspaceElement
  onSelect: (element: WorkspaceElement) => void
  onDelete: (elementId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderElement = () => {
    switch (element.type) {
      case "button":
        return (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {element.props.text || "Button"}
          </button>
        )
      case "input":
        return (
          <input
            type={element.props.type || "text"}
            placeholder={element.props.placeholder || "Enter text..."}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )
      case "card":
        return (
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">{element.props.title || "Card Title"}</h3>
            <p className="text-sm text-muted-foreground">
              {element.props.content || "Card content..."}
            </p>
          </div>
        )
      case "table":
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {element.props.headers?.map((header: string, index: number) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: element.props.rows || 3 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-t">
                    {element.props.headers?.map((header: string, colIndex: number) => (
                      <td key={colIndex} className="px-4 py-2 text-sm">
                        {`${header} ${rowIndex + 1}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      default:
        return (
          <div className="p-4 border rounded-lg bg-muted">
            <span className="text-sm font-medium">{element.name}</span>
          </div>
        )
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-blue-500 transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
      onClick={() => onSelect(element)}
    >
      <div className="absolute top-1 right-1 flex items-center gap-1">
        <Button
          {...attributes}
          {...listeners}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          <Move className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(element.id)
          }}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="mt-6">
        {renderElement()}
      </div>
      
      <div className="absolute bottom-1 left-1">
        <Badge variant="outline" className="text-xs">
          {element.type}
        </Badge>
      </div>
    </div>
  )
}

export function DragDropWorkspace({ 
  onElementSelect, 
  onElementDelete, 
  onGenerateCode 
}: DragDropWorkspaceProps) {
  const [elements, setElements] = useState<WorkspaceElement[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showGrid, setShowGrid] = useState(true)

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
      const oldIndex = elements.findIndex(element => element.id === active.id)
      const newIndex = elements.findIndex(element => element.id === over?.id)
      
      const newElements = arrayMove(elements, oldIndex, newIndex)
      setElements(newElements)
    }

    setActiveId(null)
  }

  const handleAddElement = (componentType: string) => {
    const component = COMPONENT_PALETTE.find(c => c.id === componentType)
    if (!component) return

    const newElement: WorkspaceElement = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      name: component.name,
      props: component.defaultProps,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 }
    }

    setElements([...elements, newElement])
  }

  const activeElement = elements.find(element => element.id === activeId)

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-md"
      case "desktop":
        return "max-w-4xl"
      default:
        return "max-w-4xl"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Workspace</h2>
            
            {/* Device View Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={deviceView === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("desktop")}
                className="h-7 w-7 p-0"
              >
                <Monitor className="h-3 w-3" />
              </Button>
              <Button
                variant={deviceView === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("tablet")}
                className="h-7 w-7 p-0"
              >
                <Tablet className="h-3 w-3" />
              </Button>
              <Button
                variant={deviceView === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("mobile")}
                className="h-7 w-7 p-0"
              >
                <Smartphone className="h-3 w-3" />
              </Button>
            </div>

            {/* Grid Toggle */}
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={onGenerateCode} size="sm">
              <Code className="h-4 w-4 mr-2" />
              Generate Code
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <div className="w-64 border-r bg-muted/50 p-4">
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Components</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMPONENT_PALETTE.map((component) => (
                <Button
                  key={component.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddElement(component.id)}
                  className="h-16 flex flex-col items-center justify-center text-xs"
                >
                  <span className="text-lg mb-1">{component.icon}</span>
                  {component.name}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Elements</h3>
              <div className="text-xs text-muted-foreground">
                {elements.length} elements in workspace
              </div>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 p-4">
          <div className={`mx-auto ${getDeviceWidth()}`}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className={`min-h-[600px] border-2 border-dashed border-gray-300 rounded-lg p-4 ${
                showGrid ? "bg-grid-pattern" : "bg-background"
              }`}>
                {elements.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Empty Workspace</h3>
                      <p className="text-sm">Drag components from the palette to get started</p>
                    </div>
                  </div>
                ) : (
                  <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {elements.map((element) => (
                        <SortableElement
                          key={element.id}
                          element={element}
                          onSelect={onElementSelect}
                          onDelete={onElementDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>

              <DragOverlay>
                {activeId && activeElement ? (
                  <div className="border-2 border-blue-500 rounded-lg p-2 bg-blue-50">
                    <div className="text-sm font-medium">{activeElement.name}</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  )
} 