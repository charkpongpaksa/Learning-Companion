# /handoff — Pre-Study Agent Project

---

## Project Overview
An AI-powered pre-study agent for university students that supports them before, during, and after class. The agent assesses students against teacher-defined criteria, helps them prepare for lectures, catches them up when they get lost, and gives teachers detailed insight into class understanding tracked all the way to semester goals.

---

## Team Structure
```
Chakphong   →  Backend + partially Frontend
Teammate 1  →  Frontend
Teammate 2  →  AI / Model
```

---

## Repository Structure
```
root/
├── frontend/     →  Next.js UI (frontend teammate)
├── backend/      →  Next.js API (Chakphong)
└── model/        →  AI service (AI teammate)
```

## Branch Strategy
```
main          →  stable, demo-ready
dev           →  integration branch
frontend/dev  →  frontend teammate
backend/dev   →  Chakphong
model/dev     →  AI teammate
```

**Merge flow:**
```
feature branch → teammate dev branch → dev → main
```

---

## Current State

**Completed:**
- Full project brainstorm and architecture design
- 5 layer architecture defined
- Database schema designed (17 tables)
- API documentation completed (11 categories, full request/response shapes)
- Project folder structure created
- Next.js initialized in `/backend` with `src/` directory
- Docker setup complete (PostgreSQL, Redis, Qdrant)
- Prisma initialized
- lib files created (prisma.ts, redis.ts, ai.ts with mock responses)
- Environment variables configured
- Git branching strategy defined

**Not started yet:**
- Prisma schema writing
- API route implementation
- Auth setup
- Docker services not yet running
- Frontend UI
- AI model integration

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | Zustand |
| Authentication | NextAuth.js |
| Backend | Next.js API Routes |
| ORM | Prisma |
| Database | PostgreSQL (Docker) |
| Cache + Rate Limit | Redis (Docker) |
| Vector DB | Qdrant (Docker) |
| File Storage | Local file system (`/uploads`) |
| AI Model | Local model + Gemini/DeepSeek fallback |
| Charts | Recharts (frontend) |
| Background Jobs | Manual trigger for demo, Cron after |

---

## Backend Folder Structure
```
backend/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── v1/
│   │           ├── auth/
│   │           ├── sessions/
│   │           ├── chat/
│   │           ├── quiz/
│   │           ├── reports/
│   │           ├── users/
│   │           └── training/
│   └── lib/
│       ├── prisma.ts     →  Prisma client singleton
│       ├── redis.ts      →  Redis client singleton
│       └── ai.ts         →  AI teammate endpoint calls (mock active)
├── prisma/
│   └── schema.prisma
├── uploads/
│   └── .gitkeep
├── docker-compose.yml
├── .env
├── .env.example
└── package.json
```

---

## Environment Variables
```bash
DATABASE_URL="postgresql://admin:password@localhost:5432/prestudy"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
AI_SERVICE_URL="http://localhost:8000"
QDRANT_URL="http://localhost:6333"
UPLOAD_PATH="./uploads"
```

---

## Docker Services
```yaml
postgres  →  port 5432  →  main database
redis     →  port 6379  →  conversation cache + rate limiting
qdrant    →  port 6333  →  vector embeddings for RAG
```

Start all services:
```bash
cd backend
docker-compose up -d
```

---

## Database — 17 Tables (PostgreSQL via Prisma)

```
1.  Users                →  Student + teacher accounts
2.  Subjects             →  Courses per teacher
3.  SemesterCriteria     →  End of semester learning goals
4.  ClassSessions        →  Each class with status + phase
5.  SessionCriteria      →  Per class criteria mapped to semester goals
6.  Materials            →  Uploaded files (local path + isProcessed flag)
7.  Conversations        →  One per student per phase per session
8.  Messages             →  All chat messages
9.  ConversationSummary  →  Running summary updated every 6 messages
10. Quizzes              →  Quiz per student per session
11. QuizQuestions        →  Each question tagged to a session criteria
12. CriteriaResults      →  Final verdict per criteria after scoring
13. DuringClassLogs      →  Questions asked during class mapped to criteria
14. SessionReports       →  Class wide aggregated report per session
15. StudentReports       →  Per student breakdown per session
16. TrainingData         →  External API answers for local model fine-tuning
17. WeeklySummaries      →  Weekly AI generated summary per subject
```

**Qdrant collection (separate from PostgreSQL):**
```
material_chunks
├── vector (embedding from AI teammate)
└── payload
    ├── materialId   ←  links back to Materials table
    ├── sessionId
    ├── content
    └── chunkIndex
```

---

## Key Enums
```typescript
Role:           STUDENT | TEACHER
SessionStatus:  UPCOMING | ACTIVE | COMPLETED
Phase:          BEFORE | DURING | AFTER
MessageRole:    STUDENT | AGENT
QuestionType:   DIRECT | SCENARIO | REASONING | EDGE_CASE | REAL_WORLD
Readiness:      READY | PARTIAL | NOT_READY
CriteriaStatus: MET | PARTIAL | NOT_MET
```

## Valid Session Phase Transitions
```
UPCOMING + BEFORE  →  ACTIVE + BEFORE
ACTIVE + BEFORE    →  ACTIVE + DURING
ACTIVE + DURING    →  ACTIVE + AFTER
ACTIVE + AFTER     →  COMPLETED + AFTER
```

---

## AI Integration Contract

**Backend → AI teammate (chat):**
```typescript
POST http://localhost:8000/chat
{
  phase: "before" | "during" | "after",
  language: "th" | "en",
  studentMessage: string,
  recentMessages: Message[],      // last 5-6 messages
  summary: string,                // running conversation summary
  sessionCriteria: Criteria[],    // from DB — used as rubric
  teacherMaterial: string         // retrieved chunk from Qdrant
}
```

**AI teammate → Backend (chat response):**
```typescript
{
  response: string,
  confidence: number,             // 0-1, below 0.7 = used external API
  usedExternalAPI: boolean,
  externalSource: "gemini" | "deepseek" | null,
  flaggedCriteria: string[],      // criteria IDs agent flagged as confused
  detectedLanguage: "th" | "en"
}
```

**Backend → AI teammate (report insight):**
```typescript
POST http://localhost:8000/insight
{
  criteriaResults: CriteriaResult[],
  duringClassLogs: DuringClassLog[],
  caughtUpCount: number,
  totalStudents: number
}
```

**AI teammate → Backend (insight response):**
```typescript
{
  insight: string    // natural language paragraph for teacher
}
```

**Mock responses are active in `src/lib/ai.ts`** — uncomment real calls on integration day.

---

## API Base URL
```
http://localhost:3000/api/v1
```

## API Categories
```
1.  Auth              →  /api/v1/auth/*
2.  Users             →  /api/v1/users/*
3.  Subjects          →  /api/v1/subjects/*
4.  Semester Criteria →  /api/v1/subjects/[id]/semester-criteria/*
5.  Sessions          →  /api/v1/sessions/*
6.  Session Criteria  →  /api/v1/sessions/[id]/criteria/*
7.  Materials         →  /api/v1/sessions/[id]/materials/*
8.  Chat              →  /api/v1/chat/*
9.  Quiz              →  /api/v1/quiz/*
10. Reports           →  /api/v1/reports/*
11. Training          →  /api/v1/training/*
```

Full request/response shapes for every endpoint are documented in the API Reference Document shared with the team.

---

## Role Permissions Summary
```
Students  →  chat, quiz, view own reports, view active sessions
Teachers  →  manage subjects, sessions, criteria, materials, view all reports
Internal  →  training/store (backend only, never called by frontend)
```

---

## 3 Phase System
```
BEFORE  →  Adaptive quiz (10-20 questions), criteria verdict, Ready/Not Ready
DURING  →  Fast 2-3 sentence answers, logs questions to criteria, silent TA mode
AFTER   →  Deep catch up, re-test weak criteria, feeds teacher report
```

## Criteria System
```
Semester Criteria  →  Big semester goals, defined once per subject
      ↓
Session Criteria   →  Today's specific criteria, maps to semester goals
      ↓
Quiz Questions     →  Tagged to criteria internally (student never sees mapping)
      ↓
Criteria Results   →  MET / PARTIAL / NOT_MET per criteria
      ↓
Reports            →  Session → Week → Semester level insights
```

## Question Types Per Quiz
```
Direct (Q1-4)      →  Baseline knowledge
Scenario (Q5-9)    →  Application
Reasoning (Q10-13) →  Deeper understanding
Edge case (Q14-17) →  Mastery
Real world (Q18-20)→  Synthesis
```

## Redis Conversation Cache
```
Key:    "conversation:{studentId}:{sessionId}"
Value:  {
          recentMessages: [...],   // last 5-6 messages
          summary: "...",          // running summary
          phase: "before",
          language: "th"
        }
Expiry: 24 hours
Summary trigger: every 6 messages
```

---

## AI Model Architecture
```
Student message
↓
Local model answers first
Confidence ≥ 0.7  →  Return local response
Confidence < 0.7  →  Fallback to Gemini / DeepSeek
                  →  Store answer in TrainingData table
                  →  Return external response
```

---

## Data Lifecycle Plan
```
Current semester   →  PostgreSQL active
Last 2 years       →  PostgreSQL archive schema (read only)
2-4 years          →  Local export / cold storage
4-10 years         →  Glacier equivalent
After 10 years     →  Deleted
```

---

## 1 Week Backend Sprint Plan
```
Day 1  →  Project setup, Docker, Prisma schema, migrations (IN PROGRESS)
Day 2  →  Auth (NextAuth, student + teacher login, role protection)
Day 3  →  Session + criteria management API
Day 4  →  Chat route + Redis conversation cache + summary logic
Day 5  →  Quiz engine (generate, score, store, verdict)
Day 6  →  Reports + aggregation + trigger route
Day 7  →  Integration with AI + frontend teammates, testing
```

---

## Next Immediate Step
Write the Prisma schema (`/backend/prisma/schema.prisma`) with all 17 tables and enums, then run migrations against the Docker PostgreSQL instance.

```bash
# After writing schema
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

## Important Notes For Next Agent

- **Mock AI responses are active** in `src/lib/ai.ts` — do not remove, just uncomment real calls on Day 7
- **MaterialChunks table does NOT exist in PostgreSQL** — chunks live in Qdrant, linked back via `materialId` in payload
- **`isProcessed` flag on Materials table** — tells backend whether file has been chunked and sent to Qdrant by AI teammate
- **Session criteria IDs and correctConcept are never sent to frontend** — backend only, used for scoring
- **File storage is local** (`/uploads`) not AWS S3 — `fileUrl` stores local path, swap to S3 URL later with no schema change needed
- **Rate limiting is on `/api/v1/chat` route** — targets abuse not genuine questions
- **Report generation is manual trigger for demo** — Vercel Cron Job added after demo
- **Thai and English both supported** — AI auto detects language from student message and responds in same language
- **Technical terms stay in English even in Thai responses** — EC2, IAM, S3 etc.
- **One conversation per student per phase per session** — BEFORE, DURING, AFTER are separate conversations in DB

---

## Questions To Clarify With Team Before Day 7
- Confirm AI teammate's local service port (currently assumed `8000`)
- Confirm confidence threshold value (currently assumed `0.7`)
- Confirm Qdrant collection name (currently assumed `material_chunks`)
- Confirm file size limit for material uploads
- Agree on quiz question count range per phase (currently `10-20`)