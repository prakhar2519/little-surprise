import React from 'react';
import { Gift, Heart, Sparkles, FolderHeart } from 'lucide-react';

export default function Navbar({ onNavigate, savedCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-rose-900 to-slate-800 bg-clip-text text-transparent">
                Little Surprise
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                FREE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Moments for Someone You Love</p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-brand-600 transition-colors"
          >
            Surprises
          </button>
          <button 
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
            className="hover:text-brand-600 transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigate('saved')} 
            className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
          >
            <FolderHeart className="w-4 h-4 text-brand-500" />
            <span>My Surprises</span>
            {savedCount > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('saved')}
            className="md:hidden p-2 text-slate-600 hover:text-brand-600 hover:bg-rose-50 rounded-xl transition"
            title="My Saved Surprises"
          >
            <FolderHeart className="w-5 h-5 text-brand-500" />
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('experiences-list');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                onNavigate('home');
              }
            }}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-brand-500 via-rose-500 to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create a Surprise ✨</span>
          </button>
        </div>
      </div>
    </header>
  );
}
