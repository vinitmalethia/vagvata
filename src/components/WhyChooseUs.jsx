import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Sprout, HeartHandshake, FlaskConical, Award } from 'lucide-react';

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Authentic Classical Science',
      description: 'Faithfully derived from Acharya Vagbhata’s teachings. We preserve exact herbal ratios, bhavana triturations, and decoction timings rather than rushed modern short-cuts.'
    },
    {
      icon: Sprout,
      title: 'Wildcrafted Himalayan Botanicals',
      description: 'Sourced from organic micro-farms and high-altitude Himalayan valleys where botanical herbs develop maximum active phytosterols and medicinal vitality.'
    },
    {
      icon: ShieldCheck,
      title: 'Ayush & GMP Certified',
      description: 'Manufactured in state-of-the-art Ayush-licensed facilities. Every batch undergoes stringent HPLC testing to ensure freedom from heavy metals, pesticides, and microbial contaminants.'
    },
    {
      icon: FlaskConical,
      title: '100% Chemical-Free Purity',
      description: 'Zero artificial preservatives, parabens, synthetic colors, or chemical fillers. What you ingest is solely pure plant prana and healing earth minerals.'
    },
    {
      icon: HeartHandshake,
      title: 'Personalized Vaidya Care',
      description: 'Ayurveda is inherently individual. Our qualified BAMS Ayurvedic physicians assist you in understanding your Prakriti (constitution) and choosing the exact remedy.'
    },
    {
      icon: Award,
      title: 'Holistic Bio-Availability',
      description: 'Our formulations leverage synergistic Yogavahi herbs (like Pippali and Triphala) that act as natural bio-enhancers, ensuring optimal cellular absorption.'
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-[#DCE5D5]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#173D2B] text-[#DFC282] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>The Vagvat Standard</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Why Choose Vagvat Ayurveda
          </h2>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#4A5B4D] font-light leading-relaxed">
            In an industry flooded with diluted extracts and synthetic shortcuts, we uphold 
            uncompromising fidelity to ancient healing traditions and rigorous modern purity.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-xl p-8 bg-white border border-[#C9A45C]/30 shadow-sm hover:shadow-xl hover:border-[#C9A45C] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F0DF] border border-[#C9A45C]/40 flex items-center justify-center text-[#173D2B] group-hover:bg-[#173D2B] group-hover:text-[#DFC282] transition-colors duration-300 shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#173D2B] mt-6 group-hover:text-[#C9A45C] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm text-[#4A5B4D] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold tracking-wider text-[#79583B] uppercase">
                  <span>Guaranteed Quality</span>
                  <span className="ml-auto text-[#C9A45C]">✦</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
