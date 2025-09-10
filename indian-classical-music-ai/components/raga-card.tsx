"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Youtube, Volume2 } from "lucide-react"
import { YouTubePlayer } from "./youtube-player"
import { useState } from "react"

interface RagaCardProps {
  name: string
  thaat: string
  mood: string[]
  description: string
  aroha: string
  avroha: string
  vadi: string
  samvadi: string
  youtubeLinks?: string[]
  onPlayMelody?: () => void
}

export function RagaCard({
  name,
  thaat,
  mood,
  description,
  aroha,
  avroha,
  vadi,
  samvadi,
  youtubeLinks = [],
  onPlayMelody,
}: RagaCardProps) {
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false)

  const handleYouTubeClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const youtubeVideos = youtubeLinks.map((link, index) => ({
    id: `video-${index}`,
    title: `${name} Raga Performance ${index + 1}`,
    description: `Traditional performance of ${name} raga`,
    thumbnail: `/placeholder.svg?height=180&width=320&query=${name} raga performance`,
    duration: "25:30",
    channelTitle: "Classical Music Archive",
    publishedAt: new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 1000000) + 100000,
    url: link,
    embedUrl: link.replace("watch?v=", "embed/"),
  }))

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-900">{name}</CardTitle>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
              {thaat}
            </Badge>
          </div>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Aroha:</span>
              <p className="text-gray-600 font-mono">{aroha}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Avroha:</span>
              <p className="text-gray-600 font-mono">{avroha}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Vadi:</span>
              <p className="text-gray-600 font-mono">{vadi}</p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Samvadi:</span>
              <p className="text-gray-600 font-mono">{samvadi}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              onClick={onPlayMelody}
            >
              <Play className="w-4 h-4 mr-2" />
              Generate Melody
            </Button>

            {youtubeLinks.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 bg-transparent text-red-600"
                  onClick={() => setShowYouTubePlayer(!showYouTubePlayer)}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen ({youtubeLinks.length})
                </Button>

                <div className="flex gap-1">
                  {youtubeLinks.slice(0, 2).map((link, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 bg-transparent text-red-600"
                      onClick={() => handleYouTubeClick(link)}
                    >
                      <Youtube className="w-4 h-4 mr-1" />
                      {index + 1}
                    </Button>
                  ))}
                  {youtubeLinks.length > 2 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 bg-transparent text-red-600"
                    >
                      +{youtubeLinks.length - 2}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {mood.map((m) => (
              <Badge
                key={m}
                className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-rose-200 text-xs"
              >
                {m}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {showYouTubePlayer && youtubeVideos.length > 0 && (
        <YouTubePlayer
          videos={youtubeVideos}
          title={`${name} Raga Performances`}
          onVideoSelect={(video) => console.log("Selected video:", video)}
        />
      )}
    </div>
  )
}
