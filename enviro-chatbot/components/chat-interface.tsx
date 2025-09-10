"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

const exampleQuestions = [
  "How do you detect groundwater contamination?",
  "What soil testing services do you offer?",
  "Tell me about air quality monitoring during construction",
  "What is a Phase I environmental assessment?",
  "How do you ensure environmental compliance?",
  "What analytical methods do you use for soil testing?",
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your Environmental Testing AI Assistant. I can help you with questions about:\n\n🌊 Groundwater contamination detection\n🌱 Soil analysis and testing\n🌬️ Air quality monitoring\n📋 Environmental compliance\n🔬 Laboratory analytical methods\n\nWhat would you like to know about our environmental testing services?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: msg.content + chunk } : msg)),
          )
        }
      }
    } catch (error) {
      console.error("Chat API Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try asking about our environmental testing services such as groundwater monitoring, soil analysis, air quality testing, or regulatory compliance.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[700px]">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Environmental Testing AI Assistant</h3>
            <p className="text-blue-100 text-sm">Ask me anything about environmental testing and compliance</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-lg ${
                message.role === "user" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto" 
                  : "bg-white text-gray-900 border border-gray-100"
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {message.role === "user" && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Analyzing your question...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Questions */}
      {messages.length === 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">Try asking about:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs py-1 px-3"
                onClick={() => handleExampleClick(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about environmental testing, soil analysis, air quality monitoring..."
            disabled={isLoading}
            className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl px-6 shadow-lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
