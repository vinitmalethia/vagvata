import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  Package, 
  Clock, 
  Phone, 
  Sparkles, 
  ChevronRight, 
  ExternalLink,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function CustomerAccountPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'address' | 'wellness'
  const [orders, setOrders] = useState([]);
  const [addressData, setAddressData] = useState({
    fullName: currentUser?.displayName || '',
    phone: '',
    address: '',
    city: '',
    state: 'Haryana',
    pincode: ''
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Load orders with Real-Time Firestore Sync & Offline Cache Fallback
  useEffect(() => {
    // 1. Initial cached orders
    try {
      const stored = localStorage.getItem('vagvat_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        const userOrders = parsed.filter(o => !o.customerEmail || o.customerEmail === currentUser?.email);
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.warn('Orders load error:', e);
    }

    // 2. Real-time Firestore sync for customer orders
    let unsubscribe = () => {};
    if (db && currentUser?.email) {
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', currentUser.email)
        );
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const customerOrders = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              customerOrders.push({
                id: docSnap.id,
                orderId: data.orderId || docSnap.id,
                customerName: data.customerName || 'Customer',
                customerEmail: data.customerEmail || '',
                customerPhone: data.customerPhone || '',
                shippingAddress: data.shippingAddress || '',
                date: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'),
                total: Number(data.total) || 0,
                paymentMethod: data.paymentMethod || 'Online Payment (Razorpay)',
                paymentStatus: data.paymentStatus || 'Paid',
                status: data.status === 'Delivered' ? 'Delivered' : 'Ordered',
                items: data.items || [],
                createdAt: data.createdAt || null
              });
            });

            customerOrders.sort((a, b) => {
              const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
              const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
              return timeB - timeA;
            });

            if (customerOrders.length > 0) {
              setOrders(customerOrders);
            }
          },
          (err) => {
            console.warn('Customer live orders listener notice:', err);
          }
        );
      } catch (err) {
        console.warn('Error setting up customer orders listener:', err);
      }
    }

    try {
      const savedAddr = localStorage.getItem(`vagvat_addr_${currentUser?.uid}`);
      if (savedAddr) {
        setAddressData(JSON.parse(savedAddr));
      }
    } catch {}

    return () => unsubscribe();
  }, [currentUser]);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(`vagvat_addr_${currentUser?.uid}`, JSON.stringify(addressData));
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="py-12 sm:py-16 bg-[#F7F0DF] min-h-screen text-[#263629]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CUSTOMER TOP BANNER CARD */}
        <div className="bg-[#102C20] text-[#F7F0DF] rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/40 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* User Details */}
            <div className="flex items-center space-x-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#C9A45C] to-[#DFC282] text-[#102C20] flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                {(currentUser?.displayName || currentUser?.email || 'V')[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F0DF]">
                    Namaste, {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A45C]/25 text-[#DFC282] border border-[#C9A45C]/40 uppercase font-bold tracking-wider">
                    Patron
                  </span>
                </div>
                <p className="text-xs text-[#DCE5D5]/80 mt-1">
                  {currentUser?.email}
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-3 mt-2 text-[11px] text-[#C9A45C]">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Ayurvedic Sanctuary Member</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link
                to="/shop"
                className="px-4 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#DFC282] text-[#102C20] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Catalog</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex space-x-2 border-b border-[#C9A45C]/30 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-[#79583B] hover:text-[#173D2B]'
            }`}
          >
            <Package className="w-4 h-4 text-[#C9A45C]" />
            <span>Formulation Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'address'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-[#79583B] hover:text-[#173D2B]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#C9A45C]" />
            <span>Saved Delivery Address</span>
          </button>

          <button
            onClick={() => setActiveTab('wellness')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'wellness'
                ? 'border-[#173D2B] text-[#173D2B]'
                : 'border-transparent text-[#79583B] hover:text-[#173D2B]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C9A45C]" />
            <span>Prakriti & Vaidya Profile</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border border-[#C9A45C]/35 text-center shadow-sm">
                <Package className="w-12 h-12 text-[#C9A45C] mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-[#173D2B]">No Past Orders Found</h3>
                <p className="text-xs text-[#4A5B4D] max-w-sm mx-auto mt-1 mb-5">
                  You haven't ordered any classical formulations yet. Experience pure Shastriya remedies prepared with Swarna Bhasma.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 rounded-xl bg-[#173D2B] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider hover:bg-[#102C20] transition-colors"
                >
                  Explore Master Formulations
                </Link>
              </div>
            ) : (
              orders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#C9A45C]/35 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-2">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#79583B] font-bold block">
                        Order ID
                      </span>
                      <span className="font-mono font-bold text-sm sm:text-base text-[#173D2B]">
                        {order.orderId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#79583B] font-bold block">
                        Order Date
                      </span>
                      <span className="text-xs text-[#263629]">
                        {order.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-[#79583B] font-bold block">
                        Total Amount
                      </span>
                      <span className="font-bold text-sm sm:text-base text-[#173D2B]">
                        ₹{order.total}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{order.status === 'Delivered' ? 'Delivered' : 'Ordered'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-[#F7F0DF] border border-[#C9A45C]/30 flex items-center justify-center font-serif text-[#173D2B] font-bold text-xs">
                            🌿
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#173D2B]">{item.name}</h4>
                            <span className="text-[11px] text-[#4A5B4D]">{item.volume || item.strength} • Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#173D2B]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#79583B] gap-2">
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
                      <span>Insured Botanical Packaging • Hand-sealed by certified Vaidya</span>
                    </span>
                    <a href="tel:+918059507909" className="text-[#173D2B] font-bold hover:underline">
                      Need support? Call +91 80595 07909
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ADDRESS */}
        {activeTab === 'address' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/35 shadow-sm max-w-2xl">
            <h3 className="font-serif text-xl font-bold text-[#173D2B] mb-2 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#C9A45C]" />
              <span>Default Delivery Address</span>
            </h3>
            <p className="text-xs text-[#4A5B4D] mb-6">
              Saved shipping coordinates used for 1-click expedited checkout on your future Ayurvedic orders.
            </p>

            {addressSaved && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Delivery address saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#173D2B] font-bold mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={addressData.fullName}
                    onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-[#173D2B] font-bold mb-1">Mobile Contact (+91)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 80595 07909"
                    value={addressData.phone}
                    onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#173D2B] font-bold mb-1">Street Address, House No., Locality</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Ho. no. 679, Village Barsi (133)"
                  value={addressData.address}
                  onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#173D2B] font-bold mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-[#173D2B] font-bold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-[#173D2B] font-bold mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addressData.pincode}
                    onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#173D2B] text-[#F7F0DF] font-bold uppercase tracking-wider hover:bg-[#102C20] transition-colors cursor-pointer"
              >
                Save Shipping Address
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: WELLNESS & VAIDYA GUIDANCE */}
        {activeTab === 'wellness' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/35 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#173D2B] text-[#DFC282] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#C9A45C]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#173D2B]">
                Prakriti & Tridosha Assessment
              </h3>
              <p className="text-xs text-[#4A5B4D] leading-relaxed">
                Ayurveda classifies bodily constitution into Vata, Pitta, and Kapha. Identifying your Prakriti allows precise Rasayana selection for optimal bio-availability.
              </p>
              <Link
                to="/#dosha"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#173D2B] text-[#F7F0DF] text-xs font-bold uppercase tracking-wider hover:bg-[#102C20] transition-colors"
              >
                <span>Take Classical Dosha Test</span>
                <ChevronRight className="w-4 h-4 text-[#C9A45C]" />
              </Link>
            </div>

            <div className="bg-[#102C20] text-[#F7F0DF] rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/40 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#173D2B] text-[#DFC282] flex items-center justify-center border border-[#C9A45C]/30">
                <Phone className="w-6 h-6 text-[#C9A45C]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F7F0DF]">
                Complimentary Vaidya Tele-Consultation
              </h3>
              <p className="text-xs text-[#DCE5D5]/80 leading-relaxed font-light">
                Every patron of Vagvat Ayurveda is entitled to personalized anupana (carrier milk/honey) recommendations and dosage scheduling directly from our Vaidyas.
              </p>
              <a
                href="tel:+918059507909"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#102C20] text-xs font-bold uppercase tracking-wider hover:bg-[#DFC282] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Helpline: +91 80595 07909</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
