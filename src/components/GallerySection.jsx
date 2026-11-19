import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function GallerySection() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      title: 'Mindful Morning Dinacharya',
      subtitle: 'Aligning with daily natural biorhythms'
    },
    {
      src: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      title: 'Fresh Herbal Mortar Trituration',
      subtitle: 'Bhavana process releasing cellular prana'
    },
    {
      src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      title: 'Sacred Prana & Meditation',
      subtitle: 'Cultivating inner stillness for healing'
    },
    {
      src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      title: 'Himalayan Wildcrafting',
      subtitle: 'Sustainably hand-harvested at seasonal zenith'
    },
    {
      src: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
      title: 'Botanical Leaf Architecture',
      subtitle: 'Nature’s sacred geometric intelligence'
    },
    {
      src: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      title: 'Spiced Rasayana Decoctions',
      subtitle: 'Slow simmered in copper and earthen vessels'
    }
  ];

  return (
    <section className="py-24 bg-[#F7F0DF] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Living the Ayurvedic Way</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            The Vagvat Lifestyle Gallery
          </h2>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#4A5B4D] font-light leading-relaxed">
            Ayurveda is not a temporary remedy; it is a profound celebration of life, balance, and harmony with natural seasons.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {images.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square bg-[#102C20] shadow-md cursor-pointer border border-[#C9A45C]/30 hover:scale-[1.02] transition-transform duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                loading="eager"
                decoding="sync"
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-110 group-hover:brightness-90 transition-all duration-700 ease-out"
              />

              {/* Hover Dark Overlay with Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102C20]/90 via-[#102C20]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6">
                <span className="text-[10px] tracking-widest text-[#DFC282] uppercase font-semibold">
                  Vagvat Journal
                </span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#F7F0DF] mt-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#DCE5D5]/80 mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram / Community Callout */}
        <div className="mt-12 text-center">
          <a
            href="https://vagvatayurveda.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#173D2B] hover:text-[#C9A45C] transition-colors py-2 px-4 rounded-full border border-[#173D2B]/30 hover:border-[#C9A45C]"
          >
            <InstagramIcon className="w-4 h-4 text-[#C9A45C]" />
            <span>Join our community @vagvatayurveda</span>
          </a>
        </div>

      </div>
    </section>
  );
}
