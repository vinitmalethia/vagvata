import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, BookOpen } from 'lucide-react';
import { INGREDIENTS_SHOWCASE } from '../data/products';

export default function IngredientsSection({ onSelectProductByIngredient }) {
  return (
    <section id="ingredients" className="py-24 bg-[#F7F0DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Leaf className="w-3.5 h-3.5 text-[#173D2B]" />
            <span>Sacred Dravyaguna Herbs</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Treasury of Healing Botanicals
          </h2>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#4A5B4D] font-light leading-relaxed">
            In Ayurveda, plants are viewed not as inert chemicals, but as living intelligences. 
            Discover the key therapeutic herbs that empower our six master formulations.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {INGREDIENTS_SHOWCASE.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-white border border-[#C9A45C]/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Botanical Photography Container */}
                <div className="relative h-48 w-full overflow-hidden bg-[#102C20]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Sanskrit name badge */}
                  <span 
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold text-white shadow"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.sanskrit.split(' ')[0]}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-bold text-[#173D2B] group-hover:text-[#C9A45C] transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#79583B] italic font-serif mt-1">
                    {item.sanskrit}
                  </p>

                  <p className="mt-3 text-sm text-[#4A5B4D] leading-relaxed">
                    {item.benefit}
                  </p>
                </div>
              </div>

              {/* Formulation association */}
              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#4A5B4D] font-medium">Found in:</span>
                  <span className="font-semibold text-[#173D2B] bg-[#DCE5D5]/60 px-2.5 py-1 rounded-md border border-[#C9A45C]/20">
                    {item.foundIn}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
