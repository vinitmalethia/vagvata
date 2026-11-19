import React from 'react';
import { Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#102C20] text-[#F7F0DF] text-xs py-2.5 px-4 border-b border-[#C9A45C]/20 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left: Assurance */}
        <div className="hidden md:flex items-center space-x-2 text-[#DCE5D5]/80">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>100% Authentic • Ayush GMP Certified Quality</span>
        </div>

        {/* Center: Core Prompt Slogan */}
        <div className="flex items-center justify-center space-x-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span className="text-[#F7F0DF]">Rooted in Ayurveda • Crafted with Care</span>
          <span className="hidden sm:inline text-[#C9A45C]">•</span>
          <span className="hidden sm:inline text-[#DCE5D5]/90">Free Insured Shipping on Orders over ₹499</span>
        </div>

        {/* Right: Phone Consultation Contact */}
        <div className="hidden lg:flex items-center space-x-2 text-[#DCE5D5]/80">
          <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Vaidya Support: <a href="tel:+918059507909" className="hover:text-[#C9A45C] text-[#F7F0DF] transition-colors">+91 80595 07909</a></span>
        </div>
      </div>
    </div>
  );
}
