// Advanced Pitch Detection Engine for Indian Classical Music

export interface PitchDetectionResult {
  frequency: number
  confidence: number
  swara: string | null
  cents: number // Deviation from perfect pitch
  timestamp: number
}

export interface SwaraFrequencies {
  [key: string]: {
    frequency: number
    name: string
    cents: number
  }
}

// Standard frequencies for swaras in Indian classical music (Sa = 261.63 Hz / C4)
export const swaraFrequencies: SwaraFrequencies = {
  S: { frequency: 261.63, name: "Sa (Shadja)", cents: 0 },
  r: { frequency: 277.18, name: "Komal Re", cents: 112 },
  R: { frequency: 293.66, name: "Shuddha Re", cents: 204 },
  g: { frequency: 311.13, name: "Komal Ga", cents: 294 },
  G: { frequency: 329.63, name: "Shuddha Ga", cents: 386 },
  M: { frequency: 349.23, name: "Shuddha Ma", cents: 498 },
  "M+": { frequency: 369.99, name: "Tivra Ma", cents: 590 },
  P: { frequency: 392.0, name: "Pa (Panchama)", cents: 702 },
  d: { frequency: 415.3, name: "Komal Dha", cents: 814 },
  D: { frequency: 440.0, name: "Shuddha Dha", cents: 906 },
  n: { frequency: 466.16, name: "Komal Ni", cents: 996 },
  N: { frequency: 493.88, name: "Shuddha Ni", cents: 1088 },
  "S'": { frequency: 523.25, name: "Tar Sa", cents: 1200 },
}

export class PitchDetector {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Float32Array | null = null
  private isListening = false
  private onPitchDetected: ((result: PitchDetectionResult) => void) | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 4096
      this.analyser.smoothingTimeConstant = 0.8
      this.dataArray = new Float32Array(this.analyser.frequencyBinCount)
    } catch (error) {
      console.error("Failed to initialize audio context:", error)
    }
  }

  async startListening(callback: (result: PitchDetectionResult) => void): Promise<boolean> {
    if (!this.audioContext || !this.analyser) {
      console.error("Audio context not initialized")
      return false
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          sampleRate: 44100,
        },
      })

      this.microphone = this.audioContext.createMediaStreamSource(stream)
      this.microphone.connect(this.analyser)
      this.onPitchDetected = callback
      this.isListening = true

      this.detectPitch()
      return true
    } catch (error) {
      console.error("Failed to access microphone:", error)
      return false
    }
  }

  stopListening() {
    this.isListening = false
    if (this.microphone) {
      this.microphone.disconnect()
      this.microphone = null
    }
    this.onPitchDetected = null
  }

  private detectPitch() {
    if (!this.isListening || !this.analyser || !this.dataArray || !this.onPitchDetected) {
      return
    }

    this.analyser.getFloatTimeDomainData(this.dataArray)

    const pitch = this.autocorrelate(this.dataArray, this.audioContext!.sampleRate)
    const result = this.analyzePitch(pitch)

    if (result) {
      this.onPitchDetected(result)
    }

    requestAnimationFrame(() => this.detectPitch())
  }

  private autocorrelate(buffer: Float32Array, sampleRate: number): number {
    // Autocorrelation-based pitch detection algorithm
    const SIZE = buffer.length
    const MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0

    // Calculate RMS
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i]
      rms += val * val
    }
    rms = Math.sqrt(rms / SIZE)

    // Not enough signal
    if (rms < 0.01) return -1

    let lastCorrelation = 1
    for (let offset = 1; offset < MAX_SAMPLES; offset++) {
      let correlation = 0

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset])
      }
      correlation = 1 - correlation / MAX_SAMPLES

      if (correlation > 0.9 && correlation > lastCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      } else if (correlation > 0.9) {
        // Found a good correlation, stop searching
        break
      }
      lastCorrelation = correlation
    }

    if (bestCorrelation > 0.01) {
      return sampleRate / bestOffset
    }
    return -1
  }

  private analyzePitch(frequency: number): PitchDetectionResult | null {
    if (frequency <= 0 || frequency < 80 || frequency > 2000) {
      return null
    }

    const swara = this.frequencyToSwara(frequency)
    const confidence = this.calculateConfidence(frequency, swara)

    return {
      frequency,
      confidence,
      swara: swara.swara,
      cents: swara.cents,
      timestamp: Date.now(),
    }
  }

  private frequencyToSwara(frequency: number): { swara: string; cents: number } {
    let closestSwara = "S"
    let minCentsDiff = Number.POSITIVE_INFINITY

    // Find the closest swara
    Object.entries(swaraFrequencies).forEach(([swara, data]) => {
      const centsDiff = Math.abs(this.frequencyToCents(frequency) - data.cents)
      if (centsDiff < minCentsDiff) {
        minCentsDiff = centsDiff
        closestSwara = swara
      }
    })

    // Calculate exact cents deviation
    const targetCents = swaraFrequencies[closestSwara].cents
    const actualCents = this.frequencyToCents(frequency)
    const centsDeviation = actualCents - targetCents

    return {
      swara: closestSwara,
      cents: centsDeviation,
    }
  }

  private frequencyToCents(frequency: number): number {
    // Convert frequency to cents (Sa = 0 cents)
    const saFrequency = swaraFrequencies.S.frequency
    return 1200 * Math.log2(frequency / saFrequency)
  }

  private calculateConfidence(frequency: number, swaraResult: { swara: string; cents: number }): number {
    // Confidence based on how close the frequency is to the target swara
    const centsDiff = Math.abs(swaraResult.cents)

    if (centsDiff < 10) return 0.95 // Very accurate
    if (centsDiff < 25) return 0.85 // Good
    if (centsDiff < 50) return 0.7 // Acceptable
    if (centsDiff < 100) return 0.5 // Poor
    return 0.25 // Very poor
  }

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.AudioContext)
  }
}

// Raga validation functions
export function validateSwaraInRaga(
  swara: string,
  ragaId: string,
): {
  isValid: boolean
  feedback: string
  suggestion?: string
} {
  const ragaGrammar = getRagaGrammar(ragaId)
  if (!ragaGrammar) {
    return {
      isValid: false,
      feedback: "Raga not found",
    }
  }

  const isAllowed = ragaGrammar.allowedSwaras.includes(swara)
  const isForbidden = ragaGrammar.forbiddenSwaras?.includes(swara)

  if (isForbidden) {
    return {
      isValid: false,
      feedback: `${swara} is forbidden in ${ragaGrammar.name}`,
      suggestion: `Try ${ragaGrammar.allowedSwaras.join(", ")} instead`,
    }
  }

  if (!isAllowed) {
    return {
      isValid: false,
      feedback: `${swara} is not typically used in ${ragaGrammar.name}`,
      suggestion: `This raga uses: ${ragaGrammar.allowedSwaras.join(", ")}`,
    }
  }

  // Check if it's the vadi or samvadi for extra encouragement
  if (swara === ragaGrammar.vadi) {
    return {
      isValid: true,
      feedback: `Excellent! ${swara} is the Vadi (most important note) of ${ragaGrammar.name}`,
    }
  }

  if (swara === ragaGrammar.samvadi) {
    return {
      isValid: true,
      feedback: `Great! ${swara} is the Samvadi (second most important note) of ${ragaGrammar.name}`,
    }
  }

  return {
    isValid: true,
    feedback: `Correct! ${swara} belongs to ${ragaGrammar.name}`,
  }
}

// Import the getRagaGrammar function
import { getRagaGrammar } from "./raga-grammar"
