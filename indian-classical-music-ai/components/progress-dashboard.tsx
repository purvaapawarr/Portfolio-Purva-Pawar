"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserProgressManager, type UserProgress, type Achievement } from "@/lib/user-progress"
import { ragaDatabase } from "@/lib/raga-data"

export function ProgressDashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const manager = UserProgressManager.getInstance()
    manager.loadFromLocalStorage()
    setProgress(manager.getProgress())
    setAchievements(manager.getProgress()?.achievements || [])
  }, [])

  if (!progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Journey</CardTitle>
          <CardDescription>Start learning to see your progress!</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getFavoriteRagaNames = () => {
    return progress.favoriteRagas.map((id) => ragaDatabase.find((raga) => raga.id === id)?.name || id)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{progress.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ragas Learned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{progress.ragasLearned.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{Math.round(progress.averageScore)}%</div>
            <Progress value={progress.averageScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Favorite Ragas</CardTitle>
            <CardDescription>Based on your learning frequency and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getFavoriteRagaNames().map((name, index) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="font-medium">{name}</span>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="text-muted-foreground">Keep learning to unlock achievements!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {progress.weakAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Ragas that could use more practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.weakAreas.map((ragaId) => {
                const raga = ragaDatabase.find((r) => r.id === ragaId)
                return (
                  <Badge key={ragaId} variant="outline" className="text-orange-600 border-orange-200">
                    {raga?.name || ragaId}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
