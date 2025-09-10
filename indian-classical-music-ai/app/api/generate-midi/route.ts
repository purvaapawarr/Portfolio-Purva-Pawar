import { type NextRequest, NextResponse } from "next/server"
import { createRagaMidiGenerator, exportMelodyAsMidi } from "@/lib/midi-generator"
import { getRagaGrammar } from "@/lib/raga-grammar"

export async function POST(request: NextRequest) {
  try {
    const {
      ragaId,
      duration = 30,
      tempo = 120,
      complexity = "medium",
      includeOrnaments = true,
      startWithPakad = true,
      format = "json", // 'json' or 'midi'
    } = await request.json()

    if (!ragaId) {
      return NextResponse.json({ error: "Raga ID is required" }, { status: 400 })
    }

    const ragaGrammar = getRagaGrammar(ragaId)
    if (!ragaGrammar) {
      return NextResponse.json({ error: "Raga not found" }, { status: 404 })
    }

    // Generate melody using raga grammar
    const generator = createRagaMidiGenerator(ragaId)
    const melody = generator.generateMelody({
      duration,
      tempo,
      complexity: complexity as "simple" | "medium" | "complex",
      includeOrnaments,
      startWithPakad,
    })

    // Generate MIDI data
    const midiData = generator.generateMidiData(melody)

    // Create analysis of the generated melody
    const analysis = {
      ragaName: ragaGrammar.name,
      thaat: ragaGrammar.thaat,
      totalNotes: melody.notes.length,
      duration: melody.totalDuration,
      tempo: melody.tempo,
      swarasUsed: [...new Set(melody.notes.map((n) => n.swara))],
      vadiEmphasis: melody.notes.filter((n) => n.swara === ragaGrammar.vadi).length,
      samvadiEmphasis: melody.notes.filter((n) => n.swara === ragaGrammar.samvadi).length,
      ornamentsUsed: [...new Set(melody.notes.map((n) => n.ornament).filter(Boolean))],
      phraseStructure: analyzePhraseStructure(melody.notes),
      authenticity: calculateAuthenticity(melody, ragaGrammar),
    }

    if (format === "midi") {
      // Return MIDI file data
      const midiBlob = exportMelodyAsMidi(melody, ragaGrammar.name)
      const buffer = await midiBlob.arrayBuffer()

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="raga-${ragaId}-melody.mid"`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      melody,
      midiData,
      analysis,
      ragaInfo: {
        name: ragaGrammar.name,
        thaat: ragaGrammar.thaat,
        vadi: ragaGrammar.vadi,
        samvadi: ragaGrammar.samvadi,
        timeOfDay: ragaGrammar.timeOfDay,
        mood: ragaGrammar.mood,
      },
    })
  } catch (error) {
    console.error("Error generating MIDI:", error)
    return NextResponse.json(
      {
        error: "Failed to generate MIDI melody",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function analyzePhraseStructure(notes: any[]): any {
  const phrases: any[] = []
  let currentPhrase: any[] = []
  let lastTime = 0

  notes.forEach((note, index) => {
    const currentTime = notes.slice(0, index).reduce((sum, n) => sum + n.duration, 0)

    // Detect phrase boundaries (gaps > 0.5 seconds or significant duration changes)
    if (currentTime - lastTime > 0.5 || currentPhrase.length >= 8) {
      if (currentPhrase.length > 0) {
        phrases.push({
          swaras: currentPhrase.map((n) => n.swara),
          duration: currentPhrase.reduce((sum, n) => sum + n.duration, 0),
          noteCount: currentPhrase.length,
        })
      }
      currentPhrase = []
    }

    currentPhrase.push(note)
    lastTime = currentTime
  })

  // Add final phrase
  if (currentPhrase.length > 0) {
    phrases.push({
      swaras: currentPhrase.map((n) => n.swara),
      duration: currentPhrase.reduce((sum, n) => sum + n.duration, 0),
      noteCount: currentPhrase.length,
    })
  }

  return {
    totalPhrases: phrases.length,
    averagePhraseLength: phrases.reduce((sum, p) => sum + p.noteCount, 0) / phrases.length,
    phrases: phrases.slice(0, 5), // Return first 5 phrases for analysis
  }
}

function calculateAuthenticity(melody: any, ragaGrammar: any): number {
  let score = 0.5 // Base score

  // Check if vadi is emphasized
  const vadiCount = melody.notes.filter((n: any) => n.swara === ragaGrammar.vadi).length
  if (vadiCount > melody.notes.length * 0.1) score += 0.15

  // Check if samvadi is present
  const samvadiCount = melody.notes.filter((n: any) => n.swara === ragaGrammar.samvadi).length
  if (samvadiCount > 0) score += 0.1

  // Check if pakad phrases are used
  const swaraSequence = melody.notes.map((n: any) => n.swara).join(" ")
  ragaGrammar.pakad.forEach((pakad: string[]) => {
    if (swaraSequence.includes(pakad.join(" "))) {
      score += 0.1
    }
  })

  // Check for forbidden swaras (penalty)
  const forbiddenUsed = melody.notes.some((n: any) => ragaGrammar.forbiddenSwaras?.includes(n.swara))
  if (forbiddenUsed) score -= 0.2

  // Check for proper resolution to Sa
  const lastNote = melody.notes[melody.notes.length - 1]
  if (lastNote?.swara === "S") score += 0.05

  return Math.max(0, Math.min(1, score))
}
