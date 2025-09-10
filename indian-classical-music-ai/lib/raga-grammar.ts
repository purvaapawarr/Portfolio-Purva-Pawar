// Comprehensive Raga Grammar Engine for authentic Indian classical music generation

export interface RagaGrammar {
  id: string
  name: string
  thaat: string
  aroha: string[]
  avroha: string[]
  vadi: string
  samvadi: string
  pakad: string[][]
  forbiddenSwaras?: string[]
  allowedSwaras: string[]
  timeOfDay: string
  mood: string[]
  ornamentations: string[]
  phrasePatterns: string[][]
}

// Swara to MIDI note mapping (C4 = 60 as Sa)
export const swaraToMidi: Record<string, number> = {
  S: 60, // Sa - C4
  r: 61, // Komal Re - C#4
  R: 62, // Shuddha Re - D4
  g: 63, // Komal Ga - D#4
  G: 64, // Shuddha Ga - E4
  M: 65, // Shuddha Ma - F4
  "M+": 66, // Tivra Ma - F#4
  P: 67, // Pa - G4
  d: 68, // Komal Dha - G#4
  D: 69, // Shuddha Dha - A4
  n: 70, // Komal Ni - A#4
  N: 71, // Shuddha Ni - B4
  "S'": 72, // Tar Sa - C5
  "R'": 74, // Tar Re - D5
  "G'": 76, // Tar Ga - E5
  "M+'": 78, // Tar Tivra Ma - F#5
  "P'": 79, // Tar Pa - G5
  "D'": 81, // Tar Dha - A5
  "N'": 83, // Tar Ni - B5
}

export const ragaGrammarDatabase: RagaGrammar[] = [
  {
    id: "yaman",
    name: "Yaman",
    thaat: "Kalyan",
    aroha: ["N", "R", "G", "M+", "D", "N", "S'"],
    avroha: ["S'", "N", "D", "M+", "G", "R", "S"],
    vadi: "G",
    samvadi: "N",
    pakad: [
      ["N", "R", "G", "M+", "D"],
      ["G", "M+", "D", "N"],
      ["M+", "G", "R", "S"],
    ],
    allowedSwaras: ["S", "R", "G", "M+", "P", "D", "N"],
    forbiddenSwaras: ["M", "r", "g", "d", "n"],
    timeOfDay: "Evening",
    mood: ["romantic", "peaceful", "devotional"],
    ornamentations: ["meend", "gamak", "andolan"],
    phrasePatterns: [
      ["N", "R", "G", "M+"],
      ["G", "M+", "D", "N"],
      ["D", "N", "S'", "R'"],
      ["M+", "G", "R", "S"],
    ],
  },
  {
    id: "bhairav",
    name: "Bhairav",
    thaat: "Bhairav",
    aroha: ["S", "r", "G", "M", "P", "d", "N", "S'"],
    avroha: ["S'", "N", "d", "P", "M", "G", "r", "S"],
    vadi: "D",
    samvadi: "R",
    pakad: [
      ["S", "r", "G", "M", "P"],
      ["d", "N", "S'"],
      ["G", "M", "d", "r", "S"],
    ],
    allowedSwaras: ["S", "r", "G", "M", "P", "d", "N"],
    forbiddenSwaras: ["R", "g", "M+", "D", "n"],
    timeOfDay: "Morning",
    mood: ["devotional", "serious", "melancholic"],
    ornamentations: ["kampan", "andolan", "meend"],
    phrasePatterns: [
      ["S", "r", "G", "M"],
      ["M", "P", "d", "N"],
      ["N", "S'", "d", "P"],
      ["G", "r", "S"],
    ],
  },
  {
    id: "malkauns",
    name: "Malkauns",
    thaat: "Bhairavi",
    aroha: ["S", "g", "M", "d", "n", "S'"],
    avroha: ["S'", "n", "d", "M", "g", "S"],
    vadi: "M",
    samvadi: "S",
    pakad: [
      ["g", "M", "d", "n", "S'"],
      ["n", "d", "M", "g"],
      ["M", "g", "S"],
    ],
    allowedSwaras: ["S", "g", "M", "d", "n"],
    forbiddenSwaras: ["R", "r", "G", "M+", "P", "D", "N"],
    timeOfDay: "Late Night",
    mood: ["melancholic", "serious", "contemplative"],
    ornamentations: ["andolan", "kampan"],
    phrasePatterns: [
      ["S", "g", "M", "d"],
      ["d", "n", "S'"],
      ["n", "d", "M", "g"],
      ["M", "g", "S"],
    ],
  },
  {
    id: "des",
    name: "Des",
    thaat: "Khamaj",
    aroha: ["S", "R", "M", "P", "N", "S'"],
    avroha: ["S'", "n", "D", "P", "M", "G", "R", "S"],
    vadi: "R",
    samvadi: "P",
    pakad: [
      ["S", "R", "M", "P", "N"],
      ["N", "S'", "R'"],
      ["P", "M", "G", "R", "S"],
    ],
    allowedSwaras: ["S", "R", "G", "M", "P", "D", "N", "n"],
    forbiddenSwaras: ["r", "g", "M+", "d"],
    timeOfDay: "Late Evening",
    mood: ["joyful", "energetic", "festive"],
    ornamentations: ["taan", "gamak", "meend"],
    phrasePatterns: [
      ["S", "R", "M", "P"],
      ["P", "N", "S'", "R'"],
      ["N", "D", "P", "M"],
      ["G", "R", "S"],
    ],
  },
  {
    id: "hamsadhvani",
    name: "Hamsadhvani",
    thaat: "Bilaval",
    aroha: ["S", "R", "G", "P", "N", "S'"],
    avroha: ["S'", "N", "P", "G", "R", "S"],
    vadi: "G",
    samvadi: "N",
    pakad: [
      ["S", "R", "G", "P", "N"],
      ["N", "P", "G", "R"],
      ["G", "P", "N", "S'"],
    ],
    allowedSwaras: ["S", "R", "G", "P", "N"],
    forbiddenSwaras: ["r", "g", "M", "M+", "D", "d", "n"],
    timeOfDay: "Evening",
    mood: ["joyful", "energetic", "uplifting"],
    ornamentations: ["taan", "gamak"],
    phrasePatterns: [
      ["S", "R", "G", "P"],
      ["P", "N", "S'"],
      ["N", "P", "G", "R"],
      ["G", "R", "S"],
    ],
  },
]

export function getRagaGrammar(ragaId: string): RagaGrammar | undefined {
  return ragaGrammarDatabase.find((raga) => raga.id === ragaId)
}

export function validateSwara(swara: string, ragaGrammar: RagaGrammar): boolean {
  return ragaGrammar.allowedSwaras.includes(swara) && !ragaGrammar.forbiddenSwaras?.includes(swara)
}

export function getNextValidSwaras(
  currentSwara: string,
  ragaGrammar: RagaGrammar,
  direction: "aroha" | "avroha",
): string[] {
  const sequence = direction === "aroha" ? ragaGrammar.aroha : ragaGrammar.avroha
  const currentIndex = sequence.indexOf(currentSwara)

  if (currentIndex === -1) return ragaGrammar.allowedSwaras

  const validNext: string[] = []

  // Add immediate neighbors
  if (direction === "aroha" && currentIndex < sequence.length - 1) {
    validNext.push(sequence[currentIndex + 1])
  }
  if (direction === "avroha" && currentIndex > 0) {
    validNext.push(sequence[currentIndex - 1])
  }

  // Add jump possibilities (traditional raga movements)
  ragaGrammar.allowedSwaras.forEach((swara) => {
    if (validateSwara(swara, ragaGrammar)) {
      validNext.push(swara)
    }
  })

  return [...new Set(validNext)]
}
