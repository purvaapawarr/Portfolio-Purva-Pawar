// YouTube API integration for fetching raga videos
export async function getYouTubeVideos(query: string): Promise<string[]> {
  try {
    // In a real implementation, you would use the YouTube Data API
    // For now, we'll return curated links based on the query
    const curatedVideos = getCuratedVideosByQuery(query)
    return curatedVideos
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}

function getCuratedVideosByQuery(query: string): string[] {
  // Curated high-quality raga performances
  const videoDatabase: Record<string, string[]> = {
    "yaman raga classical": [
      "https://www.youtube.com/watch?v=kOvKXjb5p7g", // Pandit Jasraj - Raga Yaman
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Ustad Rashid Khan - Yaman
      "https://www.youtube.com/watch?v=example3", // Pandit Ravi Shankar - Yaman
    ],
    "bhairav raga classical": [
      "https://www.youtube.com/watch?v=example4", // Pandit Bhimsen Joshi - Bhairav
      "https://www.youtube.com/watch?v=example5", // Ustad Amir Khan - Bhairav
      "https://www.youtube.com/watch?v=example6", // Pandit Jasraj - Bhairav
    ],
    "malkauns raga classical": [
      "https://www.youtube.com/watch?v=example7", // Ustad Ali Akbar Khan - Malkauns
      "https://www.youtube.com/watch?v=example8", // Pandit Ravi Shankar - Malkauns
      "https://www.youtube.com/watch?v=example9", // Ustad Vilayat Khan - Malkauns
    ],
    "des raga classical": [
      "https://www.youtube.com/watch?v=example10", // Pandit Jasraj - Des
      "https://www.youtube.com/watch?v=example11", // Ustad Rashid Khan - Des
      "https://www.youtube.com/watch?v=example12", // Pandit Bhimsen Joshi - Des
    ],
    "hamsadhvani raga classical": [
      "https://www.youtube.com/watch?v=example13", // Dr. M. Balamuralikrishna - Hamsadhvani
      "https://www.youtube.com/watch?v=example14", // Pandit Ravi Shankar - Hamsadhvani
      "https://www.youtube.com/watch?v=example15", // Ustad Ali Akbar Khan - Hamsadhvani
    ],
    "darbari raga classical": [
      "https://www.youtube.com/watch?v=example16", // Ustad Amir Khan - Darbari Kanada
      "https://www.youtube.com/watch?v=example17", // Pandit Bhimsen Joshi - Darbari
      "https://www.youtube.com/watch?v=example18", // Ustad Rashid Khan - Darbari Kanada
    ],
  }

  // Find matching videos based on query
  for (const [key, videos] of Object.entries(videoDatabase)) {
    if (query.toLowerCase().includes(key.split(" ")[0])) {
      return videos
    }
  }

  // Default fallback videos
  return [
    "https://www.youtube.com/watch?v=example19",
    "https://www.youtube.com/watch?v=example20",
    "https://www.youtube.com/watch?v=example21",
  ]
}

export function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export function createEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  channelTitle: string
  publishedAt: string
  viewCount: number
  url: string
  embedUrl: string
}

export interface YouTubeSearchOptions {
  query: string
  maxResults?: number
  order?: "relevance" | "date" | "rating" | "viewCount"
  videoDuration?: "short" | "medium" | "long"
  videoDefinition?: "any" | "high"
}

// Enhanced YouTube API integration
export async function searchYouTubeVideos(options: YouTubeSearchOptions): Promise<YouTubeVideo[]> {
  const { query, maxResults = 10, order = "relevance", videoDuration = "any", videoDefinition = "any" } = options

  try {
    // In a real implementation, you would use the YouTube Data API v3
    // For now, we'll simulate with enhanced curated content
    const videos = await fetchCuratedRagaVideos(query, maxResults)
    return videos
  } catch (error) {
    console.error("Error searching YouTube videos:", error)
    return []
  }
}

async function fetchCuratedRagaVideos(query: string, maxResults: number): Promise<YouTubeVideo[]> {
  // Enhanced curated database with real-like video data
  const enhancedVideoDatabase: Record<string, YouTubeVideo[]> = {
    "yaman raga classical": [
      {
        id: "kOvKXjb5p7g",
        title: "Raga Yaman - Pandit Jasraj | Classical Vocal",
        description:
          "A mesmerizing rendition of Raga Yaman by the legendary Pandit Jasraj. This evening raga showcases the beauty of Kalyan thaat.",
        thumbnail: "/placeholder-y6bd7.png",
        duration: "28:45",
        channelTitle: "Classical Music Archive",
        publishedAt: "2019-03-15T10:30:00Z",
        viewCount: 1250000,
        url: "https://www.youtube.com/watch?v=kOvKXjb5p7g",
        embedUrl: "https://www.youtube.com/embed/kOvKXjb5p7g",
      },
      {
        id: "dQw4w9WgXcQ",
        title: "Raga Yaman Alap - Ustad Rashid Khan",
        description:
          "Pure alap in Raga Yaman demonstrating the intricate movements and emotional depth of this romantic raga.",
        thumbnail: "/indian-classical-musician.png",
        duration: "15:22",
        channelTitle: "Hindustani Classical",
        publishedAt: "2020-07-08T14:20:00Z",
        viewCount: 890000,
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
      {
        id: "example3",
        title: "Raga Yaman Sitar - Pandit Ravi Shankar",
        description:
          "Master sitar performance in Raga Yaman showcasing traditional techniques and improvisational skills.",
        thumbnail: "/sitar-player-indian-classical.png",
        duration: "32:10",
        channelTitle: "Sitar Classics",
        publishedAt: "2018-11-22T09:15:00Z",
        viewCount: 2100000,
        url: "https://www.youtube.com/watch?v=example3",
        embedUrl: "https://www.youtube.com/embed/example3",
      },
    ],
    "bhairav raga classical": [
      {
        id: "example4",
        title: "Raga Bhairav Morning - Pandit Bhimsen Joshi",
        description: "Traditional morning raga Bhairav performed with devotional intensity and perfect intonation.",
        thumbnail: "/indian-vocalist-morning-raga.png",
        duration: "25:30",
        channelTitle: "Vocal Traditions",
        publishedAt: "2017-05-12T06:00:00Z",
        viewCount: 1800000,
        url: "https://www.youtube.com/watch?v=example4",
        embedUrl: "https://www.youtube.com/embed/example4",
      },
      {
        id: "example5",
        title: "Raga Bhairav Dhrupad - Ustad Zia Mohiuddin Dagar",
        description: "Ancient dhrupad style presentation of Raga Bhairav with deep spiritual resonance.",
        thumbnail: "/dhrupad-singer.png",
        duration: "42:15",
        channelTitle: "Dhrupad Heritage",
        publishedAt: "2016-09-03T07:30:00Z",
        viewCount: 650000,
        url: "https://www.youtube.com/watch?v=example5",
        embedUrl: "https://www.youtube.com/embed/example5",
      },
    ],
    "malkauns raga classical": [
      {
        id: "example7",
        title: "Raga Malkauns Sarod - Ustad Ali Akbar Khan",
        description:
          "Haunting late-night raga Malkauns on sarod, exploring the pentatonic beauty of this ancient raga.",
        thumbnail: "/sarod-player-night-raga.png",
        duration: "38:45",
        channelTitle: "Sarod Masters",
        publishedAt: "2015-12-18T23:00:00Z",
        viewCount: 1400000,
        url: "https://www.youtube.com/watch?v=example7",
        embedUrl: "https://www.youtube.com/embed/example7",
      },
    ],
    "des raga classical": [
      {
        id: "example10",
        title: "Raga Des Monsoon - Pandit Jasraj",
        description: "Joyful monsoon raga Des celebrating the arrival of rains with festive energy.",
        thumbnail: "/indian-monsoon-music.png",
        duration: "22:18",
        channelTitle: "Seasonal Ragas",
        publishedAt: "2019-07-15T18:00:00Z",
        viewCount: 920000,
        url: "https://www.youtube.com/watch?v=example10",
        embedUrl: "https://www.youtube.com/embed/example10",
      },
    ],
    "hamsadhvani raga classical": [
      {
        id: "example13",
        title: "Raga Hamsadhvani Veena - Dr. M. Balamuralikrishna",
        description: "South Indian pentatonic raga Hamsadhvani on veena, showcasing its uplifting character.",
        thumbnail: "/veena-player-south-indian-classical.png",
        duration: "19:35",
        channelTitle: "Carnatic Classics",
        publishedAt: "2018-04-20T16:45:00Z",
        viewCount: 750000,
        url: "https://www.youtube.com/watch?v=example13",
        embedUrl: "https://www.youtube.com/embed/example13",
      },
    ],
  }

  // Find matching videos based on query
  const matchingVideos: YouTubeVideo[] = []

  for (const [key, videos] of Object.entries(enhancedVideoDatabase)) {
    if (query.toLowerCase().includes(key.split(" ")[0])) {
      matchingVideos.push(...videos)
    }
  }

  // If no specific matches, return general classical music videos
  if (matchingVideos.length === 0) {
    const allVideos = Object.values(enhancedVideoDatabase).flat()
    return allVideos.slice(0, maxResults)
  }

  return matchingVideos.slice(0, maxResults)
}

export function createRagaPlaylist(
  ragaName: string,
  videos: YouTubeVideo[],
): {
  name: string
  description: string
  videos: YouTubeVideo[]
  totalDuration: string
} {
  const totalSeconds = videos.reduce((sum, video) => {
    const [minutes, seconds] = video.duration.split(":").map(Number)
    return sum + minutes * 60 + seconds
  }, 0)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const totalDuration = hours > 0 ? `${hours}:${minutes.toString().padStart(2, "0")}:00` : `${minutes}:00`

  return {
    name: `${ragaName} Classical Collection`,
    description: `Curated collection of authentic ${ragaName} raga performances by master musicians`,
    videos,
    totalDuration,
  }
}

export function filterVideosByDuration(videos: YouTubeVideo[], minMinutes: number, maxMinutes: number): YouTubeVideo[] {
  return videos.filter((video) => {
    const [minutes] = video.duration.split(":").map(Number)
    return minutes >= minMinutes && minutes <= maxMinutes
  })
}

export function sortVideosByPopularity(videos: YouTubeVideo[]): YouTubeVideo[] {
  return [...videos].sort((a, b) => b.viewCount - a.viewCount)
}

export function getVideoAnalytics(video: YouTubeVideo): {
  engagement: "high" | "medium" | "low"
  ageCategory: "recent" | "classic" | "vintage"
  duration: "short" | "medium" | "long"
} {
  const viewCount = video.viewCount
  const publishYear = new Date(video.publishedAt).getFullYear()
  const currentYear = new Date().getFullYear()
  const [minutes] = video.duration.split(":").map(Number)

  return {
    engagement: viewCount > 1000000 ? "high" : viewCount > 500000 ? "medium" : "low",
    ageCategory: currentYear - publishYear < 3 ? "recent" : currentYear - publishYear < 10 ? "classic" : "vintage",
    duration: minutes < 15 ? "short" : minutes < 35 ? "medium" : "long",
  }
}
