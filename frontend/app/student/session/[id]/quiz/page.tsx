'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { 
  Layers,
  TrendingUp,
  FileText, 
  LogOut, 
  ChevronDown,
  ChevronLeft,
  Users,
  Sliders,
  FolderOpen
} from 'lucide-react';

import { SUBJECTS } from '../../../dashboard/data';

// ประเภทโจทย์: 'mcq' (ปรนัย), 'boolean' (ถูก/ผิด), 'text' (ข้อเขียน)
type QuestionType = 'mcq' | 'boolean' | 'text';

interface Question {
  id: number;
  type: QuestionType;
  topic: string;
  question: string;
  options?: string[]; // สำหรับ mcq
}

// ข้อมูลตัวอย่างโจทย์ครบทั้ง 3 แบบ
const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'mcq',
    topic: 'IAM ROLES',
    question: 'Which AWS mechanism lets an EC2 instance securely obtain temporary permissions without storing access keys on the instance?',
    options: [
      'An IAM role attached to the instance profile',
      "An IAM user's access key pair saved in a config file",
      'A security group inbound rule',
      'A hardcoded secret in the application code',
    ],
  },
  {
    id: 2,
    type: 'boolean',
    topic: 'AWS SECURITY',
    question: 'By default, all inbound traffic to a newly created Security Group in AWS is allowed.',
    // True/False ใช้ตัวเลือกอัตโนมัติเป็น True / False
  },
  {
    id: 3,
    type: 'text',
    topic: 'EC2 COMPUTING',
    question: 'Briefly explain the primary difference between On-Demand and Spot EC2 instances.',
  },
  {
    id: 4,
    type: 'mcq',
    topic: 'EC2 BASICS',
    question: 'Which EC2 pricing option offers the highest discount for long-term committed workloads?',
    options: [
      'On-Demand Instances',
      'Reserved Instances / Savings Plans',
      'Spot Instances',
      'Dedicated Hosts',
    ],
  },
];

export default function ReadinessQuizPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id;
  // State สำหรับ Sidebar
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(SUBJECTS[0]);

  // State สำหรับ Quiz
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  
  // เก็บคำตอบรองรับทั้ง Index (ข้อเลือก/ถูกผิด) และ String (ข้อเขียน)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number | string }>({});

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
  const answeredCount = Object.keys(selectedAnswers).filter(
    (key) => String(selectedAnswers[Number(key)]).trim() !== ''
  ).length;

  const handleLogout = () => {
    router.push('/login');
  };

  // บันทึกคำตอบ (สำหรับ MCQ / Boolean)
  const handleSelectOption = (value: number | string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: value,
    }));
  };

  // บันทึกคำตอบ (สำหรับ ข้อเขียน)
  const handleTextChange = (text: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: text,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      alert('Quiz Submitted! 🎉');
      router.push('/student/dashboard');
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  // ตรวจสอบว่าข้อปัจจุบันตอบหรือยัง
  const currentAnswer = selectedAnswers[currentQuestionIdx];
  const isOptionSelected =
    currentAnswer !== undefined && String(currentAnswer).trim() !== '';

  return (
    <div className="flex min-h-screen bg-[#fdfbf7] text-stone-900 font-sans">
      
      {/* ================= 1. LEFT SIDEBAR ================= */}
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
              <div className="absolute left-3 right-3 top-full mt-1.5 bg-white border border-stone-200 shadow-xl rounded-xl z-30 overflow-hidden divide-y divide-stone-100">
                <div>
                  {SUBJECTS.map((subject: any) => {
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

          <nav className="px-3 space-y-5">
            <div>
              <p className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                Student
              </p>
              <div className="space-y-0.5">
                <Link href="/student/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-bold text-[#d84315] bg-[#fff3ed] rounded-lg">
                  <Layers size={15} />
                  Sessions
                </Link>
                <Link href="/student/material" className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-lg transition-colors">
                  <FileText size={15} className="text-stone-400" />
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

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="flex-1 pl-64 px-8 pt-12 pb-8 relative overflow-hidden"
      style={{
          background: 'radial-gradient(ellipse 1600px 600px at 70% 0%, #ffd4a8 0%, #ffdfb8 20%, #ffe9cc 40%, #fff2e0 60%, #ffebd6 100%)'
        }}
        >
        <div className="relative z-10 max-w-6xl mx-auto space-y-5">
          
          {/* Back Breadcrumb Link */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
            <ChevronLeft size={14} />
            Week 3 — EC2 and IAM
          </button>

          {/* Title Header */}
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Readiness quiz</h1>
            <p className="text-xs text-stone-400 mt-1">
              {totalQuestions} short questions based on tonight's chat.
            </p>
          </div>

          {/* QUIZ CARD CONTAINER */}
          <div className="bg-white border border-stone-200/70 rounded-3xl p-8 shadow-sm space-y-8">
            
            {/* 1. Progress Steps Bar */}
            <div className="space-y-2">
              <div 
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${totalQuestions}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: totalQuestions }).map((_, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const isAnswered =
                    selectedAnswers[idx] !== undefined &&
                    String(selectedAnswers[idx]).trim() !== '';

                  return (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'bg-[#e65100]'
                          : isAnswered
                          ? 'bg-orange-300'
                          : 'bg-stone-100'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Answered counter */}
              <p className="text-[11px] font-medium text-stone-400">
                {answeredCount} of {totalQuestions} answered
              </p>
            </div>

            {/* 2. Question Topic & Label */}
            <div>
              <p className="text-[11px] font-bold text-[#e65100] tracking-wider uppercase mb-2">
                {currentQ.topic} · QUESTION {currentQuestionIdx + 1} OF {totalQuestions}
              </p>
              <h2 className="text-lg font-bold text-stone-900 leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* 3. Dynamic Question Components */}
            <div className="space-y-3 pt-2">
              
              {/* --- TYPE 1: MULTIPLE CHOICE (MCQ) --- */}
              {currentQ.type === 'mcq' && currentQ.options && (
                currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIdx] === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-[#e65100] bg-[#fffaf7] shadow-sm'
                          : 'border-stone-400 bg-white hover:bg-stone-50/80'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'border-[#e65100] bg-white' : 'border-stone-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#e65100]" />}
                      </div>
                      <span className={`text-xs font-medium ${
                        isSelected ? 'text-stone-950 font-semibold' : 'text-stone-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                  );
                })
              )}

              {/* --- TYPE 2: TRUE / FALSE (BOOLEAN) --- */}
              {currentQ.type === 'boolean' && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'True', value: 'true' },
                    { label: 'False', value: 'false' },
                  ].map((item) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === item.value;

                    return (
                      <div
                        key={item.value}
                        onClick={() => handleSelectOption(item.value)}
                        className={`flex items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'border-[#e65100] bg-[#fffaf7] shadow-sm font-bold text-[#e65100]'
                            : 'border-stone-400 bg-white hover:bg-stone-50/80 text-stone-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'border-[#e65100] bg-white' : 'border-stone-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#e65100]" />}
                        </div>
                        <span className="text-sm font-semibold">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* --- TYPE 3: SHORT ANSWER (TEXT) --- */}
              {currentQ.type === 'text' && (
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    placeholder="Type your answer here..."
                    value={(selectedAnswers[currentQuestionIdx] as string) || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full p-4 border border-stone-400 rounded-2xl text-xs font-medium placeholder:text-stone-300 focus:outline-none focus:border-[#e65100] focus:ring-1 focus:ring-[#e65100] transition-all bg-stone-50/30"
                  />
                  <p className="text-[10px] text-stone-400 text-right">
                    Please provide a short summary or explanation.
                  </p>
                </div>
              )}

            </div>

            {/* 4. Action Buttons (Back & Next Question) */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 rounded-full border border-stone-950 text-stone-950 text-xs font-bold hover:bg-stone-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isOptionSelected}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isOptionSelected
                    ? 'bg-[#e65100] hover:bg-[#d84315] text-white cursor-pointer active:scale-[0.98]'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-70'
                }`}
              >
                {currentQuestionIdx === totalQuestions - 1 ? 'Submit' : 'Next question'}
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}