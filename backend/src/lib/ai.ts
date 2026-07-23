export type AIChatMessage = {
  role: "STUDENT" | "AGENT"
  content: string
  createdAt?: Date
}

export type AIChatResponse = {
  response: string
  confidence: number
  usedExternalAPI: boolean
  externalSource: string | null
  flaggedCriteria: string[]
  detectedLanguage: "en" | "th"
}

export const callAIChat = async (payload: {
  phase: string
  language: string
  studentMessage: string
  recentMessages: AIChatMessage[]
  summary: string
  sessionCriteria: { id: string; description: string; goal: string }[]
  teacherMaterial: string
}): Promise<AIChatResponse> => {
  // Mock response while AI teammate isn't ready.
  return {
    response: "Mock AI response for testing",
    confidence: 0.9,
    usedExternalAPI: false,
    externalSource: null,
    flaggedCriteria: [],
    detectedLanguage: payload.language === "th" ? "th" : "en"
  }
}

export const callAIImageAnalysis = async (payload: {
  imageUrl: string
  sessionId: string
  availableMaterials: { id: string; fileName: string; fileUrl: string; fileType: string }[]
}) => {
  // Mock response while AI teammate isn't ready.
  return {
    materialId: null as string | null,
    pageNumber: null as number | null,
    confidence: 0,
    description: `Uploaded file received: ${payload.imageUrl}`
  }
}

export const callAIQuizGeneration = async (payload: {
  phase: string
  language: string
  criteria: { id: string; description: string; goal: string }[]
}) => {
  return payload.criteria.map((criterion, index) => ({
    criteriaId: criterion.id,
    questionText: `Explain how you would demonstrate this learning goal: ${criterion.description}`,
    questionType: "DIRECT" as const,
    options: null,
    correctConcept: criterion.goal,
    order: index + 1
  }))
}

export const callAIQuizScoring = async (payload: {
  questionText: string
  correctConcept: string
  studentAnswer: string
  language: string
}) => {
  const answer = payload.studentAnswer.trim()
  const keyTerms = payload.correctConcept
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 3)
  const matchedTerms = keyTerms.filter((term) => answer.toLowerCase().includes(term)).length
  const score = keyTerms.length > 0 && matchedTerms / keyTerms.length >= 0.25 ? 85 : 60

  return {
    score,
    feedback: score >= 80
      ? "Mock scoring: your answer addresses the target concept."
      : "Mock scoring: add more detail about the target concept.",
    evidence: answer
  }
}

export const callAIInsight = async (payload: {
  criteriaResults: unknown[]
  duringClassLogs: unknown[]
  caughtUpCount: number
  totalStudents: number
}) => {
  void payload
  // Mock response while AI teammate isn't ready.
  return { insight: "Mock insight for testing" }
}

export const callAIWeeklySummary = async (payload: {
  subjectName: string
  weekNumber: number
  avgReadiness: number
  semesterProgress: number
}) => {
  return {
    summary: `Mock weekly summary for ${payload.subjectName}, week ${payload.weekNumber}: average readiness is ${payload.avgReadiness.toFixed(1)}%.`
  }
}
