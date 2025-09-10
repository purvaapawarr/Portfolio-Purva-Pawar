// MIDI Generation Engine with Raga Grammar Rules

import { type RagaGrammar, swaraToMidi, getRagaGrammar, getNextValidSwaras } from "./raga-grammar"

export interface MelodyNote {
  swara: string
  midiNote: number
  duration: number
  velocity: number
  ornament?: string
}

export interface GeneratedMelody {
  notes: MelodyNote[]
  tempo: number
  timeSignature: [number, number]
  ragaId: string
  totalDuration: number
}

export class RagaMidiGenerator {
  private ragaGrammar: RagaGrammar
  private currentOctave = 4

  constructor(ragaId: string) {
    const grammar = getRagaGrammar(ragaId)
    if (!grammar) {
      throw new Error(`Raga grammar not found for: ${ragaId}`)
    }
    this.ragaGrammar = grammar
  }

  generateMelody(
    options: {
      duration?: number // in seconds
      tempo?: number
      complexity?: "simple" | "medium" | "complex"
      includeOrnaments?: boolean
      startWithPakad?: boolean
    } = {},
  ): GeneratedMelody {
    const {
      duration = 30,
      tempo = 120,
      complexity = "medium",
      includeOrnaments = true,
      startWithPakad = true,
    } = options

    const melody: MelodyNote[] = []
    let currentTime = 0
    const targetDuration = duration

    // Start with Pakad phrase for authenticity
    if (startWithPakad && this.ragaGrammar.pakad.length > 0) {
      const pakadPhrase = this.ragaGrammar.pakad[0]
      const pakadNotes = this.generatePakadPhrase(pakadPhrase, tempo)
      melody.push(...pakadNotes)
      currentTime += pakadNotes.reduce((sum, note) => sum + note.duration, 0)
    }

    // Generate main melody
    while (currentTime < targetDuration) {
      const phrase = this.generatePhrase(complexity, tempo, includeOrnaments)
      melody.push(...phrase)
      currentTime += phrase.reduce((sum, note) => sum + note.duration, 0)

      // Add pause between phrases
      if (currentTime < targetDuration - 1) {
        currentTime += 0.5 // Half second pause
      }
    }

    // End with resolution to Sa
    const resolutionNote: MelodyNote = {
      swara: "S",
      midiNote: swaraToMidi["S"],
      duration: 1.0,
      velocity: 80,
    }
    melody.push(resolutionNote)

    return {
      notes: melody,
      tempo,
      timeSignature: [4, 4],
      ragaId: this.ragaGrammar.id,
      totalDuration: currentTime + 1.0,
    }
  }

  private generatePakadPhrase(pakadSwaras: string[], tempo: number): MelodyNote[] {
    const notes: MelodyNote[] = []
    const baseDuration = 60 / tempo // Quarter note duration

    pakadSwaras.forEach((swara, index) => {
      const midiNote = this.swaraToMidiWithOctave(swara)
      const duration = index === pakadSwaras.length - 1 ? baseDuration * 2 : baseDuration

      notes.push({
        swara,
        midiNote,
        duration,
        velocity: swara === this.ragaGrammar.vadi ? 90 : 80,
        ornament: swara === this.ragaGrammar.vadi ? "andolan" : undefined,
      })
    })

    return notes
  }

  private generatePhrase(complexity: string, tempo: number, includeOrnaments: boolean): MelodyNote[] {
    const phraseLength = this.getPhraseLengthByComplexity(complexity)
    const notes: MelodyNote[] = []
    const baseDuration = 60 / tempo

    // Choose a random phrase pattern or generate new one
    let phrasePattern: string[]
    if (Math.random() < 0.6 && this.ragaGrammar.phrasePatterns.length > 0) {
      phrasePattern =
        this.ragaGrammar.phrasePatterns[Math.floor(Math.random() * this.ragaGrammar.phrasePatterns.length)]
    } else {
      phrasePattern = this.generateNewPhrase(phraseLength)
    }

    phrasePattern.forEach((swara, index) => {
      const midiNote = this.swaraToMidiWithOctave(swara)
      let duration = baseDuration

      // Vary durations based on importance
      if (swara === this.ragaGrammar.vadi) {
        duration *= 1.5 // Emphasize vadi
      } else if (swara === this.ragaGrammar.samvadi) {
        duration *= 1.25 // Emphasize samvadi
      }

      // Add rhythmic variation
      if (complexity === "complex") {
        duration *= 0.5 + Math.random() * 1.5
      }

      let ornament: string | undefined
      if (includeOrnaments && Math.random() < 0.3) {
        ornament = this.ragaGrammar.ornamentations[Math.floor(Math.random() * this.ragaGrammar.ornamentations.length)]
      }

      notes.push({
        swara,
        midiNote,
        duration,
        velocity: this.getVelocityForSwara(swara),
        ornament,
      })
    })

    return notes
  }

  private generateNewPhrase(length: number): string[] {
    const phrase: string[] = []
    let currentSwara = "S" // Start from Sa
    let direction: "aroha" | "avroha" = Math.random() < 0.6 ? "aroha" : "avroha"

    for (let i = 0; i < length; i++) {
      phrase.push(currentSwara)

      const nextOptions = getNextValidSwaras(currentSwara, this.ragaGrammar, direction)
      if (nextOptions.length === 0) {
        // Switch direction if stuck
        direction = direction === "aroha" ? "avroha" : "aroha"
        const newOptions = getNextValidSwaras(currentSwara, this.ragaGrammar, direction)
        currentSwara = newOptions[Math.floor(Math.random() * newOptions.length)] || "S"
      } else {
        currentSwara = nextOptions[Math.floor(Math.random() * nextOptions.length)]
      }

      // Occasionally change direction for musical interest
      if (Math.random() < 0.2) {
        direction = direction === "aroha" ? "avroha" : "aroha"
      }
    }

    return phrase
  }

  private getPhraseLengthByComplexity(complexity: string): number {
    switch (complexity) {
      case "simple":
        return 4 + Math.floor(Math.random() * 3) // 4-6 notes
      case "medium":
        return 6 + Math.floor(Math.random() * 4) // 6-9 notes
      case "complex":
        return 8 + Math.floor(Math.random() * 6) // 8-13 notes
      default:
        return 6
    }
  }

  private swaraToMidiWithOctave(swara: string): number {
    const baseMidi = swaraToMidi[swara]
    if (baseMidi === undefined) {
      console.warn(`Unknown swara: ${swara}`)
      return swaraToMidi["S"] // Default to Sa
    }

    // Handle octave adjustments for tar swaras
    if (swara.includes("'")) {
      return baseMidi // Already in higher octave
    }

    return baseMidi + (this.currentOctave - 4) * 12
  }

  private getVelocityForSwara(swara: string): number {
    if (swara === this.ragaGrammar.vadi) return 95 // Strongest emphasis
    if (swara === this.ragaGrammar.samvadi) return 85 // Secondary emphasis
    if (swara === "S" || swara === "P") return 80 // Stable notes
    return 70 + Math.floor(Math.random() * 15) // Varied velocity
  }

  // Convert generated melody to MIDI-like data structure
  generateMidiData(melody: GeneratedMelody): any {
    const tracks = [
      {
        name: `Raga ${this.ragaGrammar.name}`,
        channel: 0,
        instrument: 73, // Flute - traditional Indian instrument sound
        notes: melody.notes.map((note, index) => ({
          midi: note.midiNote,
          time: melody.notes.slice(0, index).reduce((sum, n) => sum + n.duration, 0),
          duration: note.duration,
          velocity: note.velocity / 127,
          name: note.swara,
        })),
      },
    ]

    return {
      header: {
        name: `Raga ${this.ragaGrammar.name} - Generated Melody`,
        ppq: 480,
        tempos: [{ bpm: melody.tempo, time: 0 }],
        timeSignatures: [{ timeSignature: melody.timeSignature, time: 0 }],
      },
      tracks,
    }
  }
}

// Utility function to create MIDI generator for a raga
export function createRagaMidiGenerator(ragaId: string): RagaMidiGenerator {
  return new RagaMidiGenerator(ragaId)
}

// Export melody as downloadable MIDI file data
export function exportMelodyAsMidi(melody: GeneratedMelody, ragaName: string): Blob {
  // Create a proper MIDI file structure
  const midiFile = createMidiFile(melody, ragaName)
  return new Blob([midiFile], { type: "audio/midi" })
}

function createMidiFile(melody: GeneratedMelody, ragaName: string): Uint8Array {
  // MIDI file header
  const header = new Uint8Array([
    0x4d,
    0x54,
    0x68,
    0x64, // "MThd"
    0x00,
    0x00,
    0x00,
    0x06, // Header length
    0x00,
    0x00, // Format type 0
    0x00,
    0x01, // Number of tracks
    0x01,
    0xe0, // Ticks per quarter note (480)
  ])

  // Track header
  const trackHeader = new Uint8Array([
    0x4d,
    0x54,
    0x72,
    0x6b, // "MTrk"
  ])

  // Convert melody to MIDI events
  const events: number[] = []
  const currentTime = 0
  const ticksPerQuarter = 480
  const microsecondsPerQuarter = 60000000 / melody.tempo

  // Set tempo
  events.push(0x00, 0xff, 0x51, 0x03)
  events.push((microsecondsPerQuarter >> 16) & 0xff)
  events.push((microsecondsPerQuarter >> 8) & 0xff)
  events.push(microsecondsPerQuarter & 0xff)

  // Add track name
  const trackNameBytes = new TextEncoder().encode(`Raga ${ragaName}`)
  events.push(0x00, 0xff, 0x03, trackNameBytes.length)
  events.push(...Array.from(trackNameBytes))

  // Set instrument (Flute)
  events.push(0x00, 0xc0, 0x49)

  // Add notes
  melody.notes.forEach((note, index) => {
    const deltaTime = index === 0 ? 0 : Math.round(note.duration * ticksPerQuarter)

    // Note on
    events.push(deltaTime > 127 ? 0x81 : deltaTime, 0x90, note.midiNote, note.velocity)

    // Note off (after duration)
    const noteDuration = Math.round(note.duration * ticksPerQuarter)
    events.push(noteDuration > 127 ? 0x81 : noteDuration, 0x80, note.midiNote, 0x40)
  })

  // End of track
  events.push(0x00, 0xff, 0x2f, 0x00)

  // Create track length header
  const trackLength = events.length
  const trackLengthBytes = new Uint8Array([
    (trackLength >> 24) & 0xff,
    (trackLength >> 16) & 0xff,
    (trackLength >> 8) & 0xff,
    trackLength & 0xff,
  ])

  // Combine all parts
  const result = new Uint8Array(header.length + trackHeader.length + 4 + events.length)
  let offset = 0

  result.set(header, offset)
  offset += header.length

  result.set(trackHeader, offset)
  offset += trackHeader.length

  result.set(trackLengthBytes, offset)
  offset += 4

  result.set(events, offset)

  return result
}

export class AudioPlayer {
  private audioContext: AudioContext | null = null
  private currentSource: AudioBufferSourceNode | null = null

  async playMelody(melody: GeneratedMelody): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    // Stop any currently playing audio
    this.stop()

    const sampleRate = this.audioContext.sampleRate
    const duration = melody.totalDuration
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    let currentTime = 0

    // Generate audio for each note
    melody.notes.forEach((note) => {
      const frequency = this.midiToFrequency(note.midiNote)
      const startSample = Math.floor(currentTime * sampleRate)
      const endSample = Math.floor((currentTime + note.duration) * sampleRate)

      // Generate sine wave for the note
      for (let i = startSample; i < endSample && i < data.length; i++) {
        const t = i / sampleRate
        const envelope = this.createEnvelope(t - currentTime, note.duration)
        data[i] += Math.sin(2 * Math.PI * frequency * t) * envelope * (note.velocity / 127) * 0.3
      }

      currentTime += note.duration
    })

    // Play the generated audio
    this.currentSource = this.audioContext.createBufferSource()
    this.currentSource.buffer = buffer
    this.currentSource.connect(this.audioContext.destination)
    this.currentSource.start()
  }

  private midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12)
  }

  private createEnvelope(time: number, duration: number): number {
    const attackTime = Math.min(0.1, duration * 0.1)
    const releaseTime = Math.min(0.2, duration * 0.2)

    if (time < attackTime) {
      return time / attackTime
    } else if (time > duration - releaseTime) {
      return (duration - time) / releaseTime
    }
    return 1
  }

  stop(): void {
    if (this.currentSource) {
      this.currentSource.stop()
      this.currentSource = null
    }
  }
}
