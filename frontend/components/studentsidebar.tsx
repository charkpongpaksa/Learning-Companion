'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Layers, 
  TrendingUp, 
  FileText, 
  LogOut, 
  Plus, 
  ChevronDown, 
  X 
} from 'lucide-react';

import { SUBJECTS } from '@/app/student/dashboard/data'; // ⚠️ ตรวจสอบ path ไฟล์ data ของคุณให้ถูกต้อง

type Subject = {
  id: number;
  code: string;
  name: string;
  displayShort: string;
  weeks: string;
};

interface StudentSidebarProps {
  selectedSubject?: Subject;
  onSelectSubject?: (subject: Subject) => void;
}

export default function StudentSidebar({ 
  selectedSubject = SUBJECTS[0], 
  onSelectSubject 
}: StudentSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectCode, setSubjectCode] = useState('');

  const handleLogout = () => {
    router.push('/login');
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`กำลังเพิ่มวิชาด้วยโค้ด: ${subjectCode}`);
    setIsAddSubjectModalOpen(false);
    setSubjectCode('');
  };

  // 💡 เช็คการ Active ของเมนู Sessions (รองรับทั้ง /student/dashboard, /student/sessions และ /student/session/[id])
  const isSessionsActive = 
    pathname.startsWith('/student/session') || 
    pathname === '/student/dashboard' || 
    pathname === '/student/sessions';

  const isMaterialsActive = pathname.startsWith('/student/material');
  const isProgressActive = pathname.startsWith('/student/progress');

  return (
    <>
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20 top-0 left-0">
        <div>
          {/* Logo Brand */}
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          {/* Dropdown เลือกวิชา */}
          <div className="px-3 mb-6 relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors select-none"
            >
              <div className="text-left min-w-0 flex-1">
                <p className="text-[13px] font-bold text-stone-900 truncate pr-1">
                  {selectedSubject.displayShort}
                </p>
                <p className="text-[10px] text-stone-400 font-medium">{SUBJECTS.length} subjects</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </div>

            {/* List วิชาใน Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden divide-y divide-stone-100">
                <div>
                  {SUBJECTS.map((subject) => {
                    const isSelected = subject.id === selectedSubject.id;
                    return (
                      <div
                        key={subject.id}
                        onClick={() => {
                          if (onSelectSubject) onSelectSubject(subject);
                          setIsDropdownOpen(false);
                        }}
                        className={`p-3 text-left cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-[#fff3ed] text-[#d84315]' 
                            : 'bg-white text-stone-900 hover:bg-stone-50'
                        }`}
                      >
                        <p className="text-xs font-bold truncate">
                          {subject.displayShort}
                        </p>
                        <p className={`text-[10px] font-medium mt-0.5 ${
                          isSelected ? 'text-[#d84315]/70' : 'text-stone-400'
                        }`}>
                          {subject.weeks}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* ปุ่ม Add Subject */}
                <div 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsAddSubjectModalOpen(true);
                  }}
                  className="p-3 text-left cursor-pointer hover:bg-stone-50 transition-colors flex items-center gap-2 text-[#d84315] font-bold text-xs"
                >
                  <Plus size={14} />
                  <span>Add subject</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 text-left">
                Student
              </p>
              <div className="space-y-0.5">
                <Link 
                  href="/student/dashboard" 
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold rounded-lg transition-colors ${
                    isSessionsActive 
                      ? 'text-[#d84315] bg-[#fff3ed]' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Layers size={15} className={isSessionsActive ? 'text-[#d84315]' : 'text-stone-400'} />
                  Sessions
                </Link>

                <Link 
                  href="/student/material" 
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                    isMaterialsActive 
                      ? 'text-[#d84315] bg-[#fff3ed] font-bold' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <FileText size={15} className={isMaterialsActive ? 'text-[#d84315]' : 'text-stone-400'} />
                  Materials
                </Link>

                <Link 
                  href="/student/progress" 
                  className={`flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                    isProgressActive 
                      ? 'text-[#d84315] bg-[#fff3ed] font-bold' 
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <TrendingUp size={15} className={isProgressActive ? 'text-[#d84315]' : 'text-stone-400'} />
                  My progress
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[11px] font-bold text-orange-700">
              SJ
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-stone-900 leading-tight">Somchai Jaidee</p>
              <p className="text-[10px] text-stone-400 font-medium leading-none">Student</p>
            </div>
          </div>
          <button 
          suppressHydrationWarning
            onClick={handleLogout}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-md transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ADD A SUBJECT MODAL POPUP */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 transition-all">
          <div className="bg-white rounded-[26px] max-w-[460px] w-full p-7 relative shadow-2xl border border-stone-100 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[20px] font-bold text-stone-950 tracking-tight">
                Add a subject
              </h3>
              <button 
                onClick={() => { setIsAddSubjectModalOpen(false); setSubjectCode(''); }}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-md cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-[13px] text-stone-500 font-normal leading-relaxed mb-5">
              Enter the code your teacher gave you to add their subject.
            </p>

            <form onSubmit={handleAddSubjectSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="e.g. CS332"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
                className="w-full bg-stone-100/90 border border-stone-200/80 rounded-[14px] px-4 py-3.5 text-sm placeholder:text-stone-400 text-stone-900 outline-none focus:border-stone-400 transition-all font-medium"
              />

              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsAddSubjectModalOpen(false); setSubjectCode(''); }}
                  className="px-5 py-2 border border-stone-950 text-stone-950 font-bold text-[13px] rounded-full hover:bg-stone-50 transition-all active:scale-[0.97] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f89b78] hover:bg-[#e65100] text-white font-bold text-[13px] rounded-full shadow-sm transition-all active:scale-[0.97] cursor-pointer"
                >
                  Add subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}