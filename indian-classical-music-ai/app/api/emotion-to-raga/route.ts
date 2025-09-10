import { type NextRequest, NextResponse } from "next/server"
import { getRagasByMood } from "@/lib/raga-data"
import { getYouTubeVideos } from "@/lib/youtube-api"

// AI-powered emotion analysis and raga mapping
export async function POST(request: NextRequest) {
  try {
    const { mood, intensity = 5, context = "" } = await request.json()

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 })
    }

    // Get base ragas for the mood
    let matchedRagas = getRagasByMood(mood)

    // AI enhancement: Consider intensity and context
    if (intensity > 7) {
      // High intensity - prefer more energetic ragas
      matchedRagas = matchedRagas.filter((raga) => raga.mood.includes("energetic") || raga.mood.includes("joyful"))
    } else if (intensity < 4) {
      // Low intensity - prefer calmer ragas
      matchedRagas = matchedRagas.filter(
        (raga) => raga.mood.includes("peaceful") || raga.mood.includes("contemplative"),
      )
    }

    // Context-based filtering
    if (context.toLowerCase().includes("morning")) {
      matchedRagas = matchedRagas.filter((raga) => raga.timeOfDay.toLowerCase().includes("morning"))
    } else if (context.toLowerCase().includes("evening")) {
      matchedRagas = matchedRagas.filter((raga) => raga.timeOfDay.toLowerCase().includes("evening"))
    }

    // If no ragas match the refined criteria, fall back to base mood ragas
    if (matchedRagas.length === 0) {
      matchedRagas = getRagasByMood(mood)
    }

    // Enhance with YouTube videos
    const enhancedRagas = await Promise.all(
      matchedRagas.map(async (raga) => {
        const youtubeVideos = await getYouTubeVideos(raga.name + " raga classical")
        return {
          ...raga,
          youtubeLinks: youtubeVideos.slice(0, 3), // Top 3 videos
        }
      }),
    )

    // AI confidence scoring
    const ragasWithConfidence = enhancedRagas
      .map((raga) => ({
        ...raga,
        confidence: calculateConfidence(raga, mood, intensity, context),
      }))
      .sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      mood,
      intensity,
      context,
      ragas: ragasWithConfidence,
      totalFound: ragasWithConfidence.length,
      aiAnalysis: generateAIAnalysis(mood, intensity, context, ragasWithConfidence),
    })
  } catch (error) {
    console.error("Error in emotion-to-raga mapping:", error)
    return NextResponse.json({ error: "Failed to process emotion mapping" }, { status: 500 })
  }
}

function calculateConfidence(raga: any, mood: string, intensity: number, context: string): number {
  let confidence = 0.5 // Base confidence

  // Mood match
  if (raga.mood.includes(mood)) {
    confidence += 0.3
  }

  // Time context match
  if (context.toLowerCase().includes("morning") && raga.timeOfDay.toLowerCase().includes("morning")) {
    confidence += 0.2
  } else if (context.toLowerCase().includes("evening") && raga.timeOfDay.toLowerCase().includes("evening")) {
    confidence += 0.2
  }

  // Intensity alignment
  const energeticRagas = ["des", "hamsadhvani"]
  const calmRagas = ["malkauns", "yaman"]

  if (intensity > 6 && energeticRagas.includes(raga.id)) {
    confidence += 0.15
  } else if (intensity < 5 && calmRagas.includes(raga.id)) {
    confidence += 0.15
  }

  return Math.min(confidence, 1.0)
}

function generateAIAnalysis(mood: string, intensity: number, context: string, ragas: any[]): string {
  const topRaga = ragas[0]
  let analysis = `Based on your ${mood} mood with intensity ${intensity}/10`

  if (context) {
    analysis += ` and context "${context}"`
  }

  analysis += `, I recommend ${topRaga.name} raga from the ${topRaga.thaat} thaat. `
  analysis += `This raga is traditionally performed during ${topRaga.timeOfDay.toLowerCase()} and evokes ${topRaga.mood.join(", ")} emotions. `
  analysis += `The vadi swara is ${topRaga.vadi}, which will resonate well with your current emotional state.`

  return analysis
}
