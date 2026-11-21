import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const StoryPage = lazy(() => import('./pages/StoryPage'));
const WhyChooseUsPage = lazy(() => import('./pages/WhyChooseUsPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CustomerAccountPage = lazy(() => import('./pages/CustomerAccountPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const SearchModal = lazy(() => import('./components/SearchModal'));
const DoshaQuizModal = lazy(() => import('./components/DoshaQuizModal'));
const AuthModal = lazy(() => import('./components/AuthModal'));

import { AuthProvider } from './context/AuthContext';
import { CustomerRoute, AdminRoute } from './components/ProtectedRoute';
import { appCheck } from './firebase';

import { Sparkles, CalendarCheck } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  // Live checkout stays off until the deployed payment backend and App Check are configured.
  const onlinePaymentsEnabled = import.meta.env.VITE_ENABLE_ONLINE_PAYMENTS === 'true' && Boolean(appCheck);
  const testOrdersEnabled = import.meta.env.DEV || (
    !onlinePaymentsEnabled && import.meta.env.VITE_ENABLE_TEST_ORDERS === 'true'
  );
  const checkoutAvailable = onlinePaymentsEnabled || testOrdersEnabled;

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
  const [checkoutItems, setCheckoutItems] = useState(null);
  const [isBuyNowCheckout, setIsBuyNowCheckout] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDoshaQuizOpen, setIsDoshaQuizOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loadedModals, setLoadedModals] = useState({});
  const [toast, setToast] = useState(null);

  const loadModal = (name) => setLoadedModals((loaded) => ({ ...loaded, [name]: true }));
  const handleSelectProduct = (product) => {
    loadModal('product');
    setSelectedProduct(product);
  };
  const handleOpenCart = () => {
    loadModal('cart');
    setIsCartOpen(true);
  };
  const handleOpenSearch = () => {
    loadModal('search');
    setIsSearchOpen(true);
  };
  const handleOpenDoshaQuiz = () => {
    loadModal('quiz');
    setIsDoshaQuizOpen(true);
  };
  const handleOpenAuth = () => {
    loadModal('auth');
    setIsAuthModalOpen(true);
  };

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
    loadModal('checkout');
    setCheckoutItems(cart);
    setIsBuyNowCheckout(false);
    setCheckoutData(data);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product, qty = 1) => {
    if (!checkoutAvailable) {
      showToast('Online payment setup is required before checkout is available.');
      return;
    }
    loadModal('checkout');
    setCheckoutItems([{ product, quantity: qty }]);
    setIsBuyNowCheckout(true);
    const subtotal = product.price * qty;
    const shippingCost = subtotal >= 499 ? 0 : 70;
    const finalTotal = subtotal + shippingCost;
    setCheckoutData({ subtotal, discountAmount: 0, shippingCost, finalTotal });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (orderId) => {
    if (!isBuyNowCheckout) {
      setCart([]);
      try {
        localStorage.removeItem('vagvat_cart');
      } catch {}
    }
    setCheckoutData(null);
    setCheckoutItems(null);
    setIsBuyNowCheckout(false);
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
          onOpenCart={handleOpenCart}
          onOpenSearch={handleOpenSearch}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Multi-Page Routes */}
      <main className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<div className="flex-1 min-h-[50vh]" aria-label="Loading page" />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onSelectProduct={handleSelectProduct}
                onAddToCart={handleAddToCart}
                onOpenDoshaQuiz={handleOpenDoshaQuiz}
              />
            }
          />

          <Route
            path="/shop"
            element={
              <ShopPage
                onSelectProduct={handleSelectProduct}
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
        </Suspense>
      </main>

      {/* Global Footer with All Links (Hidden on Admin Portal) */}
      {!isAdminRoute && <Footer />}

      {/* Shopping Cart Drawer */}
      {loadedModals.cart && <Suspense fallback={null}><CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={checkoutItems || cart}
        checkoutAvailable={checkoutAvailable}
        testOrdersEnabled={testOrdersEnabled}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      /></Suspense>}

      {/* Product Detail Modal */}
      {loadedModals.product && <Suspense fallback={null}><ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        checkoutAvailable={checkoutAvailable}
        testOrdersEnabled={testOrdersEnabled}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      /></Suspense>}

      {/* Checkout Modal */}
      {loadedModals.checkout && <Suspense fallback={null}><CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        paymentGatewayConfigured={onlinePaymentsEnabled}
        testOrdersEnabled={testOrdersEnabled}
        cartItems={checkoutItems || cart}
        checkoutData={checkoutData}
        onOrderCompleted={handleOrderCompleted}
      /></Suspense>}

      {/* Search Modal */}
      {loadedModals.search && <Suspense fallback={null}><SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      /></Suspense>}

      {/* Dosha Quiz Guide Modal */}
      {loadedModals.quiz && <Suspense fallback={null}><DoshaQuizModal
        isOpen={isDoshaQuizOpen}
        onClose={() => setIsDoshaQuizOpen(false)}
        onSelectProduct={handleSelectProduct}
      /></Suspense>}

      {/* Customer / Admin Auth Modal */}
      {loadedModals.auth && <Suspense fallback={null}><AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {}}
      /></Suspense>}

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
