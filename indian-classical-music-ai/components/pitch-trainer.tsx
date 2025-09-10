"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, MicOff, Volume2, Target, TrendingUp, Award, AlertCircle } from "lucide-react"
import { PitchDetector, type PitchDetectionResult, swaraFrequencies } from "@/lib/pitch-detection"
import { ragaGrammarDatabase } from "@/lib/raga-grammar"

interface SessionAttempt {
  swara: string
  frequency: number
  confidence: number
  isCorrect: boolean
  timestamp: number
}

export function PitchTrainer() {
  const [selectedRaga, setSelectedRaga] = useState("yaman")
  const [isListening, setIsListening] = useState(false)
  const [currentPitch, setCurrentPitch] = useState<PitchDetectionResult | null>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [sessionAttempts, setSessionAttempts] = useState<SessionAttempt[]>([])
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [targetSwara, setTargetSwara] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const pitchDetectorRef = useRef<PitchDetector | null>(null)
  const lastAnalysisRef = useRef<number>(0)

  useEffect(() => {
    pitchDetectorRef.current = new PitchDetector()
    setIsSupported(pitchDetectorRef.current.isSupported())

    return () => {
      if (pitchDetectorRef.current) {
        pitchDetectorRef.current.stopListening()
      }
    }
  }, [])

  const startListening = async () => {
    if (!pitchDetectorRef.current) return

    const success = await pitchDetectorRef.current.startListening((result: PitchDetectionResult) => {
      setCurrentPitch(result)

      // Throttle analysis to avoid too many API calls
      const now = Date.now()
      if (now - lastAnalysisRef.current > 1000 && result.swara && result.confidence > 0.5) {
        lastAnalysisRef.current = now
        analyzePitch(result)
      }
    })

    if (success) {
      setIsListening(true)
      setPermissionDenied(false)
    } else {
      setPermissionDenied(true)
    }
  }

  const stopListening = () => {
    if (pitchDetectorRef.current) {
      pitchDetectorRef.current.stopListening()
    }
    setIsListening(false)
    setCurrentPitch(null)
  }

  const analyzePitch = async (pitchResult: PitchDetectionResult) => {
    try {
      const response = await fetch("/api/pitch-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swara: pitchResult.swara,
          ragaId: selectedRaga,
          frequency: pitchResult.frequency,
          confidence: pitchResult.confidence,
          sessionData: sessionAttempts,
        }),
      })

      if (!response.ok) return

      const analysis = await response.json()
      setFeedback(analysis.feedback)
      setSessionStats(analysis.sessionStats)

      // Add to session attempts
      const attempt: SessionAttempt = {
        swara: pitchResult.swara!,
        frequency: pitchResult.frequency,
        confidence: pitchResult.confidence,
        isCorrect: analysis.validation.isValid,
        timestamp: pitchResult.timestamp,
      }

      setSessionAttempts((prev) => [...prev.slice(-19), attempt]) // Keep last 20 attempts
    } catch (error) {
      console.error("Error analyzing pitch:", error)
    }
  }

  const setRandomTarget = () => {
    const ragaGrammar = ragaGrammarDatabase.find((r) => r.id === selectedRaga)
    if (ragaGrammar) {
      const randomSwara = ragaGrammar.allowedSwaras[Math.floor(Math.random() * ragaGrammar.allowedSwaras.length)]
      setTargetSwara(randomSwara)
    }
  }

  const clearSession = () => {
    setSessionAttempts([])
    setSessionStats(null)
    setFeedback(null)
    setTargetSwara(null)
  }

  const selectedRagaData = ragaGrammarDatabase.find((r) => r.id === selectedRaga)

  if (!isSupported) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your browser doesn't support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Raga Selection and Controls */}
      <Card className="border-green-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <CardTitle>Pitch-to-Swara Trainer</CardTitle>
          </div>
          <CardDescription>Train your ear by singing swaras and get real-time AI feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Raga Selection */}
          <div>
            <label className="text-base font-semibold mb-3 block">Select Training Raga</label>
            <Select value={selectedRaga} onValueChange={setSelectedRaga}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ragaGrammarDatabase.map((raga) => (
                  <SelectItem key={raga.id} value={raga.id}>
                    {raga.name} ({raga.thaat})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRagaData && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Allowed Swaras:</strong>{" "}
                    <span className="font-mono">{selectedRagaData.allowedSwaras.join(" ")}</span>
                  </div>
                  <div>
                    <strong>Vadi:</strong> {selectedRagaData.vadi} | <strong>Samvadi:</strong>{" "}
                    {selectedRagaData.samvadi}
                  </div>
                  {selectedRagaData.forbiddenSwaras && (
                    <div>
                      <strong>Forbidden:</strong>{" "}
                      <span className="font-mono text-red-600">{selectedRagaData.forbiddenSwaras.join(" ")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Target Practice */}
          <div className="flex gap-3">
            <Button
              onClick={setRandomTarget}
              variant="outline"
              className="border-green-200 hover:bg-green-50 bg-transparent"
            >
              <Target className="w-4 h-4 mr-2" />
              Random Target
            </Button>
            <Button onClick={clearSession} variant="outline" className="border-gray-200 bg-transparent">
              Clear Session
            </Button>
          </div>

          {targetSwara && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Target Swara: {targetSwara}</h4>
                  <p className="text-sm text-blue-700">
                    {swaraFrequencies[targetSwara]?.name} - {Math.round(swaraFrequencies[targetSwara]?.frequency)} Hz
                  </p>
                </div>
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex gap-3">
            {!isListening ? (
              <Button
                onClick={startListening}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                size="lg"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Listening
              </Button>
            ) : (
              <Button onClick={stopListening} variant="destructive" size="lg">
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </Button>
            )}
          </div>

          {permissionDenied && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Microphone access denied. Please allow microphone access and refresh the page.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Real-time Pitch Display */}
      {isListening && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Mic className="w-5 h-5 mr-2" />
              Live Pitch Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPitch ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{currentPitch.swara || "?"}</div>
                    <div className="text-sm text-blue-700">Detected Swara</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{Math.round(currentPitch.frequency)} Hz</div>
                    <div className="text-sm text-blue-700">Frequency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">{Math.round(currentPitch.confidence * 100)}%</div>
                    <div className="text-sm text-blue-700">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {currentPitch.cents > 0 ? "+" : ""}
                      {Math.round(currentPitch.cents)}¢
                    </div>
                    <div className="text-sm text-blue-700">Cents Deviation</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pitch Accuracy</span>
                    <span>{Math.round(currentPitch.confidence * 100)}%</span>
                  </div>
                  <Progress value={currentPitch.confidence * 100} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-blue-600">
                <Mic className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                <p>Listening for your voice... Start singing!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {feedback && (
        <Card
          className={`border-2 ${feedback.ragaValidation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center ${feedback.ragaValidation.isValid ? "text-green-800" : "text-red-800"}`}
            >
              {feedback.ragaValidation.isValid ? (
                <Award className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {feedback.ragaValidation.isValid ? "Correct!" : "Try Again"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className={`font-semibold ${feedback.ragaValidation.isValid ? "text-green-700" : "text-red-700"}`}>
                  {feedback.ragaValidation.feedback}
                </p>
                {feedback.ragaValidation.suggestion && (
                  <p className="text-sm text-gray-600 mt-1">{feedback.ragaValidation.suggestion}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Detected:</strong> {feedback.swara} ({feedback.frequency} Hz)
                </div>
                <div>
                  <strong>Accuracy:</strong> {feedback.confidence}% ({feedback.pitchAccuracy})
                </div>
              </div>

              {feedback.tips && feedback.tips.length > 0 && (
                <div>
                  <strong className="text-sm">Tips:</strong>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {feedback.tips.map((tip: string, index: number) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Statistics */}
      {sessionStats && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Session Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{sessionStats.totalAttempts}</div>
                <div className="text-sm text-purple-700">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{sessionStats.correctAttempts}</div>
                <div className="text-sm text-purple-700">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{sessionStats.accuracy}%</div>
                <div className="text-sm text-purple-700">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900">{sessionStats.averageConfidence}%</div>
                <div className="text-sm text-purple-700">Avg Confidence</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <Badge
                  variant="outline"
                  className={
                    sessionStats.improvementTrend === "excellent"
                      ? "bg-green-100 border-green-300 text-green-800"
                      : sessionStats.improvementTrend === "improving"
                        ? "bg-blue-100 border-blue-300 text-blue-800"
                        : "bg-yellow-100 border-yellow-300 text-yellow-800"
                  }
                >
                  {sessionStats.improvementTrend.replace("_", " ")}
                </Badge>
              </div>
              <Progress value={sessionStats.accuracy} className="h-2" />
            </div>

            {/* Recent Attempts */}
            {sessionAttempts.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Recent Attempts:</h4>
                <div className="flex flex-wrap gap-1">
                  {sessionAttempts.slice(-10).map((attempt, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={
                        attempt.isCorrect
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-red-100 border-red-300 text-red-800"
                      }
                    >
                      {attempt.swara}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
