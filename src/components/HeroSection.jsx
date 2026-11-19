import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Shield, Leaf, HeartHandshake, Compass } from 'lucide-react';
import StonePlatformShowcase from './StonePlatformShowcase';

export default function HeroSection({ onSelectProduct, onAddToCart }) {
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/shop';
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-[#173D2B] text-[#F7F0DF] pt-8 sm:pt-12 pb-6 sm:pb-8">
      {/* Background Forest & Botanical Canvas Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=80')`,
          mixBlendMode: 'luminosity'
        }}
      />

      {/* Subtle Golden Botanical Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#DCE5D5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Header: Grid with Left-Shifted Text & Right-Side Botanical Meditation Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 pt-2">
          
          {/* Left Column (Span 7): Shifted Leftward Hero Text */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Top Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#102C20]/80 border border-[#C9A45C]/40 text-[#DFC282] text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] shadow-sm backdrop-blur-sm mb-4 sm:mb-5 max-w-full text-center"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A45C] shrink-0" />
              <span className="truncate">Rooted in Ashtanga Hridaya • 100% Classical Formulas</span>
            </motion.div>

            {/* Main Hero Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#F7F0DF] leading-[1.15] sm:leading-[1.12]"
            >
              Ancient Wisdom. <br />
              <span className="italic font-normal text-[#DFC282] font-display">
                Everyday Wellness.
              </span>
            </motion.h1>

            {/* Subtitle / Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#DCE5D5]/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Crafted under the enduring wisdom of Acharya Vagbhata. Pure Himalayan botanicals, 
              time-honored Ayurvedic alchemy, and uncompromising modern standards for true holistic balance.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-[#C9A45C]/30 hover:scale-[1.02] flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              <Link
                to="/story"
                className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-[#DFC282]/50 hover:border-[#DFC282] text-[#F7F0DF] hover:text-[#DFC282] hover:bg-white/5 font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 backdrop-blur-sm text-center cursor-pointer"
              >
                OUR HERITAGE STORY
              </Link>
            </motion.div>

            {/* Quick Authentic Trust Highlights */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 pt-6 border-t border-[#C9A45C]/20 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-[#DCE5D5]/75 font-light"
            >
              <span className="flex items-center space-x-1.5">
                <span className="text-[#C9A45C]">✦</span>
                <span>100% Classical Shastriya</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="text-[#C9A45C]">✦</span>
                <span>Wildcrafted Herbs</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="text-[#C9A45C]">✦</span>
                <span>Pure Swarna Bhasma</span>
              </span>
            </motion.div>

          </div>

          {/* Right Column (Span 5): Botanical Meditation Artwork with Ambient Animations */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center relative py-4 overflow-hidden lg:overflow-visible"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-sm lg:max-w-md mx-auto">
              
              {/* Animation 1: Ambient Breathing Glow Halo */}
              <motion.div 
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.7, 0.35]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A45C]/30 via-[#DCE5D5]/20 to-[#102C20]/40 blur-3xl pointer-events-none"
              />

              {/* Animation 2: Sacred Rotating Celestial Geometry Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 sm:-inset-8 border border-dashed border-[#C9A45C]/35 rounded-full pointer-events-none flex items-center justify-center"
              >
                {/* Orbital Golden Pearl Beads */}
                <div className="absolute top-0 w-2.5 h-2.5 rounded-full bg-[#C9A45C] shadow-[0_0_10px_#C9A45C]" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-[#DFC282] shadow-[0_0_8px_#DFC282]" />
                <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-[#DCE5D5] shadow-[0_0_6px_#DCE5D5]" />
                <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-[#DCE5D5] shadow-[0_0_6px_#DCE5D5]" />
              </motion.div>

              {/* Animation 3: Secondary Counter-Rotating Ring */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 sm:-inset-4 border border-[#C9A45C]/20 rounded-full pointer-events-none"
              />

              {/* Animation 4: Floating Levitating Arched Frame Container */}
              <motion.div
                animate={{
                  y: [-8, 8, -8]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative rounded-t-[140px] sm:rounded-t-[160px] rounded-b-3xl overflow-hidden p-2 sm:p-2.5 bg-gradient-to-b from-[#C9A45C]/50 via-[#102C20] to-[#102C20] border-2 border-[#C9A45C]/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
              >
                {/* The Image Container with subtle inner glow */}
                <div className="rounded-t-[130px] sm:rounded-t-[150px] rounded-b-2xl overflow-hidden bg-[#F7F0DF] relative aspect-[3/4] flex items-center justify-center shadow-inner">
                  <img
                    src="/images/botanical-meditation.jpg"
                    alt="Ayurvedic Botanical Tree of Life Meditating Yogi Figure"
                    className="w-full h-full object-cover filter brightness-100 hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gentle gradient vignette at bottom to ground the frame */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#102C20]/80 via-[#102C20]/20 to-transparent pointer-events-none" />

                  {/* Floating Plaque at Bottom of Frame */}
                  <div className="absolute bottom-3 inset-x-4 p-2.5 rounded-xl bg-[#102C20]/90 backdrop-blur-md border border-[#C9A45C]/40 text-center shadow-lg">
                    <span className="text-[10px] sm:text-[11px] tracking-widest text-[#DFC282] uppercase font-bold flex items-center justify-center space-x-1.5">
                      <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                      <span>Living Botanical Prana</span>
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-[#DCE5D5]/80 font-light mt-0.5">
                      Harmonizing Mind, Body & the Natural World
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Animation 5: Floating Top-Right Mini Badge */}
              <motion.div
                animate={{
                  y: [4, -6, 4]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-3 -right-2 sm:-right-4 px-3 py-1.5 rounded-full bg-[#102C20] border border-[#C9A45C] text-[#DFC282] text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-xl flex items-center space-x-1.5"
              >
                <Leaf className="w-3 h-3 text-[#C9A45C]" />
                <span>Prakriti Harmony</span>
              </motion.div>

            </div>
          </motion.div>

        </div>

        {/* Natural Stone Platform Showcase Displaying All Six Products */}
        <div className="mt-6 sm:mt-8">
          <StonePlatformShowcase 
            onSelectProduct={onSelectProduct} 
            onAddToCart={onAddToCart} 
          />
        </div>

      </div>
    </section>
  );
}
