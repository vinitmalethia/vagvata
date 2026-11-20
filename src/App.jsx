import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import StoryPage from './pages/StoryPage';
import WhyChooseUsPage from './pages/WhyChooseUsPage';
import ReviewsPage from './pages/ReviewsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import CustomerAccountPage from './pages/CustomerAccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { AuthProvider } from './context/AuthContext';
import { CustomerRoute, AdminRoute } from './components/ProtectedRoute';

import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import SearchModal from './components/SearchModal';
import DoshaQuizModal from './components/DoshaQuizModal';
import AuthModal from './components/AuthModal';
import { Sparkles, CalendarCheck } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Persist cart items in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vagvat_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDoshaQuizOpen, setIsDoshaQuizOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('vagvat_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart state to localStorage', e);
    }
  }, [cart]);

  // Cart Management
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });

    showToast(`Added ${product.name} to your Ayurvedic cart.`);
  };

  const handleUpdateQuantity = (productId, qty) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleProceedToCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product, qty = 1) => {
    handleAddToCart(product, qty);
    const subtotal = product.price * qty;
    const shippingCost = subtotal >= 499 ? 0 : 50;
    const finalTotal = subtotal + shippingCost;
    setCheckoutData({ subtotal, discountAmount: 0, shippingCost, finalTotal });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (orderId) => {
    setCart([]);
    setCheckoutData(null);
    try {
      localStorage.removeItem('vagvat_cart');
    } catch {}
    showToast(`Order #${orderId} confirmed successfully!`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen ${isAdminRoute ? 'bg-[#07130D]' : 'bg-[#F7F0DF]'} text-[#263629] font-sans flex flex-col relative selection:bg-[#C9A45C]/30 selection:text-[#173D2B] overflow-x-hidden`}>
      <ScrollToTop />
      
      {/* Top Announcement Bar (Hidden on Admin Portal) */}
      {!isAdminRoute && <AnnouncementBar />}

      {/* Primary Navbar (Hidden on Admin Portal) */}
      {!isAdminRoute && (
        <Navbar
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Multi-Page Routes */}
      <main className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
                onOpenDoshaQuiz={() => setIsDoshaQuizOpen(true)}
              />
            }
          />

          <Route
            path="/shop"
            element={
              <ShopPage
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
              />
            }
          />

          {/* Dedicated Brand Story Page */}
          <Route
            path="/story"
            element={<StoryPage />}
          />

          {/* Dedicated Why Choose Us Page */}
          <Route
            path="/why-us"
            element={<WhyChooseUsPage />}
          />

          {/* Dedicated Reviews Page */}
          <Route
            path="/reviews"
            element={<ReviewsPage />}
          />

          {/* Dedicated Contact & Vaidya Consultation Page */}
          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* Dedicated Compact Login & Admin Portal Page */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Protected Customer Account Dashboard */}
          <Route
            path="/account"
            element={
              <CustomerRoute>
                <CustomerAccountPage />
              </CustomerRoute>
            }
          />

          {/* Protected Admin Portal Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          {/* Friendly Aliases */}
          <Route path="/dashboard" element={<Navigate to="/account" replace />} />
          <Route path="/portal" element={<Navigate to="/login" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer with All Links (Hidden on Admin Portal) */}
      {!isAdminRoute && <Footer />}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        checkoutData={checkoutData}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Dosha Quiz Guide Modal */}
      <DoshaQuizModal
        isOpen={isDoshaQuizOpen}
        onClose={() => setIsDoshaQuizOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Customer / Admin Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C] shadow-2xl flex items-center space-x-2 text-xs font-medium animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#C9A45C]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating "Book Consultancy" Button (Hidden on Admin Portal) */}
      {!isAdminRoute && (
        <Link
          to="/contact"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-[#102C20] to-[#173D2B] text-[#DFC282] hover:text-[#FFFFFF] border border-[#C9A45C]/70 shadow-2xl px-4 py-2.5 sm:px-5 sm:py-3 rounded-full flex items-center space-x-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md hover:bg-[#102C20] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(201,164,92,0.5)] group"
          title="Book an Ayurvedic Consultation with our Vaidya"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A45C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A45C]"></span>
          </span>
          <CalendarCheck className="w-4 h-4 text-[#C9A45C] group-hover:scale-110 transition-transform" />
          <span className="font-serif font-bold">Book Consultancy</span>
        </Link>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
