export interface Raga {
  id: string
  name: string
  hindiName: string
  sanskritName?: string
  thaat: string
  thaatHindi: string
  mood: string[]
  rasa: string[] // Traditional 9 rasas
  bhava: string[] // Emotional states in Sanskrit
  guna: string[] // Qualities: sattva, rajas, tamas
  description: string
  culturalContext: string
  aroha: string
  avroha: string
  vadi: string
  samvadi: string
  anuvadi?: string[]
  vivadi?: string[]
  pakad: string
  chalan: string // Characteristic movement
  timeOfDay: string
  prahar: string // Traditional time divisions
  season?: string
  ritu?: string // Sanskrit season names
  deity?: string // Associated deity
  chakra?: string // Associated chakra
  youtubeLinks: string[]
  midiNotes: number[]
  frequency: number // Base frequency in Hz
  temperament: "just" | "equal" | "meantone"
  microtones?: number[] // Shruti variations
}

export const ragaDatabase: Raga[] = [
  {
    id: "yaman",
    name: "Yaman",
    hindiName: "यमन",
    sanskritName: "यमन कल्याण",
    thaat: "Kalyan",
    thaatHindi: "कल्याण",
    mood: ["romantic", "peaceful", "devotional"],
    rasa: ["श्रृंगार (Shringar)", "शांत (Shanta)", "भक्ति (Bhakti)"],
    bhava: ["प्रेम (Prem)", "शांति (Shanti)", "आनंद (Anand)"],
    guna: ["सत्त्व (Sattva)", "रजस (Rajas)"],
    description:
      "One of the most popular ragas, often performed in the evening. Known for its romantic and devotional qualities.",
    culturalContext: "यमन राग संध्या काल का राजा है। इसे 'राग राज' भी कहते हैं। यह प्रेम और भक्ति की अभिव्यक्ति करता है।",
    aroha: "N R G M+ D N S'",
    avroha: "S' N D M+ G R S",
    vadi: "G",
    samvadi: "N",
    anuvadi: ["R", "M+", "D"],
    vivadi: ["M"],
    pakad: "N R G M+ D",
    chalan: "N R G M+ D N S' R' N D M+ G R S",
    timeOfDay: "Evening (6-9 PM)",
    prahar: "द्वितीय प्रहर (Dwitiya Prahar)",
    deity: "श्री कृष्ण (Shri Krishna)",
    chakra: "अनाहत (Anahata - Heart Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example1", "https://www.youtube.com/watch?v=example2"],
    midiNotes: [60, 62, 64, 66, 67, 69, 71],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 204, 386, 498, 702, 884, 1088],
  },
  {
    id: "bhairav",
    name: "Bhairav",
    hindiName: "भैरव",
    sanskritName: "भैरव राग",
    thaat: "Bhairav",
    thaatHindi: "भैरव",
    mood: ["devotional", "serious", "melancholic"],
    rasa: ["रौद्र (Raudra)", "भयानक (Bhayanaka)", "शांत (Shanta)"],
    bhava: ["भक्ति (Bhakti)", "गंभीरता (Gambhirta)", "वैराग्य (Vairagya)"],
    guna: ["सत्त्व (Sattva)", "तमस (Tamas)"],
    description: "A morning raga with a serious and devotional character, often used in prayers.",
    culturalContext: "भैरव राग प्रातःकाल का राग है। यह भगवान शिव के भैरव रूप से संबंधित है। इसमें गंभीरता और भक्ति का भाव है।",
    aroha: "S r G M P d N S'",
    avroha: "S' N d P M G r S",
    vadi: "D",
    samvadi: "R",
    anuvadi: ["G", "M", "P"],
    vivadi: ["R+", "D+"],
    pakad: "S r G M P",
    chalan: "S r G M P d N S' N d P M G r S",
    timeOfDay: "Morning (6-9 AM)",
    prahar: "प्रथम प्रहर (Prathama Prahar)",
    deity: "भैरव (Bhairav - Shiva)",
    chakra: "मूलाधार (Muladhara - Root Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example3"],
    midiNotes: [60, 61, 64, 65, 67, 68, 71],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 90, 386, 498, 702, 792, 1088],
  },
  {
    id: "malkauns",
    name: "Malkauns",
    hindiName: "मालकौंस",
    sanskritName: "मालकौशिक",
    thaat: "Bhairavi",
    thaatHindi: "भैरवी",
    mood: ["melancholic", "serious", "contemplative"],
    rasa: ["करुण (Karuna)", "शांत (Shanta)", "वीभत्स (Vibhatsa)"],
    bhava: ["विषाद (Vishad)", "चिंतन (Chintan)", "गहनता (Gahanata)"],
    guna: ["तमस (Tamas)", "सत्त्व (Sattva)"],
    description: "A pentatonic raga with a deep, contemplative mood, often performed late at night.",
    culturalContext: "मालकौंस राग रात्रि का राग है। यह गहन चिंतन और आत्मनिरीक्षण के लिए प्रसिद्ध है। केवल पांच स्वरों में अद्भुत गहराई।",
    aroha: "S g M d n S'",
    avroha: "S' n d M g S",
    vadi: "M",
    samvadi: "S",
    anuvadi: ["g", "d", "n"],
    vivadi: ["R", "G", "P", "D", "N"],
    pakad: "g M d n S'",
    chalan: "S g M d n S' n d M g S",
    timeOfDay: "Late Night (12-3 AM)",
    prahar: "चतुर्थ प्रहर (Chaturtha Prahar)",
    deity: "काली माता (Kali Mata)",
    chakra: "स्वाधिष्ठान (Swadhisthana - Sacral Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example4"],
    midiNotes: [60, 63, 65, 68, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 316, 498, 792, 996],
  },
  {
    id: "des",
    name: "Des",
    hindiName: "देस",
    sanskritName: "देशी राग",
    thaat: "Khamaj",
    thaatHindi: "खमाज",
    mood: ["joyful", "energetic", "festive"],
    rasa: ["हास्य (Hasya)", "वीर (Veer)", "अद्भुत (Adbhuta)"],
    bhava: ["हर्ष (Harsha)", "उत्साह (Utsaha)", "उल्लास (Ullas)"],
    guna: ["रजस (Rajas)", "सत्त्व (Sattva)"],
    description: "A joyful raga often associated with the monsoon season and festive occasions.",
    culturalContext: "देस राग वर्षा ऋतु का राग है। यह खुशी और उत्सव का प्रतीक है। लोक संगीत से शास्त्रीय संगीत में आया।",
    aroha: "S R M P N S'",
    avroha: "S' n D P M G R S",
    vadi: "R",
    samvadi: "P",
    anuvadi: ["M", "N", "D"],
    vivadi: ["G", "d"],
    pakad: "S R M P N",
    chalan: "S R M P N S' n D P M G R S",
    timeOfDay: "Late Evening (9-12 AM)",
    prahar: "तृतीय प्रहर (Tritiya Prahar)",
    season: "Monsoon",
    ritu: "वर्षा ऋतु (Varsha Ritu)",
    deity: "इंद्र देव (Indra Dev)",
    chakra: "मणिपुर (Manipura - Solar Plexus)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example5"],
    midiNotes: [60, 62, 65, 67, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 204, 498, 702, 996],
  },
  {
    id: "hamsadhvani",
    name: "Hamsadhvani",
    hindiName: "हंसध्वनि",
    sanskritName: "हंस ध्वनि",
    thaat: "Bilaval",
    thaatHindi: "बिलावल",
    mood: ["joyful", "energetic", "uplifting"],
    rasa: ["हास्य (Hasya)", "श्रृंगार (Shringar)", "अद्भुत (Adbhuta)"],
    bhava: ["प्रसन्नता (Prasannata)", "स्फूर्ति (Sphurti)", "उन्नति (Unnati)"],
    guna: ["सत्त्व (Sattva)", "रजस (Rajas)"],
    description: "A pentatonic raga with an uplifting and joyful character, popular in South Indian music.",
    culturalContext: "हंसध्वनि राग हंस की मधुर ध्वनि के समान है। यह दक्षिण भारतीय संगीत में अत्यंत लोकप्रिय है।",
    aroha: "S R G P N S'",
    avroha: "S' N P G R S",
    vadi: "G",
    samvadi: "N",
    anuvadi: ["R", "P"],
    vivadi: ["M", "D"],
    pakad: "S R G P N",
    chalan: "S R G P N S' N P G R S",
    timeOfDay: "Evening",
    prahar: "द्वितीय प्रहर (Dwitiya Prahar)",
    deity: "सरस्वती माता (Saraswati Mata)",
    chakra: "विशुद्ध (Vishuddha - Throat Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example6"],
    midiNotes: [60, 62, 64, 67, 69],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 204, 386, 702, 884],
  },
  {
    id: "darbari",
    name: "Darbari Kanada",
    hindiName: "दरबारी कानड़ा",
    sanskritName: "दरबारी कर्णाटक",
    thaat: "Asavari",
    thaatHindi: "आसावरी",
    mood: ["serious", "royal", "contemplative"],
    rasa: ["वीर (Veer)", "रौद्र (Raudra)", "शांत (Shanta)"],
    bhava: ["गौरव (Gaurav)", "गंभीरता (Gambhirta)", "राजसी (Rajasi)"],
    guna: ["सत्त्व (Sattva)", "रजस (Rajas)"],
    description: "A majestic raga with royal character, often performed with great seriousness and depth.",
    culturalContext: "दरबारी कानड़ा राजदरबार का राग है। तानसेन के नवरत्नों में से एक। इसमें राजसी गौरव और गंभीरता है।",
    aroha: "S R g M P d n S'",
    avroha: "S' n d P M g R S",
    vadi: "R",
    samvadi: "P",
    anuvadi: ["g", "M", "d", "n"],
    vivadi: ["G", "D", "N"],
    pakad: "R g M P d",
    chalan: "S R g M P d n S' n d P M g R S",
    timeOfDay: "Late Night",
    prahar: "चतुर्थ प्रहर (Chaturtha Prahar)",
    deity: "राजा राम (Raja Ram)",
    chakra: "आज्ञा (Ajna - Third Eye Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=example7"],
    midiNotes: [60, 62, 63, 65, 67, 68, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 204, 316, 498, 702, 792, 996],
  },
  {
    id: "bhimpalasi",
    name: "Bhimpalasi",
    hindiName: "भीमपलासी",
    sanskritName: "भीम पलाशी",
    thaat: "Kafi",
    thaatHindi: "काफी",
    mood: ["romantic", "melancholic", "contemplative"],
    rasa: ["श्रृंगार (Shringar)", "करुण (Karuna)", "शांत (Shanta)"],
    bhava: ["प्रेम (Prem)", "विरह (Viraha)", "स्मृति (Smriti)"],
    guna: ["सत्त्व (Sattva)", "रजस (Rajas)"],
    description: "A beautiful afternoon raga with romantic and slightly melancholic character.",
    culturalContext: "भीमपलासी दोपहर का राग है। इसमें प्रेम और विरह दोनों भाव हैं। पलाश के फूल की तरह सुंदर।",
    aroha: "S g M P N S'",
    avroha: "S' N d P M g R S",
    vadi: "M",
    samvadi: "S",
    anuvadi: ["g", "P", "N", "d"],
    vivadi: ["R+", "G", "D"],
    pakad: "g M P N d P",
    chalan: "S g M P N S' N d P M g R S",
    timeOfDay: "Afternoon (12-3 PM)",
    prahar: "मध्याह्न (Madhyahna)",
    deity: "राधा कृष्ण (Radha Krishna)",
    chakra: "अनाहत (Anahata - Heart Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=bhimpalasi1"],
    midiNotes: [60, 63, 65, 67, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 316, 498, 702, 996],
  },
  {
    id: "bageshri",
    name: "Bageshri",
    hindiName: "बागेश्री",
    sanskritName: "बाग ईश्वरी",
    thaat: "Kafi",
    thaatHindi: "काफी",
    mood: ["romantic", "devotional", "peaceful"],
    rasa: ["श्रृंगार (Shringar)", "शांत (Shanta)", "भक्ति (Bhakti)"],
    bhava: ["प्रेम (Prem)", "शांति (Shanti)", "सुकून (Sukoon)"],
    guna: ["सत्त्व (Sattva)", "रजस (Rajas)"],
    description: "A night raga with deep romantic and devotional feelings.",
    culturalContext: "बागेश्री रात्रि की रागिनी है। बाग की देवी के समान मधुर। इसमें प्रेम और भक्ति का संयोजन है।",
    aroha: "S g M D N S'",
    avroha: "S' N D M g R S",
    vadi: "M",
    samvadi: "S",
    anuvadi: ["g", "D", "N"],
    vivadi: ["R+", "G", "P"],
    pakad: "M D N S' R' N D",
    chalan: "S g M D N S' N D M g R S",
    timeOfDay: "Night (9 PM-12 AM)",
    prahar: "तृतीय प्रहर (Tritiya Prahar)",
    deity: "लक्ष्मी माता (Lakshmi Mata)",
    chakra: "अनाहत (Anahata - Heart Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=bageshri1"],
    midiNotes: [60, 63, 65, 69, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 316, 498, 884, 996],
  },
  {
    id: "miyan_malhar",
    name: "Miyan Malhar",
    hindiName: "मियां मल्हार",
    sanskritName: "मेघ मल्हार",
    thaat: "Kafi",
    thaatHindi: "काफी",
    mood: ["joyful", "energetic", "monsoon"],
    rasa: ["अद्भुत (Adbhuta)", "वीर (Veer)", "हास्य (Hasya)"],
    bhava: ["आनंद (Anand)", "उत्साह (Utsaha)", "प्रकृति प्रेम (Prakriti Prem)"],
    guna: ["रजस (Rajas)", "सत्त्व (Sattva)"],
    description: "The king of monsoon ragas, said to bring rain when performed correctly.",
    culturalContext: "मियां मल्हार वर्षा राग का राजा है। तानसेन की रचना। कहते हैं इसे गाने से वर्षा होती है।",
    aroha: "S R g M P N S'",
    avroha: "S' N d P M g R S",
    vadi: "M",
    samvadi: "S",
    anuvadi: ["R", "g", "P", "N", "d"],
    vivadi: ["G", "D"],
    pakad: "R g M P N d P",
    chalan: "S R g M P N S' N d P M g R S",
    timeOfDay: "Monsoon Season",
    prahar: "वर्षा काल (Varsha Kaal)",
    season: "Monsoon",
    ritu: "वर्षा ऋतु (Varsha Ritu)",
    deity: "इंद्र देव (Indra Dev)",
    chakra: "स्वाधिष्ठान (Swadhisthana - Sacral Chakra)",
    youtubeLinks: ["https://www.youtube.com/watch?v=miyan_malhar1"],
    midiNotes: [60, 62, 63, 65, 67, 68, 70],
    frequency: 261.63,
    temperament: "just",
    microtones: [0, 204, 316, 498, 702, 792, 996],
  },
]

// Enhanced mood mapping with Sanskrit/Hindi terms
export const moodToRagaMapping = {
  // English terms
  romantic: ["yaman", "bhimpalasi", "bageshri"],
  devotional: ["yaman", "bhairav", "bageshri", "ahir_bhairav"],
  peaceful: ["yaman", "malkauns", "bageshri"],
  energetic: ["des", "hamsadhvani", "miyan_malhar"],
  melancholic: ["malkauns", "bhairav", "darbari", "bhimpalasi"],
  joyful: ["des", "hamsadhvani", "miyan_malhar"],
  serious: ["bhairav", "darbari", "malkauns"],
  contemplative: ["malkauns", "darbari", "bhimpalasi"],
  royal: ["darbari"],
  monsoon: ["miyan_malhar", "des"],

  // Sanskrit/Hindi terms
  श्रृंगार: ["yaman", "bhimpalasi", "bageshri", "hamsadhvani"],
  शांत: ["yaman", "bhairav", "malkauns", "bageshri"],
  करुण: ["malkauns", "bhimpalasi"],
  रौद्र: ["bhairav", "darbari"],
  वीर: ["darbari", "miyan_malhar"],
  हास्य: ["des", "hamsadhvani", "miyan_malhar"],
  अद्भुत: ["des", "hamsadhvani", "miyan_malhar"],
  भयानक: ["bhairav"],
  वीभत्स: ["malkauns"],

  // Bhava terms
  प्रेम: ["yaman", "bhimpalasi", "bageshri"],
  भक्ति: ["yaman", "bhairav", "bageshri"],
  शांति: ["yaman", "bageshri"],
  आनंद: ["yaman", "hamsadhvani", "miyan_malhar"],
  विषाद: ["malkauns", "bhimpalasi"],
  गंभीरता: ["bhairav", "darbari"],
  उत्साह: ["des", "miyan_malhar"],
  चिंतन: ["malkauns", "darbari"],
}

// Traditional time-based raga classification
export const timeBasedRagas = {
  "प्रातःकाल (Morning)": ["bhairav", "ahir_bhairav"],
  "मध्याह्न (Afternoon)": ["bhimpalasi"],
  "संध्या (Evening)": ["yaman", "hamsadhvani"],
  "रात्रि (Night)": ["bageshri", "malkauns", "darbari"],
  "वर्षा (Monsoon)": ["miyan_malhar", "des"],
}

// Chakra-based raga mapping
export const chakraRagas = {
  "मूलाधार (Root)": ["bhairav"],
  "स्वाधिष्ठान (Sacral)": ["malkauns", "miyan_malhar"],
  "मणिपुर (Solar Plexus)": ["des"],
  "अनाहत (Heart)": ["yaman", "bhimpalasi", "bageshri"],
  "विशुद्ध (Throat)": ["hamsadhvani"],
  "आज्ञा (Third Eye)": ["darbari"],
  "सहस्रार (Crown)": [],
}

export function getRagasByMood(mood: string): Raga[] {
  const ragaIds = moodToRagaMapping[mood as keyof typeof moodToRagaMapping] || []
  return ragaIds.map((id) => ragaDatabase.find((raga) => raga.id === id)!).filter(Boolean)
}

export function getRagasByTime(timeCategory: string): Raga[] {
  const ragaIds = timeBasedRagas[timeCategory as keyof typeof timeBasedRagas] || []
  return ragaIds.map((id) => ragaDatabase.find((raga) => raga.id === id)!).filter(Boolean)
}

export function getRagasByChakra(chakra: string): Raga[] {
  const ragaIds = chakraRagas[chakra as keyof typeof chakraRagas] || []
  return ragaIds.map((id) => ragaDatabase.find((raga) => raga.id === id)!).filter(Boolean)
}

// Traditional rasa (emotion) theory
export const navaRasa = [
  { sanskrit: "श्रृंगार", english: "Shringar", description: "Love, Romance, Beauty" },
  { sanskrit: "हास्य", english: "Hasya", description: "Laughter, Joy, Comedy" },
  { sanskrit: "करुण", english: "Karuna", description: "Compassion, Sadness, Pathos" },
  { sanskrit: "रौद्र", english: "Raudra", description: "Anger, Fury, Wrath" },
  { sanskrit: "वीर", english: "Veer", description: "Heroism, Courage, Valor" },
  { sanskrit: "भयानक", english: "Bhayanaka", description: "Fear, Terror, Horror" },
  { sanskrit: "वीभत्स", english: "Vibhatsa", description: "Disgust, Aversion" },
  { sanskrit: "अद्भुत", english: "Adbhuta", description: "Wonder, Amazement, Marvel" },
  { sanskrit: "शांत", english: "Shanta", description: "Peace, Tranquility, Serenity" },
]
