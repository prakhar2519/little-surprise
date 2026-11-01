import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, Sparkles, Heart, ArrowRight, 
  RotateCcw, Share2, Check, Zap,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  playSparkleSound, playWaxCrackSound, 
  playMusic, stopMusic 
} from '../../utils/sound';

const LOVE_THEMES = {
  sweet_rose: {
    bg: 'from-[#2a0e1c] via-[#1c0813] to-[#10030b]',
    glow: 'bg-rose-600/15',
    particle: '💕',
    badge: 'text-rose-300 border-rose-400/20 bg-white/10',
    btnGradient: 'from-pink-500 to-rose-600',
    accentText: 'text-rose-400'
  },
  romantic_sunset: {
    bg: 'from-[#2d1208] via-[#220c08] to-[#140604]',
    glow: 'bg-amber-600/15',
    particle: '💖',
    badge: 'text-amber-300 border-amber-400/20 bg-white/10',
    btnGradient: 'from-amber-500 to-rose-600',
    accentText: 'text-amber-400'
  },
  cherry_blossom: {
    bg: 'from-[#2b040a] via-[#3b0811] to-[#170104]',
    glow: 'bg-red-600/15',
    particle: '❤️',
    badge: 'text-red-300 border-red-400/20 bg-white/10',
    btnGradient: 'from-red-600 to-pink-600',
    accentText: 'text-red-400'
  },
  cotton_candy: {
    bg: 'from-[#1f0e2b] via-[#14081c] to-[#0b0410]',
    glow: 'bg-purple-600/15',
    particle: '✨',
    badge: 'text-purple-300 border-purple-400/20 bg-white/10',
    btnGradient: 'from-purple-500 to-pink-600',
    accentText: 'text-purple-400'
  }
};

export default function ShowLoveExperience({ data, isPreview = false, onExitPreview }) {
  const [stage, setStage] = useState(0); // 0: Intro, 1: Reasons, 2: Memories, 3: Letter, 4: Love Meter, 5: Finale
  const [isMuted, setIsMuted] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [revealedReasons, setRevealedReasons] = useState([]);

  // Love Meter State
  const [loveCharge, setLoveCharge] = useState(100);
  const [chargeClicks, setChargeClicks] = useState(0);

  const theme = LOVE_THEMES[data?.theme] || LOVE_THEMES.sweet_rose;

  // Auto-start music on mount (and auto-unlocks on first user tap)
  useEffect(() => {
    if (!isMuted) {
      playMusic(data?.musicTrack || data?.music || 'show_love', data?.customAudioUrl, 'show_love');
    }
    return () => {
      stopMusic();
    };
  }, [data]);

  const handleStartExperience = () => {
    setStage(1);
    if (!isMuted) {
      playMusic(data.musicTrack || data.music || 'show_love', data.customAudioUrl, 'show_love');
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      playMusic(data.musicTrack || data.music || 'show_love', data.customAudioUrl, 'show_love');
    } else {
      setIsMuted(true);
      stopMusic();
    }
  };

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  const handleToggleReason = (id) => {
    if (!revealedReasons.includes(id)) {
      setRevealedReasons(prev => [...prev, id]);
      playSparkleSound();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#ffffff']
      });
    }
  };

  const handleOpenLetter = () => {
    if (envelopeOpened) return;
    playWaxCrackSound();
    setEnvelopeOpened(true);
    playSparkleSound();
  };

  // Charge Love Meter
  const handleChargeMeter = () => {
    const nextClick = chargeClicks + 1;
    setChargeClicks(nextClick);
    playSparkleSound();

    if (nextClick === 1) {
      setLoveCharge(250);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } else if (nextClick === 2) {
      setLoveCharge(500);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (nextClick === 3) {
      setLoveCharge(1000);
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } else {
      // Reached INFINITY!
      setLoveCharge(99999);
      setStage(5);
      
      // Multi-stage fireworks confetti celebration
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#ffffff'];
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 65,
          origin: { x: 1 },
          colors
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-rose-50 flex flex-col justify-between relative overflow-x-hidden select-none transition-colors duration-500`}>
      
      {/* Floating hearts / sparkles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {Array.from({ length: 22 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-300/35 animate-float"
            style={{
              top: `${(i * 17) % 94}%`,
              left: `${(i * 27) % 92}%`,
              fontSize: `${13 + (i % 4) * 7}px`,
              animationDuration: `${4 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.35}s`
            }}
          >
            {i % 3 === 0 ? theme.particle : i % 3 === 1 ? '💖' : '✨'}
          </div>
        ))}
        {/* Soft glowing ambient orb */}
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] ${theme.glow} rounded-full blur-3xl pointer-events-none`} />
      </div>

      {/* Top Header */}
      <header className="p-4 flex items-center justify-between max-w-2xl mx-auto w-full z-20">
        {isPreview ? (
          <button
            onClick={onExitPreview}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 shadow"
          >
            ← Exit Preview Mode
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-white/10 px-3 py-1.5 rounded-full border border-rose-300/20 backdrop-blur-md">
            <span>💕</span>
            <span>Why I Love You</span>
          </div>
        )}

        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-rose-200/20 text-rose-200 shadow-sm transition active:scale-90 backdrop-blur-md"
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400/60" /> : <Volume2 className="w-4 h-4 text-rose-300 animate-pulse" />}
        </button>
      </header>

      {/* Main Experience Flow */}
      <main className="flex-1 flex items-center justify-center p-4 max-w-xl mx-auto w-full z-10">

        {/* STAGE 0: ROMANTIC INVITATION */}
        {stage === 0 && (
          <div className="text-center space-y-6 animate-fadeIn py-6">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-red-500 text-white flex items-center justify-center text-5xl shadow-2xl shadow-rose-600/40 mx-auto animate-float">
                🥰
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-rose-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full shadow">
                WITH LOVE
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2 block">
                Made Especially For You
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                To My Favorite Human, <br />
                <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  {data.recipientName || 'My Love'}
                </span>
              </h1>
              {data.senderName && (
                <p className="text-sm font-medium text-rose-200/80 mt-2">
                  With all my heart from <span className="font-bold text-white">{data.senderName}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleStartExperience}
              className="w-full max-w-xs mx-auto py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold text-base shadow-xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group"
            >
              <Heart className="w-5 h-5 fill-current text-rose-200 group-hover:scale-110 transition-transform" />
              <span>Tap to Open My Love For You 💕</span>
            </button>
          </div>
        )}

        {/* STAGE 1: REASONS WHY I LOVE YOU */}
        {stage === 1 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 1 • What Makes You Special
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                Reasons Why I Love You 💖
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/70 mb-6">
                Tap each card to reveal what makes you so unforgettable:
              </p>

              {/* Reasons Cards */}
              <div className="space-y-3 mb-6 text-left">
                {data.reasons?.map((reason, idx) => {
                  const isRevealed = revealedReasons.includes(reason.id || idx);
                  return (
                    <div
                      key={reason.id || idx}
                      onClick={() => handleToggleReason(reason.id || idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer transform active:scale-98 ${
                        isRevealed 
                          ? 'bg-white/10 border-rose-400/50 shadow-md shadow-rose-500/10' 
                          : 'bg-white/5 border-white/10 hover:border-rose-400/30 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-rose-200 flex items-center gap-2">
                          <span>{isRevealed ? '💖' : '💌'}</span>
                          <span>{reason.title || `Reason #${idx + 1}`}</span>
                        </span>
                        <span className="text-xs text-rose-300/70">
                          {isRevealed ? 'Revealed' : 'Tap to reveal'}
                        </span>
                      </div>
                      
                      {isRevealed ? (
                        <p className="text-sm text-rose-100/90 leading-relaxed font-medium mt-2 pt-2 border-t border-rose-500/20 animate-fadeIn">
                          {reason.text}
                        </p>
                      ) : (
                        <div className="h-2 w-24 bg-white/10 rounded-full mt-2 animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress & Next */}
              <div className="flex items-center justify-between text-xs text-rose-300/70 pt-2 border-t border-rose-500/20">
                <span>{revealedReasons.length} of {data.reasons?.length || 0} reasons revealed</span>
                <button
                  onClick={() => setStage(2)}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-md shadow-rose-500/30 hover:scale-105 transition flex items-center gap-1.5"
                >
                  <span>Our Memories 📸</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: MEMORIES POLAROID LANE */}
        {stage === 2 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 2 • Favorite Moments
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-1">
                Every Second With You 💕
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/70 mb-6">
                Snapshots from our beautiful journey together.
              </p>

              {data.photos && data.photos.length > 0 ? (
                <div className="relative max-w-sm mx-auto flex items-center justify-center">
                  {/* Left Side Arrow */}
                  {data.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : data.photos.length - 1))}
                      className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-pink-300 hover:text-white shadow-xl border border-pink-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      aria-label="Previous photo"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}

                  <div className="w-full max-w-xs">
                    <div className="polaroid-card rounded-2xl border border-slate-100 shadow-2xl p-3 bg-white text-slate-800">
                      <div className="w-full h-64 sm:h-80 rounded-xl mb-4 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100">
                        <img
                          src={data.photos[activePhotoIdx].url}
                          alt="Memory"
                          className={`w-full h-full ${data.photos[activePhotoIdx].fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                        />
                      </div>
                      <p className="font-handwriting text-base sm:text-lg text-slate-800 min-h-[2rem]">
                        "{data.photos[activePhotoIdx].caption || 'A moment etched in my heart'}"
                      </p>
                    </div>

                    {data.photos.length > 1 && (
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="flex justify-center gap-2">
                          {data.photos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                activePhotoIdx === idx ? 'w-6 bg-pink-500' : 'bg-rose-900/60'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-pink-300/70">
                          Photo {activePhotoIdx + 1} of {data.photos.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Side Arrow */}
                  {data.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev < data.photos.length - 1 ? prev + 1 : 0))}
                      className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-pink-300 hover:text-white shadow-xl border border-pink-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      aria-label="Next photo"
                      title="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ) : null}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setStage(3)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/30 hover:scale-105 transition flex items-center gap-2"
                >
                  <span>Open Sealed Love Letter 📜</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: SEALED WAX LOVE LETTER */}
        {stage === 3 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 3 • Words Just For You
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                A Letter Sealed With Love 💌
              </h2>

              {!envelopeOpened ? (
                /* Sealed Envelope */
                <div className="py-8 flex flex-col items-center">
                  <div 
                    onClick={handleOpenLetter}
                    className="relative w-64 sm:w-72 h-44 bg-gradient-to-b from-rose-950 to-slate-900 rounded-2xl shadow-2xl border border-rose-500/40 flex items-center justify-center cursor-pointer group hover:scale-105 transition transform"
                  >
                    <div className="absolute inset-0 border-t-[80px] border-t-rose-900/40 border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent pointer-events-none" />
                    
                    {/* Wax Stamp Seal */}
                    <div className="wax-seal w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl z-10 group-hover:scale-110 transition animate-pulse">
                      💖
                    </div>
                  </div>

                  <p className="text-xs font-bold text-rose-400 mt-6 animate-pulse">
                    👉 Tap the heart seal to crack it open!
                  </p>
                </div>
              ) : (
                /* Unfolded Letter */
                <div className="py-2 text-left space-y-4 animate-fadeIn">
                  <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-amber-200/70 shadow-2xl font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {data.letter}

                    <div className="mt-6 text-right font-handwriting text-xl text-slate-700">
                      With all my love, <br />
                      <span className="text-2xl font-bold text-rose-600">{data.senderName || 'Me'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStage(4)}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-bold text-base shadow-xl shadow-rose-500/40 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>The Love Meter ⚡</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: INTERACTIVE LOVE METER */}
        {stage === 4 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="glass-dark rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl relative">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                The Finale • How Much I Love You
              </span>

              <h2 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight mb-2">
                The Love Meter 💕
              </h2>

              <p className="text-sm text-rose-200/80 max-w-md mx-auto mb-8">
                Tap the button to charge up how much love is in my heart for you!
              </p>

              {/* Big Charging Meter Display */}
              <div className="p-6 rounded-3xl bg-white/5 border border-rose-400/30 max-w-sm mx-auto shadow-inner text-center space-y-4">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent animate-pulse">
                  {loveCharge === 99999 ? 'INFINITY ∞ %' : `${loveCharge}%`}
                </div>

                {/* Meter Progress Bar */}
                <div className="w-full h-5 rounded-full bg-white/10 p-1 overflow-hidden border border-rose-500/30">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (loveCharge / 1000) * 100)}%` }}
                  />
                </div>

                <p className="text-xs text-rose-300/80 font-medium">
                  {chargeClicks === 0 && "Standard capacity: 100%"}
                  {chargeClicks === 1 && "Supercharging! ⚡ 250%"}
                  {chargeClicks === 2 && "Overflowing with love! 🔥 500%"}
                  {chargeClicks === 3 && "ONE MORE TAP FOR THE MAXIMUM! 🚀"}
                </p>
              </div>

              {/* Charge Button */}
              <div className="pt-4">
                <button
                  onClick={handleChargeMeter}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-slate-950 font-extrabold text-lg shadow-2xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto animate-bounce"
                >
                  <Zap className="w-5 h-5 fill-current text-amber-900" />
                  <span>Tap to Supercharge Love! ⚡</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: GRAND FINALE CELEBRATION */}
        {stage === 5 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center text-5xl shadow-2xl mx-auto animate-bounce">
              💖
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-2 block">
                MAXIMUM LOVE REACHED! 🎉
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                I Love You To Infinity & Beyond! ∞ ❤️
              </h1>
              <p className="text-base text-rose-100 mt-3 max-w-md mx-auto leading-relaxed">
                {data.finaleNote || "Forever & always, in every lifetime! You have my entire heart."}
              </p>
            </div>

            {/* Response CTA */}
            <div className="space-y-3 max-w-sm mx-auto pt-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just saw your "Why I Love You" surprise! 💕🥺 My heart is so full! I love you to infinity and beyond too!! ❤️✨`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Send "I Love You More!" on WhatsApp 💌</span>
              </a>

              <button
                onClick={() => {
                  setStage(1);
                  setEnvelopeOpened(false);
                  setLoveCharge(100);
                  setChargeClicks(0);
                  setRevealedReasons([]);
                }}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 font-bold text-xs border border-white/20 shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Love Experience</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-rose-300/40 z-10">
        Made with Little Surprise 💕
      </footer>
    </div>
  );
}
