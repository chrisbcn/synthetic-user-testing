"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  suggestedQuestion?: string
  disabled?: boolean
}

function MessageInput({ onSendMessage, suggestedQuestion, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (suggestedQuestion && !message) {
      setMessage(suggestedQuestion)
    }
  }, [suggestedQuestion, message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 96 // 4 lines * 24px line height
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [message])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={disabled}
          className="min-h-[48px] max-h-24 resize-none"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 self-end"
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
