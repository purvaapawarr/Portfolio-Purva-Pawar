import { NextRequest, NextResponse } from 'next/server'

// Mock knowledge base for Enviro Test Construct
const knowledgeBase = {
  groundwater: {
    keywords: ['groundwater', 'water', 'contamination', 'well', 'aquifer', 'monitoring'],
    response: `**Groundwater Contamination Detection**

We use advanced techniques to detect groundwater contamination:

🔬 **Analytical Methods:**
• GC-MS (Gas Chromatography-Mass Spectrometry) for organic compounds
• ICP-MS (Inductively Coupled Plasma-Mass Spectrometry) for heavy metals
• Ion chromatography for inorganic anions and cations

💧 **Monitoring Systems:**
• Installation of monitoring wells at strategic locations
• Continuous water level and quality monitoring
• Real-time data logging and remote access capabilities

🎯 **Target Contaminants:**
• Volatile Organic Compounds (VOCs)
• Heavy metals (lead, mercury, chromium, arsenic)
• Petroleum hydrocarbons (BTEX compounds)
• Chlorinated solvents and industrial chemicals

📊 **Reporting:**
• Comprehensive analytical reports with EPA-approved methods
• Regulatory compliance documentation
• Risk assessment and remediation recommendations`
  },
  
  soil: {
    keywords: ['soil', 'contamination', 'testing', 'phase', 'assessment', 'heavy metals', 'voc'],
    response: `**Soil Testing & Analysis Services**

Comprehensive soil contamination assessment and testing:

🌱 **Phase I Environmental Site Assessment:**
• Historical site research and records review
• Site reconnaissance and visual inspection
• Regulatory database searches
• ASTM E1527-21 compliant reporting

🔍 **Phase II Environmental Site Assessment:**
• Soil sampling and laboratory analysis
• Groundwater monitoring well installation
• Subsurface investigation and drilling
• Contamination delineation studies

⚗️ **Laboratory Analysis:**
• Heavy metals analysis (EPA Method 6020B)
• Volatile Organic Compounds (EPA Method 8260D)
• Semi-volatile compounds (EPA Method 8270E)
• Total Petroleum Hydrocarbons (TPH)
• Pesticides and herbicides screening

📋 **Specialized Testing:**
• PFAS (Per- and polyfluoroalkyl substances) analysis
• Asbestos and lead-based paint surveys
• PCB (Polychlorinated biphenyls) testing
• Geotechnical soil properties evaluation`
  },
  
  air: {
    keywords: ['air', 'quality', 'monitoring', 'dust', 'emissions', 'pm2.5', 'pm10', 'construction'],
    response: `**Air Quality Monitoring Services**

Advanced air quality monitoring for construction and industrial sites:

🌬️ **Real-time Monitoring:**
• PM2.5 and PM10 particulate matter monitoring
• Continuous dust level measurement
• Weather station integration (wind speed, direction, humidity)
• Automated alert systems for threshold exceedances

🏗️ **Construction Site Monitoring:**
• Fugitive dust control compliance
• Construction activity impact assessment
• Neighbor complaint investigation
• Regulatory compliance reporting

📊 **Monitoring Equipment:**
• High-volume air samplers
• Portable dust monitors with data logging
• Meteorological monitoring stations
• Remote telemetry and web-based data access

🎯 **Parameters Measured:**
• Total Suspended Particulates (TSP)
• Respirable particulates (PM10, PM2.5)
• Volatile Organic Compounds (VOCs)
• Noise levels and vibration monitoring
• Ambient air temperature and humidity`
  },
  
  compliance: {
    keywords: ['compliance', 'regulatory', 'epa', 'permit', 'regulation', 'environmental'],
    response: `**Environmental Compliance Services**

Expert guidance for environmental regulatory compliance:

📜 **Regulatory Compliance:**
• EPA federal regulations compliance
• State and local environmental regulations
• OSHA workplace safety standards
• DOT hazardous materials transportation

🏢 **Permit Assistance:**
• Air quality permits and renewals
• Wastewater discharge permits
• Hazardous waste management permits
• Construction and demolition permits

📋 **Compliance Auditing:**
• Environmental management system audits
• Regulatory compliance assessments
• Due diligence investigations
• Risk management planning

🎓 **Training & Consulting:**
• Environmental compliance training programs
• Best practices implementation
• Emergency response planning
• Sustainability consulting and green building support`
  },
  
  general: {
    keywords: ['services', 'company', 'about', 'contact', 'help', 'testing'],
    response: `**Enviro Test Construct - Environmental Testing Excellence**

🏢 **About Us:**
Leading provider of comprehensive environmental testing and consulting services, specializing in construction industry support and regulatory compliance.

🔬 **Core Services:**
• Environmental Site Assessments (Phase I & II)
• Soil and Groundwater Testing
• Air Quality Monitoring
• Regulatory Compliance Consulting
• Emergency Response Services

🎯 **Why Choose Us:**
• EPA-certified laboratory and field services
• Advanced analytical instrumentation
• Experienced environmental professionals
• Fast turnaround times for critical projects
• 24/7 emergency response capabilities

📞 **Contact Information:**
• Phone: (555) 123-4567
• Emergency: (555) 999-8888
• Email: info@envirotestconstruct.com
• Available nationwide with local expertise`
  }
}

function findBestMatch(query: string): string {
  const queryLower = query.toLowerCase()
  let bestMatch = 'general'
  let maxScore = 0

  for (const [category, data] of Object.entries(knowledgeBase)) {
    const score = data.keywords.reduce((acc, keyword) => {
      return acc + (queryLower.includes(keyword) ? keyword.length : 0)
    }, 0)
    
    if (score > maxScore) {
      maxScore = score
      bestMatch = category
    }
  }

  return knowledgeBase[bestMatch as keyof typeof knowledgeBase].response
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = findBestMatch(message)
    
    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending the response in chunks
        const words = response.split(' ')
        let index = 0
        
        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words[index] + ' '
            controller.enqueue(encoder.encode(chunk))
            index++
            setTimeout(sendChunk, 50) // Delay between words for streaming effect
          } else {
            controller.close()
          }
        }
        
        sendChunk()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
