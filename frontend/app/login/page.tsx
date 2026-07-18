'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้สำหรับเปลี่ยนหน้าของ Next.js
import { Mail, Lock, GraduationCap } from 'lucide-react';

// 1. กำหนดข้อมูลบัญชีตัวอย่างไว้ด้านนอก Component
const MOCK_ACCOUNTS = [
  {
    email: 'teacher@learning.com',
    password: 'teacher1234',
    role: 'teacher',
    redirectTo: '/teacher/dashboard', // พาไปหน้าอาจารย์
  },
  {
    email: 'student@learning.com',
    password: 'student1234',
    role: 'student',
    redirectTo: '/student/dashboard', // พาไปหน้านักศึกษา
  },
];

export default function LoginPage() {
  const router = useRouter();
  
  // 2. สร้าง State สำหรับเก็บข้อมูลที่ผู้ใช้พิมพ์ และข้อความ Error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 3. ฟังก์ชันจัดการตอนกดปุ่ม Log in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // ล้างข้อความ Error เก่าก่อนตรวจใหม่

    // ค้นหาบัญชีที่ตรงกับอีเมลและรหัสผ่านที่กรอกเข้ามา
    const matchedUser = MOCK_ACCOUNTS.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      // ถ้าเจอข้อมูลถูกต้อง ให้เปลี่ยนหน้าไปยังลิงก์ที่กำหนดตามบทบาท
      router.push(matchedUser.redirectTo);
    } else {
      // ถ้าข้อมูลไม่ตรง ให้แสดงข้อความเตือน
      setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fdfbf7] text-stone-900 relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Soft warm radial ambient glow wash */}
      <div 
        className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full pointer-events-none opacity-70 mix-blend-multiply filter blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.22) 0%, rgba(254,215,170,0.08) 50%, rgba(255,255,255,0) 70%)' }}
      />

      <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center">
        
        {/* Top Logo Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-stone-200/60 shadow-sm rounded-full pl-2 pr-4 py-1.5 mb-12">
          <span className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={14} className="text-orange-600" />
          </span>
          <span className="text-xs font-bold text-stone-800 tracking-wide">Learning Companion</span>
        </div>

        {/* Header Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight mb-2.5">
            Welcome back
          </h1>
          <p className="text-sm text-stone-400 font-normal">
            Prepare before class. Walk in ready.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          
          {/* ช่องกรอก Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-stone-600 pl-1">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 h-11 bg-white border border-stone-200 rounded-full text-sm placeholder:text-stone-300 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          {/* ช่องกรอก Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center pl-1">
              <label htmlFor="password" className="text-xs font-semibold text-stone-600">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Forgot password
              </a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 h-11 bg-white border border-stone-200 rounded-full text-sm placeholder:text-stone-300 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          {/* แจ้งเตือนข้อความ Error เมื่อกรอกผิดพลาด */}
          {errorMsg && (
            <p className="text-xs text-red-500 font-medium pl-2 animate-pulse">
              {errorMsg}
            </p>
          )}

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pl-1 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 accent-orange-600 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-stone-500 font-medium select-none cursor-pointer">
              Remember for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 bg-[#e65100] hover:bg-[#d84315] text-white font-semibold rounded-full shadow-lg shadow-orange-700/20 text-sm mt-4 transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-orange-500/20"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}