import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Shield, Leaf, HeartHandshake, CheckCircle2, Flame, Wind, Droplets } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function HomePage({ onSelectProduct, onAddToCart, onOpenDoshaQuiz }) {
  // Flagship 6 formulations for the homepage
  const featuredProducts = PRODUCTS.slice(0, 6);

  return (
    <div className="bg-[#F7F0DF] text-[#263629]">
      
      {/* 1. Hero Section with Stone Platform Showcase */}
      <HeroSection
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
      />

      {/* 2. Floating Golden Trust Strip */}
      <div className="bg-[#102C20] text-[#DFC282] py-4 border-y border-[#C9A45C]/30 relative z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs tracking-wider uppercase font-semibold">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#C9A45C]">✦</span>
              <span>100% Classical Shastriya Formulations</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#C9A45C]">✦</span>
              <span>Ayush GMP Certified & Tested</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#C9A45C]">✦</span>
              <span>Free Insured Delivery Across India</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-[#C9A45C]">✦</span>
              <span>Personalized Vaidya Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Featured Products Collection */}
      <section id="products" className="pt-8 sm:pt-10 pb-16 sm:pb-20 bg-[#F7F0DF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Featured Apothecary</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173D2B]">
                Master Formulations
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5B4D] mt-1 max-w-xl">
                Classical remedies prepared with genuine Swarna Bhasma, wildcrafted Himalayan herbs, and zero chemical fillers.
              </p>
            </div>

            <Link
              to="/shop"
              className="mt-4 md:mt-0 px-6 py-3 rounded-md bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shadow hover:scale-105 shrink-0"
            >
              <span>VIEW ALL IN SHOP ({PRODUCTS.length})</span>
              <ArrowRight className="w-4 h-4 text-[#C9A45C]" />
            </Link>
          </div>

          {/* Grid of Featured Formulations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full border-2 border-[#173D2B] text-[#173D2B] hover:bg-[#173D2B] hover:text-[#F7F0DF] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Explore Complete Store Catalog (11 Formulations)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. VISUAL SHOWCASE 1: The Ayurvedic Sanctuary & Ancient Apothecary Rituals */}
      <section className="py-20 sm:py-24 bg-[#173D2B] text-[#F7F0DF] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DCE5D5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Image Column: The Shirodhara, Potali, Amber Elixirs Sanctuary Photo */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Gold Outer Ornamental Border */}
                <div className="absolute -inset-3 rounded-3xl border-2 border-[#C9A45C]/40 transform -rotate-1 pointer-events-none" />
                
                {/* Main Sanctuary Photo Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/4] sm:aspect-[4/3] lg:aspect-[4/4] bg-[#102C20] border border-[#C9A45C]/30">
                  <img
                    src="/images/ayurvedic-sanctuary.jpg"
                    alt="Ayurvedic Sanctuary - Shirodhara Pot, Potali, Amber Elixirs & Incense"
                    className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102C20]/80 via-transparent to-transparent" />
                  
                  {/* Floating Ritual Plaque */}
                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-xl bg-[#102C20]/90 backdrop-blur-md border border-[#C9A45C]/35">
                    <span className="text-[10px] tracking-widest text-[#DFC282] uppercase font-bold block">
                      Ancient Apothecary Sanctuary
                    </span>
                    <p className="text-xs text-[#F7F0DF] font-serif italic mt-0.5">
                      "Shirodhara, warm Potali fomentation, and amber-preserved botanical rasayanas."
                    </p>
                  </div>
                </div>

                {/* Floating Gold Quality Seal */}
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[#102C20] border-2 border-[#C9A45C] flex flex-col items-center justify-center p-2 text-center shadow-2xl hidden sm:flex">
                  <span className="text-[#C9A45C] text-xl font-serif font-bold">100%</span>
                  <span className="text-[8px] uppercase tracking-wider text-[#F7F0DF] font-bold">Pure Prana</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Narrative of the Rituals */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#102C20] border border-[#C9A45C]/35 text-[#DFC282] text-xs font-semibold uppercase tracking-[0.25em] w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Sanctuary of Healing</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F7F0DF] tracking-tight leading-tight">
                Where Ancient Rituals Meet <br />
                <span className="italic font-normal text-[#DFC282] font-display">
                  Pristine Apothecary Standards
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#DCE5D5]/90 font-light leading-relaxed">
                In authentic Ayurveda, healing is sacred. The gentle stream of medicinal oils in 
                <strong> Shirodhara</strong> calms aggravated Prana Vata; heated herbal <strong>Potali</strong> poultices 
                dispel deep neuromuscular inflammation; and slow-cured elixirs preserved in dark amber bottles shield 
                delicate phytosterols from light degradation.
              </p>

              {/* Ritual Highlights */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#102C20]/70 border border-[#C9A45C]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#173D2B] border border-[#C9A45C]/40 text-[#DFC282] flex items-center justify-center shrink-0 font-serif font-bold">
                    I
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#F7F0DF]">Bhavana & Slow Decoctions</h4>
                    <p className="text-xs text-[#DCE5D5]/70 mt-0.5">
                      Herbs are simmered in sixteen parts mountain water, repeatedly infused with fresh botanical juices.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#102C20]/70 border border-[#C9A45C]/20">
                  <div className="w-8 h-8 rounded-lg bg-[#173D2B] border border-[#C9A45C]/40 text-[#DFC282] flex items-center justify-center shrink-0 font-serif font-bold">
                    II
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#F7F0DF]">Natural Solar Curing (Surya Tapi)</h4>
                    <p className="text-xs text-[#DCE5D5]/70 mt-0.5">
                      Resins and botanicals are sun-cured naturally, retaining their volatile aromatic oils and prana.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/story"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow hover:scale-105"
                >
                  <span>Explore Our Full Heritage Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. VISUAL SHOWCASE 2: Interactive Tridosha Balance (Featuring Meditating Yogi Cosmic Silhouette) */}
      <section className="py-20 sm:py-24 bg-[#F7F0DF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              <Compass className="w-3.5 h-3.5 text-[#173D2B]" />
              <span>Prakriti & Tridosha Harmony</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173D2B] tracking-tight">
              Understand Your Natural Constitution
            </h2>

            <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

            <p className="mt-4 text-sm sm:text-base text-[#4A5B4D] font-light leading-relaxed">
              Every individual is born with a unique biological constitution—Prakriti—governed by the three 
              universal bio-energies: <strong>Vata</strong> (Air & Ether), <strong>Pitta</strong> (Fire & Water), 
              and <strong>Kapha</strong> (Earth & Water).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Meditating Yogi Double-Exposure Artwork */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="relative w-full max-w-sm aspect-[3/4] p-4 rounded-3xl bg-white border border-[#C9A45C]/40 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src="/images/dosha-silhouette.jpg"
                  alt="Meditating Yogi Double Exposure with Vata, Pitta, Kapha Tridosha"
                  className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Cosmic Tag */}
                <div className="absolute bottom-3 inset-x-6 text-center py-1.5 px-3 rounded-full bg-[#102C20]/90 text-[#DFC282] text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm border border-[#C9A45C]/30">
                  Microcosm Reflects the Macrocosm
                </div>
              </div>
            </motion.div>

            {/* Right: The 3 Doshas Breakdown & Quiz Trigger */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Vata Card */}
              <div className="p-5 rounded-2xl bg-white border-l-4 border-teal-500 border-t border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-teal-500" />
                    <h3 className="font-serif text-lg font-bold text-[#173D2B]">VATA • वात</h3>
                    <span className="text-[11px] text-[#79583B] italic">(Air & Space / Ether)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800">
                    Movement & Mind
                  </span>
                </div>
                <p className="text-xs text-[#4A5B4D] mt-2 leading-relaxed">
                  Controls nerve impulses, breathing, and circulation. When out of balance, causes anxiety, erratic digestion, chronic gas, and dry joints.
                </p>
              </div>

              {/* Pitta Card */}
              <div className="p-5 rounded-2xl bg-white border-l-4 border-rose-500 border-t border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <h3 className="font-serif text-lg font-bold text-[#173D2B]">PITTA • पित्त</h3>
                    <span className="text-[11px] text-[#79583B] italic">(Fire & Water)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800">
                    Digestion & Heat
                  </span>
                </div>
                <p className="text-xs text-[#4A5B4D] mt-2 leading-relaxed">
                  Governs cellular metabolism, enzymes, body heat, and intellect. When aggravated, manifests as acidity, skin inflammation, and irritability.
                </p>
              </div>

              {/* Kapha Card */}
              <div className="p-5 rounded-2xl bg-white border-l-4 border-emerald-600 border-t border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <h3 className="font-serif text-lg font-bold text-[#173D2B]">KAPHA • कफ</h3>
                    <span className="text-[11px] text-[#79583B] italic">(Earth & Water)</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    Structure & Lubrication
                  </span>
                </div>
                <p className="text-xs text-[#4A5B4D] mt-2 leading-relaxed">
                  Provides physical stamina, joint lubrication, mucosal immunity, and calm endurance. When sluggish, leads to congestion, weight gain, and lethargy.
                </p>
              </div>

              {/* Quiz Action Callout */}
              <div className="p-6 rounded-2xl bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C]/35 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#DFC282]">
                    Unsure which Dosha dominates your body right now?
                  </h4>
                  <p className="text-xs text-[#DCE5D5]/80 mt-0.5">
                    Take our 60-second diagnostic guide to discover your Prakriti and tailored herbal remedy.
                  </p>
                </div>

                <button
                  onClick={onOpenDoshaQuiz}
                  className="px-6 py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow hover:scale-105 shrink-0 cursor-pointer"
                >
                  START 60-SEC QUIZ
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
