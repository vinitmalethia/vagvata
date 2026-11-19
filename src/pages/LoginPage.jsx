import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  User, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  AlertCircle,
  CheckCircle2,
  Leaf,
  Shield,
  HelpCircle
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentUser, 
    userRole, 
    loginCustomer, 
    signUpCustomer, 
    loginWithGoogle, 
    loginAdmin, 
    registerAdmin, 
    resetPassword 
  } = useAuth();

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (currentUser) {
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/account';
        navigate(from, { replace: true });
      }
    }
  }, [currentUser, userRole, navigate, location]);

  // Customer Card State
  const [customerMode, setCustomerMode] = useState('login'); // 'login' | 'signup'
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Admin Card State
  const [adminMode, setAdminMode] = useState('login'); // 'login' | 'register'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPassphrase, setAdminPassphrase] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Pre-fill remembered email
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('vagvat_remember_email');
      if (savedEmail) {
        setCustomerEmail(savedEmail);
      }
    } catch {}
  }, []);

  // Handle Customer Form Submit
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerError('');
    setCustomerSuccess('');
    setCustomerLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('vagvat_remember_email', customerEmail);
      } else {
        localStorage.removeItem('vagvat_remember_email');
      }

      if (customerMode === 'signup') {
        if (!customerName.trim()) {
          throw new Error('Please provide your full name.');
        }
        await signUpCustomer(customerEmail, customerPassword, customerName);
        setCustomerSuccess('Account created successfully! Welcome to Vagvat Ayurveda.');
        setTimeout(() => navigate('/account'), 600);
      } else {
        await loginCustomer(customerEmail, customerPassword);
        setCustomerSuccess('Welcome back! Directing to your account...');
        const from = location.state?.from?.pathname || '/account';
        setTimeout(() => navigate(from), 500);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password. Please try again or reset password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setCustomerError(msg);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setCustomerError('');
    setCustomerLoading(true);
    try {
      const { role } = await loginWithGoogle();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/account';
        navigate(from);
      }
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setCustomerError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setCustomerLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMessage('');
    setForgotLoading(true);

    try {
      if (!forgotEmail) throw new Error('Please enter your email address.');
      await resetPassword(forgotEmail);
      setForgotMessage(`Password reset link dispatched to ${forgotEmail}. Please check your inbox.`);
    } catch (err) {
      setForgotError(err.message || 'Could not send reset email. Ensure the address is registered.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Admin Form Submit
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    setAdminLoading(true);

    try {
      if (adminMode === 'register') {
        await registerAdmin(adminEmail, adminPassword, adminPassphrase);
        setAdminSuccess('Admin credentials verified & authorized! Directing to Admin Portal...');
        setTimeout(() => navigate('/admin'), 700);
      } else {
        await loginAdmin(adminEmail, adminPassword);
        setAdminSuccess('Admin authenticated. Granting clearance...');
        setTimeout(() => navigate('/admin'), 600);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Admin authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid administrative credentials. Access denied.';
      }
      setAdminError(msg);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D241A] via-[#102C20] to-[#0A1B13] text-[#F7F0DF] py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center">
      
      {/* Ambient Celestial Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#DCE5D5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#C9A45C_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* CENTERED BRAND HEADER */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Circular Gold-Framed Emblem Logo */}
          <Link to="/" className="inline-block group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#C9A45C] via-[#DFC282] to-[#B8860B] shadow-[0_0_25px_rgba(201,164,92,0.4)] group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/images/logo.jpg" 
                alt="Vagvat Ayurveda" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </Link>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#F7F0DF] mt-3">
            VAGVAT AYURVEDA
          </h1>
          
          <div className="flex items-center justify-center space-x-2 mt-1">
            <div className="w-8 h-[1px] bg-[#C9A45C]/60" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#DFC282] font-semibold">
              Sacred Apothecary & Portal Access
            </span>
            <div className="w-8 h-[1px] bg-[#C9A45C]/60" />
          </div>

          <p className="text-xs sm:text-sm text-[#DCE5D5]/80 max-w-md mx-auto mt-2 font-light">
            Pure Shastriya Formulations handcrafted from ancient Ayurvedic texts.
          </p>
        </div>

        {/* TWO COMPACT CARDS SIDE BY SIDE ON DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* CARD 1: IVORY USER LOGIN CARD (LEFT)                     */}
          {/* ======================================================== */}
          <div className="bg-[#F7F0DF] text-[#263629] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C9A45C]/50 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C9A45C] via-[#DFC282] to-[#C9A45C]" />

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#173D2B] text-[#DFC282] flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#173D2B]">
                      {customerMode === 'signup' ? 'Create Customer Account' : 'Customer Sanctuary'}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider text-[#79583B] font-semibold block">
                      Apothecary Member Access
                    </span>
                  </div>
                </div>

                {/* Mode Toggle Pill */}
                <div className="flex bg-[#E8DFC8] p-0.5 rounded-full text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('login');
                      setCustomerError('');
                      setCustomerSuccess('');
                    }}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      customerMode === 'login' 
                        ? 'bg-[#173D2B] text-[#F7F0DF] shadow-sm' 
                        : 'text-[#4A5B4D] hover:text-[#173D2B]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('signup');
                      setCustomerError('');
                      setCustomerSuccess('');
                    }}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      customerMode === 'signup' 
                        ? 'bg-[#173D2B] text-[#F7F0DF] shadow-sm' 
                        : 'text-[#4A5B4D] hover:text-[#173D2B]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#4A5B4D] mb-5 leading-relaxed">
                {customerMode === 'signup' 
                  ? 'Join our circle to save orders, get custom Dosha plans and Vaidya guidance.'
                  : 'Access your formulation orders, saved addresses and Ayurvedic wellness records.'}
              </p>

              {/* Status Alerts */}
              {customerError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{customerError}</span>
                </div>
              )}

              {customerSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{customerSuccess}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={customerLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-[#C9A45C]/40 bg-white hover:bg-[#FAF6ED] text-xs font-semibold text-[#173D2B] transition-all flex items-center justify-center space-x-2.5 shadow-sm hover:shadow cursor-pointer disabled:opacity-50 mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center mb-4">
                <div className="flex-grow border-t border-[#C9A45C]/30" />
                <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-[#79583B] font-semibold">
                  or with email
                </span>
                <div className="flex-grow border-t border-[#C9A45C]/30" />
              </div>

              {/* Form */}
              <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                {/* Full Name for Sign Up */}
                {customerMode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#173D2B] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#79583B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sharma"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-white text-xs text-[#173D2B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-[#173D2B] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#79583B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-white text-xs text-[#173D2B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#173D2B] uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#79583B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showCustomerPassword ? 'text' : 'password'}
                      required
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 rounded-xl border border-[#C9A45C]/40 bg-white text-xs text-[#173D2B] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#79583B] hover:text-[#173D2B] cursor-pointer"
                    >
                      {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#173D2B] rounded cursor-pointer"
                    />
                    <span className="text-[#4A5B4D] text-[11px]">Remember me</span>
                  </label>

                  {customerMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(customerEmail);
                        setForgotModalOpen(true);
                      }}
                      className="text-[11px] text-[#79583B] hover:text-[#173D2B] font-semibold underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={customerLoading}
                  className="w-full py-2.5 rounded-xl bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {customerLoading ? (
                    <div className="w-4 h-4 border-2 border-[#C9A45C] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{customerMode === 'signup' ? 'Create My Account' : 'Sign In to Account'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C9A45C]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 mt-4 border-t border-[#C9A45C]/30 text-center text-[11px] text-[#4A5B4D]">
              {customerMode === 'login' ? (
                <p>
                  New to Vagvat Ayurveda?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('signup');
                      setCustomerError('');
                    }}
                    className="font-bold text-[#173D2B] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an apothecary account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode('login');
                      setCustomerError('');
                    }}
                    className="font-bold text-[#173D2B] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>

          </div>

          {/* ======================================================== */}
          {/* CARD 2: DARK-GREEN ADMIN PORTAL CARD (RIGHT)             */}
          {/* ======================================================== */}
          <div className="bg-[#102C20] text-[#F7F0DF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C9A45C] flex flex-col justify-between relative overflow-hidden">
            
            {/* Dedicated Top Glowing Gold Rim */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#B8860B] via-[#DFC282] to-[#C9A45C]" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A45C]/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#C9A45C] text-[#102C20] flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F7F0DF] flex items-center space-x-1.5">
                      <span>Vaidya & Admin Portal</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#C9A45C]/20 text-[#DFC282] border border-[#C9A45C]/40 font-mono font-bold uppercase">
                        RESTRICTED
                      </span>
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">
                      Dispensary Management & Operations
                    </span>
                  </div>
                </div>

                {/* Admin Mode Pill */}
                <div className="flex bg-[#0A1B13] p-0.5 rounded-full text-[10px] font-semibold border border-[#C9A45C]/30">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminMode('login');
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      adminMode === 'login' 
                        ? 'bg-[#C9A45C] text-[#102C20] font-bold shadow-sm' 
                        : 'text-[#DCE5D5]/70 hover:text-white'
                    }`}
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminMode('register');
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                      adminMode === 'register' 
                        ? 'bg-[#C9A45C] text-[#102C20] font-bold shadow-sm' 
                        : 'text-[#DCE5D5]/70 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#DCE5D5]/80 mb-5 leading-relaxed font-light">
                {adminMode === 'register'
                  ? 'Authorized setup for new dispensary managers using the cryptographic authorization key.'
                  : 'Authorized clearance for dispensary orders, formulation stock, customer profiles & analytics.'}
              </p>

              {/* Status Alerts */}
              {adminError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              {adminSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                {/* Admin Email */}
                <div>
                  <label className="block text-[11px] font-bold text-[#DFC282] uppercase tracking-wider mb-1">
                    Vaidya / Admin Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C9A45C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@vagvatayurveda.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-[#0D241A] text-xs text-[#F7F0DF] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#DFC282] uppercase tracking-wider mb-1">
                    Security Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#C9A45C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 rounded-xl border border-[#C9A45C]/40 bg-[#0D241A] text-xs text-[#F7F0DF] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A45C]/80 hover:text-[#C9A45C] cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Authorization Passphrase (Only when registering/claiming admin) */}
                {adminMode === 'register' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#DFC282] uppercase tracking-wider">
                        Dispensary Authorization Passphrase *
                      </label>
                      <span className="text-[10px] text-[#C9A45C] font-mono">Default: VAGVAT-ADMIN-2025</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#C9A45C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={adminPassphrase}
                        onChange={(e) => setAdminPassphrase(e.target.value)}
                        placeholder="Enter master authorization key"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-[#0D241A] text-xs text-[#F7F0DF] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                      />
                    </div>
                  </div>
                )}

                {/* Security Badge Pill */}
                <div className="p-2.5 rounded-xl bg-black/30 border border-[#C9A45C]/25 flex items-center space-x-2 text-[10px] text-[#DCE5D5]/80">
                  <Shield className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                  <span>Role-based 256-bit encrypted authentication. Protected admin routing enabled.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {adminLoading ? (
                    <div className="w-4 h-4 border-2 border-[#102C20] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>{adminMode === 'register' ? 'Authorize & Create Admin' : 'Secure Admin Login'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 mt-4 border-t border-[#C9A45C]/25 text-center text-[10px] text-[#DCE5D5]/60 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Protected Portal</span>
              </span>
              <span>Dispensary Staff Only</span>
            </div>

          </div>

        </div>

        {/* BOTTOM HELPLINE / ASSISTANCE */}
        <div className="text-center mt-8 text-xs text-[#DCE5D5]/70">
          <span>Need consultation or account assistance? </span>
          <a href="tel:+918059507909" className="text-[#DFC282] font-semibold hover:underline">
            Vaidya Helpline: +91 80595 07909
          </a>
          <span className="mx-2">•</span>
          <Link to="/" className="text-[#DFC282] hover:underline">
            Return to Homepage
          </Link>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-[#F7F0DF] text-[#263629] rounded-2xl p-6 shadow-2xl border border-[#C9A45C]/60 space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9A45C]/30 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="font-serif text-lg font-bold text-[#173D2B]">Reset Account Password</h3>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-500 hover:text-black text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4A5B4D] leading-relaxed">
              Enter your registered customer email address. We will send you an official password recovery link.
            </p>

            {forgotError && (
              <div className="p-3 rounded-lg bg-red-100 text-red-800 text-xs">
                {forgotError}
              </div>
            )}

            {forgotMessage && (
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-800 text-xs">
                {forgotMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#173D2B] uppercase mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-white text-xs text-[#173D2B] focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2 rounded-lg bg-[#173D2B] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider hover:bg-[#102C20] cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
