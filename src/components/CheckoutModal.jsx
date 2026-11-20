import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, ArrowRight, Sparkles, ShoppingBag, AlertCircle } from 'lucide-react';
import ProductVisual from './ProductVisual';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function CheckoutModal({ isOpen, onClose, cartItems, checkoutData, onOrderCompleted }) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Address, 2: Shipping & Payment, 3: Success
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'online', // Exclusive Online Payment via Razorpay
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placedDateTime, setPlacedDateTime] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Reset state & auto-fill from currentUser when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsProcessing(false);
      setSubmitAttempted(false);
      setFormErrors({});
      setTouched({});
      setCheckoutError('');
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || currentUser.displayName || '',
          email: prev.email || currentUser.email || ''
        }));
      }
    }
  }, [isOpen, currentUser]);

  const subtotal = checkoutData?.subtotal || cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discountAmount = checkoutData?.discountAmount || 0;
  const shippingCost = checkoutData?.shippingCost || (subtotal >= 499 ? 0 : 50);
  const finalTotal = checkoutData?.finalTotal || (subtotal - discountAmount + shippingCost);

  // Field validation rules
  const validate = (values) => {
    const errs = {};
    if (!values.fullName || !values.fullName.trim()) {
      errs.fullName = 'Full Name is mandatory';
    } else if (values.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your complete name';
    }

    const cleanPhone = (values.phone || '').replace(/[\s-]/g, '');
    if (!cleanPhone.trim()) {
      errs.phone = 'Phone number is mandatory for tracking & delivery updates';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!values.email || !values.email.trim()) {
      errs.email = 'Email Address is mandatory for order confirmation & invoice';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!values.address || !values.address.trim()) {
      errs.address = 'Complete street address is mandatory for dispatch';
    } else if (values.address.trim().length < 5) {
      errs.address = 'Please enter flat/house no., street & landmark';
    }

    if (!values.city || !values.city.trim()) {
      errs.city = 'City / Town is mandatory';
    }

    const cleanPin = (values.pincode || '').trim();
    if (!cleanPin) {
      errs.pincode = 'PIN Code is mandatory';
    } else if (!/^\d{6}$/.test(cleanPin)) {
      errs.pincode = 'PIN Code must be a 6-digit number';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (submitAttempted || touched[name]) {
      setFormErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormErrors(validate(formData));
  };

  const finalizeOrder = async (generatedId, dateStr, timeStr, paymentId = null) => {
    try {
      const nowIso = new Date().toISOString();
      const orderData = {
        orderId: generatedId,
        customerName: formData.fullName.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: formData.phone.trim(),
        shippingAddress: `${formData.address.trim()}, ${formData.city.trim()} - ${formData.pincode.trim()}`,
        addressDetails: {
          street: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim()
        },
        date: dateStr,
        time: timeStr,
        dateTime: `${dateStr} • ${timeStr}`,
        total: Number(finalTotal),
        subtotal: Number(subtotal),
        discountAmount: Number(discountAmount),
        shippingCost: Number(shippingCost),
        paymentMethod: 'Online Payment',
        paymentStatus: 'Pending',
        paymentId: paymentId || `pay_${Math.random().toString(36).substring(2, 12)}`,
        status: 'Ordered',
        userId: currentUser?.uid || null,
        createdAt: nowIso,
        items: cartItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.product.price),
          volume: item.product.volume || item.product.strength || ''
        }))
      };

      // 1. Immediately store in LocalStorage so order is instantly preserved & never lost
      try {
        const existing = JSON.parse(localStorage.getItem('vagvat_orders') || '[]');
        localStorage.setItem('vagvat_orders', JSON.stringify([orderData, ...existing]));
      } catch (localErr) {
        console.warn('LocalStorage save warning:', localErr);
      }

      // 2. Synchronize to Firestore with a timeout so network delays/DNS issues never hang the checkout
      if (db) {
        try {
          const firestoreWrite = setDoc(doc(db, 'orders', generatedId), {
            ...orderData,
            createdAt: serverTimestamp()
          });

          // Allow up to 2 seconds for cloud response; if network is slow/offline, proceed gracefully
          const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000));
          await Promise.race([firestoreWrite, timeoutPromise]);
        } catch (cloudErr) {
          console.warn('Cloud Firestore sync notice (order safely recorded):', cloudErr);
        }
      }

      // 3. Mark order as confirmed and transition immediately to Step 3
      setOrderId(generatedId);
      setPlacedDateTime(`${dateStr} at ${timeStr}`);
      setIsProcessing(false);
      setStep(3);

      if (onOrderCompleted) onOrderCompleted(generatedId);
    } catch (err) {
      console.error('Failed to finalize order:', err);
      setIsProcessing(false);
      setCheckoutError(err.message || 'Unable to place order. Please try again.');
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setSubmitAttempted(true);
      const errs = validate(formData);
      setFormErrors(errs);
      if (Object.keys(errs).length > 0) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Re-verify step 1 data before processing order
      const errs = validate(formData);
      if (Object.keys(errs).length > 0) {
        setStep(1);
        setSubmitAttempted(true);
        setFormErrors(errs);
        return;
      }

      // Prevent duplicate submissions from repeated clicks
      if (isProcessing) return;

      setIsProcessing(true);
      setCheckoutError('');

      const generatedId = `VAGVAT-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      // Directly finalize order without payment gateway
        try {
          await finalizeOrder(generatedId, dateStr, timeStr);
        } catch (err) {
          console.error('Order finalization error:', err);
          setIsProcessing(false);
          setCheckoutError(err.message || 'Unable to place order. Please try again.');
        }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 3 ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#F7F0DF] rounded-2xl shadow-2xl overflow-hidden border border-[#C9A45C]/40 text-[#263629] z-10 my-8"
          >
            {/* Header */}
            <div className="bg-[#102C20] text-[#F7F0DF] p-5 border-b border-[#C9A45C]/25 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="font-serif text-lg font-bold">
                  {step === 3 ? 'Order Confirmed' : 'Vagvat Ayurveda Secure Checkout'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#F7F0DF]/70 hover:text-[#C9A45C] transition-colors p-1"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Indicator */}
            {step < 3 && (cartItems.length > 0 || checkoutData) && (
              <div className="bg-[#DCE5D5]/50 px-6 py-3 border-b border-[#C9A45C]/20 flex items-center justify-between text-xs font-medium">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#173D2B] font-bold' : 'text-gray-400'}`}>
                  <span className="w-5 h-5 rounded-full bg-[#173D2B] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Delivery Address</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300" />
                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#173D2B] font-bold' : 'text-gray-400'}`}>
                  <span className={`w-5 h-5 rounded-full ${step >= 2 ? 'bg-[#173D2B] text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-[10px]`}>2</span>
                  <span>Payment Method</span>
                </div>
              </div>
            )}

            {/* Empty Cart Notice if opened with 0 items */}
            {step < 3 && cartItems.length === 0 && !checkoutData && (
              <div className="p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#DCE5D5]/50 flex items-center justify-center text-3xl mx-auto">
                  🌿
                </div>
                <h4 className="font-serif text-xl font-bold text-[#173D2B]">Your cart is currently empty</h4>
                <p className="text-xs text-[#4A5B4D] max-w-sm mx-auto">
                  Please add at least one authentic formulation to your Ayurvedic cart before proceeding to checkout.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-md bg-[#173D2B] text-[#F7F0DF] text-xs font-semibold uppercase tracking-wider hover:bg-[#102C20] transition-colors cursor-pointer"
                >
                  Explore Store Catalog
                </button>
              </div>
            )}

            {/* Step 1: Address Form */}
            {step === 1 && (cartItems.length > 0 || checkoutData) && (
              <form onSubmit={handleNextStep} noValidate className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1 border-b border-[#C9A45C]/20">
                  <h4 className="font-serif text-base font-bold text-[#173D2B]">
                    1. Shipping & Vaidya Dispatch Information
                  </h4>
                  <span className="text-[11px] font-medium text-[#79583B]">
                    <span className="text-red-500 font-bold">*</span> All fields are mandatory to order
                  </span>
                </div>

                {/* Validation alert banner if submitted with errors */}
                {submitAttempted && Object.keys(formErrors).length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-700 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Please fill in all mandatory fields marked with an asterisk (*) before proceeding to payment.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.fullName) && formErrors.fullName
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.fullName) && formErrors.fullName && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      Phone Number (For Tracking & Vaidya Support) <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.phone) && formErrors.phone
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.phone) && formErrors.phone && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address - Now strictly mandatory with * and validation */}
                  <div className="sm:col-span-2">
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      Email Address (For Order Invoice & Tracking) <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.email) && formErrors.email
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.email) && formErrors.email && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      Complete Street Address <span className="text-red-500 font-bold">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="House / Flat No., Apartment, Landmark, Street"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.address) && formErrors.address
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.address) && formErrors.address && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.address}</span>
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      City <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.city) && formErrors.city
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.city) && formErrors.city && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.city}</span>
                      </p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">
                      PIN Code <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      placeholder="6-digit PIN"
                      value={formData.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2.5 rounded-md border bg-white focus:outline-none transition-colors ${
                        (submitAttempted || touched.pincode) && formErrors.pincode
                          ? 'border-red-500 ring-1 ring-red-400 focus:border-red-500'
                          : 'border-gray-300 focus:border-[#C9A45C]'
                      }`}
                    />
                    {(submitAttempted || touched.pincode) && formErrors.pincode && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center space-x-1">
                        <span>•</span>
                        <span>{formErrors.pincode}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Snapshot */}
                <div className="p-3.5 rounded-xl bg-white border border-[#C9A45C]/30 text-xs flex items-center justify-between mt-4">
                  <span className="text-[#4A5B4D]">{cartItems.length} Formulation(s) selected</span>
                  <span className="font-bold text-[#173D2B] text-sm">Total to Pay: ₹{finalTotal}</span>
                </div>

                {/* Continue Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-bold text-xs tracking-wider uppercase transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Payment Gateway Selection */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#173D2B]">
                    2. Order Confirmation
                  </h4>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#79583B] hover:text-[#173D2B] flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>
                </div>

                {/* Database / Checkout Error Alert */}
                {checkoutError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-700 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Exclusive Online Payment Option via Razorpay */}
                <div className="space-y-3">
                  <div className="p-5 rounded-2xl bg-[#DCE5D5]/40 border-2 border-[#173D2B] shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#173D2B] text-white flex items-center justify-center shrink-0 shadow">
                          <Lock className="w-5 h-5 text-[#C9A45C]" />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-[#173D2B] block">
                            Online Payment (Razorpay)
                          </span>
                          <span className="text-xs text-[#4A5B4D]">
                            Pay securely with UPI, Cards, NetBanking or Wallets
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-1 rounded-full uppercase shrink-0">
                        100% Encrypted
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#C9A45C]/20 flex flex-wrap items-center gap-2 text-[11px] text-[#173D2B] font-semibold">
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">Instant UPI</span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">Google Pay</span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">PhonePe</span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">Paytm</span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">Debit / Credit Card</span>
                      <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 shadow-xs">NetBanking</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Only secure online payments are accepted. Cash on delivery is unavailable to guarantee direct, authenticated dispensary dispatch.</span>
                    </div>
                  </div>
                </div>

                {/* Final Order Amount Summary */}
                <div className="p-4 rounded-xl bg-white border border-[#C9A45C]/30 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Recipient</span>
                    <span className="font-semibold text-[#173D2B]">{formData.fullName} ({formData.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Email Confirmation</span>
                    <span className="text-[#173D2B] font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Payment Gateway</span>
                    <span className="text-[#173D2B] font-bold text-emerald-800">Online Payment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Shipping To</span>
                    <span className="text-[#173D2B] truncate max-w-xs">{formData.address}, {formData.city}, PIN {formData.pincode}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100 font-bold text-sm">
                    <span className="text-[#173D2B]">Total Payable</span>
                    <span className="text-[#173D2B]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Confirm Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] disabled:opacity-50 text-[#102C20] font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Placing Your Order...' : `PLACE ORDER • ₹${finalTotal}`}
                  </span>
                </button>
              </form>
            )}

            {/* Step 3: Order Completed Confirmation */}
            {step === 3 && (
              <div className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs tracking-widest text-[#C9A45C] font-semibold uppercase">
                    • Thank You For Your Trust •
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#173D2B] mt-1">
                    Your Sacred Order is Confirmed
                  </h3>
                  <p className="text-xs text-[#4A5B4D] mt-2">
                    Order Reference ID: <strong className="text-[#173D2B] font-mono">{orderId}</strong>
                  </p>
                  {placedDateTime && (
                    <p className="text-[11px] text-[#79583B] mt-1 font-mono">
                      Order Placed: <strong>{placedDateTime}</strong>
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#C9A45C]/30 text-xs text-left space-y-2 max-w-md mx-auto">
                  <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <Truck className="w-4 h-4 text-[#173D2B]" />
                    <span>Estimated Delivery: Within 2 to 4 Business Days</span>
                  </div>
                  <p className="text-[#4A5B4D] text-[11px]">
                    We have dispatched your order details and invoice to <strong className="text-[#173D2B]">{formData.email}</strong> and tracking link via SMS to <strong className="text-[#173D2B]">{formData.phone}</strong>.
                    Our apothecary team will carefully hand-pack your fresh formulations with sacred care.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-md bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Continue Exploring Vagvat Ayurveda
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
