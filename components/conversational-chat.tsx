"use client"

import { useEffect, useRef } from "react"
import MessageInput from "./message-input"

interface Message {
  role: "interviewer" | "persona"
  content: string
  timestamp: Date
}

interface ConversationalChatProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isPersonaTyping: boolean
  suggestedQuestion?: string
  interviewerName?: string
  personaName?: string
}

function ConversationalChat({
  messages,
  onSendMessage,
  isPersonaTyping,
  suggestedQuestion,
  interviewerName,
  personaName,
}: ConversationalChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isPersonaTyping])

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="w-full border-b border-gray-200">
            <div
              className={`w-full px-6 py-4 ${
                message.role === "interviewer"
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "bg-gray-50 border-l-4 border-l-gray-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    message.role === "interviewer" ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {message.role === "interviewer"
                    ? interviewerName || "Researcher"
                    : personaName || "Interviewee"}
                </span>
                <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
              </div>
              <p className="text-gray-900 leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isPersonaTyping && (
          <div className="w-full border-b border-gray-200">
            <div className="w-full px-6 py-4 bg-gray-50 border-l-4 border-l-gray-400">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{personaName || "Interviewee"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      
    </div>
  )
}

export default ConversationalChat
