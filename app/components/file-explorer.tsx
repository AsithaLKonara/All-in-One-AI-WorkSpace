"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Folder,
  File,
  FileText,
  FileCode,
  ImageIcon,
  Plus,
  FolderPlus,
  Trash2,
  Edit,
  Copy,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  path: string
  content?: string
  children?: FileItem[]
  isOpen?: boolean
}

interface FileExplorerProps {
  files: FileItem[]
  activeFile: FileItem | null
  onFileSelect: (file: FileItem) => void
  onFilesChange: (files: FileItem[]) => void
}

export function FileExplorer({ files, activeFile, onFileSelect, onFilesChange }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const getFileIcon = (fileName: string, type: string) => {
    if (type === "folder") return Folder

    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return FileCode
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return ImageIcon
      default:
        return FileText
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const createNewFile = () => {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name: "untitled.tsx",
      type: "file",
      path: "/untitled.tsx",
      content: "// New file\n",
    }
    onFilesChange([...files, newFile])
  }

  const createNewFolder = () => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: "New Folder",
      type: "folder",
      path: "/New Folder",
      children: [],
    }
    onFilesChange([...files, newFolder])
  }

  const deleteItem = (itemId: string) => {
    const filterFiles = (items: FileItem[]): FileItem[] => {
      return items
        .filter((item) => item.id !== itemId)
        .map((item) => ({
          ...item,
          children: item.children ? filterFiles(item.children) : undefined,
        }))
    }
    onFilesChange(filterFiles(files))
  }

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => {
      const Icon = getFileIcon(item.name, item.type)
      const isExpanded = expandedFolders.has(item.id)
      const isActive = activeFile?.id === item.id

      return (
        <div key={item.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded ${
                  isActive ? "bg-blue-100 text-blue-700" : ""
                }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={() => {
                  if (item.type === "folder") {
                    toggleFolder(item.id)
                  } else {
                    onFileSelect(item)
                  }
                }}
              >
                {item.type === "folder" && (
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Rename
              </ContextMenuItem>
              <ContextMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </ContextMenuItem>
              <ContextMenuItem onClick={() => deleteItem(item.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {item.type === "folder" && isExpanded && item.children && (
            <div>{renderFileTree(item.children, depth + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-700">Files</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={createNewFile}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={createNewFolder}>
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <File className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm mb-2">No files yet</p>
              <p className="text-xs">Create your first file to get started</p>
            </div>
          ) : (
            renderFileTree(files)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
