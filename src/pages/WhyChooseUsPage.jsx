import React from 'react';
import { ShieldCheck, Sparkles, Sprout, HeartHandshake, FlaskConical, Award, CheckCircle } from 'lucide-react';
import WhyChooseUs from '../components/WhyChooseUs';

export default function WhyChooseUsPage() {
  return (
    <div className="py-12 bg-[#F7F0DF] min-h-screen">
      <WhyChooseUs />

      {/* Deep-dive Quality Assurance Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C]/35">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-[#DFC282] font-semibold">
              The 5-Fold Purity Assurance
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#F7F0DF] mt-2">
              How Every Vagvat Batch Is Verified Before Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-[#DCE5D5]/80 mt-3 leading-relaxed">
              In modern markets, herbal adulteration is prevalent. We protect your sacred health through unyielding botanical verification, micro-elemental testing, and classical authenticity.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#DFC282] flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Heavy Metal Screening (ICP-MS)</span>
              </span>
              <p className="text-[#DCE5D5]/70">Zero toxic lead, cadmium, mercury, or arsenic above international safety ceilings.</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#DFC282] flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Bio-Active HPLC Standardization</span>
              </span>
              <p className="text-[#DCE5D5]/70">Ensures active phytosterols (withanolides, fulvic acid, charantin) are at therapeutic potency.</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-[#DFC282] flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Vegetarian Shells</span>
              </span>
              <p className="text-[#DCE5D5]/70">Zero animal gelatin. All capsules are plant-cellulose based and easy on digestion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
