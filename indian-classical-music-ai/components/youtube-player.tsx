"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Volume2, ExternalLink, Clock, Eye } from "lucide-react"
import type { YouTubeVideo } from "@/lib/youtube-api"

interface YouTubePlayerProps {
  videos: YouTubeVideo[]
  title?: string
  onVideoSelect?: (video: YouTubeVideo) => void
}

export function YouTubePlayer({ videos, title = "Related Videos", onVideoSelect }: YouTubePlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(videos[0] || null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsPlaying(false)
    onVideoSelect?.(video)
  }

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K views`
    }
    return `${count} views`
  }

  const formatDuration = (duration: string): string => {
    return duration
  }

  const getEngagementColor = (viewCount: number): string => {
    if (viewCount > 1000000) return "text-green-600"
    if (viewCount > 500000) return "text-blue-600"
    return "text-gray-600"
  }

  if (videos.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">No videos available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Video Player */}
      {selectedVideo && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Video Embed */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{selectedVideo.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className={getEngagementColor(selectedVideo.viewCount)}>
                      {formatViewCount(selectedVideo.viewCount)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(selectedVideo.duration)}
                  </div>
                  <Badge variant="outline" className="bg-red-50 border-red-200 text-red-800">
                    {selectedVideo.channelTitle}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3">{selectedVideo.description}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => window.open(selectedVideo.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Playlist */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          <CardDescription>
            {videos.length} video{videos.length !== 1 ? "s" : ""} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedVideo?.id === video.id ? "bg-red-50 border border-red-200" : "border border-transparent"
                }`}
                onClick={() => handleVideoSelect(video)}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  {selectedVideo?.id === video.id && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center rounded">
                      <Play className="w-6 h-6 text-red-600" />
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{video.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{video.channelTitle}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={getEngagementColor(video.viewCount)}>{formatViewCount(video.viewCount)}</span>
                    <span>•</span>
                    <span>{new Date(video.publishedAt).getFullYear()}</span>
                  </div>
                </div>

                {/* Play Button */}
                <div className="flex-shrink-0 flex items-center">
                  <Button
                    size="sm"
                    variant={selectedVideo?.id === video.id ? "default" : "ghost"}
                    className={selectedVideo?.id === video.id ? "bg-red-600 hover:bg-red-700" : "hover:bg-gray-100"}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
