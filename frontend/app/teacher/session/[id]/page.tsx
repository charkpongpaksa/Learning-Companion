'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarDays,
  FileText,
  Users,  
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronLeft 
} from 'lucide-react';

// ดึงข้อมูลจาก data.ts
import { TEACHER_SUBJECTS, TEACHER_SESSIONS } from '../../dashboard/data';

// ข้อมูลตัวอย่าง Question Feed สำหรับหน้า Live Session
const QUESTION_FEED = [
  {
    id: 1,
    studentName: 'Somchai Jaidee',
    initials: 'SJ',
    timeAgo: '2 min ago',
    question: "What's the difference between a security group and a network ACL?",
    tag: 'Security groups',
  },
  {
    id: 2,
    studentName: 'Pim Nakorn',
    initials: 'PN',
    timeAgo: '4 min ago',
    question: 'Can one IAM role be attached to more than one EC2 instance?',
    tag: 'IAM roles',
  },
  {
    id: 3,
    studentName: 'Kritsada Thongdee',
    initials: 'KT',
    timeAgo: '5 min ago',
    question: 'My instance profile failed to assume the role — what did I miss?',
    tag: 'IAM roles',
  },
  {
    id: 4,
    studentName: 'Nina Suksawat',
    initials: 'NS',
    timeAgo: '7 min ago',
    question: 'Is a security group stateful or stateless by default?',
    tag: 'Security groups',
  },
  {
    id: 5,
    studentName: 'Arthit Boonmee',
    initials: 'AB',
    timeAgo: '9 min ago',
    question: "What happens if I don't attach any policy to a new role?",
    tag: 'IAM roles',
  },
  {
    id: 6,
    studentName: 'Somchai Jaidee',
    initials: 'SJ',
    timeAgo: '11 min ago',
    question: 'How is EC2 On-Demand pricing different from Lambda pricing?',
    tag: 'EC2 basics',
  },
  {
    id: 7,
    studentName: 'Ploy Ratana',
    initials: 'PR',
    timeAgo: '13 min ago',
    question: 'Do security group rules apply to outbound traffic too?',
    tag: 'Security groups',
  },
];

export default function TeacherSessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  // แปลง id จาก URL ให้เป็น Number
  const sessionId = Number(params?.id) || 3; 

  // ค้นหาว่า sessionId นี้ตรงกับ Subject และ Session ไหนใน data.ts
  let currentSubject = TEACHER_SUBJECTS[0];
  let currentSession: any = null;

  for (const subject of TEACHER_SUBJECTS) {
    const sessions = TEACHER_SESSIONS[subject.code as keyof typeof TEACHER_SESSIONS] || [];
    const found = sessions.find((s) => s.id === sessionId);
    if (found) {
      currentSubject = subject;
      currentSession = found;
      break;
    }
  }

  // ค่าสำรองถ้าหา session ไม่เจอ (Default เป็น Session 3)
  if (!currentSession) {
    currentSession = TEACHER_SESSIONS.CS332[2];
  }

  // State สำหรับ Dropdown วิชาด้านข้าง
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(currentSubject);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* ================= 1. LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          {/* Subject Dropdown */}
          <div className="px-3 mb-6 relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors select-none"
            >
              <div className="text-left min-w-0 flex-1">
                <p className="text-[13px] font-bold text-stone-900 truncate pr-1">
                  {selectedSubject.displayShort}
                </p>
                <p className="text-[10px] text-stone-400 font-medium">{TEACHER_SUBJECTS.length} subjects</p>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden divide-y divide-stone-100">
                <div>
                  {TEACHER_SUBJECTS.map((subject) => {
                    const isSelected = subject.id === selectedSubject.id;
                    return (
                      <div
                        key={subject.id}
                        onClick={() => {
                          setSelectedSubject(subject);
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
              </div>
            )}
          </div>

          {/* Nav Items */}
          {/* เมนูนำทางของอาจารย์ (TEACHER) */}
          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Teacher
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/teacher/sessions"
                  className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold text-[#d84315] bg-[#fff3ed] rounded-lg"
                >
                  <CalendarDays size={15} />
                  Sessions
                </Link>
                <Link
                  href="/teacher/students"
                  className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors"
                >
                  <Users size={15} className="text-stone-400" />
                  Students
                </Link>
                <Link
                  href="/teacher/materials"
                  className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors"
                >
                  <FileText size={15} className="text-stone-400" />
                  Materials & prompts
                </Link>
                <Link
                  href="/teacher/subjects"
                  className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors"
                >
                  <Settings size={15} className="text-stone-400" />
                  Subject settings
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[11px] font-bold text-orange-700">
              AC
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-stone-900 leading-tight">Achara Chaiya</p>
              <p className="text-[10px] text-stone-400 font-medium leading-none">Teacher</p>
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

      {/* ================= 2. MAIN CONTENT AREA ================= */}
      <main 
        className="flex-1 pl-64 px-8 pt-12 pb-8 relative overflow-hidden text-left"
        style={{
          background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-2">
          
          {/* Breadcrumb Back Link */}
          <div>
            <Link 
              href="/teacher/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-2 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
              {currentSubject.displayShort}
            </Link>
          </div>

          {/* Session Dynamic Title */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                {currentSession.week} — {currentSession.title}
              </h2>
              {currentSession.isLive && (
                <p className="text-xs text-orange-600 font-medium mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                 Live · visible only to you, not to students
                </p>
             )}
            </div>
          </div>

          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/70 p-4 rounded-2xl shadow-xs">
              <p className="text-[11px] font-semibold text-stone-400 mb-1">Students active</p>
              <p className="text-xl font-extrabold text-stone-900 tracking-tight">18 / 30</p>
              <p className="text-[10px] text-stone-400 mt-1">chatting right now</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/70 p-4 rounded-2xl shadow-xs">
              <p className="text-[11px] font-semibold text-stone-400 mb-1">Questions asked</p>
              <p className="text-xl font-extrabold text-stone-900 tracking-tight">7</p>
              <p className="text-[10px] text-stone-400 mt-1">in this session</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/70 p-4 rounded-2xl shadow-xs">
              <p className="text-[11px] font-semibold text-stone-400 mb-1">Top topic</p>
              <p className="text-xl font-extrabold text-stone-900 tracking-tight">IAM roles</p>
              <p className="text-[10px] text-stone-400 mt-1">3 mentions</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-stone-200/70 p-4 rounded-2xl shadow-xs">
              <p className="text-[11px] font-semibold text-stone-400 mb-1">Avg readiness so far</p>
              <p className="text-xl font-extrabold text-stone-900 tracking-tight">
                {currentSession.avgReadiness !== '–' ? currentSession.avgReadiness : '67%'}
              </p>
            </div>

          </div>

          {/* Question Feed */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-stone-800">Question feed</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTION_FEED.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white/90 backdrop-blur-sm border border-stone-200/70 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-700">
                          {item.initials}
                        </div>
                        <span className="text-xs font-bold text-stone-800">{item.studentName}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">{item.timeAgo}</span>
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
      </main>

    </div>
  );
}