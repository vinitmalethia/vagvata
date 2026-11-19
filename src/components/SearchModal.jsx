import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductVisual from './ProductVisual';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');

  const quickTags = [
    'Mall Yoddha',
    'Shilajit',
    'Swarna Bhasma',
    'Vajra Shakti',
    'IBS & Gut',
    'Women',
    'Liver',
    'Lungs',
    'Sugar Control'
  ];

  const results = PRODUCTS.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.keyIngredients.some((ing) => ing.name.toLowerCase().includes(q) || ing.botanical.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="relative w-full max-w-2xl bg-[#F7F0DF] rounded-2xl shadow-2xl overflow-hidden border border-[#C9A45C]/40 text-[#263629] z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 bg-[#102C20] border-b border-[#C9A45C]/30 flex items-center space-x-3">
              <Search className="w-5 h-5 text-[#C9A45C]" />
              <input
                type="text"
                autoFocus
                placeholder="Search formulations, herbs, health concerns..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-[#F7F0DF] placeholder-[#DCE5D5]/50 text-sm focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-xs text-[#DFC282] hover:text-white"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#F7F0DF]/70 hover:text-white"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Tags */}
            <div className="px-5 py-3 bg-[#DCE5D5]/40 border-b border-[#C9A45C]/20 flex items-center space-x-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#79583B] uppercase tracking-wider shrink-0 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#C9A45C]" />
                <span>Popular:</span>
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white text-[#173D2B] border border-gray-200 hover:border-[#C9A45C] hover:bg-[#F7F0DF] transition-colors shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Results */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
              {results.length === 0 ? (
                <div className="text-center py-12 text-[#4A5B4D]">
                  <p className="font-serif text-base font-bold text-[#173D2B]">No formulations matched your query.</p>
                  <p className="text-xs mt-1">Try searching for keywords like "liver", "lungs", "sugar", or "cycle".</p>
                </div>
              ) : (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                    className="p-3 rounded-xl bg-white border border-[#C9A45C]/20 hover:border-[#C9A45C] hover:shadow-md transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-14 bg-[#F7F0DF] rounded-lg shrink-0 flex items-center justify-center p-1 border border-gray-100">
                        <ProductVisual product={product} className="w-full h-full" showShadow={false} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-serif font-bold text-sm text-[#173D2B] group-hover:text-[#C9A45C] transition-colors">
                            {product.name}
                          </h4>
                          <span 
                            className="text-[9px] px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: product.colorHex }}
                          >
                            {product.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#79583B] italic line-clamp-1">{product.subtitle}</p>
                        <p className="text-[11px] text-[#4A5B4D] line-clamp-1 mt-0.5">
                          Herbs: {product.keyIngredients.map((i) => i.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pl-2">
                      <div className="text-right">
                        <span className="font-bold text-sm text-[#173D2B]">₹{product.price}</span>
                        <span className="text-[10px] text-gray-400 line-through block">₹{product.originalPrice}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#C9A45C] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
