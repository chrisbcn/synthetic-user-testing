"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, File, ImageIcon, FileText, Trash2, Download, Eye, X, Plus } from "lucide-react"
import type { ProjectFile } from "@/lib/types"

// Mock file data
const mockFiles: ProjectFile[] = [
  {
    id: "file-1",
    name: "User Journey Wireframes.pdf",
    type: "wireframe",
    size: 2.4 * 1024 * 1024,
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    uploadedBy: "user-1",
    url: "/mock-wireframes.pdf",
    description: "Complete user journey wireframes for luxury shopping experience",
  },
  {
    id: "file-2",
    name: "Previous Interview Transcripts.docx",
    type: "transcript",
    size: 1.8 * 1024 * 1024,
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    uploadedBy: "user-1",
    url: "/mock-transcripts.docx",
    description: "Transcripts from previous user interviews about luxury preferences",
  },
  {
    id: "file-3",
    name: "App Flow Diagram.png",
    type: "diagram",
    size: 856 * 1024,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    uploadedBy: "user-1",
    url: "/mock-flow.png",
    description: "Visual flow diagram showing app navigation and user paths",
  },
]

interface FileRepositoryProps {
  projectId: string
}

export function FileRepository({ projectId }: FileRepositoryProps) {
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "wireframe" as ProjectFile["type"],
    description: "",
  })
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: ProjectFile["type"]) => {
    switch (type) {
      case "wireframe":
      case "diagram":
        return <ImageIcon className="w-5 h-5" />
      case "transcript":
      case "document":
        return <FileText className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: ProjectFile["type"]) => {
    switch (type) {
      case "wireframe":
        return "bg-blue-100 text-blue-800"
      case "transcript":
        return "bg-green-100 text-green-800"
      case "diagram":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const detectFileType = (fileName: string): ProjectFile["type"] => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
      case "fig":
      case "sketch":
        return "wireframe"
      case "doc":
      case "docx":
      case "txt":
        return "transcript"
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
        return "diagram"
      default:
        return "document"
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setSelectedFiles(droppedFiles)
    setShowUpload(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setSelectedFiles(selectedFiles)
      setShowUpload(true)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 && !uploadForm.name) return

    // If files are selected, process them
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const fileId = `file-${Date.now()}-${Math.random()}`

        // Simulate upload progress
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }))

        // Simulate upload with progress
        const uploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[fileId] || 0
            if (currentProgress >= 100) {
              clearInterval(uploadInterval)
              return prev
            }
            return { ...prev, [fileId]: currentProgress + 10 }
          })
        }, 200)

        // Create file object after "upload" completes
        setTimeout(() => {
          const newFile: ProjectFile = {
            id: fileId,
            name: file.name,
            type: detectFileType(file.name),
            size: file.size,
            uploadedAt: new Date(),
            uploadedBy: "user-1",
            url: URL.createObjectURL(file), // Create blob URL for preview
            description: `Uploaded ${file.name} for project context`,
          }

          setFiles((prev) => [newFile, ...prev])
          setUploadProgress((prev) => {
            const { [fileId]: _, ...rest } = prev
            return rest
          })
        }, 2000)
      }
    } else {
      // Manual form upload
      const newFile: ProjectFile = {
        id: `file-${Date.now()}`,
        name: uploadForm.name,
        type: uploadForm.type,
        size: Math.random() * 2 * 1024 * 1024,
        uploadedAt: new Date(),
        uploadedBy: "user-1",
        url: `/mock-${uploadForm.name}`,
        description: uploadForm.description,
      }
      setFiles((prev) => [newFile, ...prev])
    }

    setShowUpload(false)
    setSelectedFiles([])
    setUploadForm({ name: "", type: "wireframe", description: "" })
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const deleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>File Repository</CardTitle>
            <CardDescription>
              Upload wireframes, transcripts, and other materials to train synthetic interviewers
            </CardDescription>
          </div>
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Add files to help train the synthetic interviewers with project context
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">Drop files here or click to browse</p>
                  <p className="text-sm text-slate-500 mb-4">Supports PDF, DOC, PNG, JPG, FIG, and more</p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.svg,.fig,.sketch"
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getFileIcon(detectFileType(file.name))}
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-slate-500">
                                {formatFileSize(file.size)} • {detectFileType(file.name)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeSelectedFile(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Uploading...</h4>
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Uploading file...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Manual Form (fallback) */}
                {selectedFiles.length === 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Or add file manually</h4>
                    <div>
                      <label className="text-sm font-medium">File Name</label>
                      <Input
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter file name..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">File Type</label>
                      <select
                        value={uploadForm.type}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, type: e.target.value as ProjectFile["type"] }))
                        }
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="wireframe">Wireframe</option>
                        <option value="transcript">Transcript</option>
                        <option value="diagram">Flow Diagram</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe how this file should be used in interviews..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowUpload(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={selectedFiles.length === 0 && !uploadForm.name}>
                    Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Files` : "File"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* File Grid */}
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <Badge className={getTypeColor(file.type)}>{file.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{file.description}</p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteFile(file.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How uploaded files enhance interviews:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>Wireframes:</strong> Synthetic interviewers can reference and show specific UI elements
            </li>
            <li>
              • <strong>Transcripts:</strong> Previous research informs more contextual questioning
            </li>
            <li>
              • <strong>Flow Diagrams:</strong> Interviewers understand user journeys for targeted feedback
            </li>
            <li>
              • <strong>Documents:</strong> Brand guidelines and requirements shape interview direction
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
