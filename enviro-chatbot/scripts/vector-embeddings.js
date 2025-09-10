// Vector embedding generation script
// This would typically use OpenAI's embedding API in production

import fs from "fs"

class VectorEmbeddingGenerator {
  constructor() {
    this.embeddingDimension = 1536 // OpenAI ada-002 dimension
  }

  // Simulate OpenAI embedding generation
  // In production, you'd call: openai.embeddings.create()
  async generateEmbedding(text) {
    // This is a mock embedding - in production use OpenAI API
    const mockEmbedding = Array.from({ length: this.embeddingDimension }, () => Math.random() * 2 - 1)

    // Add some text-based features for better simulation
    const textFeatures = this.extractTextFeatures(text)
    return mockEmbedding.map((val, idx) => val + (textFeatures[idx % textFeatures.length] || 0) * 0.1)
  }

  extractTextFeatures(text) {
    const features = []
    const words = text.toLowerCase().split(/\s+/)

    // Environmental testing keywords
    const keywords = [
      "environmental",
      "testing",
      "contamination",
      "soil",
      "water",
      "air",
      "quality",
      "monitoring",
      "assessment",
      "compliance",
      "construction",
      "safety",
      "green",
      "building",
      "phase",
      "analysis",
      "sampling",
      "detection",
      "emissions",
      "groundwater",
    ]

    keywords.forEach((keyword) => {
      const count = words.filter((word) => word.includes(keyword)).length
      features.push(count / words.length)
    })

    return features
  }

  async processContentFile(inputFile, outputFile) {
    try {
      console.log("Loading content from:", inputFile)
      const content = JSON.parse(fs.readFileSync(inputFile, "utf8"))

      console.log(`Processing ${content.length} content chunks...`)

      const embeddedContent = []

      for (let i = 0; i < content.length; i++) {
        const chunk = content[i]
        console.log(`Processing chunk ${i + 1}/${content.length}: ${chunk.id}`)

        // Generate embedding for the content
        const embedding = await this.generateEmbedding(chunk.content)

        const embeddedChunk = {
          ...chunk,
          embedding: embedding,
          embedding_model: "text-embedding-ada-002", // In production
          created_at: new Date().toISOString(),
        }

        embeddedContent.push(embeddedChunk)

        // Small delay to simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Save embedded content
      fs.writeFileSync(outputFile, JSON.stringify(embeddedContent, null, 2))
      console.log(`Embedded content saved to: ${outputFile}`)

      // Generate summary
      this.generateSummary(embeddedContent)

      return embeddedContent
    } catch (error) {
      console.error("Error processing content:", error)
      throw error
    }
  }

  generateSummary(embeddedContent) {
    console.log("\n=== EMBEDDING SUMMARY ===")
    console.log(`Total chunks processed: ${embeddedContent.length}`)
    console.log(`Embedding dimension: ${this.embeddingDimension}`)

    const categories = {}
    let totalWords = 0

    embeddedContent.forEach((chunk) => {
      const category = chunk.category || "unknown"
      categories[category] = (categories[category] || 0) + 1
      totalWords += chunk.content.split(" ").length
    })

    console.log("\nContent distribution by category:")
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} chunks`)
    })

    console.log(`\nAverage words per chunk: ${Math.round(totalWords / embeddedContent.length)}`)
    console.log("=========================\n")
  }

  // Simulate vector similarity search
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  async searchSimilarContent(query, embeddedContent, topK = 5) {
    console.log(`Searching for: "${query}"`)

    // Generate embedding for query
    const queryEmbedding = await this.generateEmbedding(query)

    // Calculate similarities
    const similarities = embeddedContent.map((chunk) => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding),
    }))

    // Sort by similarity and return top results
    const results = similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK)

    console.log("\nTop similar content:")
    results.forEach((result, index) => {
      console.log(`${index + 1}. [${result.similarity.toFixed(3)}] ${result.id}`)
      console.log(`   Category: ${result.category}`)
      console.log(`   Content: ${result.content.substring(0, 100)}...`)
      console.log()
    })

    return results
  }
}

// Main execution
async function main() {
  const generator = new VectorEmbeddingGenerator()

  const inputFile = "enviro_content.json"
  const outputFile = "enviro_embedded_content.json"

  try {
    // Process content and generate embeddings
    const embeddedContent = await generator.processContentFile(inputFile, outputFile)

    // Test similarity search
    console.log("\n=== TESTING SIMILARITY SEARCH ===")
    await generator.searchSimilarContent("soil contamination testing for construction sites", embeddedContent)

    await generator.searchSimilarContent("air quality monitoring during construction", embeddedContent)
  } catch (error) {
    console.error("Script failed:", error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { VectorEmbeddingGenerator }
