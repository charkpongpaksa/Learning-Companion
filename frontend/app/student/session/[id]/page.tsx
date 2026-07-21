'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Layers, 
  FileText, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronDown, 
  Send,
  Paperclip,
  X
} from 'lucide-react';
import { SESSIONS_BY_SUBJECT } from '../../dashboard/data'; // ปรับ path ให้ตรงกับที่เก็บ data.ts

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  image?: string; // รองรับรูปภาพในข้อความ
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ค้นหาข้อมูล Session จาก data.ts
  const allSessions = Object.values(SESSIONS_BY_SUBJECT).flat();
  const currentSession = allSessions.find((s) => String(s.id) === sessionId);

  // บทสนทนาเริ่มต้น
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: `Hello Somchai! 👋 Welcome to ${currentSession?.week || 'Week 3'} (${currentSession?.title || 'EC2 and IAM'}). Feel free to ask any questions or share your thoughts about this session!`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ฟังก์ชันเลือกรูปภาพ
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันส่งข้อความ
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedImage) return;

    setMessages((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        sender: 'user', 
        text: inputMessage,
        image: selectedImage || undefined
      },
    ]);

    setInputMessage('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const weekTitle = currentSession?.week || 'Week 3';
  const sessionTitle = currentSession?.title || 'EC2 and IAM';
  const description =
    currentSession?.description ||
    'Ask questions before class. Your gaps carry over to a short quiz.';

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-stone-200/60 flex flex-col justify-between fixed h-full z-20">
        <div>
          {/* Logo */}
          <div className="p-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e65100]" />
            <h1 className="text-md font-bold tracking-tight text-stone-950">Learning Companion</h1>
          </div>

          {/* Subject Selector */}
          <div className="px-3 mb-6">
            <div className="flex items-center justify-between p-2.5 bg-white border border-stone-200/80 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors select-none">
              <div className="text-left min-w-0 flex-1">
                <p className="text-[13px] font-bold text-stone-900 truncate pr-1">
                  CS332 · Basic Cloud Computing
                </p>
                <p className="text-[10px] text-stone-400 font-medium">2 subjects</p>
              </div>
              <ChevronDown size={16} className="text-stone-400 flex-shrink-0" />
            </div>
          </div>

          {/* Nav Items */}
          <nav className="px-3 space-y-5 text-left">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Student
              </p>
              <div className="space-y-0.5">
                <button
                suppressHydrationWarning
                  onClick={() => router.push('/student/dashboard')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold text-[#d84315] bg-[#fff3ed] rounded-lg text-left cursor-pointer"
                >
                  <Layers size={15} />
                  Sessions
                </button>
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <FileText size={15} className="text-stone-400" />
                  Materials
                </a>
                <a href="#" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <TrendingUp size={15} className="text-stone-400" />
                  My progress
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Student Profile */}
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
            onClick={() => router.push('/login')}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT */}
      <main 
        className="flex-1 pl-64 px-8 pt-12 pb-8 relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-5">
          
          {/* Header & Back Button */}
          <div>
            <button
            suppressHydrationWarning
              onClick={() => router.push("/student/dashboard")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-3 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} /> Your sessions
            </button>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  {weekTitle} — {sessionTitle}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  {description}
                </p>
              </div>

              {/* ปุ่มสีส้ม Take readiness quiz */}
              <button
              suppressHydrationWarning
                onClick={() => alert('Starting readiness quiz...')}
                className="self-start md:self-auto px-6 py-4 bg-[#e65100] hover:bg-[#d84315] text-white text-[13px] font-bold rounded-full shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex-shrink-0"
              >
                Take readiness quiz
              </button>
            </div>
          </div>

          {/* Chat Card Box */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[580px]">
            
            {/* Header inside chat */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h2 className="text-sm md:text-base font-bold text-stone-800">
                Ask the companion
              </h2>
              <span className="px-3 py-1 bg-[#fff3ed] text-[#d84315] rounded-full text-xs font-semibold border border-orange-100">
                Active
              </span>
            </div>

            {/* Messages list */}
            <div className="flex-1 space-y-5 overflow-y-auto py-6 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] text-xs md:text-sm leading-relaxed px-5 py-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#d84315] text-white rounded-tr-xs font-normal shadow-sm'
                        : 'bg-[#e8e5df] text-stone-800 rounded-tl-xs font-normal'
                    }`}
                  >
                    {/* หากมีรูปภาพแนบมากับข้อความ ให้แสดงรูป */}
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="attachment" 
                        className="max-h-48 rounded-xl mb-2.5 object-cover border border-black/10" 
                      />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Form & Input Box (พร้อมปุ่มแนบรูป) */}
            <form onSubmit={handleSend} className="relative flex flex-col gap-2 pt-2">
              
              {/* 🖼️ ภาพตัวอย่างพรีวิวก่อนส่ง ( Preview ) */}
              {selectedImage && (
                <div className="relative inline-block w-20 h-20 rounded-xl overflow-hidden border border-stone-300 shadow-sm ml-2">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                  suppressHydrationWarning
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 p-0.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <div className="relative flex items-center w-full">
                
                {/* 📎 Input file ที่ซ่อนไว้ */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                {/* 📎 ปุ่มไอคอนคลิปแนบรูป */}
                <button
                suppressHydrationWarning
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-3.5 text-stone-400 hover:text-[#d84315] transition-colors p-1 rounded-full cursor-pointer"
                  title="Attach image"
                >
                  <Paperclip size={18} />
                </button>

                {/* ช่องพิมพ์ข้อความ */}
                <input
                suppressHydrationWarning
                  type="text"
                  placeholder="Ask about EC2, IAM, or this week's material"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="w-full pl-12 pr-14 py-3.5 bg-[#e8e5df]/60 focus:bg-[#e8e5df] text-xs md:text-sm text-stone-800 placeholder-stone-400 rounded-full outline-none transition-all"
                />

                {/* ปุ่มกดส่ง */}
                <button
                suppressHydrationWarning
                  type="submit"
                  className="absolute right-2 w-9 h-9 bg-[#f48c5a] hover:bg-[#e65100] text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  <Send size={15} className="ml-0.5" />
                </button>
              </div>
            </form>

          </div>

        </div>
      </main>

    </div>
  );
}