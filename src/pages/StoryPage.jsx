import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, CheckCircle2, ShieldCheck, Award, HeartHandshake, Compass } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="bg-[#173D2B] text-[#F7F0DF] min-h-screen py-16 sm:py-24 relative overflow-hidden">
      {/* Golden divine aura overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-[#DCE5D5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102C20] border border-[#C9A45C]/35 text-[#DFC282] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Our Sacred Lineage</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F0DF] leading-tight">
            The Living Wisdom of <br />
            <span className="italic font-normal text-[#DFC282] font-display">Acharya Vagbhata</span>
          </h1>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-6" />

          <p className="mt-6 text-base sm:text-lg text-[#DCE5D5]/90 font-light leading-relaxed">
            Bridging 1,500 years of classical Ayurvedic science with uncompromising contemporary quality. 
            Discover how Vagvat Ayurveda honors India’s greatest synthesis of healing wisdom.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Left: Sage Visual Representation */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-3 rounded-2xl border-2 border-[#C9A45C]/40 transform -rotate-1 pointer-events-none" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] bg-[#102C20] border border-[#C9A45C]/30">
                <img
                  src="/images/logo.jpg"
                  alt="Acharya Vagbhata - Vagvat Ayurveda Sacred Emblem"
                  className="w-full h-full object-contain p-6 sm:p-10 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102C20] via-transparent to-transparent opacity-80" />

                {/* Embedded Classical Shloka */}
                <div className="absolute bottom-6 inset-x-6 p-4 rounded-xl bg-[#102C20]/95 backdrop-blur-md border border-[#C9A45C]/40 text-center">
                  <p className="font-serif italic text-xs sm:text-sm text-[#DFC282] leading-relaxed">
                    "हिताहितं सुखं दुःखमायुस्तस्य हिताहितम्। मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते॥"
                  </p>
                  <p className="text-[10px] tracking-widest text-[#DCE5D5]/80 uppercase mt-2 font-medium">
                    — Ashtanga Hridaya, Sutrasthana (1.1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Historical Lineage */}
          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[#DCE5D5]/90 font-light leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F0DF]">
              Who Was Acharya Vagbhata?
            </h2>

            <p>
              In classical Ayurvedic medicine, three ancient masters are revered above all others—the 
              <strong> Brihat Trayi</strong> (The Great Triad): Acharya Charaka (the physician of internal medicine), 
              Acharya Sushruta (the father of surgery), and <strong>Acharya Vagbhata</strong> (the great synthesizer).
            </p>

            <p>
              Living in ancient India, Vagbhata authored two landmark treatises: the <em>Ashtanga Sangraha</em> and 
              the renowned <em>Ashtanga Hridaya</em> (literally "The Heart of the Eight Branches of Ayurveda"). 
              Recognizing that the earlier monumental texts were vast and poetic, Vagbhata distilled their supreme clinical 
              practicality into crystal-clear verses that every practicing Vaidya could administer with precision.
            </p>

            <p>
              Vagbhata taught that true health (<em>Swasthya</em>) is the radiant state wherein Doshas (energies), 
              Dhatus (vital tissues), Malas (elimination), and Agni (digestive fire) function in seamless equilibrium, 
              accompanied by a serene mind and vibrant sensory awareness.
            </p>

            <div className="p-4 rounded-xl bg-[#102C20] border-l-4 border-[#C9A45C] text-xs sm:text-sm italic font-serif text-[#DFC282]">
              "We took our name from Acharya Vagbhata not as mere branding, but as a sacred vow to uphold 
              authentic classical formulations without dilution, shortcuts, or synthetic compromises."
            </div>
          </div>

        </div>

        {/* 4 Pillars of Classical Bheshaja Kalpana */}
        <div className="mb-24 pt-12 border-t border-[#C9A45C]/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#DFC282] font-semibold">
              Sacred Pharmaceutical Alchemy
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#F7F0DF] mt-1">
              How Vagvat Formulations Are Prepared
            </h3>
            <p className="text-xs sm:text-sm text-[#DCE5D5]/70 mt-2">
              Unlike commercial products produced in hours using synthetic extracts, our preparations respect classical astrological, seasonal, and decoction timings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#173D2B] border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] font-serif font-bold text-lg">
                1
              </div>
              <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Kashaya Decoctions</h4>
              <p className="text-xs text-[#DCE5D5]/70 leading-relaxed">
                Herbs are simmered slowly in sixteen parts of water until reduced to one-fourth, extracting water-soluble phytosterols in uncompromised ratios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#173D2B] border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] font-serif font-bold text-lg">
                2
              </div>
              <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Bhavana Trituration</h4>
              <p className="text-xs text-[#DCE5D5]/70 leading-relaxed">
                Herbal powders undergo repeated wet grinding with fresh botanical juices, transferring cellular prana and multiplying therapeutic bio-potency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#173D2B] border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] font-serif font-bold text-lg">
                3
              </div>
              <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Swarna Bhasma Calx</h4>
              <p className="text-xs text-[#DCE5D5]/70 leading-relaxed">
                Pure 24K gold undergoes sacred Shodhana (purification) and Marana (nano-calcination) through dozens of Puta fire cycles until safely bio-available.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#173D2B] border border-[#C9A45C]/40 flex items-center justify-center text-[#C9A45C] font-serif font-bold text-lg">
                4
              </div>
              <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Rigorous Lab Testing</h4>
              <p className="text-xs text-[#DCE5D5]/70 leading-relaxed">
                Every finished batch is screened via ICP-MS testing for heavy metal limits (lead, mercury, cadmium, arsenic) compliant with Ayush & WHO safety standards.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Commitments Checklist */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#102C20] border border-[#C9A45C]/35 text-center max-w-4xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#173D2B] border border-[#C9A45C] text-[#C9A45C] flex items-center justify-center mx-auto text-2xl font-serif">
            ॐ
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F0DF]">
            The Vagvat Promise to Every Seeker
          </h3>
          <p className="text-xs sm:text-sm text-[#DCE5D5]/80 max-w-2xl mx-auto">
            We will never sell diluted formulations, synthetic hormones, hidden chemicals, or adulterated resins. 
            When you hold a Vagvat bottle, you hold the untainted essence of classical Indian Ayurveda.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-semibold uppercase tracking-wider text-[#DFC282]">
            <div className="p-3 rounded-lg bg-[#173D2B]/80 border border-[#C9A45C]/20">100% Classical</div>
            <div className="p-3 rounded-lg bg-[#173D2B]/80 border border-[#C9A45C]/20">Ayush GMP Certified</div>
            <div className="p-3 rounded-lg bg-[#173D2B]/80 border border-[#C9A45C]/20">Zero Chemicals</div>
            <div className="p-3 rounded-lg bg-[#173D2B]/80 border border-[#C9A45C]/20">Doctor Verified</div>
          </div>
        </div>

      </div>
    </div>
  );
}
