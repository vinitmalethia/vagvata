import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Phone, Leaf, BookOpen, ShieldCheck } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-[#0D241A] text-[#F7F0DF] border-t border-[#C9A45C]/20 pt-14 pb-8 overflow-hidden">
      
      {/* Corner Botanical Foliage Watermarks */}
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-15 pointer-events-none select-none text-[#DCE5D5]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform -rotate-12 scale-125">
          <path d="M10,90 Q40,60 70,80 Q50,40 85,20 Q45,35 30,10 Q35,50 10,90 Z" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-15 pointer-events-none select-none text-[#DCE5D5]">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full transform rotate-45 scale-125">
          <path d="M10,90 Q40,60 70,80 Q50,40 85,20 Q45,35 30,10 Q35,50 10,90 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 pb-12">
          
          {/* Column 1: Brand & Vaidya Helpline (Span 4) */}
          <div className="lg:col-span-4 lg:pr-10 space-y-5 pb-6 border-b border-white/10 sm:border-none">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3.5 group">
              <img 
                src="/images/logo.jpg" 
                alt="Vagvat Ayurveda Emblem" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#C9A45C]/70 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#F7F0DF] uppercase leading-none block">
                  VAGVAT
                </span>
                <span className="block text-[9px] sm:text-[10px] tracking-[0.35em] text-[#DFC282] uppercase font-medium mt-1">
                  — AYURVEDA —
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-xs text-[#DCE5D5]/80 font-light tracking-wide">
              Pure. Natural. Trusted.
            </p>

            {/* Helpline Pill Box */}
            <div className="rounded-2xl border border-[#C9A45C]/50 p-3 sm:p-3.5 bg-black/10 max-w-[280px]">
              <div className="flex items-start space-x-3">
                <div className="text-[#C9A45C] shrink-0 mt-0.5">
                  <Headphones className="w-5 h-5 text-[#C9A45C]" />
                </div>
                <div>
                  <span className="text-[10px] tracking-wider text-[#DFC282] uppercase font-semibold block">
                    AYURVEDIC VAIDYA HELPLINE
                  </span>
                  <a 
                    href="tel:+918059507909" 
                    className="text-sm font-bold text-[#F7F0DF] hover:text-[#C9A45C] transition-colors flex items-center space-x-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                    <span>+91 80595 07909</span>
                  </a>
                  <a 
                    href="mailto:info@vagvatayurveda.com" 
                    className="text-xs text-[#DFC282]/90 hover:text-white transition-colors block mt-1 underline"
                  >
                    info@vagvatayurveda.com
                  </a>
                </div>
              </div>
            </div>

            {/* Registered Address */}
            <div className="text-[11px] text-[#DCE5D5]/80 space-y-0.5 leading-relaxed pt-1">
              <span className="text-[#DFC282] font-semibold block">Registered Address:</span>
              <p>Ho. no. 679, Village Barsi (133)</p>
              <p>Teh. Bawani Khera, Distt. Bhiwani</p>
              <p>Haryana – 127032</p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-[#C9A45C] hover:text-[#C9A45C] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-[#C9A45C] hover:text-[#C9A45C] transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-[#C9A45C] hover:text-[#C9A45C] transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP FORMULATIONS (Span 3) */}
          <div className="lg:col-span-3 lg:px-8 lg:border-l border-white/10 space-y-4 pb-6 border-b border-white/10 sm:border-none">
            <div className="flex items-center space-x-2 text-[#DFC282]">
              <Leaf className="w-4 h-4 text-[#C9A45C]" />
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#DFC282]">
                SHOP FORMULATIONS
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#DCE5D5]/80 font-light">
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">All Products</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Health & Wellness</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Immunity & Energy</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Digestive Care</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Skin & Hair Care</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Women's Health</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#C9A45C] transition-colors block">Ayurvedic Essentials</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: EXPLORE PAGES (Span 3) */}
          <div className="lg:col-span-3 lg:px-8 lg:border-l border-white/10 space-y-4 pb-6 border-b border-white/10 sm:border-none">
            <div className="flex items-center space-x-2 text-[#DFC282]">
              <BookOpen className="w-4 h-4 text-[#C9A45C]" />
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#DFC282]">
                EXPLORE PAGES
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#DCE5D5]/80 font-light">
              <li>
                <Link to="/" className="hover:text-[#C9A45C] transition-colors block">Home</Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-[#C9A45C] transition-colors block">Our Heritage & Brand Story</Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-[#C9A45C] transition-colors block">Why Choose Us</Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-[#C9A45C] transition-colors block">Reviews</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A45C] transition-colors block">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: STORE POLICIES (Span 2) */}
          <div className="lg:col-span-2 lg:pl-8 lg:border-l border-white/10 space-y-4">
            <div className="flex items-center space-x-2 text-[#DFC282]">
              <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#DFC282]">
                STORE POLICIES
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#DCE5D5]/80 font-light">
              <li>
                <Link to="/contact" className="hover:text-[#C9A45C] transition-colors block">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A45C] transition-colors block">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A45C] transition-colors block">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A45C] transition-colors block">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Exact Match to Mockup */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#DCE5D5]/70 gap-4">
          
          {/* Left Pill: Vaidya Support */}
          <a
            href="tel:+918059507909"
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#C9A45C]/50 bg-black/10 text-xs text-[#DFC282] hover:text-[#F7F0DF] hover:border-[#C9A45C] transition-all"
          >
            <Headphones className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="font-medium">Vaidya Support</span>
            <span>•</span>
            <span className="font-semibold">+91 80595 07909</span>
          </a>

          {/* Center: Copyright */}
          <p className="text-xs text-[#DCE5D5]/65">
            © 2025 Vagvat Ayurveda. All rights reserved.
          </p>

          {/* Right: Crafted with heart */}
          <p className="flex items-center space-x-1.5 text-xs text-[#DCE5D5]/75">
            <span>Crafted with</span>
            <span className="text-[#DFC282]">💛</span>
            <span>for a healthier tomorrow</span>
          </p>

        </div>

      </div>
    </footer>
  );
}
