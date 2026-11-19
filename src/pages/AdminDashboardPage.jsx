import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  LogOut, 
  ExternalLink, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Check,
  X,
  Plus
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function AdminDashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'customers' | 'analytics'

  // Orders State (loaded from localStorage with rich default data)
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Inventory State (loaded from PRODUCTS with live in-stock toggles)
  const [inventory, setInventory] = useState([]);
  const [productSearch, setProductSearch] = useState('');

  // Initial Load
  useEffect(() => {
    // 1. Load orders
    try {
      const storedOrders = localStorage.getItem('vagvat_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        const initialOrders = [
          {
            orderId: 'VAGVAT-920184',
            customerName: 'Raghavendra Rao',
            customerEmail: 'raghav.rao@example.com',
            customerPhone: '+91 98765 43210',
            date: '19 Nov 2026',
            total: 4798,
            status: 'Processing',
            shippingAddress: 'Plot 45, Sector 14, Gurugram, Haryana - 122001',
            items: [
              { name: 'Mall Yoddha (Swarna Bhasma)', quantity: 1, price: 3499, volume: 'Net Wt. 1 kg' },
              { name: 'Shilajit Pure Himalayan Resin', quantity: 1, price: 1299, volume: '20 g' }
            ]
          },
          {
            orderId: 'VAGVAT-891042',
            customerName: 'Priya Mukherjee',
            customerEmail: 'priya.m@example.com',
            customerPhone: '+91 98112 34567',
            date: '18 Nov 2026',
            total: 1648,
            status: 'Dispatched',
            trackingNumber: 'BLUEDART-88291039',
            shippingAddress: 'Flat 302, Green Glen Layout, Bellandur, Bengaluru - 560103',
            items: [
              { name: 'Nari Santulan', quantity: 1, price: 749, volume: '60 Capsules' },
              { name: 'Yonidhara', quantity: 1, price: 899, volume: '60 Capsules' }
            ]
          },
          {
            orderId: 'VAGVAT-773820',
            customerName: 'Devrat Singhania',
            customerEmail: 'devrat.s@example.com',
            customerPhone: '+91 97234 56789',
            date: '16 Nov 2026',
            total: 3499,
            status: 'Delivered',
            trackingNumber: 'INDIAPOST-IN9928172',
            shippingAddress: 'House 12, Civil Lines, Jaipur, Rajasthan - 302006',
            items: [
              { name: 'Mall Yoddha (Swarna Bhasma)', quantity: 1, price: 3499, volume: 'Net Wt. 1 kg' }
            ]
          },
          {
            orderId: 'VAGVAT-662910',
            customerName: 'Ananya Deshmukh',
            customerEmail: 'ananya.d@example.com',
            customerPhone: '+91 99887 65432',
            date: '15 Nov 2026',
            total: 549,
            status: 'Delivered',
            trackingNumber: 'DELHIVERY-77291823',
            shippingAddress: '7th Floor, Prabhat Road, Pune, Maharashtra - 411004',
            items: [
              { name: 'Kosht Sudha', quantity: 1, price: 549, volume: '60 Capsules' }
            ]
          }
        ];
        setOrders(initialOrders);
        localStorage.setItem('vagvat_orders', JSON.stringify(initialOrders));
      }
    } catch (e) {
      console.warn('Orders init error:', e);
    }

    // 2. Load inventory with stock state
    try {
      const storedInv = localStorage.getItem('vagvat_inventory');
      if (storedInv) {
        setInventory(JSON.parse(storedInv));
      } else {
        const initialInv = PRODUCTS.map((p, idx) => ({
          ...p,
          stockCount: [24, 18, 45, 30, 20, 60, 35, 40, 28, 50, 32][idx] || 25,
          inStock: true
        }));
        setInventory(initialInv);
        localStorage.setItem('vagvat_inventory', JSON.stringify(initialInv));
      }
    } catch (e) {
      setInventory(PRODUCTS);
    }
  }, []);

  // Update Order Status Handler
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    try {
      localStorage.setItem('vagvat_orders', JSON.stringify(updated));
    } catch {}
  };

  // Toggle Inventory Stock Status
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

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = inventory.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Computed Totals
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A1B13] text-[#F7F0DF] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP ADMIN HEADER BAR */}
        <div className="bg-[#102C20] rounded-3xl p-6 border-2 border-[#C9A45C]/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Branding & Clearance Title */}
          <div className="flex items-center space-x-4 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A45C] text-[#102C20] flex items-center justify-center font-bold shadow-lg shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F0DF]">
                  Vagvat Dispensary Admin
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase font-bold tracking-wider">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-[#DCE5D5]/80 mt-1">
                Authorized Vaidya: <strong className="text-white font-mono">{currentUser?.email}</strong>
              </p>
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center space-x-3 relative z-10">
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7F0DF] text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A45C]" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 4 STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#102C20]/90 rounded-2xl p-5 border border-[#C9A45C]/35 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">Total Revenue</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">₹{totalRevenue.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">✦ Insured Orders Across India</span>
          </div>

          <div className="bg-[#102C20]/90 rounded-2xl p-5 border border-[#C9A45C]/35 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">Total Orders</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">{orders.length}</div>
            <span className="text-[10px] text-[#DFC282] mt-1 block">{activeOrdersCount} Pending / Dispatched</span>
          </div>

          <div className="bg-[#102C20]/90 rounded-2xl p-5 border border-[#C9A45C]/35 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">Active Formulations</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">{inventory.length}</div>
            <span className="text-[10px] text-emerald-400 mt-1 block">100% Shastriya Formulations</span>
          </div>

          <div className="bg-[#102C20]/90 rounded-2xl p-5 border border-[#C9A45C]/35 shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-[#DFC282] font-semibold block">Dispensary Purity</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">100%</div>
            <span className="text-[10px] text-[#C9A45C] mt-1 block">Ayush GMP Certified</span>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="flex space-x-2 border-b border-[#C9A45C]/30 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#C9A45C] text-[#102C20] shadow-md'
                : 'text-[#DFC282]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-[#C9A45C] text-[#102C20] shadow-md'
                : 'text-[#DFC282]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products & Inventory ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'customers'
                ? 'bg-[#C9A45C] text-[#102C20] shadow-md'
                : 'text-[#DFC282]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-[#C9A45C] text-[#102C20] shadow-md'
                : 'text-[#DFC282]/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dispensary Analytics</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-[#102C20] p-4 rounded-2xl border border-[#C9A45C]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#DFC282] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Name or Email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D241A] border border-[#C9A45C]/40 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
                <span className="text-[11px] text-[#DFC282] font-semibold uppercase tracking-wider shrink-0 mr-1">Status:</span>
                {['All', 'Processing', 'Dispatched', 'Delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      orderStatusFilter === status
                        ? 'bg-[#C9A45C] text-[#102C20]'
                        : 'bg-[#0D241A] text-[#DCE5D5]/70 hover:text-white border border-[#C9A45C]/20'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/35 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/25">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Items Ordered</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C9A45C]/15">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#DCE5D5]/60 text-xs">
                          No orders matching your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 align-top">
                            <span className="font-mono font-bold text-white text-xs block">{order.orderId}</span>
                            <span className="text-[10px] text-[#DCE5D5]/60 block mt-0.5">{order.date}</span>
                            {order.trackingNumber && (
                              <span className="text-[9px] font-mono text-[#DFC282] block mt-1">
                                {order.trackingNumber}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 align-top">
                            <span className="font-semibold text-white block">{order.customerName}</span>
                            <span className="text-[11px] text-[#DCE5D5]/70 block">{order.customerEmail}</span>
                            <span className="text-[10px] text-[#C9A45C] block mt-0.5">{order.customerPhone}</span>
                            <span className="text-[10px] text-[#DCE5D5]/50 block mt-1 max-w-[200px] truncate" title={order.shippingAddress}>
                              {order.shippingAddress}
                            </span>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="text-[11px] text-[#DCE5D5]/90">
                                  <strong>{item.quantity}x</strong> {item.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <span className="font-bold text-white text-sm">₹{order.total}</span>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : order.status === 'Dispatched'
                                ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}>
                              <span>{order.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 align-top text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-[#0D241A] border border-[#C9A45C]/40 text-[11px] text-[#DFC282] font-semibold focus:outline-none cursor-pointer"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-[#102C20] p-4 rounded-2xl border border-[#C9A45C]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#DFC282] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search formulations by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0D241A] border border-[#C9A45C]/40 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <span className="text-xs text-[#DFC282]">
                Showing {filteredProducts.length} formulations in dispensary
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-[#102C20] rounded-2xl p-5 border border-[#C9A45C]/35 shadow-md flex flex-col justify-between">
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white uppercase"
                        style={{ backgroundColor: product.colorHex }}
                      >
                        {product.category}
                      </span>
                      <span className="text-sm font-bold text-white">₹{product.price}</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-[#C9A45C]/30 p-1 flex items-center justify-center shrink-0">
                        <img 
                          src={product.image || `/images/products/${product.id}.jpg`} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-white">{product.name}</h4>
                        <span className="text-[11px] text-[#DFC282] block">{product.hindiName}</span>
                        <span className="text-[10px] text-[#DCE5D5]/70 block mt-0.5">{product.volume || product.strength}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Toggle Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-[#DCE5D5]/60 block font-semibold">Stock Status</span>
                      <span className={`text-xs font-bold ${product.inStock !== false ? 'text-emerald-400' : 'text-red-400'}`}>
                        {product.inStock !== false ? 'In Stock (Active)' : 'Out of Stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleStock(product.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        product.inStock !== false
                          ? 'bg-red-950/70 text-red-300 border border-red-500/40 hover:bg-red-900'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                      }`}
                    >
                      {product.inStock !== false ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-[#102C20] rounded-2xl border border-[#C9A45C]/35 shadow-xl p-6">
            <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#C9A45C]" />
              <span>Registered Patrons & Customers</span>
            </h3>
            <p className="text-xs text-[#DCE5D5]/70 mb-6">
              Verified patron records who have placed orders or taken the Prakriti consultation questionnaire.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A1B13] text-[#DFC282] uppercase text-[10px] tracking-wider border-b border-[#C9A45C]/25">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Delivery City / State</th>
                    <th className="py-3 px-4 text-right">Orders Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A45C]/15">
                  {[
                    { name: 'Raghavendra Rao', email: 'raghav.rao@example.com', phone: '+91 98765 43210', location: 'Gurugram, Haryana', ordersCount: 1 },
                    { name: 'Priya Mukherjee', email: 'priya.m@example.com', phone: '+91 98112 34567', location: 'Bengaluru, Karnataka', ordersCount: 2 },
                    { name: 'Devrat Singhania', email: 'devrat.s@example.com', phone: '+91 97234 56789', location: 'Jaipur, Rajasthan', ordersCount: 3 },
                    { name: 'Ananya Deshmukh', email: 'ananya.d@example.com', phone: '+91 99887 65432', location: 'Pune, Maharashtra', ordersCount: 1 }
                  ].map((cust, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{cust.name}</td>
                      <td className="py-3 px-4 text-[#DCE5D5]/80">{cust.email}</td>
                      <td className="py-3 px-4 font-mono text-[#C9A45C]">{cust.phone}</td>
                      <td className="py-3 px-4 text-[#DCE5D5]/70">{cust.location}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">{cust.ordersCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DISPENSARY ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#102C20] rounded-2xl p-6 border border-[#C9A45C]/35 shadow-xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#C9A45C]" />
                <span>Top Formulations by Revenue</span>
              </h3>
              
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: 'Mall Yoddha (Swarna Bhasma 1kg)', percentage: 48, revenue: '₹6,998' },
                  { name: 'Shilajit Pure Himalayan Resin (20g)', percentage: 22, revenue: '₹2,598' },
                  { name: 'Yonidhara & Nari Santulan Duo', percentage: 18, revenue: '₹1,648' },
                  { name: 'Kosht Sudha (IBS Care)', percentage: 12, revenue: '₹1,098' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[#DCE5D5]">
                      <span>{item.name}</span>
                      <span className="font-bold text-white">{item.revenue} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#0A1B13] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#B8860B] to-[#C9A45C] h-full rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#102C20] rounded-2xl p-6 border border-[#C9A45C]/35 shadow-xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#C9A45C]" />
                <span>Security & Compliance Record</span>
              </h3>
              <div className="space-y-3 pt-2 text-xs text-[#DCE5D5]/80">
                <div className="p-3 rounded-xl bg-black/20 border border-[#C9A45C]/20 flex items-center justify-between">
                  <span>Firebase Authentication</span>
                  <span className="text-emerald-400 font-bold">Encrypted Active</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-[#C9A45C]/20 flex items-center justify-between">
                  <span>Role-Based Access Control</span>
                  <span className="text-emerald-400 font-bold">Admin Clearance Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-[#C9A45C]/20 flex items-center justify-between">
                  <span>Ayush GMP Licensing</span>
                  <span className="text-[#C9A45C] font-bold">Certified Standard</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-[#C9A45C]/20 flex items-center justify-between">
                  <span>Courier Insurance Status</span>
                  <span className="text-emerald-400 font-bold">100% Insured</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
