'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Layers,
  TrendingUp,
  FileText, 
  LogOut, 
  Search, 
  ChevronDown,
  Download,
  Plus,
  X
} from 'lucide-react';

import { SUBJECTS } from '../dashboard/data'; 

// ข้อมูลจำลองเอกสารการเรียนตามสัปดาห์
interface MaterialItem {
  id: string;
  title: string;
  type: string;
  size: string;
  updatedAt: string;
  downloadUrl: string;
}

interface WeekGroup {
  weekTitle: string;
  items: MaterialItem[];
}

const initialMaterialsData: WeekGroup[] = [
  {
    weekTitle: 'Week 3 — EC2 and IAM',
    items: [
      {
        id: '1',
        title: 'IAM Fundamentals — lecture slides',
        type: 'PDF',
        size: '2.4 MB',
        updatedAt: 'updated Mar 14',
        downloadUrl: '#',
      },
      {
        id: '2',
        title: 'AWS Security Best Practices — further reading',
        type: 'PDF',
        size: '810 KB',
        updatedAt: 'updated Mar 13',
        downloadUrl: '#',
      },
    ],
  },
  {
    weekTitle: 'Week 2 — S3 and storage tiers',
    items: [
      {
        id: '3',
        title: 'Object Storage — lecture slides',
        type: 'PDF',
        size: '3.1 MB',
        updatedAt: 'updated Mar 7',
        downloadUrl: '#',
      },
      {
        id: '4',
        title: 'S3 Lifecycle — practice worksheet',
        type: 'DOCX',
        size: '220 KB',
        updatedAt: 'updated Mar 6',
        downloadUrl: '#',
      },
    ],
  },
];

export default function StudentMaterials() {
  const router = useRouter();

  // State สำหรับ Sidebar และ Modal Add Subject
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [subjectCode, setSubjectCode] = useState('');

  // State สำหรับ ค้นหา Materials
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    router.push('/login');
  };

  // ฟังก์ชันกดส่งโค้ดวิชา (Add Subject)
  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`กำลังเพิ่มวิชาด้วยโค้ด: ${subjectCode}`);
    setIsAddSubjectModalOpen(false);
    setSubjectCode('');
  };

  // Logic สำหรับค้นหาเอกสาร
  const filteredData = initialMaterialsData
    .map((group) => {
      const filteredItems = group.items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);

  const hasResults = filteredData.length > 0;

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          {/* Dropdown วิชา + ปุ่ม Add Subject */}
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

            {/* Dropdown Menu Popup */}
            {isDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden divide-y divide-stone-100">
                <div>
                  {SUBJECTS.map((subject) => {
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

                {/* ปุ่ม Add Subject ด้านล่างสุดของ Dropdown */}
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

          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Student
              </p>
              <div className="space-y-0.5">
                <Link href="/student/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <Layers size={15} className="text-stone-400" />
                  Sessions
                </Link>
                <Link href="/student/material" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold text-[#d84315] bg-[#fff3ed] rounded-lg">
                  <FileText size={15} />
                  Materials
                </Link>
                <Link href="/student/progress" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <TrendingUp size={15} className="text-stone-400" />
                  My progress
                </Link>
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
      <main className="flex-1 pl-64 px-8 pt-14 pb-8 relative overflow-hidden text-left"
        style={{
          background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-6">
          
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Materials</h2>
              <p className="text-xs text-stone-400 mt-1">
                Files and content from every session in this subject.
              </p>
            </div>

            {/* Search Box */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search materials"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 h-9 bg-white border border-stone-200/80 rounded-full text-xs placeholder:text-stone-300 outline-none focus:border-orange-500/50"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          {hasResults ? (
            <div className="space-y-8">
              {filteredData.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3">
                  {/* Week Title */}
                  <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    {group.weekTitle}
                  </h3>

                  {/* List of Files */}
                  <div className="space-y-2.5">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-stone-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-50 border border-stone-100">
                            <FileText className="h-5 w-5 text-stone-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                              {item.type} · {item.size} · {item.updatedAt}
                            </p>
                          </div>
                        </div>

                        {/* Download Button */}
                        <a
                          href={item.downloadUrl}
                          className="flex items-center gap-1.5 rounded-full border border-stone-800 bg-white px-4 py-2.5 text-xs font-semibold text-stone-1000 transition-colors hover:bg-stone-50 hover:text-stone-950"
                        >
                          <Download size={13} />
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State (กรณีค้นหาไม่พบ) */
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-stone-200/50 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 border border-stone-100">
                <Search size={20} className="text-stone-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                No materials match your search
              </h3>
              <p className="mt-1 text-xs text-stone-400">
                Try a different keyword, or clear the search to see everything.
              </p>
            </div>
          )}

        </div>
      </main>

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

    </div>
  );
}