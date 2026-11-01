import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, Sparkles, Heart, ArrowRight, 
  RotateCcw, Share2, Check, Music, ShieldCheck,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  playSparkleSound, playWaxCrackSound, 
  playMusic, stopMusic 
} from '../../utils/sound';

const PROPOSAL_THEMES = {
  sunset_rose: {
    bg: 'from-[#1a0a14] via-[#2a0e20] to-[#12050e]',
    glow: 'bg-rose-500/20',
    particle: '🌹',
    badge: 'text-rose-300 border-rose-400/30 bg-rose-950/50',
    btnGradient: 'from-rose-500 via-pink-500 to-rose-600',
    ringGlow: 'rgba(244,63,94,0.4)',
    accentText: 'text-rose-400'
  },
  midnight_star: {
    bg: 'from-[#0b0c1e] via-[#151233] to-[#080718]',
    glow: 'bg-indigo-500/20',
    particle: '✨',
    badge: 'text-indigo-300 border-indigo-400/30 bg-indigo-950/50',
    btnGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    ringGlow: 'rgba(99,102,241,0.4)',
    accentText: 'text-indigo-400'
  },
  velvet_red: {
    bg: 'from-[#240307] via-[#38070d] to-[#140104]',
    glow: 'bg-red-500/20',
    particle: '❤️',
    badge: 'text-red-300 border-red-400/30 bg-red-950/50',
    btnGradient: 'from-red-600 via-rose-600 to-red-700',
    ringGlow: 'rgba(239,68,68,0.4)',
    accentText: 'text-red-400'
  },
  golden_hour: {
    bg: 'from-[#1c1004] via-[#2d1b08] to-[#120902]',
    glow: 'bg-amber-500/20',
    particle: '🌟',
    badge: 'text-amber-300 border-amber-400/30 bg-amber-950/50',
    btnGradient: 'from-amber-500 via-orange-500 to-amber-600',
    ringGlow: 'rgba(245,158,11,0.4)',
    accentText: 'text-amber-400'
  }
};

export default function ProposalExperience({ data, isPreview = false, onExitPreview }) {
  const [stage, setStage] = useState(0); // 0: Intro, 1: Memories, 2: Love Letter, 3: Ring Box, 4: The Question, 5: She Said YES!
  const [isMuted, setIsMuted] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [ringBoxOpened, setRingBoxOpened] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const theme = PROPOSAL_THEMES[data?.theme] || PROPOSAL_THEMES.sunset_rose;

  // Auto-start music on mount (and auto-unlocks on first user tap)
  useEffect(() => {
    if (!isMuted) {
      playMusic(data?.musicTrack || data?.music || 'romantic', data?.customAudioUrl, 'romantic');
    }
    return () => {
      stopMusic();
    };
  }, [data]);

  // Playful Runaway NO button state
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noToast, setNoToast] = useState('');
  const [noDodgeCount, setNoDodgeCount] = useState(0);

  const funnyToasts = [
    "Nice try! 😜",
    "Wrong button! 😉",
    "Are you sure? 🥺",
    "Can't click this! 😂",
    "You have to say YES! ❤️",
    "Destiny won't let you click No! 💍"
  ];

  // Start sound on user interaction
  const handleStartExperience = () => {
    setStage(1);
    if (!isMuted) {
      playMusic(data.musicTrack || data.music || 'romantic', data.customAudioUrl, 'romantic');
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      playMusic(data.musicTrack || data.music || 'romantic', data.customAudioUrl, 'romantic');
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

  // Dodge function for Runaway NO button
  const handleDodgeNo = () => {
    if (!data.enableRunawayNo) return;

    // Generate random offset within range
    const maxOffset = 130;
    const randomX = (Math.random() - 0.5) * maxOffset * 2;
    const randomY = (Math.random() - 0.5) * maxOffset * 2;

    setNoPos({ x: randomX, y: randomY });
    setNoToast(funnyToasts[noDodgeCount % funnyToasts.length]);
    setNoDodgeCount(c => c + 1);
  };

  // Open envelope
  const handleOpenLetter = () => {
    if (envelopeOpened) return;
    playWaxCrackSound();
    setEnvelopeOpened(true);
    playSparkleSound();
  };

  // Open ring box
  const handleOpenRingBox = () => {
    if (ringBoxOpened) return;
    setRingBoxOpened(true);
    playSparkleSound();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // When YES is clicked!
  const handleSayYes = () => {
    setStage(5);
    playSparkleSound();

    // Multi-burst fireworks confetti
    const end = Date.now() + 4 * 1000;
    const colors = ['#f43f68', '#ec4899', '#f59e0b', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-rose-50 flex flex-col justify-between relative overflow-x-hidden select-none transition-colors duration-500`}>
      {/* Floating Petals / Stars background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-300/40 animate-float"
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 92}%`,
              fontSize: `${14 + (i % 4) * 8}px`,
              animationDuration: `${4 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.4}s`
            }}
          >
            {data.particleEffect === 'stars' ? '✨' : data.particleEffect === 'hearts' ? '❤️' : theme.particle}
          </div>
        ))}
        {/* Soft glowing orbs */}
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
            <span>💍</span>
            <span>Romantic Proposal</span>
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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 max-w-xl mx-auto w-full z-10">

        {/* STAGE 0: ROMANTIC INVITATION */}
        {stage === 0 && (
          <div className="text-center space-y-6 animate-fadeIn py-6">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center text-5xl shadow-2xl shadow-rose-600/40 mx-auto animate-float">
                💍
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-rose-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full shadow">
                FOR YOU
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-2 block">
                A Moment Meant For You
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                To My Dearest, <br />
                <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                  {data.recipientName || 'Love of My Life'}
                </span>
              </h1>
              {data.senderName && (
                <p className="text-sm font-medium text-rose-200/80 mt-2">
                  From <span className="font-bold text-white">{data.senderName}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleStartExperience}
              className="w-full max-w-xs mx-auto py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 hover:from-rose-600 hover:to-brand-600 text-white font-bold text-base shadow-xl shadow-rose-500/40 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group"
            >
              <Heart className="w-5 h-5 fill-current text-rose-200 group-hover:scale-110 transition-transform" />
              <span>Tap to Open Our Story ✨</span>
            </button>
          </div>
        )}

        {/* STAGE 1: OUR JOURNEY IN MEMORIES */}
        {stage === 1 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 1 • Our Journey
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-1">
                Every Step With You ❤️
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/70 mb-6">
                From the moment you entered my world, everything became brighter.
              </p>

              {/* Memory Polaroid Display with Side Arrows */}
              {data.memories && data.memories.length > 0 ? (
                <div className="relative max-w-sm mx-auto flex items-center justify-center">
                  {/* Left Side Arrow */}
                  {data.memories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : data.memories.length - 1))}
                      className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-rose-300 hover:text-white shadow-xl border border-rose-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      aria-label="Previous photo"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}

                  <div className="w-full max-w-xs">
                    <div className="polaroid-card rounded-2xl border border-rose-100/30 text-slate-800 p-3 bg-white">
                      <div className="w-full h-64 sm:h-80 rounded-xl mb-4 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100">
                        <img
                          src={data.memories[activePhotoIdx].url}
                          alt="Memory"
                          className={`w-full h-full ${data.memories[activePhotoIdx].fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                        />
                      </div>
                      <p className="font-handwriting text-base sm:text-lg text-slate-800 min-h-[2rem]">
                        "{data.memories[activePhotoIdx].caption || 'A moment etched in my heart'}"
                      </p>
                    </div>

                    {/* Photo selector dots & counter */}
                    {data.memories.length > 1 && (
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="flex justify-center gap-2">
                          {data.memories.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                activePhotoIdx === idx ? 'w-6 bg-rose-500' : 'bg-rose-900/60'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-rose-300/70">
                          Photo {activePhotoIdx + 1} of {data.memories.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Side Arrow */}
                  {data.memories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev < data.memories.length - 1 ? prev + 1 : 0))}
                      className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-rose-300 hover:text-white shadow-xl border border-rose-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
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
                  onClick={() => setStage(2)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-500/30 hover:scale-105 transition flex items-center gap-2"
                >
                  <span>Open Sealed Love Letter 📜</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: HEART WAX SEALED LOVE LETTER */}
        {stage === 2 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 2 • Words From The Heart
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                A Letter For You 💌
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
                      ❤️
                    </div>
                  </div>

                  <p className="text-xs font-bold text-rose-400 mt-6 animate-pulse">
                    👉 Tap the heart seal to read!
                  </p>
                </div>
              ) : (
                /* Unfolded Letter */
                <div className="py-2 text-left space-y-4 animate-fadeIn">
                  <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-amber-200/70 shadow-2xl font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {data.loveLetter}

                    <div className="mt-6 text-right font-handwriting text-xl text-slate-700">
                      Forever yours, <br />
                      <span className="text-2xl font-bold text-rose-600">{data.senderName || 'Me'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStage(3)}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-base shadow-xl shadow-rose-500/40 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Open The Box 💍</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 3: THE VELVET RING BOX */}
        {stage === 3 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-rose-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 block">
                Chapter 3 • A Promise
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                A Little Box With A Big Meaning
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/70 mb-8">
                {ringBoxOpened ? "Something for you..." : "Tap the box to open it..."}
              </p>

              {/* Ring Box 3D CSS */}
              <div 
                onClick={handleOpenRingBox}
                className="cursor-pointer mx-auto flex flex-col items-center justify-center group active:scale-95 transition"
              >
                {!ringBoxOpened ? (
                  /* Closed Box */
                  <div className="w-40 h-36 rounded-3xl bg-gradient-to-b from-rose-800 to-rose-950 border-2 border-rose-400/40 shadow-2xl flex items-center justify-center relative hover:scale-105 transition transform">
                    <div className="w-32 h-1 bg-amber-400/80 rounded-full shadow-glow" />
                    <span className="absolute text-2xl animate-pulse">✨</span>
                  </div>
                ) : (
                  /* Opened Box with Sparkling Ring */
                  <div className="animate-fadeIn flex flex-col items-center">
                    {/* Ring with glowing aura */}
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-amber-300/30 rounded-full blur-xl animate-pulse" />
                      <div className="text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
                        💍
                      </div>
                    </div>

                    <div className="w-44 h-24 rounded-b-3xl bg-gradient-to-b from-rose-900 to-rose-950 border-2 border-amber-400/50 shadow-2xl flex items-center justify-center">
                      <span className="text-xs font-serif font-bold text-amber-200 tracking-wider uppercase">
                        With All My Heart
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!ringBoxOpened ? (
                <button
                  onClick={handleOpenRingBox}
                  className="mt-8 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-sm shadow-lg transition animate-bounce"
                >
                  👉 Tap the Box to Open!
                </button>
              ) : (
                <button
                  onClick={() => setStage(4)}
                  className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-slate-950 font-extrabold text-base shadow-xl shadow-rose-500/40 hover:scale-105 transition flex items-center gap-2 mx-auto"
                >
                  <span>The Question Waiting For You</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: THE BIG QUESTION & PLAYFUL RUNAWAY NO */}
        {stage === 4 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="glass-dark rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl relative">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center text-4xl mx-auto mb-4 border border-rose-400/30 animate-pulse">
                💖
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight mb-4">
                {data.question || "Will you marry me? 💍"}
              </h2>

              <p className="text-sm text-rose-200/80 max-w-md mx-auto mb-10 leading-relaxed">
                You are my forever, my best friend, and my greatest dream come true.
              </p>

              {/* Toast bubble when they try to click No */}
              {noToast && (
                <div className="mb-4 inline-block px-4 py-2 rounded-full bg-rose-500/80 text-white font-bold text-xs tracking-wide animate-bounce shadow-lg">
                  {noToast}
                </div>
              )}

              {/* Interactive Yes & Playful Runaway No buttons container */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative min-h-[100px] pt-2">
                {/* BIG YES BUTTON */}
                <button
                  onClick={handleSayYes}
                  className="px-10 py-5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-slate-950 font-extrabold text-xl shadow-2xl shadow-rose-500/50 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 z-10 animate-pulse"
                >
                  <Heart className="w-6 h-6 fill-rose-600 text-rose-600 animate-bounce" />
                  <span>YES! A THOUSAND TIMES YES! ❤️</span>
                </button>

                {/* PLAYFUL RUNAWAY NO BUTTON */}
                <div
                  style={{
                    transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                    transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={handleDodgeNo}
                  onTouchStart={handleDodgeNo}
                  onClick={handleDodgeNo}
                  className="relative cursor-pointer select-none"
                >
                  <button
                    type="button"
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-rose-300/70 text-sm font-semibold border border-white/10 transition"
                  >
                    No 🙈
                  </button>
                </div>
              </div>

              <p className="text-xs text-rose-300/50 mt-8">
                *Only one true answer is in your destiny ✨
              </p>
            </div>
          </div>
        )}

        {/* STAGE 5: SHE / HE SAID YES CELEBRATION! */}
        {stage === 5 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center text-5xl shadow-2xl mx-auto animate-bounce">
              💍
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-2 block">
                It's Official! 🎉
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                SHE SAID YES! ❤️💍
              </h1>
              <p className="text-base text-rose-100 mt-3 max-w-md mx-auto leading-relaxed">
                {data.yesMessage || "To forever and always, hand in hand. Best decision ever!"}
              </p>
            </div>

            {/* Response CTA */}
            <div className="space-y-3 max-w-sm mx-auto pt-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I SAID YES! 💍❤️❤️ Best question ever asked! Here's to forever!`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Send "I SAID YES!" on WhatsApp 💌</span>
              </a>

              <button
                onClick={() => {
                  setStage(1);
                  setEnvelopeOpened(false);
                  setRingBoxOpened(false);
                  setNoPos({ x: 0, y: 0 });
                }}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 font-bold text-xs border border-white/20 shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Romantic Moment</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-rose-300/40 z-10">
        Made with Little Surprise 💍
      </footer>
    </div>
  );
}
