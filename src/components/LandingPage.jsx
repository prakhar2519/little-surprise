import React from 'react';
import { Cake, Heart, Sparkles, ArrowRight, Play, CheckCircle2, Share2, Music, Gift, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onSelectExperience, onOpenHowItWorks }) {
  return (
    <div className="space-y-20 pb-24">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center px-4 max-w-4xl mx-auto">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-pink-200/50 via-rose-100/40 to-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Top announcement badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/60 text-xs sm:text-sm font-semibold text-brand-600 mb-6 shadow-sm shadow-rose-200/30">
          <span>💝</span>
          <span>100% Free interactive surprises, made in minutes</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-serif-display font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6">
          Make Something Personal <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
            for Someone You Love
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          An interactive surprise you can send with a private link — blow out candles, pop balloons, 
          revisit sweet memories, or pop the big question with a playful answer waiting at the end.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => {
              const el = document.getElementById('experiences-list');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-500 via-rose-500 to-pink-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Create A Surprise</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-slate-700 font-bold text-base border border-slate-200/80 shadow-sm hover:shadow transition-all flex items-center gap-2 hover:text-brand-600"
          >
            <Play className="w-4 h-4 fill-current text-brand-500" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Feature Pill Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-rose-100/80 text-center">
          <div className="p-3">
            <div className="font-extrabold text-xl sm:text-2xl text-slate-800">100% Free</div>
            <div className="text-xs text-slate-500 font-medium">No paywalls or subscriptions</div>
          </div>
          <div className="p-3">
            <div className="font-extrabold text-xl sm:text-2xl text-slate-800">4 Experiences</div>
            <div className="text-xs text-slate-500 font-medium">Birthday, Apology, Proposal & Love</div>
          </div>
          <div className="p-3">
            <div className="font-extrabold text-xl sm:text-2xl text-slate-800">Instant Link</div>
            <div className="text-xs text-slate-500 font-medium">Send via WhatsApp & SMS</div>
          </div>
          <div className="p-3">
            <div className="font-extrabold text-xl sm:text-2xl text-slate-800">4.9 ★</div>
            <div className="text-xs text-slate-500 font-medium">Loved by 10,000+ partners</div>
          </div>
        </div>
      </section>

      {/* Experience Selection Cards Section */}
      <section id="experiences-list" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-slate-900 mb-3">
            Find the Right Surprise
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Start with the feeling. Add your words, photos and memories. Send them something that feels made only for them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Birthday Card */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border-2 border-rose-100/90 hover:border-brand-300 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-100 group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  🎂
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 font-bold text-xs tracking-wide border border-amber-200 flex items-center gap-1">
                  🔥 Bestseller
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                Birthday Card <span className="text-2xl">🎂</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                A birthday they can actually interact with — make a wish, blow out flickering candles, pop secret message balloons, revisit memories, and open a wax-sealed letter.
              </p>

              {/* Interactive Features list */}
              <div className="space-y-2 mb-8 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/60 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-brand-500">✨</span> Interactive 3D birthday cake with blowable candle
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-brand-500">🎈</span> Pop-the-balloon mini game with hidden love notes
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-brand-500">📸</span> Polaroid photo gallery with custom captions
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-brand-500">💌</span> Wax-sealed personalized letter & confetti explosion
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
                <span className="text-amber-500">★★★★★</span>
                <span className="font-bold text-slate-700">4.8</span>
                <span>(783 reviews)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectExperience('birthday')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 hover:from-brand-600 hover:to-rose-600 text-white font-bold text-base shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Create This Surprise</span>
              <ArrowRight className="w-5 h-5 transition-transform" />
            </button>
          </div>

          {/* Card 2: Apology Card */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border-2 border-sky-100/90 hover:border-sky-400 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-100 group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  💙
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-bold text-xs tracking-wide border border-emerald-200 flex items-center gap-1">
                  ✨ New
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                Apology Card <span className="text-2xl">💙</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                For apologies that need more care than a text — your words, your memories, delivered as a private letter.
              </p>

              {/* Interactive Features list */}
              <div className="space-y-2 mb-8 bg-sky-50/50 p-4 rounded-2xl border border-sky-100/60 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-sky-500">🕊️</span> Sincere reflection points & gentle piano music
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-sky-500">📸</span> Treasured polaroid moments of happy memories
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-sky-500">💌</span> Wax-sealed personalized apology letter
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-sky-500">🫂</span> "Will you forgive me?" & warm virtual hug finale
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
                <span className="text-amber-500">★★★★★</span>
                <span className="font-bold text-slate-700">4.7</span>
                <span>(523 reviews)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectExperience('apology')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-base shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Create This Surprise</span>
              <ArrowRight className="w-5 h-5 transition-transform" />
            </button>
          </div>

          {/* Card 3: Romantic Proposal */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border-2 border-rose-100/90 hover:border-pink-400 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-100 group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-200/80 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  💍
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 font-bold text-xs tracking-wide border border-pink-200 flex items-center gap-1">
                  ★ Most Popular
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                Romantic Proposal <span className="text-2xl">💖</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Turn one big question into a whole little moment — drifting rose petals, memories from your journey, an opening ring box, and the playful runaway "No" button waiting at the end.
              </p>

              {/* Interactive Features list */}
              <div className="space-y-2 mb-8 bg-pink-50/50 p-4 rounded-2xl border border-pink-100/60 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-rose-500">🌹</span> Falling petals & dreamy romantic melody
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-rose-500">📸</span> "Our Story" memory cards with your personal photos
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-rose-500">💍</span> Animated velvet box opening with sparkling ring
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-rose-500">❤️</span> Playful "No" button that runs away + big "YES!" finale
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
                <span className="text-amber-500">★★★★★</span>
                <span className="font-bold text-slate-700">4.9</span>
                <span>(834 reviews)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectExperience('proposal')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-brand-500 hover:from-pink-600 hover:to-brand-600 text-white font-bold text-base shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Create This Surprise</span>
              <ArrowRight className="w-5 h-5 transition-transform" />
            </button>
          </div>

          {/* Card 4: Show Your Love */}
          <div className="glass-card rounded-3xl p-7 sm:p-9 flex flex-col justify-between border-2 border-pink-100/90 hover:border-rose-400 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-100 group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 border border-pink-200/80 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  🥰
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 font-bold text-xs tracking-wide border border-purple-200 flex items-center gap-1">
                  🚀 Just Launched
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                Show Your Love <span className="text-2xl">💕</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Show them exactly why you love them — personal reasons, your favourite photos, and a sealed letter to finish.
              </p>

              {/* Interactive Features list */}
              <div className="space-y-2 mb-8 bg-pink-50/50 p-4 rounded-2xl border border-pink-100/60 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-pink-500">💌</span> Interactive "Reasons Why I Love You" scratch/tap cards
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-pink-500">📸</span> Nostalgic polaroid photo gallery with captions
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-pink-500">📜</span> Wax-sealed romantic confession letter
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-pink-500">⚡</span> Chargeable "Love Meter" to INFINITY ∞ % & celebration
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
                <span className="text-amber-500">★★★★★</span>
                <span className="font-bold text-slate-700">5.0</span>
                <span>(321 reviews)</span>
              </div>
            </div>

            <button
              onClick={() => onSelectExperience('show_love')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-base shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Create This Surprise</span>
              <ArrowRight className="w-5 h-5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 scroll-mt-24">
        <div className="text-center mb-14">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-widest mb-2 block">Simple 3-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-slate-900">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-500 flex items-center justify-center text-2xl font-bold mb-5">
              1
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Pick an Experience</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Choose between Birthday, Apology, Proposal, or Show Your Love surprises.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-rose-500 flex items-center justify-center text-2xl font-bold mb-5">
              2
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Personalize with Words & Photos</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Fill in their name, secret messages, sweet photos, and heartfelt words.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-rose-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold mb-5">
              3
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Send Your Little Surprise</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Share the instant link on WhatsApp or Instagram. They open it on their phone and experience the magic!
            </p>
          </div>
        </div>
      </section>

      {/* Why Little Surprise Guarantee */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50/60 border border-rose-200/70 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl shrink-0">
            🎁
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Zero Subscriptions, Completely Free
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Little Surprise is 100% free and open for everyone. No expensive paywalls, no login barriers, and no hidden subscriptions. All your personalized surprises are delivered via instant private links!
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('experiences-list');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shrink-0 transition"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
