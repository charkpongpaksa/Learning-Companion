import { NextRequest, NextResponse } from "next/server"
import { callAIQuizGeneration } from "@/lib/ai"
import { ensureActiveSession } from "@/lib/chat"
import { prisma } from "@/lib/prisma"

const MAX_QUIZZES_PER_PHASE = 3

// POST /api/v1/quiz/generate — create a quiz for the current session phase
export async function POST(request: NextRequest) {
  try {
    const studentId = request.headers.get("x-user-id")!
    const language = request.headers.get("x-user-language") ?? "en"
    const body = await request.json()
    const { sessionId, phase } = body ?? {}

    if (typeof sessionId !== "string" || !["BEFORE", "DURING", "AFTER"].includes(phase)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
    }

    const sessionResult = await ensureActiveSession(sessionId)
    if (!sessionResult.ok) {
      return NextResponse.json({ error: sessionResult.error }, { status: sessionResult.status })
    }

    if (phase !== sessionResult.session.phase) {
      return NextResponse.json({ error: "Quiz phase does not match the active session phase" }, { status: 400 })
    }

    if (sessionResult.session.sessionCriteria.length === 0) {
      return NextResponse.json({ error: "Session has no criteria for quiz generation" }, { status: 400 })
    }

    const quizCount = await prisma.quiz.count({
      where: { studentId, sessionId, phase }
    })
    if (quizCount >= MAX_QUIZZES_PER_PHASE) {
      return NextResponse.json({ error: "Quiz attempt limit reached" }, { status: 429 })
    }

    const generatedQuestions = await callAIQuizGeneration({
      phase: phase.toLowerCase(),
      language,
      criteria: sessionResult.session.sessionCriteria.map(({ id, description, goal }) => ({ id, description, goal }))
    })

    const quiz = await prisma.quiz.create({
      data: {
        studentId,
        sessionId,
        phase,
        questions: {
          create: generatedQuestions.map((question) => ({
            criteria: { connect: { id: question.criteriaId } },
            questionText: question.questionText,
            questionType: question.questionType,
            ...(question.options !== null && { options: question.options }),
            correctConcept: question.correctConcept,
            order: question.order
          }))
        }
      },
      include: { questions: { orderBy: { order: "asc" } } }
    })

    return NextResponse.json(
      {
        quizId: quiz.id,
        questions: quiz.questions.map(({ id, order, questionText, questionType, options }) => ({
          id,
          order,
          questionText,
          questionType,
          options
        }))
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Generate quiz error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
