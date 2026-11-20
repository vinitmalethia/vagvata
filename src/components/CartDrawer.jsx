import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function CartDrawer({ isOpen, onClose, cartItems, checkoutAvailable, testOrdersEnabled, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingThreshold = 499;
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 70;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'VAGVAT10' || code === 'AYURVEDA10') {
      setDiscountPercent(10);
      setPromoSuccess('10% Sacred Welcome discount applied!');
    } else if (code === 'VAIDYA15') {
      setDiscountPercent(15);
      setPromoSuccess('15% Vaidya consultation discount applied!');
    } else {
      setPromoError('Invalid promo code. Try "VAGVAT10" for 10% off.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F7F0DF] shadow-2xl z-50 flex flex-col justify-between border-l border-[#C9A45C]/30 text-[#263629]"
          >
            {/* Header */}
            <div className="p-5 bg-[#102C20] text-[#F7F0DF] border-b border-[#C9A45C]/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#C9A45C]" />
                <h3 className="font-serif text-lg font-bold">Your Ayurvedic Cart</h3>
                <span className="text-xs bg-[#173D2B] text-[#DFC282] px-2 py-0.5 rounded-full border border-[#C9A45C]/30 font-medium">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-[#F7F0DF]/70 hover:text-[#C9A45C] hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="px-5 py-3 bg-[#DCE5D5]/50 border-b border-[#C9A45C]/20">
              <div className="flex items-center justify-between text-xs font-medium mb-1 text-[#173D2B]">
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <span>✨ Complimentary Insured Shipping unlocked!</span>
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#173D2B]">₹{shippingThreshold - subtotal}</strong> more for Free Shipping
                  </span>
                )}
                <span>₹{shippingThreshold} Target</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#173D2B] transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-[#DCE5D5]/40 border border-[#C9A45C]/30 flex items-center justify-center text-3xl mb-4">
                    🌿
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#173D2B]">Your cart is empty</h4>
                  <p className="text-xs text-[#4A5B4D] max-w-xs mt-1">
                    Explore our authentic classical Ayurvedic formulations to restore balance and harmony.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded bg-[#173D2B] text-[#F7F0DF] text-xs font-semibold tracking-wider uppercase hover:bg-[#102C20] transition-colors"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-xl bg-white border border-[#C9A45C]/25 shadow-sm flex items-center space-x-3"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-[#F7F0DF]/60 rounded-lg shrink-0 flex items-center justify-center overflow-hidden p-1 border border-gray-100">
                      <ProductVisual product={item.product} className="w-full h-full" showShadow={false} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#173D2B] truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-[#79583B]">
                            {item.product.volume}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 border border-gray-200 rounded-md bg-[#F7F0DF]/30 px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-[#173D2B] hover:text-[#C9A45C] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#173D2B] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-[#173D2B] hover:text-[#C9A45C] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-[#173D2B]">
                            ₹{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-white border-t border-[#C9A45C]/30 space-y-3">
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo Code (try VAGVAT10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md uppercase font-medium focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-md bg-[#173D2B] text-[#F7F0DF] text-xs font-semibold uppercase tracking-wider hover:bg-[#102C20] transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {promoSuccess && (
                  <p className="text-[11px] text-emerald-700 font-medium">{promoSuccess}</p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
                )}

                {/* Subtotals breakdown */}
                <div className="space-y-1.5 text-xs text-[#4A5B4D] pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#173D2B]">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Sacred Promo ({discountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-[#173D2B]">
                      {isFreeShipping ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-[#173D2B] pt-2 border-t border-gray-100">
                    <span>Total Amount</span>
                    <span className="text-base text-[#173D2B]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout({ subtotal, discountAmount, shippingCost, finalTotal });
                  }}
                  disabled={!checkoutAvailable}
                  className="w-full py-3.5 rounded-md bg-[#C9A45C] hover:bg-[#DFC282] disabled:opacity-60 disabled:cursor-not-allowed text-[#102C20] font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-[#C9A45C]/30 cursor-pointer"
                >
                  <span>{testOrdersEnabled ? `PLACE TEST ORDER • ₹${finalTotal}` : checkoutAvailable ? `PROCEED TO CHECKOUT • ₹${finalTotal}` : 'ONLINE PAYMENT SETUP REQUIRED'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Payment status footer */}
                <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{testOrdersEnabled ? 'TEST MODE — no payment will be taken or order dispatched.' : 'Online payment setup is required before checkout is available.'}</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
