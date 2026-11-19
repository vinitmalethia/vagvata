import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Plus, Minus, Check, ShieldCheck, Leaf, Sparkles, Heart } from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onBuyNow();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#F7F0DF] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#C9A45C]/40 text-[#263629] z-10 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#102C20]/80 text-[#F7F0DF] hover:bg-[#102C20] hover:text-[#C9A45C] flex items-center justify-center transition-colors shadow"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Content Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
              
              {/* Left Column: Visual Showcase with Genuine Product Photo */}
              <div 
                className="md:col-span-5 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-[#F7F0DF] to-[#EFE5CE]"
              >
                {/* Product Badge */}
                <div 
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider shadow"
                  style={{ backgroundColor: product.colorHex }}
                >
                  {product.badge}
                </div>

                {/* Real Product Photo */}
                <div className="w-full max-w-[190px] sm:max-w-[260px] aspect-[9/16] flex items-center justify-center my-1 sm:my-2">
                  <ProductVisual product={product} className="w-full h-full" />
                </div>

                <div className="mt-1 sm:mt-2 text-center space-y-0.5 sm:space-y-1">
                  <span className="text-[11px] sm:text-xs font-bold text-[#173D2B] block">
                    Authentic Packaging: {product.capsuleCount} • {product.strength}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#79583B] italic block">
                    {product.tagline}
                  </span>
                </div>
              </div>

              {/* Right Column: Detailed Information */}
              <div className="md:col-span-7 p-4 sm:p-8 flex flex-col justify-between bg-white space-y-4 sm:space-y-6">
                <div>
                  {/* Category & Dosha */}
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#79583B] tracking-wider uppercase mb-1">
                    <span>{product.category}</span>
                    <span>•</span>
                    <span className="text-[#173D2B]">{product.dosha}</span>
                  </div>

                  {/* Title & Hindi Script */}
                  <div className="flex items-baseline space-x-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#173D2B]">
                      {product.name}
                    </h2>
                    {product.hindiName && (
                      <span className="font-serif text-lg font-bold text-[#79583B]">
                        ({product.hindiName})
                      </span>
                    )}
                  </div>

                  {/* Distinctive Packaging Subtitle / Indication */}
                  <div 
                    className="mt-1.5 px-3 py-1 rounded-md text-xs font-bold w-fit text-white"
                    style={{ backgroundColor: product.colorHex }}
                  >
                    {product.subtitle}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mt-2.5">
                    <div className="flex text-[#C9A45C]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#173D2B]">{product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviewCount} verified reviews)</span>
                  </div>

                  {/* Price Banner */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#F7F0DF]/60 border border-[#C9A45C]/35 flex items-baseline space-x-3">
                    <span className="text-2xl font-bold text-[#173D2B]">₹{product.price}</span>
                    <span className="text-sm text-[#79583B]/70 line-through">₹{product.originalPrice}</span>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      25% SAVINGS
                    </span>
                    <span className="text-[11px] text-[#4A5B4D] ml-auto">Free Shipping</span>
                  </div>

                  {/* Tabs */}
                  <div className="mt-5 flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('benefits')}
                      className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                        activeTab === 'benefits'
                          ? 'border-[#173D2B] text-[#173D2B]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Indications & Benefits
                    </button>
                    <button
                      onClick={() => setActiveTab('ingredients')}
                      className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                        activeTab === 'ingredients'
                          ? 'border-[#173D2B] text-[#173D2B]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Botanical Composition
                    </button>
                    <button
                      onClick={() => setActiveTab('usage')}
                      className={`pb-2.5 px-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                        activeTab === 'usage'
                          ? 'border-[#173D2B] text-[#173D2B]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      How To Use
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="py-4 text-xs leading-relaxed min-h-[140px]">
                    {activeTab === 'benefits' && (
                      <div className="space-y-3">
                        <p className="text-[#4A5B4D]">{product.description}</p>
                        
                        <div className="p-3 rounded-lg bg-[#DCE5D5]/30 border border-[#DCE5D5] space-y-1.5">
                          <span className="font-bold text-[#173D2B] block uppercase tracking-wider text-[10px]">
                            Key Actions from Packaging:
                          </span>
                          {product.boxFeatures?.map((f, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-[#173D2B] font-semibold">{f}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          {product.highlights.map((h, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <span className="text-[#C9A45C] font-bold">•</span>
                              <span className="text-[#263629]">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'ingredients' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.keyIngredients.map((ing) => (
                          <div key={ing.name} className="p-2.5 rounded-lg bg-[#F7F0DF]/40 border border-gray-100">
                            <span className="font-bold text-[#173D2B] block">{ing.name}</span>
                            <span className="text-[10px] text-[#79583B] italic block">{ing.botanical}</span>
                            <span className="text-[11px] text-[#4A5B4D] mt-1 block">{ing.role}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'usage' && (
                      <div className="p-4 rounded-xl bg-[#DCE5D5]/30 border border-[#DCE5D5] space-y-2">
                        <span className="font-bold text-[#173D2B] text-xs uppercase tracking-wider block">
                          Suggested Dosage & Anupana (Carrier):
                        </span>
                        <p className="text-[#4A5B4D]">{product.usage}</p>
                        <p className="text-[11px] text-[#79583B] italic">
                          * Classical 100% vegetarian capsules. Take consistently for optimal therapeutic harmony.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="flex items-center space-x-2 flex-1">
                      {/* Quantity Picker */}
                      <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1.5 sm:p-1 bg-[#F7F0DF]/40 shrink-0">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-1 hover:text-[#C9A45C] text-[#173D2B]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-[#173D2B]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1 hover:text-[#C9A45C] text-[#173D2B]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                          added
                            ? 'bg-[#173D2B] text-[#F7F0DF]'
                            : 'bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] shadow'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Added to Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart • ₹{product.price * quantity}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Buy Now Direct */}
                    <button
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto py-3 px-5 rounded-lg bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] font-bold text-xs tracking-wider uppercase transition-colors shrink-0 shadow cursor-pointer text-center"
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ayush GMP Approved</span>
                    </span>
                    <span>Free Shipping on Orders &gt; ₹499</span>
                    <span>Dispatched in 24 Hours</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
