import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ADMIN_CONFIG } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Protects customer account routes
export function CustomerRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#102C20] flex items-center justify-center text-[#DFC282]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A45C]" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Protects admin portal routes (strictly requires role === 'admin')
export function AdminRoute({ children }) {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D241A] flex items-center justify-center text-[#DFC282]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A45C]" />
      </div>
    );
  }

  const ADMIN_UID = ADMIN_CONFIG?.uid || 'fOZcyquhHTUJJA7o5xiz4d7vBoB3';

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, tab: 'admin' }} replace />;
  }

  if (currentUser.uid !== ADMIN_UID || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0D241A] text-[#F7F0DF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#102C20] border-2 border-red-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">403: Admin Authorization Required</h2>
          <p className="text-xs text-[#DCE5D5]/80 leading-relaxed">
            Your authenticated account (<strong className="text-white">{currentUser.email}</strong>) does not hold
            Vaidya or Dispensary Administrative clearance.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/account"
              className="px-5 py-2.5 rounded-lg bg-[#C9A45C] text-[#102C20] text-xs font-bold uppercase tracking-wider hover:bg-[#DFC282] transition-colors"
            >
              Customer Account
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg border border-white/20 text-[#F7F0DF] text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
