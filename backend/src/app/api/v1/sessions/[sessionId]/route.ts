import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/v1/sessions/[sessionId] — get single session with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    const { sessionId } = params

    const session = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            teacherId: true
          }
        },
        sessionCriteria: {
          orderBy: { order: "asc" }
        },
        materials: {
          orderBy: { uploadedAt: "desc" }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Teacher can only see their own sessions
    if (userRole === "TEACHER" && session.subject.teacherId !== userId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Student can only see active sessions
    if (userRole === "STUDENT" && session.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 403 }
      )
    }

    return NextResponse.json({ session }, { status: 200 })

  } catch (error) {
    console.error("Get session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/v1/sessions/[sessionId] — update session details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId } = params
    const body = await request.json()
    const { title, description, date } = body

    // Check session exists
    const existing = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: {
          select: { teacherId: true }
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Check teacher owns this session
    if (existing.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const session = await prisma.classSession.update({
      where: { id: sessionId },
      data: {
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        date: date ? new Date(date) : existing.date
      }
    })

    return NextResponse.json(
      { success: true, session },
      { status: 200 }
    )

  } catch (error) {
    console.error("Update session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/sessions/[sessionId] — delete session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId } = params

    // Check session exists
    const existing = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        subject: {
          select: { teacherId: true }
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Check teacher owns this session
    if (existing.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    await prisma.classSession.delete({
      where: { id: sessionId }
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )

  } catch (error) {
    console.error("Delete session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}