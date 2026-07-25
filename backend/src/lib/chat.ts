import { Phase, type Prisma } from "@prisma/client"
import { callAIChat, type AIChatMessage } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"

type ConversationCache = {
  recentMessages: AIChatMessage[]
  summary: string
}

type ActiveSessionResult =
  | { ok: false; error: string; status: 400 | 404 }
  | {
      ok: true
      session: Prisma.ClassSessionGetPayload<{
        include: {
          sessionCriteria: true
          materials: { select: { id: true; fileName: true; fileUrl: true; fileType: true } }
        }
      }>
    }

const CACHE_TTL_SECONDS = 60 * 60 * 24
const RECENT_MESSAGE_LIMIT = 6
const RATE_LIMIT_MAX_REQUESTS = 30
const RATE_LIMIT_WINDOW_SECONDS = 60

const cacheKey = (studentId: string, sessionId: string, phase: Phase) =>
  `conversation:${studentId}:${sessionId}:${phase}`

export const ensureActiveSession = async (sessionId: string): Promise<ActiveSessionResult> => {
  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
    include: {
      sessionCriteria: { orderBy: { order: "asc" } },
      materials: {
        select: { id: true, fileName: true, fileUrl: true, fileType: true }
      }
    }
  })

  if (!session) return { ok: false, error: "Session not found", status: 404 }
  if (session.status !== "ACTIVE") return { ok: false, error: "Session is not active", status: 400 }
  return { ok: true, session }
}

export const checkChatRateLimit = async (studentId: string) => {
  try {
    const key = `rate-limit:chat:${studentId}`
    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS)
    }

    return count <= RATE_LIMIT_MAX_REQUESTS
  } catch (error) {
    console.warn("Chat rate-limit unavailable:", error)
    return true
  }
}

const getConversation = async (studentId: string, sessionId: string, phase: Phase) => {
  const existing = await prisma.conversation.findFirst({
    where: { studentId, sessionId, phase },
    orderBy: { startedAt: "desc" }
  })

  return existing ?? prisma.conversation.create({
    data: { studentId, sessionId, phase }
  })
}

const getCache = async (
  conversationId: string,
  studentId: string,
  sessionId: string,
  phase: Phase
): Promise<ConversationCache> => {
  try {
    const cached = await redis.get(cacheKey(studentId, sessionId, phase))
    if (cached) return JSON.parse(cached) as ConversationCache
  } catch (error) {
    console.warn("Conversation cache unavailable:", error)
  }

  const [messages, summary] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      select: { role: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: RECENT_MESSAGE_LIMIT
    }),
    prisma.conversationSummary.findUnique({ where: { conversationId } })
  ])

  return {
    recentMessages: messages.reverse(),
    summary: summary?.summary ?? ""
  }
}

const saveCache = async (
  studentId: string,
  sessionId: string,
  phase: Phase,
  cache: ConversationCache
) => {
  try {
    await redis.set(
      cacheKey(studentId, sessionId, phase),
      JSON.stringify(cache),
      "EX",
      CACHE_TTL_SECONDS
    )
  } catch (error) {
    console.warn("Conversation cache unavailable:", error)
  }
}

const makeSummary = (messages: AIChatMessage[]) =>
  messages.map((message) => `${message.role}: ${message.content}`).join("\n").slice(-4000)

export const sendChatMessage = async ({
  studentId,
  language,
  sessionId,
  message
}: {
  studentId: string
  language: string
  sessionId: string
  message: string
}) => {
  const sessionResult = await ensureActiveSession(sessionId)
  if (!sessionResult.ok) return sessionResult

  const { session } = sessionResult
  const conversation = await getConversation(studentId, sessionId, session.phase)
  const cache = await getCache(conversation.id, studentId, sessionId, session.phase)

  const studentMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      studentId,
      role: "STUDENT",
      content: message
    }
  })

  const aiResult = await callAIChat({
    phase: session.phase.toLowerCase(),
    language,
    studentMessage: message,
    recentMessages: cache.recentMessages,
    summary: cache.summary,
    sessionCriteria: session.sessionCriteria.map(({ id, description, goal }) => ({ id, description, goal })),
    teacherMaterial: session.materials.map((material) => material.fileName).join(", ")
  })

  const agentMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      studentId,
      role: "AGENT",
      content: aiResult.response
    }
  })

  const recentMessages = [...cache.recentMessages, studentMessage, agentMessage].slice(-RECENT_MESSAGE_LIMIT)
  const messageCount = await prisma.message.count({ where: { conversationId: conversation.id } })
  let summary = cache.summary

  if (messageCount % RECENT_MESSAGE_LIMIT === 0) {
    const allMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      select: { role: true, content: true, createdAt: true },
      orderBy: { createdAt: "asc" }
    })
    summary = makeSummary(allMessages)
    await prisma.conversationSummary.upsert({
      where: { conversationId: conversation.id },
      create: { conversationId: conversation.id, summary, messageCount },
      update: { summary, messageCount }
    })
  }

  await saveCache(studentId, sessionId, session.phase, { recentMessages, summary })

  if (aiResult.usedExternalAPI && aiResult.externalSource) {
    await prisma.trainingData.create({
      data: {
        question: message,
        answer: aiResult.response,
        source: aiResult.externalSource,
        sessionId,
        studentId,
        topic: session.title
      }
    })
  }

  return {
    ok: true as const,
    conversationId: conversation.id,
    phase: session.phase,
    language: aiResult.detectedLanguage,
    response: aiResult.response,
    flaggedCriteria: aiResult.flaggedCriteria,
    studentMessageId: studentMessage.id,
    session
  }
}
