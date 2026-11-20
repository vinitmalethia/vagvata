import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Shield,
  Sparkles
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialView = 'customer' }) {
  const navigate = useNavigate();
  const {
    loginCustomer,
    signUpCustomer,
    loginWithGoogle,
    loginAdmin,
    registerAdmin,
    resetPassword
  } = useAuth();

  // Active View: 'customer' or 'admin'
  const [activePortal, setActivePortal] = useState(initialView);

  // Customer State
  const [customerMode, setCustomerMode] = useState('login'); // 'login' | 'signup'
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [customerSuccess, setCustomerSuccess] = useState('');

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  // Admin State
  const [adminMode, setAdminMode] = useState('login'); // 'login' | 'register'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPassphrase, setAdminPassphrase] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Reset or pre-fill on open
  useEffect(() => {
    if (isOpen) {
      setActivePortal(initialView);
      setCustomerError('');
      setCustomerSuccess('');
      setAdminError('');
      setAdminSuccess('');
      setIsForgotMode(false);
      try {
        const saved = localStorage.getItem('vagvat_remember_email');
        if (saved) setCustomerEmail(saved);
      } catch {}
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  // Customer Submit
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
        if (!customerName.trim()) throw new Error('Please enter your full name.');
        await signUpCustomer(customerEmail, customerPassword, customerName);
        setCustomerSuccess('Account created! Welcome to Vagvat Ayurveda.');
        setTimeout(() => {
          onClose();
          navigate('/account');
        }, 600);
      } else {
        await loginCustomer(customerEmail, customerPassword);
        setCustomerSuccess('Welcome back! Logging in...');
        setTimeout(() => {
          onClose();
          navigate('/account');
        }, 500);
      }
    } catch (err) {
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setCustomerError(msg);
    } finally {
      setCustomerLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setCustomerError('');
    setCustomerLoading(true);
    try {
      const { role } = await loginWithGoogle();
      onClose();
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setCustomerError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setCustomerLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotErr('');
    setForgotMsg('');
    setForgotLoading(true);
    try {
      if (!forgotEmail) throw new Error('Please enter your registered email address.');
      await resetPassword(forgotEmail);
      setForgotMsg(`Password reset link dispatched to ${forgotEmail}. Check your inbox.`);
    } catch (err) {
      setForgotErr(err.message || 'Failed to dispatch reset link. Verify your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Admin Submit
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');
    setAdminLoading(true);

    try {
      if (adminMode === 'register') {
        await registerAdmin(adminEmail, adminPassword, adminPassphrase);
        setAdminSuccess('Admin authorized! Directing to Admin Portal...');
        setTimeout(() => {
          onClose();
          navigate('/admin');
        }, 600);
      } else {
        await loginAdmin(adminEmail, adminPassword);
        setAdminSuccess('Admin authenticated. Directing to portal...');
        setTimeout(() => {
          onClose();
          navigate('/admin');
        }, 500);
      }
    } catch (err) {
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md my-8 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#102C20] border border-[#C9A45C] text-[#DFC282] hover:text-white hover:scale-110 flex items-center justify-center shadow-xl z-20 transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ======================================================== */}
          {/* VIEW 1: CUSTOMER LOGIN (DEFAULT)                         */}
          {/* ======================================================== */}
          {activePortal === 'customer' && (
            <div className="bg-[#F7F0DF] text-[#263629] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#C9A45C]/60 relative overflow-hidden">
              {/* Top Accent Rim */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#C9A45C] via-[#DFC282] to-[#C9A45C]" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#173D2B] text-[#DFC282] flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#173D2B] leading-tight">
                      {isForgotMode 
                        ? 'Reset Password'
                        : customerMode === 'signup' 
                        ? 'Create Account' 
                        : 'Customer Sanctuary'}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider text-[#79583B] font-semibold block">
                      Vagvat Ayurveda Member Access
                    </span>
                  </div>
                </div>

                {/* Sign In / Sign Up switch */}
                {!isForgotMode && (
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
                )}
              </div>

              {/* FORGOT PASSWORD FORM */}
              {isForgotMode ? (
                <form onSubmit={handleForgotSubmit} className="space-y-3.5 pt-2">
                  <p className="text-xs text-[#4A5B4D] leading-relaxed">
                    Enter your registered email address. We'll send an official recovery link.
                  </p>

                  {forgotErr && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{forgotErr}</span>
                    </div>
                  )}

                  {forgotMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{forgotMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-[#173D2B] uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#79583B] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C9A45C]/40 bg-white text-xs text-[#173D2B] focus:outline-none focus:ring-2 focus:ring-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(false)}
                      className="text-xs font-semibold text-[#79583B] hover:text-[#173D2B] underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-5 py-2 rounded-xl bg-[#173D2B] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider hover:bg-[#102C20] cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              ) : (
                /* NORMAL LOGIN / SIGN UP FORM */
                <>
                  {/* Status Alerts */}
                  {customerError && (
                    <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{customerError}</span>
                    </div>
                  )}

                  {customerSuccess && (
                    <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{customerSuccess}</span>
                    </div>
                  )}

                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={customerLoading}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#C9A45C]/40 bg-white hover:bg-[#FAF6ED] text-xs font-semibold text-[#173D2B] transition-all flex items-center justify-center space-x-2.5 shadow-sm hover:shadow cursor-pointer disabled:opacity-50 mb-3.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative flex py-1 items-center mb-3">
                    <div className="flex-grow border-t border-[#C9A45C]/30" />
                    <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-[#79583B] font-semibold">
                      or with email
                    </span>
                    <div className="flex-grow border-t border-[#C9A45C]/30" />
                  </div>

                  <form onSubmit={handleCustomerSubmit} className="space-y-3">
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

                    <div className="flex items-center justify-between text-xs pt-0.5">
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
                            setIsForgotMode(true);
                          }}
                          className="text-[11px] text-[#79583B] hover:text-[#173D2B] font-semibold underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={customerLoading}
                      className="w-full py-2.5 rounded-xl bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-3"
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
                </>
              )}

              {/* FOOTER: DISCREET ADMIN PORTAL OPTION AT THE SIDE/BOTTOM */}
              <div className="mt-4 pt-3.5 border-t border-[#C9A45C]/30 flex items-center justify-between text-[11px]">
                <span className="text-[#79583B]">
                  {customerMode === 'login' ? 'New patron?' : 'Already registered?'}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerMode(customerMode === 'login' ? 'signup' : 'login');
                      setCustomerError('');
                    }}
                    className="ml-1 font-bold text-[#173D2B] hover:underline cursor-pointer"
                  >
                    {customerMode === 'login' ? 'Create account' : 'Sign in'}
                  </button>
                </span>

                {/* HIDDEN ADMIN PORTAL SWITCH */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('admin');
                    setAdminError('');
                    setAdminSuccess('');
                  }}
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#79583B] hover:text-[#173D2B] transition-colors py-1 px-2 rounded-lg hover:bg-black/5 cursor-pointer"
                  title="Restricted Vaidya / Dispensary Staff Clearance"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Admin Login</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW 2: ADMIN PORTAL (ONLY REVEALED WHEN TRIGGERED)       */}
          {/* ======================================================== */}
          {activePortal === 'admin' && (
            <div className="bg-[#102C20] text-[#F7F0DF] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#C9A45C] relative overflow-hidden">
              {/* Glowing Gold Rim */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#B8860B] via-[#DFC282] to-[#C9A45C]" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#C9A45C] text-[#102C20] flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F7F0DF] flex items-center space-x-1.5 leading-tight">
                      <span>Vaidya & Admin Portal</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#C9A45C]/20 text-[#DFC282] border border-[#C9A45C]/40 font-mono font-bold uppercase">
                        RESTRICTED
                      </span>
                    </h2>
                    <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">
                      Dispensary Management & Operations
                    </span>
                  </div>
                </div>

                {/* Admin Mode Toggle */}
                <div className="flex bg-[#0A1B13] p-0.5 rounded-full text-[10px] font-semibold border border-[#C9A45C]/30">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminMode('login');
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      adminMode === 'login'
                        ? 'bg-[#C9A45C] text-[#102C20] font-bold shadow-sm'
                        : 'text-[#DCE5D5]/70 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminMode('register');
                      setAdminError('');
                      setAdminSuccess('');
                    }}
                    className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                      adminMode === 'register'
                        ? 'bg-[#C9A45C] text-[#102C20] font-bold shadow-sm'
                        : 'text-[#DCE5D5]/70 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Status Alerts */}
              {adminError && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{adminError}</span>
                </div>
              )}

              {adminSuccess && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-start space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              {/* Admin Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-3">
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

                {adminMode === 'register' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#DFC282] uppercase tracking-wider">
                        Dispensary Authorization Key *
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

                <div className="p-2.5 rounded-xl bg-black/30 border border-[#C9A45C]/25 flex items-center space-x-2 text-[10px] text-[#DCE5D5]/80">
                  <Shield className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                  <span>256-bit encrypted authentication. Protected admin routing enabled.</span>
                </div>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-3"
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

              {/* FOOTER: RETURN TO CUSTOMER LOGIN */}
              <div className="mt-4 pt-3 border-t border-[#C9A45C]/25 flex items-center justify-between text-[11px] text-[#DCE5D5]/70">
                <button
                  type="button"
                  onClick={() => {
                    setActivePortal('customer');
                    setCustomerError('');
                  }}
                  className="inline-flex items-center space-x-1.5 text-[#DFC282] hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Customer Login</span>
                </button>
                <span className="text-[10px] text-[#DCE5D5]/50">Dispensary Staff Only</span>
              </div>

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
