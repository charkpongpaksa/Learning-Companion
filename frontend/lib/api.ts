export type Role = "teacher" | "student";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface AppSubject {
  id: number;
  code: string;
  name: string;
  displayShort: string;
  subtitle?: string;
  weeks: string;
  stats?: {
    avgReadiness?: string;
    semesterProgress?: string;
    progressCriteria?: string;
    sessionsRun?: number;
    studentsCaughtUp?: string;
  };
}

export interface ApiSemesterCriteria {
  id: string;
  description: string;
  goal: string;
  order: number;
}

export interface ApiMaterial {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  isProcessed: boolean;
  uploadedAt: string;
}

export interface ApiSessionResponse {
  id: string;
  title: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  phase: "BEFORE" | "DURING" | "AFTER";
  date: string;
  description: string;
  readinessPercent?: number;
  criteria?: ApiSemesterCriteria[];
  materials?: ApiMaterial[];
}

export interface ApiSubjectResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  teacherId: string;
  semesterCriteria: ApiSemesterCriteria[];
  sessions: ApiSessionResponse[];
}

export interface TeacherDashboardViewModel {
  subjects: AppSubject[];
  sessionsBySubject: Record<
    string,
    Array<{
      id: number;
      week: string;
      title: string;
      status: "Completed" | "Active" | "Upcoming";
      segments: string[];
      avgReadiness: string;
      isLive?: boolean;
    }>
  >;
}

export interface StudentDashboardViewModel {
  subjects: Array<{
    id: number;
    code: string;
    name: string;
    displayShort: string;
    weeks: string;
  }>;
  sessionsBySubject: Record<
    string,
    Array<{
      id: number;
      week: string;
      title: string;
      description: string;
      status: "Completed" | "Active" | "Upcoming";
      date: string;
      info: string;
    }>
  >;
}

export interface StudentMaterialsViewModel {
  subjectCode: string;
  groups: Array<{
    weekTitle: string;
    items: Array<{
      id: string;
      title: string;
      type: string;
      size: string;
      updatedAt: string;
      downloadUrl: string;
    }>;
  }>;
}

export interface StudentProgressViewModel {
  subjectCode: string;
  stats: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
  progress: Array<{
    id: string;
    weekTitle: string;
    status: string;
    percentage: number;
    color: string;
  }>;
}

const AUTH_STORAGE_KEY = "learning-companion-auth";

const MOCK_API_SUBJECTS: ApiSubjectResponse[] = [
  {
    id: "subj123",
    code: "CS332",
    name: "Basic Cloud Computing",
    description: "AWS fundamentals course",
    teacherId: "clx123",
    semesterCriteria: [
      {
        id: "sc123",
        description: "Explain IAM Role vs Policy",
        goal: "Student can clearly differentiate IAM Role and Policy",
        order: 1,
      },
      {
        id: "sc124",
        description: "Apply IAM in a real scenario",
        goal: "Student can apply secure AWS practices",
        order: 2,
      },
    ],
    sessions: [
      {
        id: "sess101",
        title: "Cloud fundamentals",
        status: "COMPLETED",
        phase: "AFTER",
        date: "2024-03-01T09:00:00.000Z",
        description: "Core concepts of cloud computing",
        readinessPercent: 94,
        criteria: [
          {
            id: "sc123",
            description: "Explain IAM Role vs Policy",
            goal: "Student can clearly differentiate IAM Role and Policy",
            order: 1,
          },
        ],
        materials: [
          {
            id: "mat101",
            fileName: "lecture_slides.pdf",
            fileUrl: "#",
            fileType: "application/pdf",
            isProcessed: true,
            uploadedAt: "2024-03-01T00:00:00.000Z",
          },
        ],
      },
      {
        id: "sess102",
        title: "S3 and storage tiers",
        status: "COMPLETED",
        phase: "AFTER",
        date: "2024-03-08T09:00:00.000Z",
        description: "Object storage fundamentals and lifecycle policies",
        readinessPercent: 82,
      },
      {
        id: "sess103",
        title: "EC2 and IAM",
        status: "ACTIVE",
        phase: "BEFORE",
        date: "2024-03-15T09:00:00.000Z",
        description:
          "Understanding EC2 instances and IAM roles for secure access",
        readinessPercent: 88,
        materials: [
          {
            id: "mat102",
            fileName: "iam_notes.pdf",
            fileUrl: "#",
            fileType: "application/pdf",
            isProcessed: true,
            uploadedAt: "2024-03-14T00:00:00.000Z",
          },
        ],
      },
      {
        id: "sess104",
        title: "VPC networking",
        status: "UPCOMING",
        phase: "BEFORE",
        date: "2024-03-22T09:00:00.000Z",
        description: "Subnets, route tables, and security groups",
      },
    ],
  },
];

function mapApiSessionStatus(
  status: ApiSessionResponse["status"],
): "Completed" | "Active" | "Upcoming" {
  if (status === "COMPLETED") return "Completed";
  if (status === "ACTIVE") return "Active";
  return "Upcoming";
}

export function getTeacherDashboardViewModel(): TeacherDashboardViewModel {
  const subjects = MOCK_API_SUBJECTS.map((subject) => ({
    id: Number(subject.id.slice(-3)),
    code: subject.code,
    name: subject.name,
    displayShort: `${subject.code} · ${subject.name}`,
    subtitle: subject.description,
    weeks: `${subject.sessions.length} weeks`,
    stats: {
      avgReadiness: `${subject.sessions.find((s) => s.readinessPercent)?.readinessPercent ?? 0}%`,
      semesterProgress: "72%",
      progressCriteria: "Based on active sessions",
      sessionsRun: subject.sessions.length,
      studentsCaughtUp: "90%",
    },
  }));

  const sessionsBySubject: TeacherDashboardViewModel["sessionsBySubject"] = {};
  for (const subject of MOCK_API_SUBJECTS) {
    sessionsBySubject[subject.code] = subject.sessions.map(
      (session, index) => ({
        id: index + 1,
        week: `Week ${index + 1}`,
        title: session.title,
        status: mapApiSessionStatus(session.status),
        segments: [
          "bg-emerald-400",
          "bg-emerald-300",
          "bg-emerald-200",
          "bg-stone-100",
        ],
        avgReadiness: `${session.readinessPercent ?? 0}%`,
        isLive: session.status === "ACTIVE",
      }),
    );
  }

  return { subjects, sessionsBySubject };
}

export function getStudentDashboardViewModel(): StudentDashboardViewModel {
  const subjects = MOCK_API_SUBJECTS.map((subject) => ({
    id: Number(subject.id.slice(-3)),
    code: subject.code,
    name: subject.name,
    displayShort: `${subject.code} · ${subject.name}`,
    weeks: `${subject.sessions.length} weeks`,
  }));

  const sessionsBySubject: StudentDashboardViewModel["sessionsBySubject"] = {};
  for (const subject of MOCK_API_SUBJECTS) {
    sessionsBySubject[subject.code] = subject.sessions.map(
      (session, index) => ({
        id: index + 1,
        week: `Week ${index + 1}`,
        title: session.title,
        description: session.description,
        status: mapApiSessionStatus(session.status),
        date: new Date(session.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        info:
          session.phase === "BEFORE"
            ? "Before class"
            : session.phase === "DURING"
              ? "Live now"
              : "Ready",
      }),
    );
  }

  return { subjects, sessionsBySubject };
}

export function getStudentMaterialsViewModel(
  subjectCode = "CS332",
): StudentMaterialsViewModel {
  const subject = MOCK_API_SUBJECTS.find((item) => item.code === subjectCode);
  const groups = (subject?.sessions ?? [])
    .filter((session) => session.materials && session.materials.length > 0)
    .map((session, index) => ({
      weekTitle: `Week ${index + 1} — ${session.title}`,
      items: (session.materials ?? []).map((material) => ({
        id: material.id,
        title: material.fileName,
        type: material.fileType.split("/").pop()?.toUpperCase() ?? "FILE",
        size: material.fileType.includes("pdf") ? "2.4 MB" : "1.2 MB",
        updatedAt: `updated ${new Date(material.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        downloadUrl: material.fileUrl,
      })),
    }))
    .filter((group) => group.items.length > 0);

  return { subjectCode, groups };
}

export function getStudentProgressViewModel(
  subjectCode = "CS332",
): StudentProgressViewModel {
  const subject = MOCK_API_SUBJECTS.find((item) => item.code === subjectCode);
  const stats = [
    {
      label: "Avg readiness",
      value: `${subject?.sessions.find((s) => s.readinessPercent)?.readinessPercent ?? 0}%`,
      subtext: "across active sessions",
    },
    {
      label: "Criteria met",
      value: `${subject?.semesterCriteria.length ?? 0} / ${subject?.semesterCriteria.length ?? 0}`,
      subtext: "for this subject",
    },
    {
      label: "Sessions done",
      value: `${subject?.sessions.filter((s) => s.status === "COMPLETED").length ?? 0} / ${subject?.sessions.length ?? 0}`,
      subtext: "this semester",
    },
    {
      label: "Questions asked",
      value: `${subject?.sessions.filter((s) => s.status === "ACTIVE").length ?? 0}`,
      subtext: "during active sessions",
    },
  ];

  const progress = (subject?.sessions ?? []).map((session, index) => ({
    id: session.id,
    weekTitle: `Week ${index + 1} — ${session.title}`,
    status:
      session.status === "COMPLETED"
        ? "Completed"
        : session.status === "ACTIVE"
          ? "Active"
          : "Not started",
    percentage: session.readinessPercent ?? 0,
    color:
      session.status === "COMPLETED"
        ? "bg-emerald-500"
        : session.status === "ACTIVE"
          ? "bg-[#e65100]"
          : "bg-stone-200",
  }));

  return { subjectCode, stats, progress };
}

const MOCK_ACCOUNTS: Array<{ email: string; password: string; role: Role }> = [
  {
    email: "teacher@learning.com",
    password: "teacher1234",
    role: "teacher",
  },
  {
    email: "student@learning.com",
    password: "student1234",
    role: "student",
  },
];

function buildMockUser(email: string, role: Role): ApiUser {
  const displayName = role === "teacher" ? "Achara Chaiya" : "Somchai Jaidee";
  return {
    id: `${role}-${email}`,
    name: displayName,
    email,
    role,
    token: `${role}-token-${Date.now()}`,
  };
}

export async function loginWithBackend(
  email: string,
  password: string,
): Promise<ApiUser> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const matched = MOCK_ACCOUNTS.find(
    (account) => account.email === email && account.password === password,
  );

  if (!matched) {
    throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
  }

  return buildMockUser(email, matched.role);
}

export function getStoredAuthUser(): ApiUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export function persistAuthUser(user: ApiUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export async function getSubjects(role: Role): Promise<AppSubject[]> {
  if (role === "teacher") {
    const { TEACHER_SUBJECTS } = await import("@/app/teacher/dashboard/data");
    return TEACHER_SUBJECTS as AppSubject[];
  }

  const { SUBJECTS } = await import("@/app/student/dashboard/data");
  return SUBJECTS as AppSubject[];
}

export async function createSubject(
  role: Role,
  payload: { code: string; name: string },
): Promise<AppSubject> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    id: Date.now(),
    code: payload.code,
    name: payload.name,
    displayShort: `${payload.code} · ${payload.name}`,
    subtitle: role === "teacher" ? "Added via API-ready flow" : undefined,
    weeks: "4 weeks",
  };
}

export async function createSession(payload: {
  title: string;
  week: string;
  date: string;
}): Promise<{ id: number; title: string; week: string; date: string }> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    id: Date.now(),
    title: payload.title,
    week: payload.week,
    date: payload.date,
  };
}
