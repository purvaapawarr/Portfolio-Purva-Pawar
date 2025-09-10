"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Play, Download, Music, Wand2, BarChart3 } from "lucide-react"
import { ragaGrammarDatabase } from "@/lib/raga-grammar"
import { AudioPlayer } from "@/lib/midi-generator"

interface MidiGeneratorProps {
  selectedRaga?: any
}

export function MidiGenerator({ selectedRaga }: MidiGeneratorProps) {
  const [ragaId, setRagaId] = useState(selectedRaga?.id || "yaman")
  const [duration, setDuration] = useState([30])
  const [tempo, setTempo] = useState([120])
  const [complexity, setComplexity] = useState("medium")
  const [includeOrnaments, setIncludeOrnaments] = useState(true)
  const [startWithPakad, setStartWithPakad] = useState(true)
  const [loading, setLoading] = useState(false)
  const [generatedMelody, setGeneratedMelody] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlayer] = useState(() => new AudioPlayer())

  const handleGenerateMelody = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-midi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ragaId,
          duration: duration[0],
          tempo: tempo[0],
          complexity,
          includeOrnaments,
          startWithPakad,
          format: "json",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate melody")
      }

      const data = await response.json()
      setGeneratedMelody(data)
    } catch (error) {
      console.error("Error generating melody:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadMidi = async () => {
    try {
      const response = await fetch("/api/generate-midi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ragaId,
          duration: duration[0],
          tempo: tempo[0],
          complexity,
          includeOrnaments,
          startWithPakad,
          format: "midi",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to download MIDI")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `raga-${ragaId}-melody.mid`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading MIDI:", error)
    }
  }

  const playMelody = async () => {
    if (!generatedMelody) return

    setIsPlaying(true)
    try {
      await audioPlayer.playMelody(generatedMelody.melody)
      // Set timeout to reset playing state
      setTimeout(() => {
        setIsPlaying(false)
      }, generatedMelody.melody.totalDuration * 1000)
    } catch (error) {
      console.error("Error playing melody:", error)
      setIsPlaying(false)
    }
  }

  const selectedRagaGrammar = ragaGrammarDatabase.find((r) => r.id === ragaId)

  return (
    <div className="space-y-6">
      {/* Raga Selection and Parameters */}
      <Card className="border-amber-200 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
        {/* Traditional Indian border pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400"></div>
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 via-red-400 to-orange-400"></div>
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-orange-400 via-red-400 to-orange-400"></div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-amber-400 opacity-30"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-amber-400 opacity-30"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-amber-400 opacity-30"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-amber-400 opacity-30"></div>

        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-amber-900 font-serif text-xl">स्वर संयोजक | MIDI Melody Generator</CardTitle>
              <p className="text-amber-700 text-sm mt-1">
                Generate authentic raga-based melodies following traditional Indian classical music rules
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Raga Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Raga</Label>
            <Select value={ragaId} onValueChange={setRagaId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a raga" />
              </SelectTrigger>
              <SelectContent>
                {ragaGrammarDatabase.map((raga) => (
                  <SelectItem key={raga.id} value={raga.id}>
                    {raga.name} ({raga.thaat})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRagaGrammar && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>Vadi:</strong> {selectedRagaGrammar.vadi}
                  </div>
                  <div>
                    <strong>Samvadi:</strong> {selectedRagaGrammar.samvadi}
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedRagaGrammar.timeOfDay}
                  </div>
                  <div>
                    <strong>Mood:</strong> {selectedRagaGrammar.mood.join(", ")}
                  </div>
                </div>
                <div className="mt-2">
                  <div>
                    <strong>Aroha:</strong> <span className="font-mono">{selectedRagaGrammar.aroha.join(" ")}</span>
                  </div>
                  <div>
                    <strong>Avroha:</strong> <span className="font-mono">{selectedRagaGrammar.avroha.join(" ")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Duration Slider */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Duration: {duration[0]} seconds</Label>
            <Slider value={duration} onValueChange={setDuration} max={120} min={10} step={5} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10s</span>
              <span>60s</span>
              <span>120s</span>
            </div>
          </div>

          {/* Tempo Slider */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Tempo: {tempo[0]} BPM</Label>
            <Slider value={tempo} onValueChange={setTempo} max={200} min={60} step={10} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slow (60)</span>
              <span>Medium (120)</span>
              <span>Fast (200)</span>
            </div>
          </div>

          {/* Complexity Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Complexity Level</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple - Basic phrases (4-6 notes)</SelectItem>
                <SelectItem value="medium">Medium - Moderate phrases (6-9 notes)</SelectItem>
                <SelectItem value="complex">Complex - Advanced phrases (8-13 notes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Include Ornaments</Label>
                <p className="text-sm text-gray-600">Add traditional ornamentations like meend, gamak</p>
              </div>
              <Switch checked={includeOrnaments} onCheckedChange={setIncludeOrnaments} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold">Start with Pakad</Label>
                <p className="text-sm text-gray-600">Begin with characteristic raga phrase</p>
              </div>
              <Switch checked={startWithPakad} onCheckedChange={setStartWithPakad} />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateMelody}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 border-2 border-amber-300"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                स्वर रचना कर रहे हैं... | Generating melody...
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2" />
                राग मेलोडी बनाएं | Generate Raga Melody
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Melody Results */}
      {generatedMelody && (
        <div className="space-y-6">
          {/* Playback Controls */}
          <Card className="border-emerald-200 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden">
            {/* Traditional paisley pattern background */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                <path d="M20,50 Q30,30 50,50 Q70,70 80,50 Q70,30 50,50 Q30,70 20,50 Z" className="text-emerald-600" />
                <path d="M60,20 Q70,10 80,20 Q90,30 80,40 Q70,30 60,20 Z" className="text-emerald-500" />
                <path d="M10,80 Q20,70 30,80 Q40,90 30,100 Q20,90 10,80 Z" className="text-emerald-500" />
              </svg>
            </div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-emerald-800 flex items-center font-serif">
                <Music className="w-6 h-6 mr-3 text-emerald-600" />
                <div>
                  <div className="text-xl">रचित स्वर माला | Generated Melody</div>
                  <div className="text-lg text-emerald-600 mt-1">{generatedMelody.ragaInfo.name}</div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={playMelody}
                  disabled={isPlaying}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105"
                >
                  {isPlaying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      बजा रहे हैं... | Playing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      स्वर सुनें | Play Melody
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDownloadMidi}
                  variant="outline"
                  className="border-2 border-emerald-300 hover:bg-emerald-100 bg-white text-emerald-700 font-semibold px-6 py-2 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  MIDI डाउनलोड करें | Download MIDI
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong>Duration:</strong> {Math.round(generatedMelody.analysis.duration)}s
                </div>
                <div>
                  <strong>Notes:</strong> {generatedMelody.analysis.totalNotes}
                </div>
                <div>
                  <strong>Tempo:</strong> {generatedMelody.analysis.tempo} BPM
                </div>
                <div>
                  <strong>Authenticity:</strong> {Math.round(generatedMelody.analysis.authenticity * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Musical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Swaras Used:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {generatedMelody.analysis.swarasUsed.map((swara: string) => (
                      <Badge key={swara} variant="outline" className="bg-purple-50 border-purple-200">
                        {swara}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Vadi Emphasis:</Label>
                    <p className="text-sm text-gray-600">{generatedMelody.analysis.vadiEmphasis} occurrences</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Samvadi Emphasis:</Label>
                    <p className="text-sm text-gray-600">{generatedMelody.analysis.samvadiEmphasis} occurrences</p>
                  </div>
                </div>

                {generatedMelody.analysis.ornamentsUsed.length > 0 && (
                  <div>
                    <Label className="font-semibold">Ornaments Used:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedMelody.analysis.ornamentsUsed.map((ornament: string) => (
                        <Badge key={ornament} variant="outline" className="bg-orange-50 border-orange-200">
                          {ornament}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="font-semibold">Phrase Structure:</Label>
                  <p className="text-sm text-gray-600">
                    {generatedMelody.analysis.phraseStructure.totalPhrases} phrases, average length:{" "}
                    {Math.round(generatedMelody.analysis.phraseStructure.averagePhraseLength)} notes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
