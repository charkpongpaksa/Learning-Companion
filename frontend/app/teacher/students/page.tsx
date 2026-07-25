"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// ดึงข้อมูลวิชาจาก data.ts
import { TEACHER_SUBJECTS } from "../dashboard/data";
import TeacherSidebar from "@/components/teachersidebar";

// ข้อมูลนักเรียนตัวอย่าง
const INITIAL_STUDENTS = [
  {
    id: "1",
    name: "Somchai Jaidee",
    initials: "SJ",
    avgReadiness: "76%",
    sessionsDone: "2 / 4",
    lastActive: "Today",
    status: "Partial",
    statusBg: "bg-amber-100/70 text-amber-800",
  },
  {
    id: "2",
    name: "Pim Nakorn",
    initials: "PN",
    avgReadiness: "92%",
    sessionsDone: "3 / 4",
    lastActive: "Yesterday",
    status: "Met",
    statusBg: "bg-emerald-100/70 text-emerald-800",
  },
  {
    id: "3",
    name: "Kritsada Thongdee",
    initials: "KT",
    avgReadiness: "41%",
    sessionsDone: "1 / 4",
    lastActive: "3 days ago",
    status: "Gap",
    statusBg: "bg-rose-100/70 text-rose-800",
  },
];

export default function TeacherStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // ป้องกัน undefined กรณี TEACHER_SUBJECTS เป็นอาร์เรย์ว่าง
  const [selectedSubject] = useState<any>(
    TEACHER_SUBJECTS?.[0] || {
      id: "default",
      code: "CS101",
      name: "Sample Subject",
      displayShort: "CS101 Sample",
      weeks: "12 weeks",
    },
  );

  // กรองรายชื่อนักเรียนตามคำค้นหา
  const filteredStudents = INITIAL_STUDENTS.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      <TeacherSidebar />

      {/* ================= 2. MAIN CONTENT AREA ================= */}
      <main
        className="flex-1 pl-64 px-8 pt-14 pb-8 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)",
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          {/* Header Title & Actions */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Students
              </h2>
              <p className="text-xs text-stone-400 font-medium mt-1">
                All students enrolled in {selectedSubject?.code || "Subject"} -
                30 total
              </p>
            </div>

            {/* Search and Add Student */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="Search students"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 bg-white border border-stone-200/80 rounded-full text-xs placeholder:text-stone-300 outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Students Table Card */}
          <div className="bg-white/90 backdrop-blur-xs border border-stone-200/70 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-medium text-[11px]">
                  <th className="py-4 px-6 font-semibold">Student</th>
                  <th className="py-4 px-6 font-semibold">Avg readiness</th>
                  <th className="py-4 px-6 font-semibold">Sessions done</th>
                  <th className="py-4 px-6 font-semibold">Last active</th>
                  <th className="py-4 px-6 font-semibold text-right sm:text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/80">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-orange-100/80 flex items-center justify-center text-[11px] font-bold text-orange-800 shrink-0">
                            {student.initials}
                          </div>
                          <span className="font-bold text-stone-800">
                            {student.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-semibold text-stone-700">
                        {student.avgReadiness}
                      </td>

                      <td className="py-4 px-6 font-medium text-stone-600">
                        {student.sessionsDone}
                      </td>

                      <td className="py-4 px-6 font-medium text-stone-600">
                        {student.lastActive}
                      </td>

                      <td className="py-4 px-6 text-right sm:text-left">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${student.statusBg}`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-stone-400 font-medium"
                    >
                      No students found matching "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
