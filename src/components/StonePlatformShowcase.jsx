import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../data/products';
import ProductVisual from './ProductVisual';

export default function StonePlatformShowcase({ onSelectProduct }) {
  // 6 Flagship Star Formulations spanning Strength, Vitality, Digestion & Women's Health
  const featuredIds = [
    'vajra-shakti-premium',
    'mall-yoddha',
    'shilajit-resin',
    'kosht-sudha',
    'nari-santulan',
    'yonidhara'
  ];

  const featuredProducts = featuredIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-10 px-4 select-none">
      {/* Subtle divine golden aura and forest light beams */}
      <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[380px] bg-[#C9A45C]/15 rounded-full blur-3xl" />
        <div className="w-[400px] h-[320px] bg-[#DCE5D5]/20 rounded-full blur-2xl" />
      </div>

      {/* Floating botanical sprigs & golden sparkles */}
      <div className="absolute top-2 left-6 text-2xl opacity-75 animate-pulse">🌿</div>
      <div className="absolute top-8 right-8 text-xl opacity-70 animate-bounce" style={{ animationDuration: '4s' }}>✨</div>
      <div className="absolute bottom-16 left-8 text-xl opacity-50">🌱</div>

      {/* The 6 Master Formulations Standing on the Podium (Swipeable on mobile, Panoramic on desktop) */}
      <div className="relative z-10 flex sm:grid sm:grid-cols-6 gap-3 sm:gap-4 items-end justify-start sm:justify-items-center overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 px-2 sm:px-0 no-scrollbar snap-x mb-[-20px] sm:mb-[-26px]">
        {featuredProducts.map((product, idx) => {
          // Subtle elevation rhythm for natural organic elegance
          const elevation =
            idx === 1 || idx === 2
              ? '-translate-y-3 sm:-translate-y-6'
              : idx === 0 || idx === 3
              ? '-translate-y-1 sm:-translate-y-2'
              : '';

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.25 } }}
              onClick={() => onSelectProduct(product)}
              className={`group cursor-pointer flex flex-col items-center shrink-0 w-[115px] sm:w-full sm:max-w-[155px] snap-center ${elevation}`}
            >
              {/* Product Badge / Pill */}
              <div 
                className="mb-1.5 sm:mb-2 px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wider text-white uppercase shadow-md transition-transform duration-300 group-hover:scale-105 truncate max-w-full text-center"
                style={{ backgroundColor: product.colorHex }}
              >
                {product.name}
              </div>

              {/* Product Visual Container with Real Box Photo */}
              <div className="relative w-full aspect-[9/16] max-h-[190px] sm:max-h-[260px] flex items-center justify-center drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_20px_30px_rgba(201,164,92,0.35)]">
                <ProductVisual product={product} className="w-full h-full" showShadow={false} />
              </div>

              {/* Price & Subtitle */}
              <div className="mt-2 sm:mt-3 text-center">
                <span className="text-xs font-bold text-[#F7F0DF] drop-shadow-sm">₹{product.price}</span>
                <span className="ml-1 text-[9px] sm:text-[10px] text-[#DFC282]/80 line-through">₹{product.originalPrice}</span>
                <span className="block text-[8px] sm:text-[9px] text-[#DCE5D5]/80 font-medium truncate max-w-[110px] sm:max-w-[120px]">
                  {product.strength || product.capsuleCount}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Swipe Cue */}
      <div className="sm:hidden text-center text-[10px] text-[#DFC282]/70 tracking-widest uppercase mb-1 font-light">
        ‹ Swipe to view all 6 flagship formulations ›
      </div>

      {/* The Natural Stone Platform / Pedestal */}
      <div className="relative z-0 w-full">
        {/* Stone Top Surface */}
        <div 
          className="w-full h-10 sm:h-14 rounded-[50%] mx-auto shadow-2xl relative border-t border-[#DFC282]/50"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #E8DFC8 0%, #D8CBB2 45%, #B8A68B 90%, #8C775D 100%)',
            boxShadow: '0 25px 50px rgba(16, 44, 32, 0.35), inset 0 2px 5px rgba(255, 255, 255, 0.5)'
          }}
        >
          {/* Natural Stone Fleck Texture */}
          <div className="absolute inset-0 opacity-20 rounded-[50%] bg-[radial-gradient(#173D2B_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-3 bg-white/15 rounded-full blur-sm" />
        </div>

        {/* Stone Slab Depth Rim */}
        <div 
          className="w-[96%] h-7 sm:h-10 mx-auto -mt-5 sm:-mt-6 rounded-b-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #9C866D 0%, #7A654F 50%, #544434 100%)',
            boxShadow: '0 30px 45px -10px rgba(16, 44, 32, 0.5)'
          }}
        >
          {/* Classical Sanskrit Inscription */}
          <div className="absolute inset-x-0 bottom-1 sm:bottom-1.5 flex items-center justify-center space-x-3 sm:space-x-6 text-[8px] sm:text-[10px] tracking-widest text-[#E8DFC8]/60 uppercase font-serif">
            <span>• सत्यम् •</span>
            <span>• शुद्धम् •</span>
            <span>• सुन्दरम् •</span>
            <span>• आरोग्याय •</span>
          </div>
        </div>

        {/* Ground Foliage & Soft Shadow */}
        <div className="w-[90%] h-6 sm:h-7 mx-auto -mt-2 bg-[#102C20]/40 rounded-full blur-md" />
      </div>

      {/* Caption under pedestal */}
      <p className="relative z-10 text-center text-xs tracking-[0.25em] text-[#DFC282] uppercase mt-4 font-medium font-serif">
        Vagvat Master Formulations • Classical Ayurvedic Heritage
      </p>
    </div>
  );
}
