"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  CalendarDays,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";

// ดึงข้อมูลวิชาจากไฟล์ data.ts (ปรับ Path ให้ตรงกับโครงสร้างจริงได้ครับ)
import { TEACHER_SUBJECTS } from "@/app/teacher/dashboard/data";

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

export default function TeacherSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<TeacherSubject>(
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
    }
  );

  // State สำหรับกล่อง Add Subject
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const handleLogout = () => {
    router.push("/login");
  };

  // ฟังก์ชันจัดการเมื่อกดเซฟสร้างวิชาใหม่
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `สร้างวิชาใหม่สำเร็จ!\nชื่อวิชา: ${subjectName}\nรหัสวิชา: ${subjectCode}`
    );
    setIsSubjectModalOpen(false);
    setSubjectName("");
    setSubjectCode("");
  };

  return (
    <>
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">
              Learning Companion
            </h1>
          </div>

          {/* รายการวิชา & ปุ่ม Add Subject */}
          <div className="px-3 mb-6 relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors select-none"
            >
              <div className="text-left min-w-0 flex-1">
                <p className="text-[13px] font-bold text-stone-900 truncate pr-1">
                  {selectedSubject.code} · {selectedSubject.name}
                </p>
                <p className="text-[10px] text-stone-400 font-medium">
                  {TEACHER_SUBJECTS.length} subjects
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden p-1 space-y-0.5">
                {TEACHER_SUBJECTS.map((subject: TeacherSubject) => {
                  const isSelected = subject.id === selectedSubject.id;
                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setIsDropdownOpen(false);
                      }}
                      className={`p-2.5 text-left cursor-pointer rounded-lg transition-colors ${
                        isSelected
                          ? "bg-[#fff3ed] text-[#d84315] font-bold"
                          : "bg-white text-stone-800 hover:bg-stone-50"
                      }`}
                    >
                      <p className="text-xs truncate">{subject.displayShort}</p>
                      <p
                        className={`text-[10px] font-medium mt-0.5 ${
                          isSelected ? "text-[#d84315]/70" : "text-stone-400"
                        }`}
                      >
                        {subject.weeks}
                      </p>
                    </div>
                  );
                })}

                <div className="border-t border-stone-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsSubjectModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left p-2.5 text-xs font-bold text-[#d84315] hover:bg-stone-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    Add subject
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* เมนูนำทางของอาจารย์ (TEACHER) */}
          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Teacher
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/teacher/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] rounded-lg transition-colors ${
                    pathname.startsWith("/teacher/dashboard")
                      ? "font-bold text-[#e65100] bg-[#fff3ed]"
                      : "font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <CalendarDays
                    size={15}
                    className={
                      pathname.startsWith("/teacher/dashboard")
                        ? ""
                        : "text-stone-400"
                    }
                  />
                  Sessions
                </Link>
                <Link
                  href="/teacher/students"
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] rounded-lg transition-colors ${
                    pathname === "/teacher/students"
                      ? "font-bold text-[#d84315] bg-[#fff3ed]"
                      : "font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Users
                    size={15}
                    className={
                      pathname === "/teacher/students" ? "" : "text-stone-400"
                    }
                  />
                  Students
                </Link>
                <Link
                  href="/teacher/materials"
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] rounded-lg transition-colors ${
                    pathname === "/teacher/materials"
                      ? "font-bold text-[#d84315] bg-[#fff3ed]"
                      : "font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <FileText
                    size={15}
                    className={
                      pathname === "/teacher/materials" ? "" : "text-stone-400"
                    }
                  />
                  Materials & prompts
                </Link>
                <Link
                  href="/teacher/setting"
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] rounded-lg transition-colors ${
                    pathname === "/teacher/setting"
                      ? "font-bold text-[#d84315] bg-[#fff3ed]"
                      : "font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <Settings
                    size={15}
                    className={
                      pathname === "/teacher/setting" ? "" : "text-stone-400"
                    }
                  />
                  Subject settings
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* โปรไฟล์อาจารย์ */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[11px] font-bold text-orange-700">
              AC
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-stone-900 leading-tight">
                Achara Chaiya
              </p>
              <p className="text-[10px] text-stone-400 font-medium leading-none">
                Teacher
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

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
    </>
  );
}