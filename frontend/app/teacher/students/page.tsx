"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  X,
  Copy,
  Check,
} from "lucide-react";

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
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  // ป้องกัน undefined กรณี TEACHER_SUBJECTS เป็นอาร์เรย์ว่าง
  const [selectedSubject, setSelectedSubject] = useState<any>(
    TEACHER_SUBJECTS?.[0] || {
      id: "default",
      code: "CS101",
      name: "Sample Subject",
      displayShort: "CS101 Sample",
      weeks: "12 weeks",
    },
  );

  const handleLogout = () => {
    router.push("/login");
  };

  // กรองรายชื่อนักเรียนตามคำค้นหา
  const filteredStudents = INITIAL_STUDENTS.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `สร้างวิชาใหม่สำเร็จ!\nชื่อวิชา: ${subjectName}\nรหัสวิชา: ${subjectCode}`,
    );
    setIsSubjectModalOpen(false);
    setSubjectName("");
    setSubjectCode("");
  };

  // 1. State สำหรับเปิด-ปิด Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 2. State สำหรับแสดงสถานะว่ากด Copy แล้วหรือยัง
  const [isCopied, setIsCopied] = useState(false);

  // 3. รหัสเชิญเข้าร่วมวิชา (ดึงจากวิชาที่เลือก หรือสมมุติขึ้นมา)
  const inviteCode = `${selectedSubject?.code || "CS332"}-8XQP`;

  // 4. ฟังก์ชันคัดลอกรหัส
  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // คืนค่าเป็น Copy หลังจาก 2 วินาที
  };

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

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-1.5 px-4 h-9 bg-[#e65100] hover:bg-[#d84315] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus size={15} />
                Add student
              </button>
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

      {/* ================= INVITE STUDENTS MODAL ================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[999]">
          <div className="bg-white w-[420px] rounded-[28px] p-7 shadow-2xl relative max-w-[90%] mx-auto text-left">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                Invite students
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p className="text-[13px] text-stone-500 font-medium leading-relaxed mb-6">
              Have students enter this code on the "Join with code" screen to
              join this subject.
            </p>

            {/* Code Display Box */}
            <div className="bg-[#e9e8e8]/60 p-4 rounded-2xl flex items-center justify-between mb-8">
              <span className="text-xl font-extrabold text-stone-900 tracking-wide pl-1">
                {inviteCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fceee6] hover:bg-[#fbd3c1] border border-[#f7cdb9] rounded-xl text-xs font-bold text-[#d84315] transition-all cursor-pointer active:scale-95 select-none"
              >
                {isCopied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Action */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="px-7 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-[13px] font-bold text-white rounded-full transition-all shadow-md active:scale-[0.97] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
