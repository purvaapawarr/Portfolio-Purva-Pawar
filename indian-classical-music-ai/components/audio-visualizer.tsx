"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, AudioWaveformIcon as Waveform, Activity } from "lucide-react"

interface AudioVisualizerProps {
  isActive?: boolean
  audioContext?: AudioContext
  analyser?: AnalyserNode
  title?: string
}

export function AudioVisualizer({
  isActive = false,
  audioContext,
  analyser,
  title = "Audio Visualization",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [visualizationType, setVisualizationType] = useState<"waveform" | "frequency" | "spectrogram">("frequency")
  const [audioData, setAudioData] = useState<{
    frequency: number
    volume: number
    dominantFreq: number
  }>({ frequency: 0, volume: 0, dominantFreq: 0 })

  useEffect(() => {
    if (!isActive || !analyser || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const timeDataArray = new Float32Array(bufferLength)

    const draw = () => {
      if (!isActive) return

      analyser.getByteFrequencyData(dataArray)
      analyser.getFloatTimeDomainData(timeDataArray)

      // Calculate audio metrics
      const volume = Array.from(dataArray).reduce((sum, val) => sum + val, 0) / dataArray.length / 255
      const dominantFreqIndex = dataArray.indexOf(Math.max(...Array.from(dataArray)))
      const dominantFreq = (dominantFreqIndex * audioContext!.sampleRate) / (2 * bufferLength)

      setAudioData({
        frequency: dominantFreq,
        volume: volume * 100,
        dominantFreq,
      })

      // Clear canvas
      ctx.fillStyle = "rgb(15, 23, 42)" // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (visualizationType === "frequency") {
        drawFrequencyBars(ctx, dataArray, canvas.width, canvas.height)
      } else if (visualizationType === "waveform") {
        drawWaveform(ctx, timeDataArray, canvas.width, canvas.height)
      } else {
        drawSpectrogram(ctx, dataArray, canvas.width, canvas.height)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, analyser, audioContext, visualizationType])

  const drawFrequencyBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const barWidth = (width / dataArray.length) * 2.5
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.8

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
      gradient.addColorStop(0, "#f97316") // orange-500
      gradient.addColorStop(0.5, "#dc2626") // red-600
      gradient.addColorStop(1, "#7c3aed") // violet-600

      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }
  }

  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Float32Array, width: number, height: number) => {
    ctx.lineWidth = 2
    ctx.strokeStyle = "#f97316" // orange-500
    ctx.beginPath()

    const sliceWidth = width / dataArray.length
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] * 0.5 + 0.5
      const y = v * height

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.stroke()
  }

  const drawSpectrogram = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height)

    for (let i = 0; i < dataArray.length && i < width; i++) {
      const value = dataArray[i]
      const intensity = value / 255

      for (let j = 0; j < height; j++) {
        const pixelIndex = (j * width + i) * 4

        // Create color based on intensity
        imageData.data[pixelIndex] = intensity * 255 * 0.8 // Red
        imageData.data[pixelIndex + 1] = intensity * 255 * 0.4 // Green
        imageData.data[pixelIndex + 2] = intensity * 255 * 1.2 // Blue
        imageData.data[pixelIndex + 3] = 255 // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const frequencyToSwara = (freq: number): string => {
    const swaraFreqs = [
      { swara: "S", freq: 261.63 },
      { swara: "R", freq: 293.66 },
      { swara: "G", freq: 329.63 },
      { swara: "M", freq: 349.23 },
      { swara: "P", freq: 392.0 },
      { swara: "D", freq: 440.0 },
      { swara: "N", freq: 493.88 },
    ]

    let closest = swaraFreqs[0]
    let minDiff = Math.abs(freq - closest.freq)

    for (const swaraData of swaraFreqs) {
      const diff = Math.abs(freq - swaraData.freq)
      if (diff < minDiff) {
        minDiff = diff
        closest = swaraData
      }
    }

    return minDiff < 50 ? closest.swara : "?"
  }

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-800 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={visualizationType === "frequency" ? "default" : "outline"}
              onClick={() => setVisualizationType("frequency")}
              className="text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Frequency
            </Button>
            <Button
              size="sm"
              variant={visualizationType === "waveform" ? "default" : "outline"}
              onClick={() => setVisualizationType("waveform")}
              className="text-xs"
            >
              <Waveform className="w-3 h-3 mr-1" />
              Waveform
            </Button>
            <Button
              size="sm"
              variant={visualizationType === "spectrogram" ? "default" : "outline"}
              onClick={() => setVisualizationType("spectrogram")}
              className="text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
              Spectrum
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Canvas for visualization */}
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-48 border border-purple-200 rounded-lg bg-slate-900"
          />

          {/* Audio metrics */}
          {isActive && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-900">{Math.round(audioData.frequency)} Hz</div>
                <div className="text-sm text-purple-700">Dominant Frequency</div>
                <Badge variant="outline" className="mt-1 bg-purple-50 border-purple-200">
                  {frequencyToSwara(audioData.frequency)}
                </Badge>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">{Math.round(audioData.volume)}%</div>
                <div className="text-sm text-purple-700">Volume Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-900">
                  {visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)}
                </div>
                <div className="text-sm text-purple-700">Visualization Mode</div>
              </div>
            </div>
          )}

          {!isActive && (
            <div className="text-center py-8 text-purple-600">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start audio input to see visualization</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
