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
