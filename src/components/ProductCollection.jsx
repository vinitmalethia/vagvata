import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PhoneCall } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductCollection({ onSelectProduct, onAddToCart, searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    "Strength & Stamina",
    "Women's Wellness",
    'Digestive Wellness',
    'Liver & Digestion',
    'Respiratory Health',
    'Metabolic Wellness'
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.keyIngredients.some((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 bg-[#F7F0DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Classical Ayurvedic Science</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Explore Our Formulations
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#4A5B4D] font-light leading-relaxed">
            Authentic Ayurvedic formulations crafted in accordance with classical treatises. 
            Wildcrafted botanicals, purified Shastriya Bhasmas, and zero artificial additives.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#173D2B] text-[#F7F0DF] shadow-md border border-[#173D2B]'
                  : 'bg-white/80 hover:bg-white text-[#4A5B4D] hover:text-[#173D2B] border border-[#C9A45C]/30'
              }`}
            >
              {cat === 'All' ? `All Formulations (${PRODUCTS.length})` : cat}
            </button>
          ))}
        </div>

        {/* Active Search Query Notice */}
        {searchQuery && (
          <div className="mt-4 text-center text-sm text-[#79583B]">
            Showing results for "<span className="font-semibold text-[#173D2B]">{searchQuery}</span>" ({filteredProducts.length} items found)
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white/60 rounded-xl border border-dashed border-[#C9A45C]/40 mt-8">
            <p className="text-lg font-serif text-[#173D2B]">No formulations match your search.</p>
            <p className="text-sm text-[#4A5B4D] mt-1">Try adjusting your filters or search keywords.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-5 py-2 rounded bg-[#C9A45C] text-[#102C20] text-xs font-semibold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Assurance Note */}
        <div className="mt-16 p-6 rounded-2xl bg-[#DCE5D5]/40 border border-[#C9A45C]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#173D2B] text-[#C9A45C] flex items-center justify-center shrink-0 text-xl font-serif">
              🌿
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-[#173D2B]">
                Looking for tailored Vaidya advice?
              </h4>
              <p className="text-xs text-[#4A5B4D]">
                Our certified Ayurvedic physicians are available for confidential consultations.
              </p>
            </div>
          </div>
          <a
            href="tel:+919888335557"
            className="px-6 py-2.5 rounded bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-semibold tracking-wider uppercase transition-colors shrink-0 flex items-center space-x-2"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Call: +91 9888335557</span>
          </a>
        </div>

      </div>
    </section>
  );
}
