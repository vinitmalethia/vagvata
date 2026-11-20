import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Boxes, 
  Users, 
  CreditCard, 
  Tag, 
  TrendingUp, 
  Star, 
  Globe, 
  Settings, 
  LogOut,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  Check,
  X,
  Plus,
  Menu,
  ChevronRight,
  ShieldCheck,
  Percent,
  Edit,
  Save,
  Trash2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductVisual from '../components/ProductVisual';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminDashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active Admin Section (Strictly the exact items requested)
  // 'dashboard' | 'products' | 'orders' | 'inventory' | 'customers' | 'payments' | 'coupons' | 'reports' | 'reviews' | 'website' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState(true);

  // --- Orders State (Synchronized via Cloud Firestore) ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- Products & Inventory State ---
  const [inventory, setInventory] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    hindiName: '',
    category: 'Strength & Stamina',
    price: '',
    originalPrice: '',
    volume: '60 Capsules',
    stockCount: 50,
  });

  // --- Coupons State ---
  const [coupons, setCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem('vagvat_coupons');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // --- Reviews State ---
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('vagvat_customer_reviews');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // --- Website Management State ---
  const [announcementText, setAnnouncementText] = useState('🌿 100% Authentic Classical Formulations • Free Sacred Shipping Across India on Orders Above ₹499');
  const [supportPhone, setSupportPhone] = useState('+91 80595 07909');
  const [shippingThreshold, setShippingThreshold] = useState(499);
  const [dispensaryActive, setDispensaryActive] = useState(true);
  const [websiteSavedNotice, setWebsiteSavedNotice] = useState(false);

  // Real-Time Cross-Device Synchronization via Cloud Firestore
  useEffect(() => {
    // 1. Synchronize Orders in Real Time from Firestore
    if (!db) {
      setOrdersLoading(false);
      setOrdersError('Database connection unavailable.');
      return;
    }

    setOrdersLoading(true);
    const ordersCol = collection(db, 'orders');

    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const liveOrders = [];
        const DEMO_IDS = ['VAGVAT-920184', 'VAGVAT-891042', 'VAGVAT-773820', 'VAGVAT-662910', 'VAGVAT-839201'];
        
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const docOrderId = data.orderId || docSnap.id;
          if (DEMO_IDS.includes(docOrderId)) return; // Exclude legacy demo orders

          liveOrders.push({
            id: docSnap.id,
            orderId: docOrderId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            customerPhone: data.customerPhone || '',
            shippingAddress: data.shippingAddress || '',
            date: data.date || (data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'),
            total: Number(data.total) || 0,
            paymentMethod: data.paymentMethod || 'Not recorded',
            paymentStatus: data.paymentStatus || 'Unverified',
            isTestOrder: data.isTestOrder === true,
            status: data.status === 'Delivered' ? 'Delivered' : 'Ordered',
            items: data.items || [],
            createdAt: data.createdAt || null
          });
        });

        // Sort descending: newest orders first
        liveOrders.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });

        let combinedOrders = liveOrders;
        try {
          const localOrders = JSON.parse(localStorage.getItem('vagvat_orders') || '[]');
          const localOnlyTestOrders = localOrders.filter(order =>
            order.isTestOrder && !liveOrders.some(liveOrder => liveOrder.orderId === order.orderId)
          );
          combinedOrders = [...liveOrders, ...localOnlyTestOrders];
          combinedOrders.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
            return timeB - timeA;
          });
        } catch {}

        setOrders(combinedOrders);
        setOrdersLoading(false);
        setOrdersError(null);
        setIsLiveSyncing(true);

        // Keep local cache updated for offline resilience
        try {
          localStorage.setItem('vagvat_orders', JSON.stringify(combinedOrders));
        } catch {}
      },
      (error) => {
        console.warn('Real-time Firestore listener notice:', error);
        setOrdersError(error.message);
        setOrdersLoading(false);
        setIsLiveSyncing(false);
        // Fallback to local storage if offline
        try {
          const cached = localStorage.getItem('vagvat_orders');
          if (cached) setOrders(JSON.parse(cached));
        } catch {}
      }
    );

    // 2. Load inventory with stock counts
    try {
      const storedInv = localStorage.getItem('vagvat_inventory');
      if (storedInv) {
        const parsed = JSON.parse(storedInv);
        const synced = parsed.map(item => {
          const fresh = PRODUCTS.find(p => p.id === item.id);
          return fresh ? { ...fresh, stockCount: item.stockCount, inStock: item.inStock } : item;
        });
        setInventory(synced);
        localStorage.setItem('vagvat_inventory', JSON.stringify(synced));
      } else {
        const initialInv = PRODUCTS.map((p, idx) => ({
          ...p,
          stockCount: [28, 14, 45, 30, 18, 60, 35, 40, 22, 50, 32, 25, 40][idx] || 25,
          inStock: true
        }));
        setInventory(initialInv);
        localStorage.setItem('vagvat_inventory', JSON.stringify(initialInv));
      }
    } catch {
      setInventory(PRODUCTS);
    }

    return () => unsubscribe();
  }, []);

  // Update Order Status directly in Cloud Firestore (Cross-Device Sync)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    // 1. Optimistic UI update on current device
    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    setStatusUpdating(prev => ({ ...prev, [orderId]: true }));

    // 2. Direct persistence to Cloud Firestore
    if (db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Failed to update order status in Firestore:', err);
        alert('Could not update status in cloud database: ' + (err.message || 'Network error'));
      } finally {
        setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
      }
    } else {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }));
    }

    try {
      localStorage.setItem('vagvat_orders', JSON.stringify(updated));
    } catch {}
  };

  // Toggle In-Stock
  const handleToggleStock = (productId) => {
    const updated = inventory.map(item => {
      if (item.id === productId) {
        return { ...item, inStock: !item.inStock };
      }
      return item;
    });
    setInventory(updated);
    try {
      localStorage.setItem('vagvat_inventory', JSON.stringify(updated));
    } catch {}
  };

  // Adjust Stock Count
  const handleAdjustStock = (productId, delta) => {
    const updated = inventory.map(item => {
      if (item.id === productId) {
        const newCount = Math.max(0, (item.stockCount || 0) + delta);
        return { ...item, stockCount: newCount, inStock: newCount > 0 };
      }
      return item;
    });
    setInventory(updated);
    try {
      localStorage.setItem('vagvat_inventory', JSON.stringify(updated));
    } catch {}
  };

  // Add Product Handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) return;

    const created = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      hindiName: newProduct.hindiName || '',
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) + 200,
      volume: newProduct.volume,
      stockCount: Number(newProduct.stockCount) || 50,
      inStock: true,
      rating: 5.0,
      reviewCount: 0
    };

    const updated = [created, ...inventory];
    setInventory(updated);
    try {
      localStorage.setItem('vagvat_inventory', JSON.stringify(updated));
    } catch {}
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      hindiName: '',
      category: 'Strength & Stamina',
      price: '',
      originalPrice: '',
      volume: '60 Capsules',
      stockCount: 50,
    });
  };

  // Toggle Coupon Active
  const handleToggleCoupon = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    setCoupons(updated);
    try {
      localStorage.setItem('vagvat_coupons', JSON.stringify(updated));
    } catch {}
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount.trim()) return;
    const item = {
      id: Date.now(),
      code: newCouponCode.trim().toUpperCase(),
      discount: newCouponDiscount.trim(),
      type: 'percentage',
      minOrder: 499,
      active: true,
      uses: 0
    };
    const updated = [item, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem('vagvat_coupons', JSON.stringify(updated));
    } catch {}
    setNewCouponCode('');
    setNewCouponDiscount('');
  };

  // Toggle Review Approval
  const handleToggleReview = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, approved: !r.approved } : r);
    setReviews(updated);
    try {
      localStorage.setItem('vagvat_customer_reviews', JSON.stringify(updated));
    } catch {}
  };

  // Clean Store Data / Reset for Production Launch (Purges Cloud Firestore and Local Cache)
  const handleCleanStoreData = async () => {
    if (window.confirm('Reset all test orders and records for live launch? This will synchronize a clean zero-state across all devices.')) {
      if (db && orders.length > 0) {
        try {
          for (const order of orders) {
            await deleteDoc(doc(db, 'orders', order.orderId));
          }
        } catch (err) {
          console.warn('Firestore purge notice:', err);
        }
      }
      try {
        localStorage.removeItem('vagvat_orders');
        localStorage.removeItem('vagvat_customer_reviews');
      } catch {}
      setOrders([]);
      setReviews([]);
      alert('Store data cleaned! Zero-state synchronized across all devices.');
    }
  };

  // Save Website Settings
  const handleSaveWebsite = () => {
    setWebsiteSavedNotice(true);
    setTimeout(() => setWebsiteSavedNotice(false), 3000);
  };

  // Logout Handler
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const orderStatus = o.status === 'Delivered' ? 'Delivered' : 'Ordered';
    const matchesFilter = orderStatusFilter === 'All' || orderStatus === orderStatusFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered Products
  const filteredProducts = inventory.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.hindiName && p.hindiName.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Computed Totals
  const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;
  const lowStockCount = inventory.filter(i => (i.stockCount || 0) < 20).length;

  // Synthesized Customers
  const customerMap = {};
  orders.forEach(o => {
    const key = o.customerEmail || o.customerPhone;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        address: o.shippingAddress,
        ordersCount: 1,
        totalSpent: o.paymentStatus === 'Paid' ? (Number(o.total) || 0) : 0,
        lastOrder: o.date
      };
    } else {
      customerMap[key].ordersCount += 1;
      if (o.paymentStatus === 'Paid') customerMap[key].totalSpent += Number(o.total) || 0;
    }
  });
  const customersList = Object.values(customerMap);

  // Exact 11 sorted Navigation Items requested
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: inventory.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'inventory', label: 'Inventory', icon: Boxes, alert: lowStockCount > 0 ? lowStockCount : null },
    { id: 'customers', label: 'Customers', icon: Users, badge: customersList.length },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
    { id: 'reports', label: 'Sales Reports', icon: TrendingUp },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: reviews.filter(r => !r.approved).length || null },
    { id: 'website', label: 'Website Management', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07130D] text-[#F7F0DF] flex font-sans overflow-x-hidden">
      
      {/* ===================== SIDEBAR ===================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-[#0D241A] border-r border-[#C9A45C]/30 flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl
        lg:static lg:w-64 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Branding */}
        <div>
          <div className="p-4 sm:p-5 border-b border-[#C9A45C]/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C] text-[#102C20] flex items-center justify-center font-bold shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif font-bold text-base text-[#F7F0DF] leading-tight truncate">Vagvat Admin</h2>
                <span className="text-[10px] text-[#C9A45C] font-mono tracking-wider uppercase block">Dispensary Portal</span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Admin Menu"
              className="lg:hidden text-white/60 hover:text-white p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logged in Admin Pill */}
          <div className="px-4 sm:px-5 py-3 bg-[#102C20]/80 border-b border-[#C9A45C]/15 flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="truncate text-xs min-w-0">
              <span className="text-[#DFC282] font-semibold block truncate">Vaidya Sachin</span>
              <span className="text-[11px] text-[#DCE5D5]/60 font-mono block truncate">Administrator account</span>
            </div>
          </div>

          {/* Sorted Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 sm:py-2.5 min-h-[44px] rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C9A45C] text-[#0D241A] font-bold shadow-md'
                      : 'text-[#DCE5D5]/80 hover:text-white hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D241A]' : 'text-[#C9A45C]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-[#0D241A] text-[#C9A45C]' : 'bg-white/10 text-[#DFC282]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                      {item.alert} low
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-[#C9A45C]/20 bg-[#0A1B13]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 min-h-[44px] rounded-xl bg-red-950/50 hover:bg-red-900/60 active:bg-red-900 text-red-200 border border-red-500/30 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden w-full">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#0D241A]/95 backdrop-blur-md border-b border-[#C9A45C]/25 px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Admin Menu"
              className="lg:hidden p-2.5 min-w-[42px] min-h-[42px] rounded-xl bg-white/5 hover:bg-white/10 text-[#DFC282] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-base sm:text-xl font-bold text-[#F7F0DF] capitalize leading-tight truncate">
                  {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase shrink-0 ${
                  isLiveSyncing 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveSyncing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="hidden xs:inline">{isLiveSyncing ? 'Live Sync' : 'Offline'}</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#DCE5D5]/60 hidden md:block truncate">
                Vagvat Ayurveda Dispensary Management System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 min-h-[38px] rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-[#F7F0DF] text-xs font-semibold transition-all flex items-center space-x-1.5"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A45C]" />
            </Link>
          </div>
        </header>

        {/* Mobile Quick Tab Bar */}
        <div className="lg:hidden bg-[#0A1B13] border-b border-[#C9A45C]/20 px-2 py-2 overflow-x-auto no-scrollbar flex space-x-1.5 shrink-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 transition-all shrink-0 min-h-[36px] ${
                  isActive
                    ? 'bg-[#C9A45C] text-[#0D241A] font-bold shadow'
                    : 'bg-white/5 text-[#DCE5D5]/70 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0D241A]' : 'text-[#C9A45C]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#0D241A] text-[#C9A45C]' : 'bg-white/10 text-[#DFC282]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT CONTAINER */}
        <div className="p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">

          {/* ================= 1. DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 sm:space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#102C20] rounded-2xl p-4 sm:p-5 border border-[#C9A45C]/30 shadow">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#DFC282] font-semibold block truncate">Total Revenue</span>
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1 truncate">₹{totalRevenue.toLocaleString()}</div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 mt-1 block truncate">✦ Verified payments</span>
                </div>

                <div className="bg-[#102C20] rounded-2xl p-4 sm:p-5 border border-[#C9A45C]/30 shadow">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#DFC282] font-semibold block truncate">Total Orders</span>
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">{orders.length}</div>
                  <span className="text-[9px] sm:text-[10px] text-[#DFC282] mt-1 block truncate">{activeOrdersCount} Pending dispatch</span>
                </div>

                <div className="bg-[#102C20] rounded-2xl p-4 sm:p-5 border border-[#C9A45C]/30 shadow">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#DFC282] font-semibold block truncate">In Stock</span>
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1 truncate">
                    {inventory.filter(i => i.inStock).length} / {inventory.length}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 mt-1 block truncate">Shastriya herbs</span>
                </div>

                <div className="bg-[#102C20] rounded-2xl p-4 sm:p-5 border border-[#C9A45C]/30 shadow">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#DFC282] font-semibold block truncate">Customers</span>
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">{customersList.length}</div>
                  <span className="text-[9px] sm:text-[10px] text-[#C9A45C] mt-1 block truncate">Verified accounts</span>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-[#102C20] rounded-2xl p-6 border border-[#C9A45C]/30 shadow space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#C9A45C]/20">
                    <h3 className="font-serif font-bold text-base text-[#F7F0DF] flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 text-[#C9A45C]" />
                      <span>Recent Orders</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#C9A45C] hover:text-white font-semibold cursor-pointer"
                    >
                      View All Orders &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-[#C9A45C]/15">
                    {orders.length === 0 ? (
                      <div className="py-8 text-center text-white/50 text-xs">
                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                        <p className="text-white font-semibold">No customer orders yet</p>
                        <span className="text-[#DCE5D5]/60 text-[11px]">When customers complete purchases on the storefront, orders will appear here in real time.</span>
                      </div>
                    ) : (
                      orders.slice(0, 4).map((order) => (
                        <div key={order.orderId} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#DFC282]">{order.orderId}</span>
                            {order.isTestOrder && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200 font-bold">TEST</span>}
                            <span className="text-white block font-medium">{order.customerName}</span>
                            <span className="text-[10px] text-[#DCE5D5]/60">{order.date} • {order.items.length} item(s)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#F7F0DF] text-sm block">₹{order.total}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                              order.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                              'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {order.status === 'Delivered' ? 'Delivered' : 'Ordered'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Operations & System Status */}
                <div className="bg-[#102C20] rounded-2xl p-6 border border-[#C9A45C]/30 shadow space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#F7F0DF] pb-3 border-b border-[#C9A45C]/20 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
                    <span>Operations Status</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                      <span className="text-[#DCE5D5]/80">Dispensary Order Dispatch</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">ACTIVE</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                      <span className="text-[#DCE5D5]/80">Online Payment Gateway</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">NOT CONFIGURED</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                      <span className="text-[#DCE5D5]/80">Vaidya Support Hotline</span>
                      <span className="font-mono text-[#DFC282] font-bold text-[11px]">+91 80595 07909</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                      <span className="text-[#DCE5D5]/80">Low Stock Formulations</span>
                      <span className="font-bold text-amber-400">{lowStockCount} items</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="w-full py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#DFC282] text-[#0D241A] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Manage Inventory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-1 w-full sm:max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-[#C9A45C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search formulations by name..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#102C20] border border-[#C9A45C]/30 rounded-xl text-xs text-[#F7F0DF] placeholder:text-white/40 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 bg-[#102C20] border border-[#C9A45C]/30 rounded-xl text-xs text-[#DFC282] focus:outline-none flex-1 sm:flex-none min-h-[40px]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Strength & Stamina">Strength & Stamina</option>
                    <option value="Rasayana & Immunity">Rasayana & Immunity</option>
                    <option value="Digestive Care">Digestive Care</option>
                    <option value="Skin & Beauty">Skin & Beauty</option>
                  </select>

                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="px-4 py-2.5 bg-[#C9A45C] hover:bg-[#DFC282] text-[#0D241A] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow min-h-[40px] shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Products Container (Desktop Table + Mobile Cards) */}
              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                {/* 1. Desktop & Tablet Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/20">
                      <tr>
                        <th className="p-4">Formulation</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Dosage / Vol</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A45C]/15">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <div className="w-10 h-12 bg-white/5 rounded border border-[#C9A45C]/20 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                              <ProductVisual product={p} className="w-full h-full" showShadow={false} />
                            </div>
                            <div>
                              <span className="font-serif font-bold text-white block">{p.name}</span>
                              {p.hindiName && <span className="text-[10px] text-[#DFC282]">{p.hindiName}</span>}
                            </div>
                          </td>
                          <td className="p-4 text-[#DCE5D5]/80">{p.category}</td>
                          <td className="p-4 text-[#DCE5D5]/80 font-mono text-[11px]">{p.volume || p.strength}</td>
                          <td className="p-4">
                            <span className="font-bold text-white">₹{p.price}</span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-[10px] text-[#DFC282]/60 line-through ml-1.5">₹{p.originalPrice}</span>
                            )}
                          </td>
                          <td className="p-4 font-mono font-bold text-white">{p.stockCount ?? 25} units</td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              p.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className="text-[11px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#DFC282] transition-colors cursor-pointer"
                            >
                              Toggle Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Formulation Cards (Shown on mobile screens < 768px) */}
                <div className="md:hidden divide-y divide-[#C9A45C]/15">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-14 bg-white/5 rounded-xl border border-[#C9A45C]/20 shrink-0 overflow-hidden flex items-center justify-center p-1">
                          <ProductVisual product={p} className="w-full h-full" showShadow={false} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif font-bold text-sm text-white truncate">{p.name}</h4>
                              {p.hindiName && <span className="text-[10px] text-[#DFC282] block">{p.hindiName}</span>}
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                              p.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#DCE5D5]/70 block mt-0.5">{p.category} • {p.volume || p.strength}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div>
                          <span className="text-base font-bold text-white">₹{p.price}</span>
                          <span className="text-[11px] text-[#DCE5D5]/60 block">{p.stockCount ?? 25} units available</span>
                        </div>

                        <button
                          onClick={() => handleToggleStock(p.id)}
                          className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            p.inStock 
                              ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30' 
                              : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {p.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Product Modal */}
              {isAddProductOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-[#102C20] border border-[#C9A45C]/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#C9A45C]/25">
                      <h3 className="font-serif font-bold text-lg text-white">Add Classical Formulation</h3>
                      <button 
                        onClick={() => setIsAddProductOpen(false)} 
                        aria-label="Close"
                        className="text-white/60 hover:text-white p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#DFC282] mb-1">Formulation Name *</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g. Ashwagandha Lehyam"
                          className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none focus:border-[#C9A45C]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#DFC282] mb-1">Hindi Script Name</label>
                          <input
                            type="text"
                            value={newProduct.hindiName}
                            onChange={(e) => setNewProduct({ ...newProduct, hindiName: e.target.value })}
                            placeholder="e.g. अश्वगंधा लेह्यम"
                            className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none focus:border-[#C9A45C]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#DFC282] mb-1">Category</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none"
                          >
                            <option>Strength & Stamina</option>
                            <option>Rasayana & Immunity</option>
                            <option>Digestive Care</option>
                            <option>Skin & Beauty</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[#DFC282] mb-1">Selling Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="799"
                            className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[#DFC282] mb-1">MRP Price (₹)</label>
                          <input
                            type="number"
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                            placeholder="999"
                            className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[#DFC282] mb-1">Opening Stock</label>
                          <input
                            type="number"
                            value={newProduct.stockCount}
                            onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsAddProductOpen(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-[#C9A45C] hover:bg-[#DFC282] text-[#0D241A] font-bold"
                        >
                          Save Formulation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#C9A45C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer, Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#102C20] border border-[#C9A45C]/30 rounded-xl text-xs text-[#F7F0DF] placeholder:text-white/40 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
                  {['All', 'Ordered', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        orderStatusFilter === status
                          ? 'bg-[#C9A45C] text-[#0D241A]'
                          : 'bg-[#102C20] text-[#DCE5D5]/70 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Container (Responsive Table on Desktop/Tablet, Cards on Mobile) */}
              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                
                {/* 1. Desktop & Tablet Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/20">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A45C]/15">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-white/50">
                            No orders found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#DFC282]">
                              {order.orderId}
                              {order.isTestOrder && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">TEST</span>}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-white block">{order.customerName}</span>
                              <span className="text-[10px] text-[#DCE5D5]/60 block">{order.customerPhone}</span>
                            </td>
                            <td className="p-4 text-[#DCE5D5]/80">{order.date}</td>
                            <td className="p-4 text-[#DCE5D5]/80">
                              {order.items.map((i, idx) => (
                                <div key={idx} className="truncate max-w-xs">
                                  {i.name} (x{i.quantity})
                                </div>
                              ))}
                            </td>
                            <td className="p-4 font-bold text-white">₹{order.total}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                <span>{order.status === 'Delivered' ? 'Delivered' : 'Ordered'}</span>
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {order.status !== 'Delivered' ? (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.orderId, 'Delivered')}
                                  className="px-2.5 py-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold cursor-pointer transition-colors"
                                  title="Mark as Delivered"
                                >
                                  Mark Delivered
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.orderId, 'Ordered')}
                                  className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[#DCE5D5]/60 text-[11px] cursor-pointer transition-colors"
                                  title="Mark as Ordered"
                                >
                                  Mark Ordered
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-[#DFC282] text-xs font-semibold cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Order Cards (Shown on mobile screens < 768px) */}
                <div className="md:hidden divide-y divide-[#C9A45C]/15">
                  {filteredOrders.length === 0 ? (
                    <div className="p-6 text-center text-white/50 text-xs">
                      No orders found matching your search.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div key={order.orderId} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#DFC282]">
                            {order.orderId}
                            {order.isTestOrder && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-200">TEST</span>}
                          </span>
                          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span>{order.status === 'Delivered' ? 'Delivered' : 'Ordered'}</span>
                          </span>
                        </div>

                        <div className="text-xs space-y-0.5">
                          <div className="font-bold text-white text-sm">{order.customerName}</div>
                          <div className="text-[#DCE5D5]/70 flex items-center space-x-2 text-[11px]">
                            {order.customerPhone && (
                              <a href={`tel:${order.customerPhone}`} className="text-[#DFC282] hover:underline">
                                {order.customerPhone}
                              </a>
                            )}
                            <span>•</span>
                            <span>{order.date}</span>
                          </div>
                          {order.shippingAddress && (
                            <p className="text-[11px] text-[#DCE5D5]/60 truncate pt-0.5">
                              📍 {order.shippingAddress}
                            </p>
                          )}
                        </div>

                        {/* Items preview */}
                        <div className="flex flex-wrap gap-1.5">
                          {order.items.map((i, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-black/30 border border-white/5 text-[11px] text-[#DCE5D5]/90">
                              {i.name} <strong className="text-[#DFC282]">×{i.quantity}</strong>
                            </span>
                          ))}
                        </div>

                        {/* Total & Touch Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div>
                            <span className="text-[10px] uppercase text-[#DCE5D5]/60 block">Total Amount</span>
                            <span className="font-bold text-base text-[#DFC282]">₹{order.total}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {order.status !== 'Delivered' ? (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Delivered')}
                                className="px-3.5 py-2 min-h-[40px] rounded-lg bg-emerald-950 hover:bg-emerald-900 active:bg-emerald-800 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Delivered</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, 'Ordered')}
                                className="px-3.5 py-2 min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 text-[#DCE5D5]/70 border border-white/10 text-xs font-semibold cursor-pointer transition-all"
                              >
                                <span>Ordered</span>
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3.5 py-2 min-h-[40px] rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/25 text-[#DFC282] border border-[#C9A45C]/30 text-xs font-semibold cursor-pointer transition-all"
                            >
                              <span>View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Order Details Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
                  <div className="bg-[#102C20] border border-[#C9A45C]/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto my-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#C9A45C]/25">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-white">Order Details</h3>
                        <span className="font-mono text-xs text-[#C9A45C]">{selectedOrder.orderId}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(null)} 
                        aria-label="Close"
                        className="text-white/60 hover:text-white p-2 min-w-[38px] min-h-[38px] flex items-center justify-center rounded-lg hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-black/30 flex items-center justify-between">
                        <div>
                          <span className="text-[#DFC282] font-semibold block">Current Status:</span>
                          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mt-1 ${
                            selectedOrder.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span>{selectedOrder.status === 'Delivered' ? 'Delivered' : 'Ordered'}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newSt = selectedOrder.status === 'Delivered' ? 'Ordered' : 'Delivered';
                            handleUpdateOrderStatus(selectedOrder.orderId, newSt);
                            setSelectedOrder({ ...selectedOrder, status: newSt });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#DFC282] text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {selectedOrder.status === 'Delivered' ? 'Mark as Ordered' : 'Mark as Delivered'}
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-black/30 space-y-1">
                        <span className="text-[#DFC282] font-semibold block">Shipping Address:</span>
                        <p className="text-white">{selectedOrder.shippingAddress}</p>
                        <p className="text-[#DCE5D5]/70">Recipient: {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                      </div>

                      <div className="p-3 rounded-xl bg-black/30 space-y-1.5">
                        <span className="text-[#DFC282] font-semibold block">Formulations Ordered:</span>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-1 border-b border-white/5 last:border-none">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-mono">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 border-t border-[#C9A45C]/20 font-bold text-sm text-[#DFC282]">
                          <span>Total Paid:</span>
                          <span>₹{selectedOrder.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-5 py-2 rounded-lg bg-[#C9A45C] text-[#0D241A] font-bold text-xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. INVENTORY ================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif font-bold text-base text-white">Dispensary Stock & Raw Herb Inventory</h3>
                  <p className="text-xs text-[#DCE5D5]/70">Track unit batches and adjust stock levels in real time</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Low Stock: {lowStockCount}
                  </span>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                    In Stock: {inventory.filter(i => i.inStock).length}
                  </span>
                </div>
              </div>

              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                {/* 1. Desktop & Tablet Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/20">
                      <tr>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Dosage / Size</th>
                        <th className="p-4">Units Available</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Quick Stock Adjustment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A45C]/15">
                      {inventory.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-serif font-bold text-white">{item.name}</td>
                          <td className="p-4 font-mono text-[11px] text-[#DCE5D5]/70">{item.volume || item.strength}</td>
                          <td className="p-4">
                            <span className={`font-mono font-bold text-sm ${
                              (item.stockCount || 0) < 20 ? 'text-amber-400' : 'text-white'
                            }`}>
                              {item.stockCount ?? 25}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              item.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {item.inStock ? 'Ready for Dispatch' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center space-x-1.5">
                              <button
                                onClick={() => handleAdjustStock(item.id, -5)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer text-xs"
                                title="Decrease by 5"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => handleAdjustStock(item.id, -1)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center cursor-pointer text-xs"
                                title="Decrease by 1"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleAdjustStock(item.id, 1)}
                                className="w-8 h-8 rounded-lg bg-[#C9A45C]/30 hover:bg-[#C9A45C]/50 active:bg-[#C9A45C]/70 text-[#DFC282] font-bold flex items-center justify-center cursor-pointer text-xs"
                                title="Increase by 1"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleAdjustStock(item.id, 10)}
                                className="w-8 h-8 rounded-lg bg-[#C9A45C] hover:bg-[#DFC282] active:bg-[#C9A45C] text-[#0D241A] font-bold flex items-center justify-center cursor-pointer text-xs"
                                title="Add 10 Batch"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Inventory Cards (Shown on mobile screens < 768px) */}
                <div className="md:hidden divide-y divide-[#C9A45C]/15">
                  {inventory.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-[11px] font-mono text-[#DCE5D5]/60 block">{item.volume || item.strength}</span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                          item.inStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-[10px] uppercase text-[#DCE5D5]/60 block">Units Available</span>
                          <span className={`font-mono font-bold text-lg ${
                            (item.stockCount || 0) < 20 ? 'text-amber-400' : 'text-white'
                          }`}>
                            {item.stockCount ?? 25}
                          </span>
                        </div>

                        {/* Large Touch Controls */}
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleAdjustStock(item.id, -5)}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center text-xs active:scale-95 transition-transform"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, -1)}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold flex items-center justify-center text-xs active:scale-95 transition-transform"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, 1)}
                            className="w-10 h-10 rounded-xl bg-[#C9A45C]/30 hover:bg-[#C9A45C]/50 active:bg-[#C9A45C]/70 text-[#DFC282] font-bold flex items-center justify-center text-xs active:scale-95 transition-transform"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, 10)}
                            className="w-10 h-10 rounded-xl bg-[#C9A45C] hover:bg-[#DFC282] active:bg-[#C9A45C] text-[#0D241A] font-bold flex items-center justify-center text-xs active:scale-95 transition-transform"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. CUSTOMERS ================= */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              {/* Customers Container (Desktop Table + Mobile Cards) */}
              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                <div className="p-4 border-b border-[#C9A45C]/20 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white">Registered Patients & Customers</h3>
                  <span className="text-xs text-[#DFC282]">{customersList.length} Customer Record(s)</span>
                </div>

                {/* 1. Desktop & Tablet Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/20">
                      <tr>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">Phone Number</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Orders Placed</th>
                        <th className="p-4">Lifetime Value</th>
                        <th className="p-4">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A45C]/15">
                      {customersList.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-white/50">
                            <Users className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                            <p className="text-white font-semibold">No customer accounts recorded yet</p>
                            <span className="text-[#DCE5D5]/60 text-[11px]">When customers place orders or sign up, their profile and contact records will appear here.</span>
                          </td>
                        </tr>
                      ) : (
                        customersList.map((c, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">{c.name}</td>
                            <td className="p-4 font-mono text-[#DCE5D5]/80">{c.phone}</td>
                            <td className="p-4 text-[#DCE5D5]/80">{c.email || 'N/A'}</td>
                            <td className="p-4 font-mono font-bold text-[#DFC282]">{c.ordersCount}</td>
                            <td className="p-4 font-bold text-white">₹{c.totalSpent}</td>
                            <td className="p-4 text-[#DCE5D5]/60 text-[11px]">{c.lastOrder}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Customer Cards (Shown on mobile screens < 768px) */}
                <div className="md:hidden divide-y divide-[#C9A45C]/15">
                  {customersList.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/50">
                      No customer accounts recorded yet.
                    </div>
                  ) : (
                    customersList.map((c, idx) => (
                      <div key={idx} className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-white">{c.name}</h4>
                            {c.phone && (
                              <a href={`tel:${c.phone}`} className="text-xs text-[#DFC282] block font-mono hover:underline">
                                {c.phone}
                              </a>
                            )}
                            <span className="text-[11px] text-[#DCE5D5]/60 block">{c.email || 'No email registered'}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[#DFC282] font-mono font-bold shrink-0">
                            {c.ordersCount} order(s)
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                          <span className="text-[#DCE5D5]/70">Last Order: <strong className="text-white">{c.lastOrder}</strong></span>
                          <span className="font-bold text-sm text-[#DFC282]">₹{c.totalSpent}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 6. PAYMENTS ================= */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#102C20] p-4 rounded-xl border border-[#C9A45C]/30">
                  <span className="text-[10px] uppercase text-[#DFC282] font-semibold">Online Prepaid Revenue</span>
                  <span className="text-xl font-bold text-white block mt-1">₹{totalRevenue.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-300">Gateway setup required</span>
                </div>
                <div className="bg-[#102C20] p-4 rounded-xl border border-[#C9A45C]/30">
                  <span className="text-[10px] uppercase text-[#DFC282] font-semibold">Payment Mode</span>
                  <span className="text-xl font-bold text-white block mt-1">Prepaid Online Only</span>
                  <span className="text-[10px] text-[#DFC282]">Cash on Delivery is Disabled</span>
                </div>
                <div className="bg-[#102C20] p-4 rounded-xl border border-[#C9A45C]/30">
                  <span className="text-[10px] uppercase text-[#DFC282] font-semibold">Gateway Integration</span>
                  <span className="text-xl font-bold text-amber-300 block mt-1">Not Configured</span>
                  <span className="text-[10px] text-[#DCE5D5]/70">Orders stay disabled until setup</span>
                </div>
              </div>

              {/* Transactions Container (Desktop Table + Mobile Cards) */}
              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                <div className="p-4 border-b border-[#C9A45C]/20">
                  <h3 className="font-serif font-bold text-base text-white">Payment Transactions Log</h3>
                </div>

                {/* 1. Desktop & Tablet Table (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/20">
                      <tr>
                        <th className="p-4">Transaction ID</th>
                        <th className="p-4">Order Ref</th>
                        <th className="p-4">Payer</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A45C]/15">
                      {paidOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-white/50">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                            <p className="text-white font-semibold">No payment transactions recorded yet</p>
                            <span className="text-[#DCE5D5]/60 text-[11px]">Captured online payments will automatically be logged here.</span>
                          </td>
                        </tr>
                      ) : (
                        paidOrders.map((o) => (
                          <tr key={o.orderId} className="hover:bg-white/5">
                            <td className="p-4 font-mono text-[11px] text-[#DCE5D5]/70">TXN-{o.orderId.replace('VAGVAT-', '')}</td>
                            <td className="p-4 font-mono font-bold text-[#DFC282]">{o.orderId}</td>
                            <td className="p-4 text-white font-medium">{o.customerName}</td>
                            <td className="p-4 text-[#DCE5D5]/80">{o.paymentMethod || 'Online Payment'}</td>
                            <td className="p-4 font-bold text-white">₹{o.total}</td>
                            <td className="p-4">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-400">
                                Captured
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. Mobile Transaction Cards (Shown on mobile screens < 768px) */}
                <div className="md:hidden divide-y divide-[#C9A45C]/15">
                  {paidOrders.length === 0 ? (
                    <div className="p-6 text-center text-xs text-white/50">
                      No payment transactions recorded yet.
                    </div>
                  ) : (
                    paidOrders.map((o) => (
                      <div key={o.orderId} className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#DCE5D5]/70">TXN-{o.orderId.replace('VAGVAT-', '')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-400">
                            Captured
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-xs text-[#DFC282] block">{o.orderId}</span>
                            <span className="text-white font-medium text-xs block">{o.customerName}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-sm text-white block">₹{o.total}</span>
                            <span className="text-[10px] text-[#DCE5D5]/60 block">{o.paymentMethod || 'Online Payment'}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. COUPONS & OFFERS ================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              {/* Add Coupon Bar */}
              <div className="bg-[#102C20] p-5 rounded-2xl border border-[#C9A45C]/30">
                <h3 className="font-serif font-bold text-base text-white mb-3">Create New Promotional Voucher</h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Coupon Code (e.g. DIWALI20)"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="px-3 py-2 bg-[#07130D] border border-[#C9A45C]/30 rounded-xl text-white focus:outline-none uppercase"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Discount Value (e.g. 15% OFF or ₹100 FLAT)"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="px-3 py-2 bg-[#07130D] border border-[#C9A45C]/30 rounded-xl text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-2 bg-[#C9A45C] hover:bg-[#DFC282] text-[#0D241A] font-bold uppercase rounded-xl tracking-wider cursor-pointer shadow"
                  >
                    Activate Coupon
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              {coupons.length === 0 ? (
                <div className="p-8 bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 text-center text-xs text-white/50">
                  <Tag className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                  <p className="text-white font-semibold">No promotional vouchers created yet</p>
                  <span className="text-[#DCE5D5]/60 text-[11px]">Use the creation bar above to configure launch discount codes (e.g., LAUNCH10, VAGVAT50).</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div key={coupon.id} className="p-5 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 shadow flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-lg text-[#C9A45C]">{coupon.code}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            {coupon.discount}
                          </span>
                        </div>
                        <p className="text-xs text-[#DCE5D5]/70 mt-1">Min Order: ₹{coupon.minOrder} • Redeemed: {coupon.uses} times</p>
                      </div>

                      <button
                        onClick={() => handleToggleCoupon(coupon.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                          coupon.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {coupon.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= 8. SALES REPORTS ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#102C20] p-5 rounded-2xl border border-[#C9A45C]/30">
                  <span className="text-xs text-[#DFC282] uppercase font-semibold">Average Order Value (AOV)</span>
                  <span className="text-2xl font-bold text-white block mt-1">
                    ₹{paidOrders.length > 0 ? (totalRevenue / paidOrders.length).toFixed(0) : '0'}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Live storefront metric</span>
                </div>

                <div className="bg-[#102C20] p-5 rounded-2xl border border-[#C9A45C]/30">
                  <span className="text-xs text-[#DFC282] uppercase font-semibold">Total Revenue Captured</span>
                  <span className="text-2xl font-bold text-white block mt-1">
                    ₹{totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#C9A45C] mt-1 block">From verified customer orders</span>
                </div>

                <div className="bg-[#102C20] p-5 rounded-2xl border border-[#C9A45C]/30">
                  <span className="text-xs text-[#DFC282] uppercase font-semibold">Delivered Formulations</span>
                  <span className="text-2xl font-bold text-white block mt-1">
                    {orders.filter(o => o.status === 'Delivered').length}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Successfully fulfilled</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 text-center text-xs text-white/50">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                  <p className="font-semibold text-white mb-1">Awaiting Initial Storefront Orders</p>
                  <span>Category sales distributions and product velocity analytics will populate here automatically as live orders are placed.</span>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#102C20] border border-[#C9A45C]/30 space-y-4">
                  <h3 className="font-serif font-bold text-base text-white">Sales Distribution</h3>
                  <div className="text-xs text-[#DCE5D5]/80">
                    {paidOrders.length} verified payment(s) recorded for ₹{totalRevenue.toLocaleString()}.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 9. REVIEWS ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/30 overflow-hidden shadow">
                <div className="p-4 border-b border-[#C9A45C]/20 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white">Patient & Customer Reviews Moderation</h3>
                  <span className="text-xs text-[#DFC282]">{reviews.length} Total Submissions</span>
                </div>

                {reviews.length === 0 ? (
                  <div className="p-8 text-center text-xs text-white/50">
                    <Star className="w-8 h-8 mx-auto mb-2 text-[#C9A45C]/40" />
                    <p className="text-white font-semibold">No customer reviews submitted yet</p>
                    <span className="text-[#DCE5D5]/60 text-[11px]">When customers submit reviews on product formulation pages, they will appear here for your moderation.</span>
                  </div>
                ) : (
                  <div className="divide-y divide-[#C9A45C]/15">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{rev.author}</span>
                            <span className="text-[#C9A45C] flex">
                              {'★'.repeat(rev.rating)}
                            </span>
                            <span className="text-[10px] text-[#DCE5D5]/60">• {rev.date}</span>
                          </div>
                          <span className="text-[#DFC282] font-semibold block">{rev.product}</span>
                          <p className="text-[#DCE5D5]/80 italic">"{rev.comment}"</p>
                        </div>

                        <div className="flex items-center space-x-2 self-start sm:self-auto">
                          <button
                            onClick={() => handleToggleReview(rev.id)}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                              rev.approved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                            }`}
                          >
                            {rev.approved ? 'Approved • Visible' : 'Pending Review'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 10. WEBSITE MANAGEMENT ================= */}
          {activeTab === 'website' && (
            <div className="space-y-6">
              <div className="bg-[#102C20] p-6 rounded-2xl border border-[#C9A45C]/30 space-y-4">
                <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#C9A45C]/20">
                  Global Website Settings
                </h3>

                {websiteSavedNotice && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Website settings saved and updated across all visitor sessions.</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#DFC282] mb-1 font-semibold">Top Announcement Bar Text</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#DFC282] mb-1 font-semibold">Vaidya Support Telephone</label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[#DFC282] mb-1 font-semibold">Free Insured Shipping Threshold (₹)</label>
                      <input
                        type="number"
                        value={shippingThreshold}
                        onChange={(e) => setShippingThreshold(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#07130D] border border-[#C9A45C]/30 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                    <div>
                      <span className="text-white font-semibold block">Online Storefront Orders</span>
                      <span className="text-[#DCE5D5]/60 text-[11px]">Allow patients and customers to place direct orders</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDispensaryActive(!dispensaryActive)}
                      className={`px-4 py-1.5 rounded-lg font-bold uppercase text-xs cursor-pointer ${
                        dispensaryActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {dispensaryActive ? 'Enabled' : 'Paused'}
                    </button>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveWebsite}
                      className="px-6 py-2.5 bg-[#C9A45C] hover:bg-[#DFC282] text-[#0D241A] font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Website Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 11. SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-[#102C20] p-6 rounded-2xl border border-[#C9A45C]/30 space-y-4">
                <h3 className="font-serif font-bold text-base text-white pb-3 border-b border-[#C9A45C]/20">
                  Dispensary Administrator Profile
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                      <span className="text-[#DFC282] block">Admin Email Account</span>
                      <span className="text-white font-mono font-bold text-sm block mt-0.5">Hidden for security</span>
                    </div>

                    <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                      <span className="text-[#DFC282] block">Administrative Clearance</span>
                      <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                        Chief Vaidya Operations (Master Admin)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-black/20 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[#DFC282] font-semibold block">Security Clearance & Credentials:</span>
                    <p className="text-[#DCE5D5]/80 text-[11px]">
                      Your designated administrative login is hidden for security. Protected with 256-bit encryption and role-based route guards.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-950/20 border border-amber-500/25 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[#DFC282] font-semibold block">Store Data & Production Launch Mode</span>
                      <span className="text-[#DCE5D5]/60 text-[11px]">Purge all test/demo orders, customer logs, and start with a completely clean zero-state store for launch.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCleanStoreData}
                      className="px-4 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-bold uppercase rounded-lg border border-amber-500/40 transition-colors cursor-pointer shrink-0"
                    >
                      Clean Test Data
                    </button>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#C9A45C]/20">
                    <span className="text-[#DCE5D5]/60 text-[11px]">Session Active • Vagvat Ayurveda Dispensary</span>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-500/30 font-bold uppercase text-xs cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
