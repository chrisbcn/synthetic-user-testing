"use client"

import { Button } from "@/components/ui/button"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: {
    url: string
    filename?: string
    name?: string
    size?: number
    uploadedAt?: string
    interviewTitle?: string
  } | null
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  if (!isOpen || !video) return null

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{video.filename || video.name}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <video
          src={video.url}
          controls
          className="w-full rounded-lg mb-4"
          autoPlay
          onError={(e) => {
            console.error("[v0] Video playback error:", e)
          }}
          onLoadStart={() => {
            console.log("[v0] Video loading started")
          }}
          onCanPlay={() => {
            console.log("[v0] Video can play")
          }}
        />
        <div className="text-sm text-slate-600">
          <p>
            <strong>File:</strong> {video.filename || video.name}
          </p>
          {video.size && (
            <p>
              <strong>Size:</strong> {(video.size / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
          {video.uploadedAt && (
            <p>
              <strong>Uploaded:</strong> {new Date(video.uploadedAt).toLocaleDateString()}
            </p>
          )}
          {video.interviewTitle && (
            <p>
              <strong>Interview:</strong> {video.interviewTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
