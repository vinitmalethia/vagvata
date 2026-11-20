import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CalendarCheck } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

export default function HomePage({ onSelectProduct, onAddToCart, onOpenDoshaQuiz }) {
  // Flagship 6 formulations for the homepage
  const featuredProducts = PRODUCTS.slice(0, 6);

  return (
    <div className="bg-[#F7F0DF] text-[#263629] relative">
      
      {/* Sticky "Book Consultancy" Button on Right Side */}
      <Link
        to="/contact"
        aria-label="Book Consultancy"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-l from-[#102C20] to-[#173D2B] text-[#DFC282] hover:text-[#FFFFFF] border-l-2 border-y border-[#C9A45C] shadow-2xl py-2.5 px-3 sm:py-3 sm:px-4 rounded-l-xl sm:rounded-l-2xl flex items-center space-x-2 sm:space-x-2.5 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:shadow-[0_0_25px_rgba(201,164,92,0.45)] group cursor-pointer"
        title="Book an Ayurvedic Consultation with our Vaidya"
      >
        <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A45C] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#C9A45C]"></span>
        </span>
        <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A45C] group-hover:scale-110 transition-transform" />
        <span className="font-serif text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase whitespace-nowrap">
          Book Consultancy
        </span>
      </Link>
      
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

    </div>
  );
}
