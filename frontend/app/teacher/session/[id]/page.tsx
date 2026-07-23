"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Download,
  Lightbulb,
} from "lucide-react";

// ดึงข้อมูลจาก data.ts
import { TEACHER_SUBJECTS, TEACHER_SESSIONS } from "../../dashboard/data";
import TeacherSidebar from "@/components/teachersidebar";

// ข้อมูลตัวอย่าง Question Feed สำหรับหน้า Live Session
const QUESTION_FEED = [
  {
    id: 1,
    studentName: "Somchai Jaidee",
    initials: "SJ",
    timeAgo: "2 min ago",
    question:
      "What's the difference between a security group and a network ACL?",
    tag: "Security groups",
  },
  {
    id: 2,
    studentName: "Pim Nakorn",
    initials: "PN",
    timeAgo: "4 min ago",
    question: "Can one IAM role be attached to more than one EC2 instance?",
    tag: "IAM roles",
  },
  {
    id: 3,
    studentName: "Kritsada Thongdee",
    initials: "KT",
    timeAgo: "5 min ago",
    question:
      "My instance profile failed to assume the role — what did I miss?",
    tag: "IAM roles",
  },
  {
    id: 4,
    studentName: "Nina Suksawat",
    initials: "NS",
    timeAgo: "7 min ago",
    question: "Is a security group stateful or stateless by default?",
    tag: "Security groups",
  },
];

// ข้อมูลตัวอย่างสำหรับหน้า Completed Session Report (Week 1 / Completed)
const COMPLETED_REPORT_DATA = {
  avgReadiness: "67.5%",
  studentsCount: 30,
  caughtUpCount: 24,
  caughtUpPercent: "80%",
  weakestCriterion: "70%",
  weakestDesc: "fail rate on scenario",
  suggestedFocus:
    "67% of students struggled with applying IAM in a real scenario. Consider a practical demo at the start of next session.",
  readinessStats: {
    onTrack: 14,
    needsReview: 10,
    atRisk: 6,
    onTrackPercent: "47%",
  },
  studentsList: [
    {
      id: 1,
      name: "Somchai Jaidee",
      initials: "SJ",
      readiness: "76%",
      status: "Partial",
      statusColor: "bg-amber-100/70 text-amber-800",
      questions: 2,
    },
    {
      id: 2,
      name: "Pim Nakorn",
      initials: "PN",
      readiness: "92%",
      status: "Met",
      statusColor: "bg-emerald-100/70 text-emerald-800",
      questions: 0,
    },
    {
      id: 3,
      name: "Kritsada Thongdee",
      initials: "KT",
      readiness: "41%",
      status: "Gap",
      statusColor: "bg-rose-100/70 text-rose-800",
      questions: 4,
    },
  ],
};

export default function Page() {
  const params = useParams();

  // แปลง id จาก URL ให้เป็น Number
  const sessionId = Number(params?.id) || 1;

  // ค้นหาว่า sessionId นี้ตรงกับ Subject และ Session ไหนใน data.ts
  let currentSubject = TEACHER_SUBJECTS[0];
  let currentSession: any = null;

  for (const subject of TEACHER_SUBJECTS) {
    const sessions =
      TEACHER_SESSIONS[subject.code as keyof typeof TEACHER_SESSIONS] || [];
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      currentSubject = subject;
      currentSession = found;
      break;
    }
  }

  // ค่าสำรองถ้าหา session ไม่เจอ (Default เป็น Session 1)
  if (!currentSession) {
    currentSession = TEACHER_SESSIONS.CS332[0];
  }

  // Check ว่าเป็น Completed หรือไม่
  const isCompleted =
    currentSession.status === "Completed" || !currentSession.isLive;

  // State สำหรับ Dropdown วิชาด้านข้าง
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(currentSubject);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      <TeacherSidebar />

      {/* ================= 2. MAIN CONTENT AREA ================= */}
      <main
        className="flex-1 pl-64 px-8 pt-12 pb-8 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-3">
          {/* Breadcrumb Back Link */}
          <div>
            <Link
              href="/teacher/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
              {currentSubject.displayShort}
            </Link>
          </div>

          {/* Header Title & Action */}
          <div className="flex flex-col -mt-2 md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                {currentSession.week} — {currentSession.title}
              </h2>
              {isCompleted ? (
                <p className="text-xs text-stone-400 font-medium mt-1">
                  Report generated after session close · 30 students
                </p>
              ) : (
                <p className="text-xs text-orange-600 font-medium mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                  Live · visible only to you, not to students
                </p>
              )}
            </div>

            {/* Export Report Button (เฉพาะ Completed) */}
            {isCompleted && (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-white border border-stone-400 rounded-full text-xs font-semibold text-stone-1000 shadow-2xs hover:bg-stone-50 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Download size={16} />
                Export report
              </button>
            )}
          </div>

          {/* =================== VIEW 1: COMPLETED SESSION REPORT =================== */}
          {isCompleted ? (
            <div className="space-y-4">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 p-4 rounded-xl shadow-2xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Avg readiness
                  </p>
                  <p className="text-xl font-extrabold text-stone-900">
                    {COMPLETED_REPORT_DATA.avgReadiness}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 p-4 rounded-xl shadow-2xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Students
                  </p>
                  <p className="text-xl font-extrabold text-stone-900">
                    {COMPLETED_REPORT_DATA.studentsCount}
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 p-4 rounded-xl shadow-2xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Caught up
                  </p>
                  <p className="text-xl font-extrabold text-stone-900">
                    {COMPLETED_REPORT_DATA.caughtUpCount}
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {COMPLETED_REPORT_DATA.caughtUpPercent} of class
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 p-4 rounded-xl shadow-2xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Weakest criterion
                  </p>
                  <p className="text-xl font-extrabold text-stone-900">
                    {COMPLETED_REPORT_DATA.weakestCriterion}
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {COMPLETED_REPORT_DATA.weakestDesc}
                  </p>
                </div>
              </div>

              {/* Suggested Focus Card */}
              <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 rounded-xl p-4 shadow-2xs flex items-start gap-3">
                <div className="p-1.5 bg-orange-100/60 rounded-lg text-orange-600 shrink-0 mt-0.5">
                  <Lightbulb size={18} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-stone-800">
                    Suggested focus
                  </h4>
                  <p className="text-xs text-stone-600 font-medium mt-0.5 leading-relaxed">
                    {COMPLETED_REPORT_DATA.suggestedFocus}
                  </p>
                </div>
              </div>

              {/* Class Readiness Chart Card */}
              <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 rounded-xl p-6 shadow-2xs">
                <h3 className="text-xs font-bold text-stone-800 mb-4">
                  Class readiness
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* SVG Donut Chart */}
                  <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-emerald-400"
                        strokeDasharray="47, 100"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-amber-400"
                        strokeDasharray="33, 100"
                        strokeDashoffset="-47"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-rose-500"
                        strokeDasharray="20, 100"
                        strokeDashoffset="-80"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-sm font-extrabold text-stone-900 leading-none">
                        {COMPLETED_REPORT_DATA.readinessStats.onTrackPercent}
                      </span>
                      <span className="text-[10px] font-medium text-stone-400 mt-0.5">
                        on track
                      </span>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="space-y-2 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-stone-600">On track</span>
                      <span className="font-bold text-stone-900">
                        {COMPLETED_REPORT_DATA.readinessStats.onTrack}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="text-stone-600">Needs review</span>
                      <span className="font-bold text-stone-900">
                        {COMPLETED_REPORT_DATA.readinessStats.needsReview}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="text-stone-600">At risk</span>
                      <span className="font-bold text-stone-900">
                        {COMPLETED_REPORT_DATA.readinessStats.atRisk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Issues Section */}
              <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 rounded-xl p-5 shadow-2xs">
                <h3 className="text-xs font-bold text-stone-800">
                  Common issues this session
                </h3>
              </div>

              {/* Students Table */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-stone-800 mb-3">
                  Students
                </h3>
                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/60 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-medium text-[11px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Readiness</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right sm:text-left">
                          During-class questions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {COMPLETED_REPORT_DATA.studentsList.map((student) => (
                        <tr
                          key={student.id}
                          className="hover:bg-stone-50/50 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
                                {student.initials}
                              </div>
                              <span className="font-bold text-stone-800">
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-700">
                            {student.readiness}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${student.statusColor}`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-700 text-right sm:text-left">
                            {student.questions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* =================== VIEW 2: LIVE SESSION (QUESTION FEED) =================== */
            <div className="space-y-4">
              {/* Top 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/70 p-4 rounded-2xl shadow-xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Students active
                  </p>
                  <p className="text-xl font-extrabold text-stone-900 tracking-tight">
                    18 / 30
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    chatting right now
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/70 p-4 rounded-2xl shadow-xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Questions asked
                  </p>
                  <p className="text-xl font-extrabold text-stone-900 tracking-tight">
                    7
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    in this session
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/70 p-4 rounded-2xl shadow-xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Top topic
                  </p>
                  <p className="text-xl font-extrabold text-stone-900 tracking-tight">
                    IAM roles
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">3 mentions</p>
                </div>

                <div className="bg-white/90 backdrop-blur-xs border border-stone-200/70 p-4 rounded-2xl shadow-xs">
                  <p className="text-[11px] font-semibold text-stone-400 mb-1">
                    Avg readiness so far
                  </p>
                  <p className="text-xl font-extrabold text-stone-900 tracking-tight">
                    {currentSession.avgReadiness !== "–"
                      ? currentSession.avgReadiness
                      : "67%"}
                  </p>
                </div>
              </div>

              {/* Question Feed */}
              <div className="space-y-3 pt-2">
                <h2 className="text-sm font-bold text-stone-800">
                  Question feed
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUESTION_FEED.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/90 backdrop-blur-xs border border-stone-200/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
                              {item.initials}
                            </div>
                            <span className="text-xs font-bold text-stone-800">
                              {item.studentName}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {item.timeAgo}
                          </span>
                        </div>

                        <p className="text-xs text-stone-700 font-medium leading-relaxed">
                          {item.question}
                        </p>
                      </div>

                      <div>
                        <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-semibold rounded-md">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
