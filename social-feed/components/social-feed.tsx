"use client"

import { useEffect, useRef, useState } from "react"
import { Post } from "@/components/post"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for posts
const generateMockPosts = (start: number, count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const id = start + i
    const hasImage = Math.random() > 0.3 // 70% of posts have images
    return {
      id,
      author: {
        name: `User ${id % 10}`,
        avatar: `/placeholder.svg?height=40&width=40&text=${id % 10}`,
      },
      content: `This is post #${id}. ${
        hasImage ? "Check out this amazing photo!" : "Just sharing my thoughts with everyone."
      }`,
      image: hasImage ? `/placeholder.svg?height=400&width=600&text=Post+${id}` : null,
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    }
  })
}

export function SocialFeed() {
  const [posts, setPosts] = useState(() => generateMockPosts(1, 5))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMorePosts = async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nextPosts = generateMockPosts(posts.length + 1, 5)
    setPosts((prevPosts) => [...prevPosts, ...nextPosts])

    // Limit to 50 posts total for performance
    if (posts.length + 5 >= 50) {
      setHasMore(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          loadMorePosts()
        }
      },
      { threshold: 1.0 },
    )

    const currentLoaderRef = loaderRef.current
    if (currentLoaderRef) {
      observer.observe(currentLoaderRef)
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef)
      }
    }
  }, [posts, loading, hasMore])

  return (
    <div className="max-w-xl mx-auto">
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}

        {loading && (
          <div className="space-y-6">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {hasMore && <div ref={loaderRef} className="h-10" />}

        {!hasMore && <div className="text-center py-6 text-gray-500">You've reached the end of the feed</div>}
      </div>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  )
}
