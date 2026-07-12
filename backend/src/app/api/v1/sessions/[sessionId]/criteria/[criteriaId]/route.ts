import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PATCH /api/v1/sessions/[sessionId]/criteria/[criteriaId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionId: string; criteriaId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId, criteriaId } = params
    const body = await request.json()
    const { description, goal, order, semesterCriteriaId } = body

    // Check session exists and teacher owns it
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

    if (session.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Check criteria exists
    const existing = await prisma.sessionCriteria.findUnique({
      where: { id: criteriaId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Criteria not found" },
        { status: 404 }
      )
    }

    const criteria = await prisma.sessionCriteria.update({
      where: { id: criteriaId },
      data: {
        description: description || existing.description,
        goal: goal || existing.goal,
        order: order !== undefined ? order : existing.order,
        semesterCriteriaId: semesterCriteriaId !== undefined
          ? semesterCriteriaId
          : existing.semesterCriteriaId
      }
    })

    return NextResponse.json(
      { success: true, criteria },
      { status: 200 }
    )

  } catch (error) {
    console.error("Update session criteria error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/sessions/[sessionId]/criteria/[criteriaId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionId: string; criteriaId: string } }
) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const { sessionId, criteriaId } = params

    // Check session exists and teacher owns it
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

    if (session.subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Check criteria exists
    const existing = await prisma.sessionCriteria.findUnique({
      where: { id: criteriaId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Criteria not found" },
        { status: 404 }
      )
    }

    await prisma.sessionCriteria.delete({
      where: { id: criteriaId }
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )

  } catch (error) {
    console.error("Delete session criteria error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}