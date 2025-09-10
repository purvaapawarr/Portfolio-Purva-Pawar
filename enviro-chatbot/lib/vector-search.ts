// Enhanced vector search with better content matching

interface ContentChunk {
  id: string
  content: string
  metadata: {
    source: string
    category: string
  }
}

// Enhanced knowledge base content from Enviro Test Construct
const knowledgeBase: ContentChunk[] = [
  {
    id: "1",
    content: `Enviro Test Construct delivers next-generation environmental testing technologies designed specifically for the construction sector. Based in Miami, FL, the company has rapidly become a trusted name in the industry by offering high-performance, innovative solutions that ensure both safety and sustainability on every project. Our customer-first approach, backed by rigorous quality assurance, expert support, and continuous product development, allows us to help our clients optimize performance, meet compliance standards, and make smarter decisions.`,
    metadata: { source: "homepage", category: "company-info" },
  },
  {
    id: "2",
    content: `Site Assessment & Contamination Detection services include comprehensive soil testing, groundwater analysis, and contamination identification. Our advanced testing methodologies help identify potential environmental hazards before construction begins, ensuring compliance with environmental regulations and protecting worker safety. We use state-of-the-art equipment and EPA-approved methods to detect heavy metals, petroleum hydrocarbons, volatile organic compounds (VOCs), and other hazardous substances in soil and groundwater.`,
    metadata: { source: "services", category: "site-assessment" },
  },
  {
    id: "3",
    content: `Environmental Monitoring & Sampling Technology encompasses real-time air quality monitoring, dust particle analysis, noise level assessment, and continuous environmental parameter tracking during construction activities. Our state-of-the-art sensors and monitoring equipment provide accurate, real-time data to ensure construction sites meet environmental standards. We monitor particulate matter (PM2.5, PM10), volatile organic compounds, asbestos fibers, and ambient air quality with portable monitoring stations that provide continuous data logging and real-time alerts.`,
    metadata: { source: "services", category: "monitoring" },
  },
  {
    id: "4",
    content: `Green Building and Compliance services help construction projects achieve LEED certification and meet sustainable building standards. We provide environmental impact assessments, energy efficiency testing, indoor air quality analysis, and comprehensive compliance documentation to support green building initiatives. Our team helps navigate federal, state, and local environmental regulations affecting construction projects, develop environmental management plans, and ensure projects meet all applicable environmental standards.`,
    metadata: { source: "services", category: "green-building" },
  },
  {
    id: "5",
    content: `Phase I Environmental Site Assessments (ESAs) are comprehensive evaluations that identify potential environmental contamination liabilities. Our certified environmental professionals conduct thorough site investigations, review historical records, and provide detailed reports that meet ASTM E1527 standards for due diligence requirements. These assessments include site reconnaissance, interviews with site personnel, review of government records, and evaluation of potential environmental concerns.`,
    metadata: { source: "services", category: "phase-1-esa" },
  },
  {
    id: "6",
    content: `Groundwater contamination detection services utilize advanced sampling techniques and analytical methods to identify contaminants in groundwater systems. We install monitoring wells, conduct aquifer testing, and provide long-term groundwater quality monitoring to assess environmental impact and remediation needs. Our groundwater testing includes analysis for petroleum hydrocarbons, heavy metals, volatile organic compounds, and other contaminants using advanced analytical techniques including GC-MS and ICP-MS methods.`,
    metadata: { source: "testing", category: "groundwater" },
  },
  {
    id: "7",
    content: `Soil contamination testing includes comprehensive analysis for heavy metals, petroleum hydrocarbons, volatile organic compounds (VOCs), and other hazardous substances. Our laboratory uses advanced analytical techniques including GC-MS, ICP-MS, and other EPA-approved methods to provide accurate contamination assessment results. We test for lead, arsenic, mercury, chromium, petroleum products, solvents, and other industrial contaminants that may be present in construction site soils.`,
    metadata: { source: "testing", category: "soil-testing" },
  },
  {
    id: "8",
    content: `Air quality monitoring during construction includes particulate matter (PM2.5, PM10) monitoring, volatile organic compound detection, asbestos fiber analysis, and ambient air quality assessment. Our portable monitoring stations provide continuous data logging and real-time alerts for environmental compliance. We track diesel exhaust, dust emissions, noise pollution, and other environmental impacts from construction activities to help contractors maintain compliance with local environmental regulations.`,
    metadata: { source: "monitoring", category: "air-quality" },
  },
  {
    id: "9",
    content: `Construction site emissions monitoring includes tracking of diesel exhaust, dust emissions, noise pollution, and other environmental impacts from construction activities. Our monitoring programs help contractors maintain compliance with local environmental regulations and minimize community impact. We provide real-time monitoring systems that alert project managers when emission levels exceed regulatory thresholds, allowing for immediate corrective action.`,
    metadata: { source: "monitoring", category: "emissions" },
  },
  {
    id: "10",
    content: `Environmental compliance consulting provides expert guidance on federal, state, and local environmental regulations affecting construction projects. Our team helps navigate permitting requirements, develop environmental management plans, and ensure projects meet all applicable environmental standards and regulations. We assist with NEPA compliance, Clean Air Act requirements, Clean Water Act permitting, and other regulatory frameworks that impact construction activities.`,
    metadata: { source: "consulting", category: "compliance" },
  },
]

// Enhanced similarity search with better keyword matching
export async function getRelevantContent(query: string): Promise<string> {
  const queryLower = query.toLowerCase()

  // Score each chunk based on keyword relevance
  const scoredChunks = knowledgeBase.map((chunk) => {
    const contentLower = chunk.content.toLowerCase()
    let score = 0

    // Enhanced keyword matching
    const keywords = queryLower.split(" ").filter((word) => word.length > 2)
    keywords.forEach((keyword) => {
      // Count occurrences of each keyword
      const occurrences = (contentLower.match(new RegExp(keyword, "g")) || []).length
      score += occurrences
    })

    // Boost score for specific category matches
    const categoryBoosts = {
      soil: ["soil-testing", "site-assessment"],
      groundwater: ["groundwater", "site-assessment"],
      water: ["groundwater", "site-assessment"],
      contamination: ["site-assessment", "groundwater", "soil-testing"],
      air: ["air-quality", "monitoring"],
      quality: ["air-quality", "monitoring"],
      monitoring: ["monitoring", "air-quality", "emissions"],
      compliance: ["compliance", "green-building"],
      green: ["green-building", "compliance"],
      building: ["green-building", "compliance"],
      phase: ["phase-1-esa", "site-assessment"],
      assessment: ["site-assessment", "phase-1-esa"],
      testing: ["soil-testing", "groundwater", "air-quality"],
      emissions: ["emissions", "air-quality", "monitoring"],
      construction: ["monitoring", "compliance", "emissions"],
      detect: ["site-assessment", "groundwater", "soil-testing"],
      analysis: ["soil-testing", "groundwater", "air-quality"],
    }

    Object.entries(categoryBoosts).forEach(([keyword, categories]) => {
      if (queryLower.includes(keyword)) {
        categories.forEach((category) => {
          if (chunk.metadata.category.includes(category)) {
            score += 3
          }
        })
      }
    })

    return { ...chunk, score }
  })

  // Sort by relevance and take top chunks
  const topChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((chunk) => chunk.score > 0)

  // If no relevant chunks found, return general company info and most relevant service
  if (topChunks.length === 0) {
    return knowledgeBase[0].content + "\n\n" + knowledgeBase[1].content
  }

  // Combine relevant content
  return topChunks.map((chunk) => chunk.content).join("\n\n")
}
