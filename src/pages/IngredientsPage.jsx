import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, BookOpen, Search } from 'lucide-react';
import { INGREDIENTS_SHOWCASE } from '../data/products';

export default function IngredientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const detailedHerbs = [
    ...INGREDIENTS_SHOWCASE,
    {
      name: 'Kutaja Bark',
      sanskrit: 'कुटज (Holarrhena antidysenterica)',
      benefit: 'The king of digestive astringents; soothes IBS spasms and heals intestinal mucosa.',
      foundIn: 'Kosht Sudha',
      color: '#5C90A8',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Ashwagandha',
      sanskrit: 'अश्वगंधा (Withania somnifera)',
      benefit: 'Premier adaptogenic Rasayana that calms Vata, reduces stress cortisol, and builds stamina.',
      foundIn: 'Mall Yoddha, Vajra Shakti & Nari Santulan',
      color: '#C9A45C',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Safed Musli',
      sanskrit: 'श्वेत मूसली (Chlorophytum borivilianum)',
      benefit: 'Natural anabolic tonic that builds dense muscular strength and cellular vitality.',
      foundIn: 'Mall Yoddha & Vajra Shakti Premium',
      color: '#C9A45C',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Haritaki',
      sanskrit: 'हरीतकी (Terminalia chebula)',
      benefit: 'Revered as the Mother of herbs; cleanses toxic Ama while gently nourishing colon tissue.',
      foundIn: 'Kosht Sudha',
      color: '#79583B',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filtered = detailedHerbs.filter((herb) => {
    const q = searchTerm.toLowerCase();
    return (
      herb.name.toLowerCase().includes(q) ||
      herb.sanskrit.toLowerCase().includes(q) ||
      herb.benefit.toLowerCase().includes(q) ||
      herb.foundIn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-16 sm:py-24 bg-[#F7F0DF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Leaf className="w-3.5 h-3.5 text-[#173D2B]" />
            <span>Dravyaguna Vijnana</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Treasury of Botanical Herbs
          </h1>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#4A5B4D] font-light leading-relaxed">
            In classical Ayurveda, each herb possesses a distinct Rasa (taste), Guna (attribute), 
            Virya (potency), and Vipaka (post-digestive effect). Explore the living botanicals that power our formulations.
          </p>
        </div>

        {/* Search Herb Filter */}
        <div className="max-w-md mx-auto mb-14 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search herbs by name or formulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#C9A45C]/40 bg-white text-xs sm:text-sm focus:outline-none focus:border-[#173D2B] shadow-sm"
          />
        </div>

        {/* Herbs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group rounded-2xl overflow-hidden bg-white border border-[#C9A45C]/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#102C20]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span 
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold text-white shadow"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.sanskrit.split(' ')[0]}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-[#173D2B] group-hover:text-[#C9A45C] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#79583B] italic font-serif mt-1">
                    {item.sanskrit}
                  </p>

                  <p className="mt-3 text-sm text-[#4A5B4D] leading-relaxed">
                    {item.benefit}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#4A5B4D] font-medium">Empowers:</span>
                  <span className="font-semibold text-[#173D2B] bg-[#DCE5D5]/60 px-2.5 py-1 rounded-md border border-[#C9A45C]/20">
                    {item.foundIn}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
