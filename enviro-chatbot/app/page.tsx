import ChatInterface from "@/components/chat-interface"
import { Badge } from "@/components/ui/badge"
import { Bot, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 animate-gradient flex flex-col">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-xl shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Enviro Test Construct AI
              </h1>
              <p className="text-sm text-gray-600">Smart Environmental Testing Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Centered Chatbot */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg border border-white/20">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Environmental Expert</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Ask About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Environmental Testing
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get instant, expert answers about soil analysis, groundwater testing, air quality monitoring, 
              and environmental compliance from our AI assistant.
            </p>

            {/* Quick Topics */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                Groundwater Testing
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                Soil Analysis
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
                Air Quality Monitoring
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors">
                Environmental Compliance
              </Badge>
            </div>
          </div>

          {/* Chatbot Interface */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Enviro Test Construct AI Assistant - Environmental Testing Excellence
          </p>
        </div>
      </footer>
    </div>
  )
}
