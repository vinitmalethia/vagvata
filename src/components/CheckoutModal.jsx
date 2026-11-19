import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function CheckoutModal({ isOpen, onClose, cartItems, checkoutData, onOrderCompleted }) {
  const [step, setStep] = useState(1); // 1: Address, 2: Shipping & Payment, 3: Success
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi', // upi, card, cod, netbanking
  });
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const subtotal = checkoutData?.subtotal || cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const discountAmount = checkoutData?.discountAmount || 0;
  const shippingCost = checkoutData?.shippingCost || (subtotal >= 499 ? 0 : 50);
  const finalTotal = checkoutData?.finalTotal || (subtotal - discountAmount + shippingCost);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
        alert('Please fill in your complete delivery details (Name, Phone, Address, PIN code).');
        return;
      }
      if (formData.phone.trim().length < 10) {
        alert('Please enter a valid 10-digit mobile number for order delivery updates.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        const generatedId = `VAGVAT-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedId);
        setIsProcessing(false);
        setStep(3);
        if (onOrderCompleted) onOrderCompleted(generatedId);
      }, 1500);
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
              <form onSubmit={handleNextStep} className="p-6 space-y-4">
                <h4 className="font-serif text-base font-bold text-[#173D2B]">
                  1. Shipping & Vaidya Dispatch Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">Phone Number (For Tracking & Vaidya Support) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#4A5B4D] mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#4A5B4D] mb-1 font-medium">Complete Street Address *</label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="House / Flat No., Apartment, Landmark, Street"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4A5B4D] mb-1 font-medium">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="6-digit PIN"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:border-[#C9A45C]"
                    />
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
                    className="w-full sm:w-auto px-8 py-3 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] font-bold text-xs tracking-wider uppercase transition-colors shadow flex items-center justify-center space-x-2"
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
                    2. Select Secure Payment Method
                  </h4>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#79583B] hover:text-[#173D2B] flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Address</span>
                  </button>
                </div>

                {/* Payment Options (Razorpay Style) */}
                <div className="space-y-3">
                  {/* UPI Option */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'upi' ? 'bg-[#DCE5D5]/40 border-[#173D2B] ring-1 ring-[#173D2B]' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                        className="text-[#173D2B] focus:ring-[#C9A45C]"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#173D2B] block">Instant UPI / QR Code (Razorpay)</span>
                        <span className="text-xs text-[#4A5B4D]">Google Pay, PhonePe, Paytm, BHIM or any UPI App</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Recommended</span>
                  </label>

                  {/* Cards Option */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'bg-[#DCE5D5]/40 border-[#173D2B] ring-1 ring-[#173D2B]' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                        className="text-[#173D2B] focus:ring-[#C9A45C]"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#173D2B] block">Credit / Debit Card</span>
                        <span className="text-xs text-[#4A5B4D]">Visa, MasterCard, RuPay, American Express</span>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </label>

                  {/* Cash on Delivery Option */}
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'bg-[#DCE5D5]/40 border-[#173D2B] ring-1 ring-[#173D2B]' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="text-[#173D2B] focus:ring-[#C9A45C]"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#173D2B] block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-[#4A5B4D]">Pay with cash or UPI at the time of doorstep delivery</span>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-gray-400" />
                  </label>
                </div>

                {/* Final Order Amount Summary */}
                <div className="p-4 rounded-xl bg-white border border-[#C9A45C]/30 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Recipient</span>
                    <span className="font-semibold text-[#173D2B]">{formData.fullName} ({formData.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A5B4D]">Shipping To</span>
                    <span className="text-[#173D2B] truncate max-w-xs">{formData.city}, PIN {formData.pincode}</span>
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
                  className="w-full py-3.5 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] disabled:opacity-50 text-[#102C20] font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Verifying with Razorpay...' : `COMPLETE ORDER • ₹${finalTotal}`}
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
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#C9A45C]/30 text-xs text-left space-y-2 max-w-md mx-auto">
                  <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                    <Truck className="w-4 h-4 text-[#173D2B]" />
                    <span>Estimated Delivery: Within 2 to 4 Business Days</span>
                  </div>
                  <p className="text-[#4A5B4D] text-[11px]">
                    We have dispatched your order details to <strong className="text-[#173D2B]">{formData.phone}</strong>. 
                    Our apothecary team will carefully hand-pack your fresh formulations with sacred care.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-md bg-[#173D2B] hover:bg-[#102C20] text-[#F7F0DF] text-xs font-semibold tracking-wider uppercase transition-colors"
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
