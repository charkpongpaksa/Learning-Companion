'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Layers, 
  BarChart2, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  ChevronDown 
} from 'lucide-react';

const SESSIONS_DATA = [
  {
    id: 1,
    week: 'Week 1',
    title: 'Cloud fundamentals',
    description: 'Core concepts of cloud computing',
    status: 'Completed',
    date: 'Mar 1',
    info: 'Readiness 94%',
  },
  {
    id: 2,
    week: 'Week 2',
    title: 'S3 and storage tiers',
    description: 'Object storage fundamentals and lifecycle policies',
    status: 'Completed',
    date: 'Mar 8',
    info: 'Readiness 82%',
  },
  {
    id: 3,
    week: 'Week 3',
    title: 'EC2 and IAM',
    description: 'Understanding EC2 instances and IAM roles for secure access',
    status: 'Active',
    date: 'Mar 15',
    info: 'Before class',
  },
  {
    id: 4,
    week: 'Week 4',
    title: 'VPC networking',
    description: 'Subnets, route tables, and security groups',
    status: 'Upcoming',
    date: 'Mar 22',
    info: 'Not started',
  },
];

export default function StudentDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* =========================================================
          LEFT SIDEBAR (แถบเมนูด้านซ้าย)
         ========================================================= */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          <div className="px-3 mb-6">
            <div className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
              <div className="text-left">
                <p className="text-[13px] font-bold text-stone-900 truncate max-w-[160px]">
                  CS332 · Basic Cloud Computing
                </p>
                <p className="text-[10px] text-stone-400 font-medium">2 subjects</p>
              </div>
              <ChevronDown size={16} className="text-stone-400" />
            </div>
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

      {/* =========================================================
          RIGHT MAIN CONTENT (พื้นที่แสดงเนื้อหาหลักทางขวา)
         ========================================================= */}
      {/* เพิ่ม relative และ overflow-hidden เพื่อรองรับแสงฟุ้ง */}
      <main 
        className="flex-1 pl-64 px-8 pt-14 pb-8 relative overflow-hidden"
        style={{
            background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #fdfbf7 80%)'
        }}
        >

        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Your sessions</h2>
              <p className="text-xs text-stone-400 mt-1">
                CS332 · Basic Cloud Computing — prepare before class, catch up if you missed something.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sessions"
                  className="w-full pl-9 pr-4 h-9 bg-white border border-stone-200/80 rounded-full text-xs placeholder:text-stone-300 outline-none focus:border-orange-500/50"
                />
              </div>
              <button className="flex items-center gap-1.5 px-4 h-9 bg-[#e65100] hover:bg-[#d84315] text-white text-xs font-bold rounded-full shadow-sm transition-all active:scale-[0.98]">
                <Plus size={14} />
                Join with code
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SESSIONS_DATA.map((session) => (
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

        </div>
      </main>

    </div>
  );
}