import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function BrandStory() {
  return (
    <section id="story" className="py-24 bg-[#173D2B] text-[#F7F0DF] relative overflow-hidden">
      {/* Decorative botanical background blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DCE5D5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Story Artwork */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Gold Border Frame */}
              <div className="absolute -inset-3 rounded-2xl border-2 border-[#C9A45C]/40 transform -rotate-1 pointer-events-none" />
              
              {/* Main Image Container */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/5] bg-[#102C20]">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
                  alt="Ancient Ayurvedic Botanicals Preparation"
                  className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102C20] via-transparent to-transparent opacity-80" />
                
                {/* Embedded Quote Plaque */}
                <div className="absolute bottom-6 inset-x-6 p-4 rounded-lg bg-[#102C20]/90 backdrop-blur-md border border-[#C9A45C]/30 text-center">
                  <p className="font-serif italic text-xs text-[#DFC282]">
                    "हिताहितं सुखं दुःखमायुस्तस्य हिताहितम्। मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते॥"
                  </p>
                  <p className="text-[10px] tracking-widest text-[#DCE5D5]/80 uppercase mt-1">
                    — Ashtanga Hridaya, Acharya Vagbhata
                  </p>
                </div>
              </div>

              {/* Floating Quality Seal */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-[#102C20] border-2 border-[#C9A45C] flex flex-col items-center justify-center p-2 text-center shadow-xl hidden sm:flex">
                <span className="text-[#C9A45C] text-lg font-serif font-bold">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-[#F7F0DF] font-semibold">Purity Guaranteed</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102C20] border border-[#C9A45C]/30 text-[#DFC282] text-xs font-semibold uppercase tracking-[0.25em] w-fit mb-4">
              <BookOpen className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Our Sacred Lineage</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F0DF] tracking-tight leading-tight">
              Honoring the Timeless Teachings of <span className="text-[#DFC282] italic font-display">Acharya Vagbhata</span>
            </h2>

            <div className="w-20 h-1 bg-[#C9A45C] mt-4 mb-6" />

            <div className="space-y-4 text-sm sm:text-base text-[#DCE5D5]/90 font-light leading-relaxed">
              <p>
                <strong>Vagvat Ayurveda</strong> was conceived with a singular, noble devotion: to resurrect 
                the profound medical wisdom compiled by Acharya Vagbhata in his classical treatises, the 
                <em> Ashtanga Hridaya</em> and <em>Ashtanga Sangraha</em>.
              </p>
              <p>
                Recognized across the centuries as the most lucid and clinically practical synthesis 
                of Ayurvedic medicine, Vagbhata's core philosophy emphasizes that true health (*Swasthya*) 
                is not merely the absence of disease, but the radiant harmony of Doshas (biological energies), 
                Dhatus (vital tissues), and Agni (digestive fire).
              </p>
              <p>
                We do not compromise. While modern mass manufacturers rely on synthetic binders, quick 
                chemical extractions, and cost-cutting preservatives, every single Vagvat formulation is prepared 
                through authentic classical *Bheshaja Kalpana*—slow decoctions, natural sun-drying, and repeated 
                herbal titrations.
              </p>
            </div>

            {/* Core Commitments List */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#C9A45C]/20">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#F7F0DF]">Authentic Classical Text Roots</h4>
                  <p className="text-xs text-[#DCE5D5]/70 mt-0.5">Formulations directly referenced from classical treatises.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#F7F0DF]">Heavy Metal Safety Certified</h4>
                  <p className="text-xs text-[#DCE5D5]/70 mt-0.5">Every batch tested for lead, cadmium, mercury, and arsenic.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#F7F0DF]">Wildcrafted Botanical Harvests</h4>
                  <p className="text-xs text-[#DCE5D5]/70 mt-0.5">Herbs harvested at their peak astrological & seasonal potency.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#F7F0DF]">Complete Transparency</h4>
                  <p className="text-xs text-[#DCE5D5]/70 mt-0.5">Clear labeling with full botanical ingredients and zero hidden fillers.</p>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
