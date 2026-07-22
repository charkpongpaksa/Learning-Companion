"use client";

import React from "react";
import Link from "next/link";
import TeacherSidebar from "@/components/teachersidebar";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  FileText,
  Settings,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  Trash2,
  X,
} from "lucide-react";

// ดึงข้อมูลวิชาและบทเรียนจากไฟล์ data.ts
import { TEACHER_SUBJECTS, TEACHER_SESSIONS } from "./data";

type TeacherSubject = {
  id: number;
  code: string;
  name: string;
  displayShort: string;
  subtitle: string;
  weeks: string;
  stats: {
    avgReadiness: string;
    semesterProgress: string;
    progressCriteria: string;
    sessionsRun: number;
    studentsCaughtUp: string;
  };
};

type TeacherSession = {
  id: number;
  week: string;
  title: string;
  status: "Completed" | "Active" | "Upcoming";
  segments: string[];
  avgReadiness: string;
  isLive?: boolean;
};

export default function Page() {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState<TeacherSubject>(
    TEACHER_SUBJECTS[0] || {
      id: 0,
      code: "",
      name: "",
      displayShort: "",
      subtitle: "",
      weeks: "",
      stats: {
        avgReadiness: "N/A",
        semesterProgress: "0%",
        progressCriteria: "",
        sessionsRun: 0,
        studentsCaughtUp: "0/0",
      },
    },
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  // 1. State สำหรับ Modal ล็อกการเปิด-ปิดหน้าต่าง New Session
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [sessionTitle, setSessionTitle] = React.useState("");
  const [sessionWeek, setSessionWeek] = React.useState("5");
  const [sessionDate, setSessionDate] = React.useState("Mar 29");

  // 2. State สำหรับกล่อง Add Subject
  const [isSubjectModalOpen, setIsSubjectModalOpen] = React.useState(false);
  const [subjectName, setSubjectName] = React.useState("");
  const [subjectCode, setSubjectCode] = React.useState("");

  // ล็อกแถบเลื่อนขวาสุดไว้เสมอ หน้าจอจะได้นิ่งสนิท ไม่ขยับซ้าย-ขวา
  React.useEffect(() => {
    document.documentElement.style.scrollbarGutter = "stable";
    return () => {
      document.documentElement.style.scrollbarGutter = "";
    };
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `สร้างเซสชันใหม่สำเร็จ!\nชื่อ: ${sessionTitle}\nสัปดาห์: ${sessionWeek}\nวันที่: ${sessionDate}`,
    );
    setIsModalOpen(false);
    setSessionTitle("");
  };

  // ฟังก์ชันจัดการเมื่อกดเซฟสร้างวิชาใหม่
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `สร้างวิชาใหม่สำเร็จ!\nชื่อวิชา: ${subjectName}\nรหัสวิชา: ${subjectCode}`,
    );
    setIsSubjectModalOpen(false);
    setSubjectName("");
    setSubjectCode("");
  };

  // ดึงข้อมูลบทเรียนของวิชาที่เลือก
  const currentSessions: TeacherSession[] =
    selectedSubject?.code &&
    TEACHER_SESSIONS[selectedSubject.code as keyof typeof TEACHER_SESSIONS]
      ? (TEACHER_SESSIONS[
          selectedSubject.code as keyof typeof TEACHER_SESSIONS
        ] as TeacherSession[])
      : [];
  // ระบบกรองข้อมูลค้นหาบทเรียน
  const filteredSessions = (currentSessions || []).filter((session: any) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      session.title?.toLowerCase().includes(query) ||
      session.week?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      <TeacherSidebar />

      {/* RIGHT MAIN CONTENT */}
      <main
        className="flex-1 pl-64 px-8 pt-14 pb-8 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          {/* ส่วนหัวแสดงชื่อวิชา */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                {selectedSubject?.code} — {selectedSubject?.name}
              </h2>
              <p className="text-xs text-stone-400 mt-1 font-medium">
                {selectedSubject?.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search sessions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 bg-white border border-stone-200/80 rounded-full text-xs placeholder:text-stone-300 outline-none focus:border-orange-500/50"
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-4 h-9 bg-[#e65100] hover:bg-[#d84315] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus size={14} />
                New session
              </button>
            </div>
          </div>

          {/* ส่วนแสดงแถบสถิติภาพรวมคลาสเรียน */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200/50 rounded-xl p-4 shadow-sm text-left">
              <p className="text-[11px] font-semibold text-stone-400">
                Avg readiness
              </p>
              <p className="text-xl font-bold text-stone-900 mt-1.5">
                {selectedSubject?.stats?.avgReadiness ?? "N/A"}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                across active sessions
              </p>
            </div>
            <div className="bg-white border border-stone-200/50 rounded-xl p-4 shadow-sm text-left">
              <p className="text-[11px] font-semibold text-stone-400">
                Semester progress
              </p>
              <p className="text-xl font-bold text-stone-900 mt-1.5">
                {selectedSubject?.stats?.semesterProgress ?? "0%"}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {selectedSubject?.stats?.progressCriteria ?? ""}
              </p>
            </div>
            <div className="bg-white border border-stone-200/50 rounded-xl p-4 shadow-sm text-left">
              <p className="text-[11px] font-semibold text-stone-400">
                Sessions run
              </p>
              <p className="text-xl font-bold text-stone-900 mt-1.5">
                {selectedSubject?.stats?.sessionsRun ?? 0}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">this semester</p>
            </div>
            <div className="bg-white border border-stone-200/50 rounded-xl p-4 shadow-sm text-left">
              <p className="text-[11px] font-semibold text-stone-400">
                Students caught up
              </p>
              <p className="text-xl font-bold text-stone-900 mt-1.5">
                {selectedSubject?.stats?.studentsCaughtUp ?? "0/0"}
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">latest week</p>
            </div>
          </div>

          {/* หัวข้อรายการแผงสัปดาห์ */}
          <div className="text-left pt-2">
            <h3 className="text-sm font-bold text-stone-800">
              Sessions ({selectedSubject?.weeks})
            </h3>
          </div>

          {/* ลูปแสดงการ์ดบทเรียนของแต่ละสัปดาห์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[480px] items-start content-start pb-12">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session: TeacherSession) => {
                const isUpcoming = session.status === "Upcoming";
                const CardWrapper = isUpcoming ? "div" : Link;

                // กำหนด props สำหรับ CardWrapper ตามประเภทของ Component
                const wrapperProps = isUpcoming
                  ? {
                      className:
                        "bg-white border border-stone-200/60 rounded-xl p-4 flex flex-col h-full shadow-sm transition-all text-left",
                    }
                  : {
                      href: `/teacher/session/${session.id}`,
                      className:
                        "bg-white border border-stone-200/60 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md/5 transition-all text-left",
                    };

                return (
                  <CardWrapper key={session.id} {...(wrapperProps as any)}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                          {session.week}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {session.status === "Completed" && (
                            <span className="px-2.5 py-0.5 bg-[#e6f4ea] text-[#137333] rounded-full text-[10px] font-bold border border-[#ceead6]">
                              Completed
                            </span>
                          )}
                          {session.status === "Active" && (
                            <span className="px-2.5 py-0.5 bg-[#fff3ed] text-[#d84315] rounded-full text-[10px] font-bold border border-orange-100">
                              Active
                            </span>
                          )}
                          {session.status === "Upcoming" && (
                            <>
                              <span className="px-2.5 py-0.5 bg-white text-stone-500 border border-stone-200 rounded-full text-[10px] font-semibold">
                                Upcoming
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Delete session: ${session.title}`);
                                }}
                                className="w-7 h-7 flex items-center justify-center bg-white text-stone-500 border border-stone-200 rounded-xl hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm cursor-pointer active:scale-[0.95]"
                                title="Delete session"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 leading-snug mb-3">
                        {session.title}
                      </h4>

                      <div className="grid grid-cols-4 gap-1 mb-2">
                        {session.segments?.map(
                          (colorClass: string, index: number) => (
                            <div
                              key={index}
                              className={`h-1.5 rounded-full ${colorClass}`}
                            />
                          ),
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-stone-400 font-medium mb-2">
                        <span>Avg readiness</span>
                        <span
                          className={`font-semibold ${session.status !== "Upcoming" ? "text-stone-700" : ""}`}
                        >
                          {session.avgReadiness}
                        </span>
                      </div>
                    </div>

                    {(session.status === "Upcoming" || session.isLive) && (
                      <div className="pt-2.5 mt-2 border-t border-stone-100 flex flex-col justify-center">
                        {session.status === "Upcoming" && (
                          <button
                            type="button"
                            onClick={() => {
                              router.push(`/teacher/session/${session.id}`);
                            }}
                            className="w-full py-2 bg-[#fff8f5] border border-orange-200/80 text-[13px] text-[#d84315] font-bold rounded-full flex items-center justify-center gap-1 hover:bg-[#fff3ed] hover:border-orange-300 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
                          >
                            Start this session →
                          </button>
                        )}

                        {session.isLive && (
                          <div className="text-[11px] text-rose-500 font-bold flex items-center gap-1.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="hover:underline cursor-pointer">
                              Live now — view questions
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardWrapper>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center select-none">
                <p className="text-xs font-bold text-stone-500">
                  No sessions found
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* NEW SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white w-[460px] rounded-[28px] p-7 shadow-2xl relative max-w-[90%] mx-auto text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                New session
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400/90 mb-1.5">
                  Session title
                </label>
                <input
                  type="text"
                  placeholder="e.g. VPC networking"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone-50 rounded-[14px] text-xs font-medium text-stone-900 placeholder:text-stone-400/80 outline-none border border-stone-300 focus:border-stone-400 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400/90 mb-1.5">
                    Week
                  </label>
                  <input
                    type="text"
                    value={sessionWeek}
                    onChange={(e) => setSessionWeek(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-[14px] text-xs font-medium text-stone-700 outline-none border border-stone-300 focus:border-stone-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400/90 mb-1.5">
                    Date
                  </label>
                  <input
                    type="text"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-50 rounded-[14px] text-xs font-medium text-stone-700 outline-none border border-stone-300 focus:border-stone-400 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-stone-950 text-xs font-bold text-stone-950 rounded-full bg-white hover:bg-stone-50 transition-all active:scale-[0.97] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#f5a982] hover:bg-[#e2936a] text-xs font-bold text-white rounded-full shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                >
                  Create session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white w-[460px] rounded-[28px] p-7 shadow-2xl relative max-w-[90%] mx-auto text-left">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-stone-950 tracking-tight">
                Add a subject
              </h3>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-stone-500 font-medium leading-relaxed mb-6">
              Create a new subject. You can add as many weekly sessions to it as
              you need.
            </p>

            <form onSubmit={handleCreateSubject} className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-stone-600 mb-1.5">
                  Subject name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Database Systems"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone-50 rounded-[14px] text-xs font-medium text-stone-900 placeholder:text-stone-400/70 outline-none border border-stone-300 focus:border-stone-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-stone-600 mb-1.5">
                  Subject code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS221"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone-50 rounded-[14px] text-xs font-medium text-stone-900 placeholder:text-stone-400/70 outline-none border border-stone-300 focus:border-stone-400 transition-all"
                />
              </div>

              <div className="flex justify-center sm:justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-7 py-2.5 border border-stone-950 text-[13px] font-bold text-stone-950 rounded-full bg-white hover:bg-stone-50 transition-all active:scale-[0.97] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#f5a982] hover:bg-[#e2936a] text-[13px] font-bold text-white rounded-full transition-all active:scale-[0.97] cursor-pointer"
                >
                  Create subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
