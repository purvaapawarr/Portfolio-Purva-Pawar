"use client"
import { SocialFeed } from "@/components/social-feed"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Social Feed</h1>
      <SocialFeed />
    </main>
  )
}
