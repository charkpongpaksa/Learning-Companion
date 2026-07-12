import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/v1/sessions/[sessionId]/criteria
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId } = params

    // Check session exists
    const session = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: {
          select: { teacherId: true }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Check teacher owns this session
    if (session.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const criteria = await prisma.sessionCriteria.findMany({
      where: { sessionId },
      include: {
        semesterCriteria: {
          select: {
            id: true,
            description: true,
            goal: true
          }
        }
      },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({ criteria }, { status: 200 })

  } catch (error) {
    console.error("Get session criteria error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/v1/sessions/[sessionId]/criteria
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId } = params
    const body = await request.json()
    const { description, goal, order, semesterCriteriaId } = body

    // Validate required fields
    if (!description || !goal || order === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check session exists
    const session = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: {
          select: { teacherId: true }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Check teacher owns this session
    if (session.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const criteria = await prisma.sessionCriteria.create({
      data: {
        sessionId,
        description,
        goal,
        order,
        semesterCriteriaId: semesterCriteriaId || null
      }
    })

    return NextResponse.json(
      { success: true, criteria },
      { status: 201 }
    )

  } catch (error) {
    console.error("Create session criteria error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}