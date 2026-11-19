import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { Sparkles, Phone } from 'lucide-react';

export default function App() {
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
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#F7F0DF] text-[#263629] font-sans flex flex-col relative selection:bg-[#C9A45C]/30 selection:text-[#173D2B]">
          
          {/* Top Announcement Bar */}
          <AnnouncementBar />

          {/* Primary Navbar (With "Our Story" removed as requested) */}
          <Navbar
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          {/* Multi-Page Routes */}
          <main className="flex-1">
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

        {/* Global Footer with All Links */}
        <Footer />

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

        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-[#102C20] text-[#F7F0DF] border border-[#C9A45C] shadow-2xl flex items-center space-x-2 text-xs font-medium animate-fadeIn">
            <Sparkles className="w-4 h-4 text-[#C9A45C]" />
            <span>{toast}</span>
          </div>
        )}

        {/* Floating Helpline Dialer */}
        <a
          href="tel:+918059507909"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-[#173D2B]/95 text-[#DFC282] hover:text-white border border-[#C9A45C]/60 shadow-2xl px-3 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md hover:bg-[#102C20] transition-all group"
          title="Consult with our Vaidya"
        >
          <Phone className="w-3.5 h-3.5 text-[#C9A45C] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Vaidya Support:</span>
          <span>+91 80595 07909</span>
        </a>

      </div>
    </Router>
  </AuthProvider>
);
}
