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

const AUTH_STORAGE_KEY = "learning-companion-auth";

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
