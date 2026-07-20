// app/student/dashboard/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layers, 
  BarChart2, 
  FileText, 
  LogOut, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  ChevronDown,
  X // 🌟 เพิ่มไอคอน X สำหรับปิดกล่อง
} from 'lucide-react';

// ดึงข้อมูลมาจากไฟล์ data.ts ที่เราแยกไว้
import { SUBJECTS, SESSIONS_BY_SUBJECT } from './data';

export default function StudentDashboard() {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState(SUBJECTS[0]);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // 🌟 จุดที่เพิ่ม 1: State สำหรับเปิด-ปิด Modal และเก็บค่าโค้ดห้องเรียน
  const [isJoinModalOpen, setIsJoinModalOpen] = React.useState(false);
  const [sessionCode, setSessionCode] = React.useState('');

  const handleLogout = () => {
    router.push('/login');
  };

  // ฟังก์ชันกดยืนยันการ Join
  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`กำลังเข้าร่วม Session ด้วยโค้ด: ${sessionCode}`);
    setIsJoinModalOpen(false);
    setSessionCode(''); // ล้างค่าเมื่อเสร็จสิ้น
  };

  // ดึงข้อมูลการ์ดของวิชาที่เลือกอยู่ ณ ปัจจุบัน
  const currentSessions = SESSIONS_BY_SUBJECT[selectedSubject.code as keyof typeof SESSIONS_BY_SUBJECT] || [];

  // กรองข้อมูลบทเรียนตามคำที่พิมพ์ในช่อง Search
  const filteredSessions = currentSessions.filter((session) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      session.title.toLowerCase().includes(query) ||
      session.description.toLowerCase().includes(query) ||
      session.week.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          {/* Dropdown วิชา */}
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

            {isDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden">
                {SUBJECTS.map((subject) => {
                  const isSelected = subject.id === selectedSubject.id;
                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setIsDropdownOpen(false);
                        setSearchQuery(''); 
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
            )}
          </div>

          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Student
              </p>
              <div className="space-y-0.5">
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold text-[#d84315] bg-[#fff3ed] rounded-lg">
                  <Layers size={15} />
                  Sessions
                </a>
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <FileText size={15} className="text-stone-400" />
                  Materials
                </a>
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <BarChart2 size={15} className="text-stone-400" />
                  My progress
                </a>
              </div>
            </div>
          </nav>
        </div>

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
            onClick={handleLogout}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main 
        className="flex-1 pl-64 px-8 pt-14 pb-8 relative overflow-hidden"
        style={{
            background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)'
        }}
    >
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Your sessions</h2>
              <p className="text-xs text-stone-400 mt-1">
                {selectedSubject.code} - {selectedSubject.name} — prepare before class, catch up if you missed something.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sessions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 bg-white border border-stone-200/80 rounded-full text-xs placeholder:text-stone-300 outline-none focus:border-orange-500/50"
                />
              </div>
              
              {/* 🌟 จุดที่แก้ไข 2: ผูกปุ่มกดเข้ากับ State เพื่อสั่งเปิด Modal */}
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="flex items-center gap-1.5 px-4 h-9 bg-[#e65100] hover:bg-[#d84315] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98]"
              >
                <Plus size={14} />
                Join with code
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id}
                  className="bg-white border border-stone-200/60 rounded-xl p-5 flex flex-col justify-between min-h-[170px] shadow-sm hover:shadow-md/5 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        {session.week}
                      </span>
                      
                      {session.status === 'Completed' && (
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-semibold border border-green-100">
                          Completed
                        </span>
                      )}
                      {session.status === 'Active' && (
                        <span className="px-2.5 py-0.5 bg-[#fff3ed] text-[#d84315] rounded-full text-[10px] font-bold border border-orange-100">
                          Active
                        </span>
                      )}
                      {session.status === 'Upcoming' && (
                        <span className="px-2.5 py-0.5 bg-white text-stone-400 border border-stone-200 rounded-full text-[10px] font-semibold">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-stone-900 leading-snug mb-1">
                      {session.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-4 text-[11px] text-stone-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-stone-300" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-stone-300" />
                      <span className={session.status === 'Active' ? 'text-stone-500 font-semibold' : ''}>
                        {session.info}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-stone-200/50">
              <p className="text-sm text-stone-400 font-medium">No sessions found matching "{searchQuery}"</p>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================
          🌟 จุดที่เพิ่ม 3: JOIN WITH CODE MODAL POPUP (ถอดแบบตามภาพประกอบ)
         ========================================================= */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 transition-all">
          
          {/* กล่องสีขาวขนาดตรงตามภาพ ขอบมน 3xl */}
          <div className="bg-white rounded-[26px] max-w-[460px] w-full p-7 relative shadow-2xl border border-stone-100 text-left animate-in fade-in zoom-in-95 duration-200">
            
            {/* หัวข้อเจ๋ง ๆ และปุ่มตัว X ด้านมุมขวาบน */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[21px] font-bold text-stone-950 tracking-tight">
                Join a session with a code
              </h3>
              <button 
                onClick={() => { setIsJoinModalOpen(false); setSessionCode(''); }}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            {/* คำอธิบาย */}
            <p className="text-[13.5px] text-stone-500 font-normal leading-relaxed mb-5">
              Enter the code your teacher gave you to join a session.
            </p>

            {/* ฟอร์มรับค่าพิมและปุ่มกดยืนยัน */}
            <form onSubmit={handleJoinSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="e.g. CS332-8XQP"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                required
                className="w-full bg-stone-100/90 border border-stone-300 rounded-[14px] px-4 py-3.5 text-sm placeholder:text-stone-400 text-stone-900 outline-none focus:border-stone-400 transition-all font-medium"
              />

              {/* ปุ่มควบคุมล่างขวา */}
              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setIsJoinModalOpen(false); setSessionCode(''); }}
                  className="px-[22px] py-2 border-[1.5px] border-stone-950 text-stone-950 font-bold text-[13px] rounded-full hover:bg-stone-50 transition-all active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-[26px] py-2 bg-[#e65100] hover:bg-[#d84315] text-white font-bold text-[13px] rounded-full shadow-lg shadow-orange-700/15 transition-all active:scale-[0.97]"
                >
                  Join
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}