"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Brain, Heart, Flame, Droplets, Sun, Moon, Star, Wind, Mountain, Flower } from "lucide-react"
import { RagaCard } from "./raga-card"

interface EmotionMapperProps {
  onRagaSelect?: (raga: any) => void
}

export function EmotionMapper({ onRagaSelect }: EmotionMapperProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [intensity, setIntensity] = useState([5])
  const [context, setContext] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const moods = [
    {
      id: "shringara",
      label: "श्रृंगार (Shringara)",
      englishLabel: "Love & Romance",
      color: "bg-rose-100 text-rose-800 border-rose-200",
      description: "प्रेम, काम, सौंदर्य - Love, passion, beauty",
      icon: Heart,
      rasa: "The king of all rasas, expressing love in all its forms",
    },
    {
      id: "bhakti",
      label: "भक्ति (Bhakti)",
      englishLabel: "Devotion & Surrender",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description: "भगवान के प्रति प्रेम - Divine love and surrender",
      icon: Star,
      rasa: "Sacred devotion connecting the soul to the divine",
    },
    {
      id: "shanti",
      label: "शांति (Shanti)",
      englishLabel: "Peace & Tranquility",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "मन की शांति, ध्यान - Mental peace, meditation",
      icon: Droplets,
      rasa: "The serene state of inner calm and spiritual balance",
    },
    {
      id: "veera",
      label: "वीर (Veera)",
      englishLabel: "Courage & Valor",
      color: "bg-red-100 text-red-800 border-red-200",
      description: "वीरता, साहस, शक्ति - Bravery, strength, power",
      icon: Flame,
      rasa: "The heroic sentiment inspiring courage and determination",
    },
    {
      id: "karuna",
      label: "करुणा (Karuna)",
      englishLabel: "Compassion & Sorrow",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "दया, दुःख, विरह - Compassion, grief, separation",
      icon: Moon,
      rasa: "The tender emotion of empathy and melancholic beauty",
    },
    {
      id: "hasya",
      label: "हास्य (Hasya)",
      englishLabel: "Joy & Celebration",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "आनंद, उत्सव, हर्ष - Bliss, festivity, mirth",
      icon: Sun,
      rasa: "The joyous expression of life's celebratory moments",
    },
    {
      id: "adbhuta",
      label: "अद्भुत (Adbhuta)",
      englishLabel: "Wonder & Awe",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      description: "आश्चर्य, विस्मय - Wonder, amazement, mystery",
      icon: Mountain,
      rasa: "The mystical sentiment of cosmic wonder and divine mystery",
    },
    {
      id: "raudra",
      label: "रौद्र (Raudra)",
      englishLabel: "Fierce & Intense",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      description: "क्रोध, तीव्रता - Anger, intensity, transformation",
      icon: Wind,
      rasa: "The powerful emotion of righteous anger and transformation",
    },
    {
      id: "bibhatsa",
      label: "बीभत्स (Bibhatsa)",
      englishLabel: "Disgust & Detachment",
      color: "bg-green-100 text-green-800 border-green-200",
      description: "वैराग्य, त्याग - Detachment, renunciation",
      icon: Flower,
      rasa: "The sentiment of spiritual detachment from worldly desires",
    },
  ]

  const handleEmotionMapping = async () => {
    if (!selectedMood) return

    setLoading(true)
    try {
      const response = await fetch("/api/emotion-to-raga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: selectedMood,
          intensity: intensity[0],
          context: context.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to map emotion to raga")
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error mapping emotion:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Emotion Selection */}
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-xl">भाव-राग संयोजक (Bhava-Raga Mapper)</CardTitle>
          </div>
          <CardDescription className="text-base">
            अपनी भावनाओं को चुनें और हमारा AI आपके लिए सही राग खोजेगा
            <br />
            <span className="text-sm italic">
              Select your emotional state and let our AI find the perfect ragas for your soul
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Selection */}
          <div>
            <Label className="text-lg font-semibold mb-4 block text-orange-800">
              आपका भाव कैसा है? (What is your current भाव?)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moods.map((mood) => {
                const IconComponent = mood.icon
                return (
                  <div
                    key={mood.id}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105 ${
                      selectedMood === mood.id
                        ? mood.color + " ring-2 ring-offset-2 ring-orange-400 shadow-lg"
                        : "border-gray-200 hover:border-orange-200 hover:bg-orange-50"
                    }`}
                    onClick={() => setSelectedMood(mood.id)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="w-5 h-5" />
                      <div className="font-bold text-sm">{mood.label}</div>
                    </div>
                    <div className="text-xs font-medium text-gray-700 mb-1">{mood.englishLabel}</div>
                    <div className="text-xs text-gray-600 mb-2">{mood.description}</div>
                    <div className="text-xs italic text-gray-500">{mood.rasa}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <Label className="text-base font-semibold mb-3 block text-orange-800">
              भावना की तीव्रता (Emotional Intensity): {intensity[0]}/10
            </Label>
            <Slider value={intensity} onValueChange={setIntensity} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>मंद (Subtle)</span>
              <span>मध्यम (Moderate)</span>
              <span>तीव्र (Intense)</span>
            </div>
          </div>

          {/* Context Input */}
          <div>
            <Label htmlFor="context" className="text-base font-semibold mb-3 block text-orange-800">
              अतिरिक्त संदर्भ (Additional Context) - वैकल्पिक
            </Label>
            <Textarea
              id="context"
              placeholder="जैसे: 'प्रातःकालीन ध्यान', 'संध्या विश्राम', 'मित्रों के साथ उत्सव', 'एकांत चिंतन'..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1 italic">
              e.g., 'morning meditation', 'evening relaxation', 'celebrating with friends', 'solitary contemplation'...
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleEmotionMapping}
            disabled={!selectedMood || loading}
            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI विश्लेषण कर रहा है... (AI is analyzing...)
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                मेरे राग खोजें (Find My Ragas)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* AI Analysis */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center text-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                AI विश्लेषण (AI Analysis)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 text-base leading-relaxed">{results.aiAnalysis}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
                  {results.totalFound} राग मिले (ragas found)
                </Badge>
                <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
                  भाव (Bhava): {results.mood}
                </Badge>
                <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
                  तीव्रता (Intensity): {results.intensity}/10
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Ragas */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">सुझाए गए राग (Recommended Ragas)</h3>
            <p className="text-gray-600 mb-6 italic">
              आपकी भावनाओं के अनुकूल पारंपरिक राग (Traditional ragas aligned with your emotions)
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {results.ragas.map((raga: any, index: number) => (
                <div key={raga.id} className="relative">
                  {index === 0 && (
                    <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold">
                      सर्वोत्तम मेल (Best Match)
                    </Badge>
                  )}
                  <RagaCard {...raga} youtubeLinks={raga.youtubeLinks} onPlayMelody={() => onRagaSelect?.(raga)} />
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800 font-medium">
                      विश्वसनीयता (Confidence): {Math.round(raga.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
