import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, UploadCloud, HelpCircle, Info, Menu, X, Server, RefreshCw } from 'lucide-react';
import { checkBackendHealth, API_BASE_URL } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, isOnline: false, checking: false });

  const verifyBackend = async () => {
    setBackendStatus(prev => ({ ...prev, checking: true }));
    try {
      const res = await checkBackendHealth();
      setBackendStatus({ checked: true, isOnline: res.isOnline, checking: false });
    } catch {
      setBackendStatus({ checked: true, isOnline: false, checking: false });
    }
  };

  useEffect(() => {
    verifyBackend();
    // Poll backend health gently every 30 seconds
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/', id: 'nav-home' },
    { label: 'Analyse Video', path: '/upload', id: 'nav-upload', icon: UploadCloud },
    { label: 'How It Works', path: '/how-it-works', id: 'nav-how-it-works', icon: HelpCircle },
    { label: 'About', path: '/about', id: 'nav-about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <Link
            to="/"
            id="nav-brand-logo"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                PhysioVision <span className="text-teal-600 text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-50 border border-teal-200">AI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Exercise Video Recognition
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  id={link.id}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-teal-700 bg-teal-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Backend Status Badge */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Backend connection indicator chip */}
            <button
              onClick={verifyBackend}
              title={`FastAPI target: ${API_BASE_URL} (Click to re-check)`}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                backendStatus.checking
                  ? 'bg-slate-50 text-slate-500 border-slate-200'
                  : backendStatus.isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus.checking
                    ? 'bg-slate-400 animate-pulse'
                    : backendStatus.isOnline
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
              <span className="font-mono text-[11px]">
                {backendStatus.checking
                  ? 'Checking API...'
                  : backendStatus.isOnline
                  ? 'FastAPI Online'
                  : 'FastAPI Offline'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 ${backendStatus.checking ? 'animate-spin' : ''}`} />
            </button>

            {/* Primary Action Button */}
            <Link
              to="/upload"
              id="nav-cta-upload"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-teal-700/20 active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyse Video</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">System Status</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className={`w-2 h-2 rounded-full ${backendStatus.isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{backendStatus.isOnline ? 'FastAPI Connected' : 'FastAPI Offline'}</span>
            </div>
          </div>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-teal-700 bg-teal-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-teal-600" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/upload"
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Video Now</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
