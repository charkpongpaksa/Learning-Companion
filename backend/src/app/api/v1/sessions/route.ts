import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/v1/sessions — students get active sessions, teachers get all their sessions
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    const subjectId = request.nextUrl.searchParams.get("subjectId")

    let sessions

    if (userRole === "TEACHER") {
      // Teacher gets all their sessions
      sessions = await prisma.classSession.findMany({
        where: {
          subject: { teacherId: userId! },
          ...(subjectId && { subjectId })
        },
        include: {
          subject: {
            select: { name: true }
          },
          _count: {
            select: {
              sessionCriteria: true,
              materials: true
            }
          }
        },
        orderBy: { date: "desc" }
      })
    } else {
      // Student gets active sessions only
      sessions = await prisma.classSession.findMany({
        where: {
          status: "ACTIVE",
          ...(subjectId && { subjectId })
        },
        include: {
          subject: {
            select: { name: true }
          },
          _count: {
            select: {
              sessionCriteria: true,
              materials: true
            }
          }
        },
        orderBy: { date: "desc" }
      })
    }

    return NextResponse.json({ sessions }, { status: 200 })

  } catch (error) {
    console.error("Get sessions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/v1/sessions — create a new class session
export async function POST(request: NextRequest) {
  try {
    const teacherId = request.headers.get("x-user-id")
    const body = await request.json()

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { subjectId, title, description, date } = body
    const sessionDate = new Date(date)

    // Validate required fields
    if (
      typeof subjectId !== "string" ||
      typeof title !== "string" ||
      !title.trim() ||
      typeof date !== "string" ||
      Number.isNaN(sessionDate.getTime()) ||
      (description !== undefined && description !== null && typeof description !== "string")
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check subject exists and teacher owns it
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      )
    }

    if (subject.teacherId !== teacherId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const session = await prisma.classSession.create({
      data: {
        subjectId,
        title: title.trim(),
        description: description?.trim() || null,
        date: sessionDate,
        status: "UPCOMING",
        phase: "BEFORE"
      }
    })

    return NextResponse.json(
      { success: true, session },
      { status: 201 }
    )

  } catch (error) {
    console.error("Create session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
