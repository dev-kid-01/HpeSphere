import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <Logo size="lg" linkTo={null} className="mb-4 animate-pulse-glow" />
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F2B48]">
          <svg className="animate-spin h-4 w-4 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Authenticating HopeSphere session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-2xl mb-4">
          !
        </div>
        <h2 className="text-2xl font-black text-[#0F2B48]">Access Restricted</h2>
        <p className="text-slate-600 max-w-md mt-2 text-sm">
          This area is designated for {allowedRoles.join(' or ')} accounts. Your account type is currently{' '}
          <strong className="uppercase">{user.role}</strong>.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0F2B48] hover:bg-emerald-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
}
