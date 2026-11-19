import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductVisual from './ProductVisual';

export default function StonePlatformShowcase({ onSelectProduct, onAddToCart }) {
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const total = featuredProducts.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const activeProduct = featuredProducts[activeIndex] || featuredProducts[0];

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(activeProduct, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 select-none">
      
      {/* Subtle divine golden aura and forest light beams */}
      <div className="absolute inset-0 -top-12 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[380px] bg-[#C9A45C]/15 rounded-full blur-3xl" />
        <div className="w-[400px] h-[320px] bg-[#DCE5D5]/20 rounded-full blur-2xl" />
      </div>

      {/* Floating botanical sprigs & golden sparkles */}
      <div className="absolute top-2 left-6 text-2xl opacity-75 animate-pulse hidden sm:block">🌿</div>
      <div className="absolute top-8 right-8 text-xl opacity-70 animate-bounce hidden sm:block" style={{ animationDuration: '4s' }}>✨</div>

      {/* Section Sub-header / Instruction */}
      <div className="text-center mb-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#DFC282] font-semibold">
          Interactive 3D Formulation Carousel
        </span>
      </div>

      {/* 3D ROUNDED SCROLL CAROUSEL STAGE */}
      <div 
        className="relative w-full h-[340px] sm:h-[400px] flex items-center justify-center overflow-hidden touch-pan-y pt-2"
        style={{ perspective: 1200 }}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#102C20]/80 border border-[#C9A45C]/40 text-[#DFC282] hover:text-white hover:bg-[#102C20] hover:scale-110 flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="Previous Formulation"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#102C20]/80 border border-[#C9A45C]/40 text-[#DFC282] hover:text-white hover:bg-[#102C20] hover:scale-110 flex items-center justify-center transition-all shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="Next Formulation"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Swipe / Drag gesture detector on the whole stage */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            const swipeThreshold = 35;
            if (offset.x < -swipeThreshold || velocity.x < -300) {
              handleNext();
            } else if (offset.x > swipeThreshold || velocity.x > 300) {
              handlePrev();
            }
          }}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {featuredProducts.map((product, idx) => {
            // Calculate normalized circular offset (-total/2 to total/2)
            let diff = idx - activeIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isImmediateNeighbor = Math.abs(diff) === 1;
            const isFarNeighbor = Math.abs(diff) === 2;

            // Responsive 3D geometry parameters along a curved round arc
            const spacingX = isMobile ? 120 : 210;
            const posX = diff * spacingX;
            const rotY = diff * (isMobile ? -26 : -22);
            const scaleVal = isCenter ? (isMobile ? 1.18 : 1.14) : isImmediateNeighbor ? (isMobile ? 0.82 : 0.84) : 0.65;
            const zIndexVal = 30 - Math.abs(diff) * 10;
            const opacityVal = isCenter ? 1 : isImmediateNeighbor ? (isMobile ? 0.65 : 0.75) : isFarNeighbor && !isMobile ? 0.35 : 0;
            const posY = isCenter ? -12 : Math.abs(diff) * 12;

            return (
              <motion.div
                key={product.id}
                animate={{
                  x: posX,
                  y: posY,
                  scale: scaleVal,
                  rotateY: rotY,
                  zIndex: zIndexVal,
                  opacity: opacityVal
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 28
                }}
                onClick={() => {
                  if (isCenter) {
                    onSelectProduct(product);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  pointerEvents: opacityVal === 0 ? 'none' : 'auto'
                }}
                className={`flex flex-col items-center justify-end cursor-pointer group ${
                  isCenter ? 'drop-shadow-[0_20px_35px_rgba(201,164,92,0.4)]' : 'filter brightness-85'
                }`}
              >
                {/* Product Name Badge Pill Above Formulation (Never Truncated on Mobile) */}
                {isCenter ? (
                  <div
                    className="mb-2 sm:mb-2.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider text-white uppercase shadow-xl ring-2 ring-[#C9A45C] text-center max-w-[280px] sm:max-w-none transition-all duration-300"
                    style={{ backgroundColor: product.colorHex }}
                  >
                    {product.name}
                  </div>
                ) : (
                  <div
                    className="mb-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium tracking-wide text-white/80 uppercase shadow-md text-center hidden sm:block whitespace-nowrap"
                    style={{ backgroundColor: product.colorHex }}
                  >
                    {product.name.replace(/\s*\(.*?\)\s*/g, '')}
                  </div>
                )}

                {/* Packaging Box Visual Container (Large, Crisp & Visible on Mobile) */}
                <div 
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isCenter 
                      ? 'w-[180px] sm:w-[220px] h-[220px] sm:h-[270px]' 
                      : 'w-[140px] sm:w-[170px] h-[170px] sm:h-[210px]'
                  }`}
                >
                  {/* Dedicated Golden Glow Spotlight behind the Center Product */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-radial from-[#C9A45C]/35 to-transparent rounded-full blur-xl pointer-events-none" />
                  )}

                  <ProductVisual product={product} className="w-full h-full object-contain drop-shadow-2xl" showShadow={false} />
                </div>

                {/* Subtitle / Volume */}
                <div className={`mt-2 text-center transition-all ${isCenter ? 'opacity-100' : 'opacity-70'}`}>
                  <span className="text-xs sm:text-sm font-bold text-[#F7F0DF] drop-shadow-sm">₹{product.price}</span>
                  <span className="ml-1 text-[10px] text-[#DFC282]/80 line-through">₹{product.originalPrice}</span>
                  <span className="block text-[9px] sm:text-[10px] text-[#DCE5D5]/80 font-medium truncate max-w-[130px] mx-auto">
                    {product.strength || product.capsuleCount}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* The Natural Stone Platform / Pedestal */}
      <div className="relative z-0 w-full mt-[-10px] sm:mt-[-16px]">
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

      {/* Active Product Detailed Spotlight Bar & Actions */}
      <div className="mt-4 sm:mt-6 max-w-xl mx-auto px-4 text-center">
        {/* Pagination Dots */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          {featuredProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === idx 
                  ? 'w-6 bg-[#C9A45C]' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Switch to ${p.name}`}
            />
          ))}
        </div>

        {/* Active Product Headline & Subtitle */}
        <motion.div
          key={activeProduct.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[#C9A45C] text-sm">✦</span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#F7F0DF]">
              {activeProduct.name} {activeProduct.hindiName && <span className="font-normal text-[#DFC282]">({activeProduct.hindiName})</span>}
            </h3>
            <span className="text-[#C9A45C] text-sm">✦</span>
          </div>

          <p className="text-xs sm:text-sm text-[#DCE5D5]/90 max-w-md mx-auto italic font-serif">
            "{activeProduct.subtitle}"
          </p>

          {/* Quick Action Buttons for Active Product */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => onSelectProduct(activeProduct)}
              className="px-4 sm:px-6 py-2 rounded-md bg-white/10 hover:bg-white/20 text-[#F7F0DF] border border-[#C9A45C]/40 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>View Details</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className={`px-4 sm:px-6 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                added 
                  ? 'bg-[#102C20] text-[#DFC282] border border-[#C9A45C]' 
                  : 'bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{added ? 'Added to Cart' : `Add to Cart • ₹${activeProduct.price}`}</span>
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
