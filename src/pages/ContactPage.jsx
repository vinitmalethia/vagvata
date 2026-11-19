import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ChevronDown, ChevronUp, Sparkles, Send } from 'lucide-react';
import { FAQS } from '../data/products';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', concern: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', phone: '', email: '', concern: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-16 sm:py-24 bg-[#F7F0DF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#DCE5D5]/70 text-[#173D2B] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            <Phone className="w-3.5 h-3.5 text-[#173D2B]" />
            <span>Vaidya Support & Assistance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#173D2B] tracking-tight">
            Consult With Our Vaidya Team
          </h1>

          <div className="w-24 h-1 bg-[#C9A45C] mx-auto mt-4" />

          <p className="mt-4 text-sm sm:text-base text-[#4A5B4D] font-light leading-relaxed">
            Have questions regarding dosage, anupana (carriers), or Prakriti constitution? 
            Reach out directly to our certified Ayurvedic practitioners.
          </p>
        </div>

        {/* Contact Information & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Left Column: Direct Helplines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C]/35 space-y-6 shadow-xl">
              <span className="text-xs uppercase tracking-widest text-[#DFC282] font-semibold block">
                Direct Contact Channels
              </span>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#173D2B] border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Ayurvedic Vaidya Helpline</h4>
                  <a href="tel:+918059507909" className="text-sm font-bold text-[#DFC282] hover:underline block mt-0.5">
                    +91 80595 07909
                  </a>
                  <span className="text-xs text-[#DCE5D5]/70">Available Mon - Sat, 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#173D2B] border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Email Inquiries</h4>
                  <a href="mailto:info@vagvatayurveda.com" className="text-sm text-[#DFC282] hover:underline block mt-0.5">
                    info@vagvatayurveda.com
                  </a>
                  <span className="text-xs text-[#DCE5D5]/70">Inquiries answered within 24 business hours</span>
                </div>
              </div>

              {/* Registered Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#173D2B] border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Registered Office & Apothecary</h4>
                  <div className="text-xs text-[#DCE5D5]/80 mt-1 space-y-0.5 leading-relaxed">
                    <p>Ho. no. 679</p>
                    <p>Village Barsi (133)</p>
                    <p>Teh. Bawani Khera, Distt. Bhiwani</p>
                    <p>Haryana – 127032, India</p>
                  </div>
                </div>
              </div>

              {/* Hours & Shipping */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#173D2B] border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#F7F0DF]">Apothecary Dispatch</h4>
                  <span className="text-xs text-[#DCE5D5]/70 block mt-0.5">
                    All orders dispatched with discrete protective sealing within 24 hours. Complimentary courier across India on orders &gt; ₹499.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Confidential Inquiry Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#C9A45C]/35 shadow-md">
            <h3 className="font-serif text-2xl font-bold text-[#173D2B] mb-2">
              Book a Confidential Consultation
            </h3>
            <p className="text-xs text-[#4A5B4D] mb-6">
              Share your primary health concern and our physician will prepare personalized herbal recommendations.
            </p>

            {sent ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold">Inquiry Successfully Received</h4>
                <p className="text-xs text-emerald-700">
                  Our chief Vaidya will review your details and contact you at <strong className="font-mono">{formData.phone}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-[#F7F0DF]/20 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-[#F7F0DF]/20 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-[#F7F0DF]/20 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-semibold">Area of Concern *</label>
                    <select
                      value={formData.concern}
                      onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-[#F7F0DF]/20 focus:outline-none focus:border-[#C9A45C]"
                    >
                      <option value="">Select primary focus...</option>
                      <option value="Athletic Stamina & Muscle (Mall Yoddha)">Athletic Stamina & Muscle (Mall Yoddha)</option>
                      <option value="Male Vitality & Rejuvenation">Male Vitality & Rejuvenation (Vajra Shakti)</option>
                      <option value="Pure Himalayan Shilajit Guidance">Pure Himalayan Shilajit Guidance</option>
                      <option value="IBS & Digestive Gas / Bloating">IBS & Digestive Gas / Bloating (Kosht Sudha)</option>
                      <option value="Women's Hormonal & Cycle Health">Women's Hormonal & Cycle Health (Nari Santulan)</option>
                      <option value="Leucorrhea & Mucosal Balance">Leucorrhea & Mucosal Balance (Yonidhara)</option>
                      <option value="Respiratory & Cough Relief">Respiratory & Cough Relief (Swas Amrit)</option>
                      <option value="Blood Sugar Control">Blood Sugar Control (Madhuraksha)</option>
                      <option value="Liver Detox & Enzyme Health">Liver Detox & Enzyme Health (Akshire Jigar)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#4A5B4D] mb-1 font-semibold">Describe Your Symptoms or Questions *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide any relevant details, dietary patterns, or current symptoms for our Vaidya..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-[#F7F0DF]/20 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>REQUEST VAIDYA CONSULTATION</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto pt-8">
          <h3 className="font-serif text-2xl font-bold text-[#173D2B] text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[#C9A45C]/30 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-serif text-sm sm:text-base font-bold text-[#173D2B] flex items-center justify-between transition-colors hover:text-[#C9A45C] cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#C9A45C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#4A5B4D] leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
