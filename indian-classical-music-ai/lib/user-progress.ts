export interface UserSession {
  id: string
  timestamp: Date
  ragaId: string
  activity: "emotion_mapping" | "midi_generation" | "pitch_training"
  score?: number
  duration: number
  notes?: string
}

export interface UserProgress {
  userId: string
  totalSessions: number
  ragasLearned: string[]
  averageScore: number
  favoriteRagas: string[]
  weakAreas: string[]
  achievements: Achievement[]
  lastActivity: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  category: "raga_mastery" | "pitch_accuracy" | "consistency" | "exploration"
}

export class UserProgressManager {
  private static instance: UserProgressManager
  private sessions: UserSession[] = []
  private progress: UserProgress | null = null

  static getInstance(): UserProgressManager {
    if (!UserProgressManager.instance) {
      UserProgressManager.instance = new UserProgressManager()
    }
    return UserProgressManager.instance
  }

  addSession(session: Omit<UserSession, "id" | "timestamp">): void {
    const newSession: UserSession = {
      ...session,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }

    this.sessions.push(newSession)
    this.updateProgress()
    this.saveToLocalStorage()
  }

  getProgress(): UserProgress | null {
    return this.progress
  }

  getSessions(): UserSession[] {
    return this.sessions
  }

  getSessionsByRaga(ragaId: string): UserSession[] {
    return this.sessions.filter((session) => session.ragaId === ragaId)
  }

  getSessionsByActivity(activity: UserSession["activity"]): UserSession[] {
    return this.sessions.filter((session) => session.activity === activity)
  }

  private updateProgress(): void {
    if (this.sessions.length === 0) return

    const ragasLearned = [...new Set(this.sessions.map((s) => s.ragaId))]
    const scoresWithValues = this.sessions.filter((s) => s.score !== undefined)
    const averageScore =
      scoresWithValues.length > 0
        ? scoresWithValues.reduce((sum, s) => sum + (s.score || 0), 0) / scoresWithValues.length
        : 0

    // Calculate favorite ragas based on frequency and scores
    const ragaStats = ragasLearned.map((ragaId) => {
      const ragaSessions = this.getSessionsByRaga(ragaId)
      const avgScore = ragaSessions
        .filter((s) => s.score !== undefined)
        .reduce((sum, s, _, arr) => sum + (s.score || 0) / arr.length, 0)
      return { ragaId, frequency: ragaSessions.length, avgScore }
    })

    const favoriteRagas = ragaStats
      .sort((a, b) => b.frequency * b.avgScore - a.frequency * a.avgScore)
      .slice(0, 3)
      .map((stat) => stat.ragaId)

    // Identify weak areas
    const weakAreas = ragaStats.filter((stat) => stat.avgScore < 70 && stat.frequency >= 3).map((stat) => stat.ragaId)

    this.progress = {
      userId: "local_user",
      totalSessions: this.sessions.length,
      ragasLearned,
      averageScore,
      favoriteRagas,
      weakAreas,
      achievements: this.calculateAchievements(),
      lastActivity: new Date(),
    }
  }

  private calculateAchievements(): Achievement[] {
    const achievements: Achievement[] = []
    const now = new Date()

    // First Steps
    if (this.sessions.length >= 1) {
      achievements.push({
        id: "first_session",
        name: "First Steps",
        description: "Completed your first learning session",
        icon: "🎵",
        unlockedAt: now,
        category: "consistency",
      })
    }

    // Raga Explorer
    const uniqueRagas = new Set(this.sessions.map((s) => s.ragaId)).size
    if (uniqueRagas >= 5) {
      achievements.push({
        id: "raga_explorer",
        name: "Raga Explorer",
        description: "Explored 5 different ragas",
        icon: "🗺️",
        unlockedAt: now,
        category: "exploration",
      })
    }

    // Pitch Perfect
    const pitchSessions = this.getSessionsByActivity("pitch_training")
    const highScorePitchSessions = pitchSessions.filter((s) => (s.score || 0) >= 90)
    if (highScorePitchSessions.length >= 3) {
      achievements.push({
        id: "pitch_perfect",
        name: "Pitch Perfect",
        description: "Achieved 90%+ accuracy in 3 pitch training sessions",
        icon: "🎯",
        unlockedAt: now,
        category: "pitch_accuracy",
      })
    }

    // Consistent Learner
    if (this.sessions.length >= 10) {
      achievements.push({
        id: "consistent_learner",
        name: "Consistent Learner",
        description: "Completed 10 learning sessions",
        icon: "📚",
        unlockedAt: now,
        category: "consistency",
      })
    }

    return achievements
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem("music_ai_sessions", JSON.stringify(this.sessions))
      localStorage.setItem("music_ai_progress", JSON.stringify(this.progress))
    } catch (error) {
      console.warn("Failed to save progress to localStorage:", error)
    }
  }

  loadFromLocalStorage(): void {
    try {
      const sessionsData = localStorage.getItem("music_ai_sessions")
      const progressData = localStorage.getItem("music_ai_progress")

      if (sessionsData) {
        this.sessions = JSON.parse(sessionsData).map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp),
        }))
      }

      if (progressData) {
        this.progress = JSON.parse(progressData)
        if (this.progress) {
          this.progress.lastActivity = new Date(this.progress.lastActivity)
        }
      }
    } catch (error) {
      console.warn("Failed to load progress from localStorage:", error)
    }
  }

  exportProgress(): string {
    return JSON.stringify(
      {
        sessions: this.sessions,
        progress: this.progress,
        exportedAt: new Date(),
      },
      null,
      2,
    )
  }

  importProgress(data: string): boolean {
    try {
      const imported = JSON.parse(data)
      this.sessions = imported.sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
      }))
      this.updateProgress()
      this.saveToLocalStorage()
      return true
    } catch (error) {
      console.error("Failed to import progress:", error)
      return false
    }
  }
}
