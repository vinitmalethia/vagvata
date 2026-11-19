import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-24 bg-[#102C20] text-[#F7F0DF] relative overflow-hidden">
      {/* Background golden glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#173D2B]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#173D2B] border border-[#C9A45C]/30 text-[#DFC282] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Real Experiences</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F7F0DF] tracking-tight">
            Stories of Restoration & Vitality
          </h2>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base sm:text-lg text-[#DCE5D5]/80 font-light leading-relaxed">
            Read authentic words from Ayurvedic doctors, nutritionists, and everyday seekers 
            who have experienced the transformative harmony of Vagvat Ayurveda.
          </p>

          {/* Rating Summary Banner */}
          <div className="mt-6 inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/5 border border-[#C9A45C]/20 backdrop-blur-sm">
            <div className="flex text-[#C9A45C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#F7F0DF]">4.87 / 5.0 Average Rating</span>
            <span className="text-xs text-[#DCE5D5]/70">• Over 2,100+ Verified Users Across India</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl p-7 bg-[#173D2B]/90 border border-[#C9A45C]/30 shadow-xl hover:border-[#C9A45C] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#C9A45C]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#C9A45C]/40 group-hover:text-[#C9A45C] transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-sm text-[#DCE5D5] leading-relaxed italic font-serif">
                  "{review.comment}"
                </p>

                {/* Formulation Tag */}
                <div className="mt-4 inline-block px-2.5 py-1 rounded bg-[#102C20] text-[#DFC282] text-xs font-medium border border-[#C9A45C]/20">
                  Formulation: {review.product}
                </div>
              </div>

              {/* Reviewer Info */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#F7F0DF]">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-[#DCE5D5]/70">
                    {review.role}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
