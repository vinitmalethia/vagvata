import React, { useState } from 'react';
import { Star, CheckCircle, Quote, Sparkles, MessageSquare } from 'lucide-react';
import { REVIEWS } from '../data/products';

export default function ReviewsPage() {
  const [filterProduct, setFilterProduct] = useState('All');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', product: 'Mall Yoddha', rating: 5, comment: '' });

  const allReviews = [
    ...REVIEWS,
    {
      id: 6,
      name: 'Ramanathan Iyer',
      role: 'Yoga Acharya, Chennai',
      rating: 5,
      verified: true,
      product: 'Shilajit Pure Himalayan Resin',
      comment:
        'The resin dissolves completely in warm milk without any bitter residue. The fulvic acid potency is palpable—my morning Pranayama breath retention and endurance have expanded noticeably.',
      date: '12 Nov 2026'
    },
    {
      id: 7,
      name: 'Devika Singhania',
      role: 'Architect & Mother of Two, Gurgaon',
      rating: 5,
      verified: true,
      product: 'Nari Santulan',
      comment:
        'Postpartum hormonal fluctuations and erratic cycles had drained my energy. Nari Santulan brought steady regularity back to my life within two months. Gentle, natural, and truly effective.',
      date: '08 Nov 2026'
    }
  ];

  const filtered = filterProduct === 'All'
    ? allReviews
    : allReviews.filter((r) => r.product.toLowerCase().includes(filterProduct.toLowerCase()));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', role: '', product: 'Mall Yoddha', rating: 5, comment: '' });
    }, 3000);
  };

  return (
    <div className="py-16 sm:py-24 bg-[#102C20] text-[#F7F0DF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#173D2B] border border-[#C9A45C]/35 text-[#DFC282] text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Verified Customer Stories</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#F7F0DF]">
            Voices of Healing & Vitality
          </h1>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-base text-[#DCE5D5]/80 font-light leading-relaxed">
            Real feedback from Ayurvedic physicians, athletes, and families across India who trust Vagvat Ayurveda for everyday holistic balance.
          </p>

          <div className="mt-6 inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-white/5 border border-[#C9A45C]/20 backdrop-blur-sm">
            <div className="flex text-[#C9A45C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#F7F0DF]">4.91 / 5.0 Star Rating</span>
            <span className="text-xs text-[#DCE5D5]/70">• Over 2,800+ Verified Orders</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl p-7 bg-[#173D2B]/90 border border-[#C9A45C]/30 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-[#C9A45C]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#C9A45C]/40" />
                </div>

                <p className="text-sm text-[#DCE5D5] leading-relaxed italic font-serif">
                  "{review.comment}"
                </p>

                <div className="mt-4 inline-block px-2.5 py-1 rounded bg-[#102C20] text-[#DFC282] text-xs font-medium border border-[#C9A45C]/20">
                  Formulation: {review.product}
                </div>
              </div>

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
            </div>
          ))}
        </div>

        {/* Share Your Story Form */}
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#173D2B] border border-[#C9A45C]/35">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[#C9A45C]" />
            <h3 className="font-serif text-2xl font-bold text-[#F7F0DF]">
              Share Your Healing Experience
            </h3>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-center text-emerald-300 text-sm">
              ✨ Thank you! Your verified experience has been submitted to our Vaidya editorial team.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#DCE5D5] mb-1 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-[#102C20] border border-white/20 text-[#F7F0DF] focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-[#DCE5D5] mb-1 font-medium">City / Profession</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-md bg-[#102C20] border border-white/20 text-[#F7F0DF] focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#DCE5D5] mb-1 font-medium">Which formulation did you experience? *</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md bg-[#102C20] border border-white/20 text-[#F7F0DF] focus:outline-none focus:border-[#C9A45C]"
                >
                  <option value="Mall Yoddha (Swarna Bhasma)">Mall Yoddha (Swarna Bhasma 1kg)</option>
                  <option value="Vajra Shakti Premium">Vajra Shakti Premium</option>
                  <option value="Shilajit Pure Himalayan Resin">Shilajit Pure Himalayan Resin</option>
                  <option value="Kosht Sudha (IBS Support)">Kosht Sudha (IBS Support)</option>
                  <option value="Nari Santulan">Nari Santulan</option>
                  <option value="Yonidhara">Yonidhara</option>
                  <option value="Swas Amrit">Swas Amrit</option>
                  <option value="Madhuraksha">Madhuraksha</option>
                  <option value="Akshire Jigar">Akshire Jigar</option>
                </select>
              </div>

              <div>
                <label className="block text-[#DCE5D5] mb-1 font-medium">Your Testimonial *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share how the formulation supported your vitality and wellness..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-[#102C20] border border-white/20 text-[#F7F0DF] focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-bold text-xs uppercase tracking-wider transition-colors shadow"
              >
                SUBMIT VERIFIED REVIEW
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
