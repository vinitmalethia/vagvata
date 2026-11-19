import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, PhoneCall } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenSearch }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Notice: "Our Story" and "Botanical Ingredients" are removed from navigation bar
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop Formulations', href: '/shop' },
    { label: 'Why Choose Us', href: '/why-us' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#102C20]/95 backdrop-blur-md shadow-lg border-b border-[#C9A45C]/20 py-3' 
        : 'bg-[#102C20] border-b border-[#C9A45C]/15 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F7F0DF] hover:text-[#C9A45C] focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo Brand Title */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              {/* Official Brand Logo Emblem */}
              <img 
                src="/images/logo.jpg" 
                alt="Vagvat Ayurveda Emblem" 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#C9A45C]/60 shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.2em] text-[#F7F0DF] group-hover:text-[#DFC282] transition-colors uppercase">
                  Vagvat
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-[#C9A45C] uppercase font-medium -mt-1">
                  Ayurveda
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 tracking-wide group ${
                    isActive ? 'text-[#C9A45C] font-semibold' : 'text-[#F7F0DF]/90 hover:text-[#C9A45C]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#C9A45C] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons: Search & Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#F7F0DF]/90 hover:text-[#C9A45C] transition-colors rounded-full hover:bg-white/5 cursor-pointer"
              aria-label="Search formulations"
              title="Search formulations"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#F7F0DF]/90 hover:text-[#C9A45C] transition-colors rounded-full hover:bg-white/5 group flex items-center cursor-pointer"
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#C9A45C] text-[#102C20] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline ml-2 text-xs font-semibold tracking-wider text-[#C9A45C] uppercase">
                Cart
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#102C20] border-t border-[#C9A45C]/20 px-6 py-6 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  `text-base font-medium py-1.5 border-b border-white/5 transition-colors ${
                    isActive ? 'text-[#C9A45C] font-bold' : 'text-[#F7F0DF] hover:text-[#C9A45C]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="pt-4 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center space-x-3 w-full py-2.5 px-4 rounded bg-[#173D2B] text-[#F7F0DF] border border-[#C9A45C]/30 text-sm"
              >
                <Search className="w-4 h-4 text-[#C9A45C]" />
                <span>Search Products & Herbs</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="flex items-center justify-between w-full py-2.5 px-4 rounded bg-[#C9A45C] text-[#102C20] font-semibold text-sm shadow"
              >
                <span className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Open Shopping Cart</span>
                </span>
                <span className="bg-[#102C20] text-[#F7F0DF] text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
