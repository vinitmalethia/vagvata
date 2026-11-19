import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Eye, Check, ShieldCheck } from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function ProductCard({ product, onSelectProduct, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      onClick={() => onSelectProduct(product)}
      className="group cursor-pointer rounded-2xl bg-white border border-[#C9A45C]/35 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Card Header & Color Accent Bar */}
      <div>
        {/* Exact Packaging Color Accent Bar */}
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: product.colorHex }}
        />

        {/* Top Badges */}
        <div className="p-4 pb-0 flex items-center justify-between">
          <span 
            className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-sm tracking-wide"
            style={{ backgroundColor: product.colorHex }}
          >
            {product.badge}
          </span>

          <div className="flex items-center space-x-1 text-xs text-[#79583B]">
            <Star className="w-3.5 h-3.5 fill-[#C9A45C] text-[#C9A45C]" />
            <span className="font-semibold text-[#173D2B]">{product.rating}</span>
            <span className="text-[#4A5B4D]/70 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Visual Container with Real Photo */}
        <div className="relative w-full h-64 sm:h-72 flex items-center justify-center p-4 bg-gradient-to-b from-[#F7F0DF]/50 via-white to-white overflow-hidden">
          <div className="h-full w-full flex items-center justify-center">
            <ProductVisual product={product} className="h-full max-h-[260px]" />
          </div>

          {/* Quick View Button overlay on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-4 py-1.5 rounded-full bg-[#102C20]/90 text-[#F7F0DF] text-xs font-medium flex items-center space-x-1.5 shadow-lg hover:bg-[#173D2B] backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Product Information */}
        <div className="p-5 pt-3">
          {/* Category & Dosage Pill */}
          <div className="flex items-center justify-between text-[11px] text-[#79583B] font-semibold tracking-wide mb-1.5 uppercase">
            <span>{product.category}</span>
            <span className="text-[#173D2B] bg-[#DCE5D5]/60 px-2 py-0.5 rounded font-mono font-bold">
              {product.volume}
            </span>
          </div>

          {/* Dual Hindi & English Product Title */}
          <div className="flex items-baseline space-x-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#173D2B] group-hover:text-[#C9A45C] transition-colors leading-snug">
              {product.name}
            </h3>
            {product.hindiName && (
              <span className="text-sm font-serif text-[#79583B] font-semibold">
                ({product.hindiName})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart */}
      <div className="p-5 pt-0 border-t border-gray-100 mt-2">
        <div className="flex items-center justify-between pt-3">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-[#173D2B]">
                ₹{product.price}
              </span>
              <span className="text-xs text-[#79583B]/70 line-through">
                ₹{product.originalPrice}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Save ₹{product.originalPrice - product.price} (25% off)
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-md font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center space-x-1.5 shadow cursor-pointer ${
              added
                ? 'bg-[#173D2B] text-[#F7F0DF]'
                : 'bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
