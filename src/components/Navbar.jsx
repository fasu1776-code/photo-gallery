import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Compass, Heart, Shield, LogOut, User, LogIn, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-sm'
        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
    }`;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-neutral-800/60 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
  PHOTO <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-sans tracking-normal">GALLERY</span>
</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={navLinkClass}>
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">Discover</span>
          </NavLink>

          <NavLink to="/gallery" className={navLinkClass}>
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/favorites" className={navLinkClass}>
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">Curator Hub</span>
            </NavLink>
          )}
        </nav>

        {/* User Status / Action Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 text-xs font-bold uppercase">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-200 leading-none">{user?.name}</p>
                  <span className="text-[10px] text-neutral-400 capitalize">{user?.role}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Join Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
