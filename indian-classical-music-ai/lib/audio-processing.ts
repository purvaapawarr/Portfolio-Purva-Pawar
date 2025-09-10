// Advanced Audio Processing for Indian Classical Music

export interface AudioAnalysisResult {
  pitch: number
  volume: number
  spectralCentroid: number
  mfcc: number[]
  chroma: number[]
  tempo: number
  key: string
  swara: string | null
}

export interface AudioPlaybackOptions {
  volume?: number
  playbackRate?: number
  loop?: boolean
  fadeIn?: number
  fadeOut?: number
}

export class AudioProcessor {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private gainNode: GainNode | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.gainNode = this.audioContext.createGain()

      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8
    } catch (error) {
      console.error("Failed to initialize audio context:", error)
    }
  }

  async analyzeAudioBuffer(audioBuffer: AudioBuffer): Promise<AudioAnalysisResult> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    const channelData = audioBuffer.getChannelData(0)

    return {
      pitch: this.extractPitch(channelData, audioBuffer.sampleRate),
      volume: this.calculateRMS(channelData),
      spectralCentroid: this.calculateSpectralCentroid(channelData),
      mfcc: this.calculateMFCC(channelData),
      chroma: this.calculateChroma(channelData, audioBuffer.sampleRate),
      tempo: this.estimateTempo(channelData, audioBuffer.sampleRate),
      key: this.estimateKey(channelData, audioBuffer.sampleRate),
      swara: this.frequencyToSwara(this.extractPitch(channelData, audioBuffer.sampleRate)),
    }
  }

  private extractPitch(audioData: Float32Array, sampleRate: number): number {
    // Autocorrelation-based pitch detection
    const bufferSize = audioData.length
    const halfBuffer = Math.floor(bufferSize / 2)
    let bestOffset = -1
    let bestCorrelation = 0

    for (let offset = 1; offset < halfBuffer; offset++) {
      let correlation = 0
      for (let i = 0; i < halfBuffer; i++) {
        correlation += Math.abs(audioData[i] - audioData[i + offset])
      }
      correlation = 1 - correlation / halfBuffer

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation
        bestOffset = offset
      }
    }

    return bestOffset > 0 ? sampleRate / bestOffset : 0
  }

  private calculateRMS(audioData: Float32Array): number {
    let sum = 0
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i]
    }
    return Math.sqrt(sum / audioData.length)
  }

  private calculateSpectralCentroid(audioData: Float32Array): number {
    const fft = this.performFFT(audioData)
    let weightedSum = 0
    let magnitudeSum = 0

    for (let i = 0; i < fft.length / 2; i++) {
      const magnitude = Math.sqrt(fft[i * 2] ** 2 + fft[i * 2 + 1] ** 2)
      weightedSum += i * magnitude
      magnitudeSum += magnitude
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
  }

  private calculateMFCC(audioData: Float32Array): number[] {
    // Simplified MFCC calculation
    const fft = this.performFFT(audioData)
    const melFilters = this.createMelFilterBank(fft.length / 2)
    const mfcc: number[] = []

    for (let i = 0; i < 13; i++) {
      let sum = 0
      for (let j = 0; j < melFilters[i].length; j++) {
        const magnitude = Math.sqrt(fft[j * 2] ** 2 + fft[j * 2 + 1] ** 2)
        sum += magnitude * melFilters[i][j]
      }
      mfcc.push(Math.log(sum + 1e-10))
    }

    return mfcc
  }

  private calculateChroma(audioData: Float32Array, sampleRate: number): number[] {
    const fft = this.performFFT(audioData)
    const chroma = new Array(12).fill(0)

    for (let i = 1; i < fft.length / 2; i++) {
      const frequency = (i * sampleRate) / fft.length
      const magnitude = Math.sqrt(fft[i * 2] ** 2 + fft[i * 2 + 1] ** 2)

      if (frequency > 80 && frequency < 2000) {
        const pitchClass = Math.round(12 * Math.log2(frequency / 440)) % 12
        const normalizedPitchClass = pitchClass < 0 ? pitchClass + 12 : pitchClass
        chroma[normalizedPitchClass] += magnitude
      }
    }

    // Normalize
    const maxChroma = Math.max(...chroma)
    return chroma.map((c) => (maxChroma > 0 ? c / maxChroma : 0))
  }

  private estimateTempo(audioData: Float32Array, sampleRate: number): number {
    // Simplified tempo estimation using onset detection
    const hopSize = 512
    const onsets: number[] = []

    for (let i = 0; i < audioData.length - hopSize; i += hopSize) {
      const window = audioData.slice(i, i + hopSize)
      const energy = this.calculateRMS(window)
      onsets.push(energy)
    }

    // Find peaks in energy
    const peaks: number[] = []
    for (let i = 1; i < onsets.length - 1; i++) {
      if (onsets[i] > onsets[i - 1] && onsets[i] > onsets[i + 1] && onsets[i] > 0.1) {
        peaks.push(i)
      }
    }

    if (peaks.length < 2) return 120 // Default tempo

    // Calculate average interval between peaks
    const intervals = []
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1])
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const timePerHop = hopSize / sampleRate
    const beatsPerSecond = 1 / (avgInterval * timePerHop)

    return Math.round(beatsPerSecond * 60) // Convert to BPM
  }

  private estimateKey(audioData: Float32Array, sampleRate: number): string {
    const chroma = this.calculateChroma(audioData, sampleRate)
    const keyNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    let maxChroma = 0
    let keyIndex = 0

    for (let i = 0; i < chroma.length; i++) {
      if (chroma[i] > maxChroma) {
        maxChroma = chroma[i]
        keyIndex = i
      }
    }

    return keyNames[keyIndex]
  }

  private frequencyToSwara(frequency: number): string | null {
    if (frequency <= 0) return null

    const swaraFreqs = {
      S: 261.63,
      r: 277.18,
      R: 293.66,
      g: 311.13,
      G: 329.63,
      M: 349.23,
      "M+": 369.99,
      P: 392.0,
      d: 415.3,
      D: 440.0,
      n: 466.16,
      N: 493.88,
    }

    let closestSwara = "S"
    let minDiff = Number.POSITIVE_INFINITY

    for (const [swara, freq] of Object.entries(swaraFreqs)) {
      const diff = Math.abs(frequency - freq)
      if (diff < minDiff) {
        minDiff = diff
        closestSwara = swara
      }
    }

    return minDiff < 50 ? closestSwara : null // 50 Hz tolerance
  }

  private performFFT(audioData: Float32Array): Float32Array {
    // Simplified FFT implementation
    const N = audioData.length
    const result = new Float32Array(N * 2)

    for (let k = 0; k < N; k++) {
      let realSum = 0
      let imagSum = 0

      for (let n = 0; n < N; n++) {
        const angle = (-2 * Math.PI * k * n) / N
        realSum += audioData[n] * Math.cos(angle)
        imagSum += audioData[n] * Math.sin(angle)
      }

      result[k * 2] = realSum
      result[k * 2 + 1] = imagSum
    }

    return result
  }

  private createMelFilterBank(numBins: number): number[][] {
    const numFilters = 13
    const filters: number[][] = []

    for (let i = 0; i < numFilters; i++) {
      const filter = new Array(numBins).fill(0)
      const start = Math.floor((i * numBins) / numFilters)
      const end = Math.floor(((i + 2) * numBins) / numFilters)
      const peak = Math.floor(((i + 1) * numBins) / numFilters)

      for (let j = start; j < peak; j++) {
        filter[j] = (j - start) / (peak - start)
      }
      for (let j = peak; j < end; j++) {
        filter[j] = (end - j) / (end - peak)
      }

      filters.push(filter)
    }

    return filters
  }

  async playMelodyWithEffects(melody: any, options: AudioPlaybackOptions = {}): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      throw new Error("Audio context not initialized")
    }

    const { volume = 0.7, playbackRate = 1.0, loop = false, fadeIn = 0, fadeOut = 0 } = options

    // Create oscillators for each note
    const oscillators: OscillatorNode[] = []
    let currentTime = this.audioContext.currentTime

    if (fadeIn > 0) {
      this.gainNode.gain.setValueAtTime(0, currentTime)
      this.gainNode.gain.linearRampToValueAtTime(volume, currentTime + fadeIn)
      currentTime += fadeIn
    } else {
      this.gainNode.gain.setValueAtTime(volume, currentTime)
    }

    for (const note of melody.notes) {
      const oscillator = this.audioContext.createOscillator()
      const noteGain = this.audioContext.createGain()

      oscillator.connect(noteGain)
      noteGain.connect(this.gainNode)
      this.gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(note.midiNote * 8.1758, currentTime) // Convert MIDI to Hz
      oscillator.type = "sine"

      // Apply note-specific effects
      noteGain.gain.setValueAtTime(0, currentTime)
      noteGain.gain.linearRampToValueAtTime(note.velocity / 127, currentTime + 0.01)
      noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + note.duration)

      oscillators.push(oscillator)
      currentTime += note.duration
    }

    if (fadeOut > 0) {
      this.gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeOut)
    }
  }

  dispose() {
    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

// Utility functions for audio processing
export function createAudioProcessor(): AudioProcessor {
  return new AudioProcessor()
}

export function convertMidiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12)
}

export function createTanpuraSound(audioContext: AudioContext, fundamentalFreq = 261.63): OscillatorNode[] {
  // Create a tanpura-like drone with multiple harmonics
  const oscillators: OscillatorNode[] = []
  const harmonics = [1, 2, 3, 4, 5] // Harmonic series
  const volumes = [0.8, 0.4, 0.2, 0.1, 0.05] // Decreasing volumes

  harmonics.forEach((harmonic, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.frequency.setValueAtTime(fundamentalFreq * harmonic, audioContext.currentTime)
    oscillator.type = "sawtooth"

    gainNode.gain.setValueAtTime(volumes[index], audioContext.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillators.push(oscillator)
  })

  return oscillators
}
