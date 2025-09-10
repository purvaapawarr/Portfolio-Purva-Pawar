"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Heart, Mic, Play, ArrowRight, BarChart3, Settings, Download, Upload } from "lucide-react"
import { EmotionMapper } from "@/components/emotion-mapper"
import { MidiGenerator } from "@/components/midi-generator"
import { PitchTrainer } from "@/components/pitch-trainer"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AdvancedSettings } from "@/components/advanced-settings"
import { UserProgressManager } from "@/lib/user-progress"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<
    "home" | "emotion-mapper" | "midi-generator" | "pitch-trainer" | "progress" | "settings"
  >("home")
  const [selectedRaga, setSelectedRaga] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userProgress, setUserProgress] = useState<any>(null)

  useEffect(() => {
    const manager = UserProgressManager.getInstance()
    manager.loadFromLocalStorage()
    setUserProgress(manager.getProgress())
  }, [])

  const handleSectionChange = async (section: typeof activeSection) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setActiveSection(section)
    setIsLoading(false)
  }

  const handleExportProgress = () => {
    const manager = UserProgressManager.getInstance()
    const progress = manager.getProgress()
    const dataStr = JSON.stringify(progress, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `ragalchemy-progress-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleImportProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const progress = JSON.parse(e.target?.result as string)
        const manager = UserProgressManager.getInstance()
        manager.importProgress(progress)
        setUserProgress(manager.getProgress())
        alert("Progress imported successfully!")
      } catch (error) {
        alert("Error importing progress file")
      }
    }
    reader.readAsText(file)
  }

  if (activeSection === "emotion-mapper") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <pattern id="paisley" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,5 Q15,2 18,8 Q15,15 10,12 Q5,8 10,5 Z" fill="currentColor" className="text-orange-300" />
            </pattern>
            <rect width="100" height="100" fill="url(#paisley)" />
          </svg>
        </div>

        <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg relative">
                  <Music className="w-6 h-6 text-white" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-serif">RAGALCHEMY</h1>
                  <p className="text-sm text-orange-600 font-semibold">भाव-राग मैपर | Emotion-Raga Mapper</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSectionChange("progress")}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  प्रगति
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange("home")}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <EmotionMapper onRagaSelect={setSelectedRaga} />
        </div>
      </div>
    )
  }

  if (activeSection === "midi-generator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RAGALCHEMY</h1>
                  <p className="text-sm text-gray-600">स्वर संयोजक</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSectionChange("progress")}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  प्रगति
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange("home")}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <MidiGenerator selectedRaga={selectedRaga} />
        </div>
      </div>
    )
  }

  if (activeSection === "pitch-trainer") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RAGALCHEMY</h1>
                  <p className="text-sm text-gray-600">स्वर शिक्षक</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSectionChange("progress")}
                  className="border-green-200 hover:bg-green-50"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  प्रगति
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange("home")}
                  className="border-green-200 hover:bg-green-50"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <PitchTrainer />
        </div>
      </div>
    )
  }

  if (activeSection === "progress") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <header className="border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RAGALCHEMY</h1>
                  <p className="text-sm text-gray-600">प्रगति दर्शन</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportProgress}
                  className="border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  निर्यात करें (Export)
                </Button>
                <label className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 hover:bg-purple-50 bg-transparent"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      आयात करें (Import)
                    </span>
                  </Button>
                  <input type="file" accept=".json" onChange={handleImportProgress} className="hidden" />
                </label>
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange("home")}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <ProgressDashboard />
        </div>
      </div>
    )
  }

  if (activeSection === "settings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-500 rounded-full flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RAGALCHEMY</h1>
                  <p className="text-sm text-gray-600">सुधार सेटिंग्स</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleSectionChange("home")}
                className="border-gray-200 hover:bg-gray-50"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <AdvancedSettings />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          {/* Traditional lotus pattern */}
          <pattern id="lotus" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20,10 Q25,5 30,10 Q35,15 30,20 Q25,25 20,20 Q15,15 20,10 Z" fill="currentColor" className="text-orange-300" />
            <path d="M20,15 Q22,12 25,15 Q22,18 20,15 Z" fill="currentColor" className="text-red-300" />
          </pattern>
          <rect width="200" height="200" fill="url(#lotus)" />
          
          {/* Decorative border elements */}
          <pattern id="border" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" className="text-amber-300" />
            <circle cx="5" cy="5" r="1" fill="currentColor" className="text-orange-300" />
            <circle cx="15" cy="15" r="1" fill="currentColor" className="text-red-300" />
          </pattern>
          <rect x="0" y="0" width="200" height="10" fill="url(#border)" />
          <rect x="0" y="190" width="200" height="10" fill="url(#border)" />
        </svg>
      </div>

      <header className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 relative">
        {/* Traditional decorative top border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-400 via-orange-400 via-red-400 to-orange-400"></div>
        
        {/* Corner decorative elements */}
        <div className="absolute top-2 left-4 w-6 h-6 border-l-2 border-t-2 border-orange-300 opacity-40"></div>
        <div className="absolute top-2 right-4 w-6 h-6 border-r-2 border-t-2 border-orange-300 opacity-40"></div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg">॥</div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-orange-400 to-red-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-30 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-serif">
                  RAGALCHEMY
                </h1>
                <p className="text-sm text-gray-600 font-semibold">रागों का रसायन • The Science of Ragas</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-orange-600 font-semibold"
                onClick={() => handleSectionChange("emotion-mapper")}
              >
                भाव-राग मैपर
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-orange-600 font-semibold"
                onClick={() => handleSectionChange("midi-generator")}
              >
                स्वर संयोजक
              </Button>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-orange-600 font-semibold"
                onClick={() => handleSectionChange("pitch-trainer")}
              >
                स्वर शिक्षक
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-orange-600"
                onClick={() => handleSectionChange("progress")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                प्रगति
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-orange-600"
                onClick={() => handleSectionChange("settings")}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </nav>
          </div>
        </header>

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl border-2 border-orange-200 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-400 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-orange-300 opacity-30"></div>
              </div>
              <span className="text-gray-700 font-semibold">प्रतीक्षा करें... Loading...</span>
            </div>
          </div>
        </div>
      )}

      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-serif">
            <span className="block text-2xl md:text-3xl text-orange-600 mb-2 relative">
              ॥ श्री गणेशाय नमः ॥
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-orange-300 rounded-full opacity-50"></div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-300 rounded-full opacity-50"></div>
            </span>
            Transform Emotions into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
              {" "}
              Sacred Ragas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Experience the divine alchemy of Indian classical music through AI. Map भावs (emotions) to राग (ragas),
            generate authentic मेलोडी following शास्त्रीय (classical) rules, and train your कान (ear) with ancient wisdom.
          </p>
          <p className="text-lg text-orange-600 font-semibold mb-8 relative">
            "संगीतं सर्वविद्यानां प्रधानम्" - Music is the foremost among all knowledge
            <span className="absolute -left-6 top-0 text-3xl text-orange-300 opacity-50">"</span>
            <span className="absolute -right-6 bottom-0 text-3xl text-orange-300 opacity-50">"</span>
          </p>

          {userProgress && (
            <div className="mt-8 flex justify-center">
              <Card className="bg-white/60 backdrop-blur-sm border-2 border-orange-200 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400"></div>
                
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userProgress.totalSessions}</div>
                      <div className="text-gray-600">साधना Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userProgress.ragasLearned.length}</div>
                      <div className="text-gray-600">राग Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(userProgress.averageScore)}%</div>
                      <div className="text-gray-600">शुद्धता Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm relative overflow-hidden group">
            {/* Traditional corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-rose-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-rose-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-rose-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-rose-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 shadow-lg relative">
                <Heart className="w-6 h-6 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg opacity-30 animate-pulse"></div>
              </div>
              <CardTitle className="text-xl text-gray-900 font-serif">भाव-राग संयोजक (Emotion-Raga Mapper)</CardTitle>
              <CardDescription>
                Discover which राग resonates with your current भाव (emotional state) using ancient रस theory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-rose-50 p-4 rounded-lg border border-rose-100 relative">
                  <div className="absolute top-1 right-1 w-2 h-2 bg-rose-300 rounded-full opacity-50"></div>
                  <h4 className="font-semibold text-rose-900 mb-2">AI शक्ति (Powers):</h4>
                  <ul className="text-sm text-rose-800 space-y-1">
                    <li>• नवरस (9 emotions) analysis</li>
                    <li>• समय-राग (time-raga) matching</li>
                    <li>• आत्मविश्वास (confidence) scoring</li>
                    <li>• YouTube संगीत integration</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  onClick={() => handleSectionChange("emotion-mapper")}
                >
                  भाव खोजें (Discover Emotions)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm relative overflow-hidden group">
            {/* Traditional corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-blue-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-blue-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-blue-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 shadow-lg relative">
                <Play className="w-6 h-6 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg opacity-30 animate-pulse"></div>
              </div>
              <CardTitle className="text-xl text-gray-900 font-serif">स्वर संयोजक (Swara Composer)</CardTitle>
              <CardDescription>
                Generate authentic राग-based melodies following शास्त्रीय संगीत (classical music) grammar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative">
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-full opacity-50"></div>
                  <h4 className="font-semibold text-blue-900 mb-2">शास्त्रीय Features:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• आरोह/अवरोह (Aroha/Avroha) patterns</li>
                    <li>• वादी/संवादी (Vadi/Samvadi) emphasis</li>
                    <li>• पकड़ (Pakad) phrase generation</li>
                    <li>• MIDI निर्यात & विश्लेषण</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  onClick={() => handleSectionChange("midi-generator")}
                >
                  संगीत रचना करें (Compose Music)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm relative overflow-hidden group">
            {/* Traditional corner decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-300 opacity-40 group-hover:opacity-70 transition-opacity"></div>
            
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 shadow-lg relative">
                <Mic className="w-6 h-6 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg opacity-30 animate-pulse"></div>
              </div>
              <CardTitle className="text-xl text-gray-900 font-serif">स्वर शिक्षक (Swara Guru)</CardTitle>
              <CardDescription>
                Train your कान (ear) with AI-powered स्वर detection and गुरु-शिष्य feedback system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 relative">
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-300 rounded-full opacity-50"></div>
                  <h4 className="font-semibold text-green-900 mb-2">AI गुरु Training:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Real-time स्वर detection</li>
                    <li>• शुद्ध/कोमल identification</li>
                    <li>• राग नियम validation</li>
                    <li>• साधना progress tracking</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  onClick={() => handleSectionChange("pitch-trainer")}
                >
                  साधना शुरू करें (Begin Practice)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-12 border-t-2 border-orange-200 bg-white/40 backdrop-blur-sm rounded-lg relative overflow-hidden">
          {/* Decorative top border pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-orange-400 via-red-400 via-orange-400 to-transparent"></div>
          
          {/* Corner lotus decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 opacity-20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
              <path d="M12,2 Q16,6 12,10 Q8,6 12,2 Z M12,10 Q16,14 12,18 Q8,14 12,10 Z M12,18 Q16,22 12,26 Q8,22 12,18 Z" />
            </svg>
          </div>
          <div className="absolute top-4 right-4 w-8 h-8 opacity-20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
              <path d="M12,2 Q16,6 12,10 Q8,6 12,2 Z M12,10 Q16,14 12,18 Q8,14 12,10 Z M12,18 Q16,22 12,26 Q8,22 12,18 Z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 font-serif">
            परंपरा में निहित, AI से सशक्त
            <span className="block text-lg text-gray-600 mt-2">Rooted in Tradition, Empowered by AI</span>
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our algorithms honor the sacred principles of भारतीय शास्त्रीय संगीत while leveraging modern machine learning
            to create an immersive साधना (practice) and खोज (discovery) experience. Each राग carries centuries of
            wisdom, now accessible through intelligent technology.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => handleSectionChange("progress")}
              className="border-2 border-orange-200 hover:bg-orange-50 font-semibold"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              प्रगति देखें (View Progress)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSectionChange("settings")}
              className="border-2 border-orange-200 hover:bg-orange-50 font-semibold"
            >
              <Settings className="w-4 h-4 mr-2" />
              सेटिंग्स (Settings)
            </Button>
          </div>
        </div>
      </section>
    </div>
  )\
}
