import { type NextRequest, NextResponse } from "next/server"
import { validateSwaraInRaga } from "@/lib/pitch-detection"

export async function POST(request: NextRequest) {
  try {
    const { swara, ragaId, frequency, confidence, sessionData } = await request.json()

    if (!swara || !ragaId) {
      return NextResponse.json({ error: "Swara and raga ID are required" }, { status: 400 })
    }

    // Validate swara against raga rules
    const validation = validateSwaraInRaga(swara, ragaId)

    // Generate detailed feedback
    const feedback = generateDetailedFeedback(swara, ragaId, frequency, confidence, validation)

    // Calculate session statistics
    const sessionStats = calculateSessionStats(sessionData, validation.isValid)

    return NextResponse.json({
      validation,
      feedback,
      sessionStats,
      recommendations: generateRecommendations(swara, ragaId, validation),
    })
  } catch (error) {
    console.error("Error in pitch analysis:", error)
    return NextResponse.json({ error: "Failed to analyze pitch" }, { status: 500 })
  }
}

function generateDetailedFeedback(
  swara: string,
  ragaId: string,
  frequency: number,
  confidence: number,
  validation: any,
): any {
  const pitchAccuracy = confidence > 0.8 ? "excellent" : confidence > 0.6 ? "good" : "needs improvement"

  return {
    swara,
    frequency: Math.round(frequency * 100) / 100,
    confidence: Math.round(confidence * 100),
    pitchAccuracy,
    ragaValidation: validation,
    tips: generateTips(swara, confidence, validation.isValid),
  }
}

function generateTips(swara: string, confidence: number, isValid: boolean): string[] {
  const tips: string[] = []

  if (confidence < 0.6) {
    tips.push("Try to sing with more stable pitch")
    tips.push("Practice holding the note longer")
  }

  if (confidence < 0.8) {
    tips.push("Focus on breath control for steadier pitch")
  }

  if (!isValid) {
    tips.push("Listen to recordings of this raga to internalize the correct swaras")
    tips.push("Practice the aroha and avroha patterns")
  }

  if (isValid && confidence > 0.8) {
    tips.push("Excellent! Try practicing ornamentations like meend or gamak")
    tips.push("Experiment with different octaves")
  }

  return tips
}

function calculateSessionStats(sessionData: any[], isCorrect: boolean): any {
  if (!sessionData || sessionData.length === 0) {
    return {
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      accuracy: isCorrect ? 100 : 0,
      averageConfidence: 0,
      improvementTrend: "starting",
    }
  }

  const totalAttempts = sessionData.length + 1
  const correctAttempts = sessionData.filter((attempt: any) => attempt.isCorrect).length + (isCorrect ? 1 : 0)
  const accuracy = Math.round((correctAttempts / totalAttempts) * 100)

  const recentAttempts = sessionData.slice(-5)
  const recentAccuracy = recentAttempts.filter((attempt: any) => attempt.isCorrect).length / recentAttempts.length

  let improvementTrend = "stable"
  if (recentAccuracy > 0.8) improvementTrend = "excellent"
  else if (recentAccuracy > 0.6) improvementTrend = "improving"
  else if (recentAccuracy < 0.4) improvementTrend = "needs_practice"

  return {
    totalAttempts,
    correctAttempts,
    accuracy,
    averageConfidence: Math.round(
      sessionData.reduce((sum: number, attempt: any) => sum + attempt.confidence, 0) / sessionData.length,
    ),
    improvementTrend,
  }
}

function generateRecommendations(swara: string, ragaId: string, validation: any): string[] {
  const recommendations: string[] = []

  if (!validation.isValid) {
    recommendations.push(`Focus on practicing the allowed swaras: ${validation.suggestion}`)
    recommendations.push("Listen to master recordings of this raga")
    recommendations.push("Practice with a tanpura or drone for better pitch reference")
  } else {
    recommendations.push("Try connecting this swara to others in melodic phrases")
    recommendations.push("Practice this swara in different octaves")
    recommendations.push("Experiment with traditional ornamentations")
  }

  return recommendations
}
