const AI_SERVICE_URL = process.env.AI_SERVICE_URL!

export const callAIChat = async (payload: {
  phase: string
  language: string
  studentMessage: string
  recentMessages: any[]
  summary: string
  sessionCriteria: any[]
  teacherMaterial: string
}) => {
  // Mock response while AI teammate isn't ready
  return {
    response: "Mock AI response for testing",
    confidence: 0.9,
    usedExternalAPI: false,
    externalSource: null,
    flaggedCriteria: [],
    detectedLanguage: payload.language
  }

  // Uncomment when AI teammate is ready:
  // const res = await fetch(`${AI_SERVICE_URL}/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // return res.json()
}

export const callAIInsight = async (payload: {
  criteriaResults: any[]
  duringClassLogs: any[]
  caughtUpCount: number
  totalStudents: number
}) => {
  // Mock response while AI teammate isn't ready
  return {
    insight: "Mock insight for testing"
  }

  // Uncomment when AI teammate is ready:
  // const res = await fetch(`${AI_SERVICE_URL}/insight`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload)
  // })
  // return res.json()
}