import React from 'react';
import { Sparkles } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function HomePage({ onSelectProduct, onAddToCart, onOpenDoshaQuiz }) {
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

      {/* 3. Complete Products Collection */}
      <section id="products" className="pt-8 sm:pt-10 pb-16 sm:pb-20 bg-[#F7F0DF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Classical Apothecary</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#173D2B]">
              Master Formulations
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5B4D] mt-2 max-w-xl mx-auto">
              Pure classical remedies prepared with genuine Swarna Bhasma, wildcrafted Himalayan herbs, and zero chemical fillers.
            </p>
          </div>

          {/* Grid of All Formulations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
