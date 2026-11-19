import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Filter, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopPage({ onSelectProduct, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

  const categories = [
    'All',
    "Strength & Stamina",
    "Women's Wellness",
    'Digestive Wellness',
    'Liver & Digestion',
    'Respiratory Health',
    'Metabolic Wellness'
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let list = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        (product.hindiName && product.hindiName.includes(q)) ||
        product.keyIngredients.some((i) => i.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="py-12 sm:py-16 bg-[#F7F0DF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Ayurvedic Apothecary Store</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Shop All Formulations
          </h1>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-sm sm:text-base text-[#4A5B4D] font-light leading-relaxed">
            Discover our complete dispensary of 11 authentic classical formulations. 
            Crafted with genuine Swarna Bhasma, purified Himalayan Shilajit, and wildcrafted botanicals.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#C9A45C]/35 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, herb, concern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#C9A45C] bg-[#F7F0DF]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <div className="flex items-center space-x-2 text-xs text-[#79583B] font-semibold uppercase tracking-wider shrink-0">
              <ArrowDownUp className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-lg border border-gray-200 bg-[#F7F0DF]/30 text-xs sm:text-sm text-[#173D2B] font-medium focus:outline-none focus:border-[#C9A45C] cursor-pointer"
            >
              <option value="featured">Featured & Classic</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Category Filter Pills (Horizontal scrollable on mobile, centered wrap on desktop) */}
        <div className="flex overflow-x-auto sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 no-scrollbar pb-2 sm:pb-0 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#173D2B] text-[#F7F0DF] shadow-md border border-[#173D2B]'
                  : 'bg-white/90 hover:bg-white text-[#4A5B4D] hover:text-[#173D2B] border border-[#C9A45C]/30'
              }`}
            >
              {cat === 'All' ? `All Formulations (${PRODUCTS.length})` : cat}
            </button>
          ))}
        </div>

        {/* Active Query Notice */}
        {searchQuery && (
          <div className="mb-6 text-center text-sm text-[#79583B]">
            Showing results for "<strong className="text-[#173D2B]">{searchQuery}</strong>" ({filteredAndSortedProducts.length} formulations found)
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20 bg-white/70 rounded-2xl border border-dashed border-[#C9A45C]/40">
            <span className="text-3xl block mb-2">🌿</span>
            <h3 className="font-serif text-xl font-bold text-[#173D2B]">No formulations found</h3>
            <p className="text-xs text-[#4A5B4D] mt-1 max-w-sm mx-auto">
              We couldn't find any formulation matching your search. Try different terms or reset your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-5 px-6 py-2.5 rounded bg-[#C9A45C] text-[#102C20] text-xs font-bold uppercase tracking-wider hover:bg-[#DFC282] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Shipping & Vaidya Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C]/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#DFC282] font-semibold">
              Free Insured Delivery Across India
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F0DF]">
              All Orders Above ₹499 Ship Free in Discrete Protective Packaging
            </h3>
            <p className="text-xs text-[#DCE5D5]/80">
              Each bottle is hand-sealed with safety holograms and dispatched within 24 hours.
            </p>
          </div>
          <a
            href="tel:+918059507909"
            className="px-6 py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            Vaidya Support: +91 80595 07909
          </a>
        </div>

      </div>
    </div>
  );
}
