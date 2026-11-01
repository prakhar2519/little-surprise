import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, Sparkles, Heart, ArrowRight, 
  RotateCcw, Share2, Check, MessageCircle, ShieldCheck,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  playSparkleSound, playWaxCrackSound, 
  playMusic, stopMusic 
} from '../../utils/sound';

const APOLOGY_THEMES = {
  ocean_breeze: {
    bg: 'from-[#0c1a2e] via-[#10243e] to-[#071220]',
    glow: 'bg-sky-500/15',
    particle: '💙',
    badge: 'text-sky-300 border-sky-300/20 bg-white/10',
    btnGradient: 'from-sky-500 to-blue-600',
    accentText: 'text-sky-400'
  },
  midnight_peace: {
    bg: 'from-[#0d1117] via-[#161b22] to-[#090d12]',
    glow: 'bg-blue-500/15',
    particle: '✨',
    badge: 'text-slate-300 border-slate-400/20 bg-white/10',
    btnGradient: 'from-blue-600 to-slate-700',
    accentText: 'text-blue-400'
  },
  gentle_sage: {
    bg: 'from-[#081c18] via-[#0d2a24] to-[#051310]',
    glow: 'bg-teal-500/15',
    particle: '🌿',
    badge: 'text-teal-300 border-teal-300/20 bg-white/10',
    btnGradient: 'from-teal-500 to-emerald-600',
    accentText: 'text-teal-400'
  },
  lavender_sky: {
    bg: 'from-[#150d24] via-[#201438] to-[#0c0717]',
    glow: 'bg-purple-500/15',
    particle: '💜',
    badge: 'text-purple-300 border-purple-300/20 bg-white/10',
    btnGradient: 'from-purple-500 to-indigo-600',
    accentText: 'text-purple-400'
  }
};

export default function ApologyExperience({ data, isPreview = false, onExitPreview }) {
  const [stage, setStage] = useState(0); // 0: Intro, 1: Thoughts, 2: Memories, 3: Letter, 4: Forgive Decision, 5: Reconciled
  const [isMuted, setIsMuted] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [forgiveChoice, setForgiveChoice] = useState(null); // 'forgiven' | 'hug'

  const theme = APOLOGY_THEMES[data?.theme] || APOLOGY_THEMES.ocean_breeze;

  // Auto-start music on mount (and auto-unlocks on first user tap)
  useEffect(() => {
    if (!isMuted) {
      playMusic(data?.musicTrack || data?.music || 'apology', data?.customAudioUrl, 'apology');
    }
    return () => {
      stopMusic();
    };
  }, [data]);

  const handleStartExperience = () => {
    setStage(1);
    if (!isMuted) {
      playMusic(data.musicTrack || data.music || 'apology', data.customAudioUrl, 'apology');
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      playMusic(data.musicTrack || data.music || 'apology', data.customAudioUrl, 'apology');
    } else {
      setIsMuted(true);
      stopMusic();
    }
  };

  const handleOpenLetter = () => {
    if (envelopeOpened) return;
    playWaxCrackSound();
    setEnvelopeOpened(true);
    playSparkleSound();
  };

  const handleForgive = (choice) => {
    setForgiveChoice(choice);
    setStage(5);
    playSparkleSound();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#60a5fa', '#818cf8', '#ffffff']
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-sky-50 flex flex-col justify-between relative overflow-x-hidden select-none transition-colors duration-500`}>
      
      {/* Ambient drifting starlight / particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-sky-300/30 animate-float"
            style={{
              top: `${(i * 19) % 94}%`,
              left: `${(i * 29) % 92}%`,
              fontSize: `${12 + (i % 4) * 6}px`,
              animationDuration: `${5 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.3}s`
            }}
          >
            {i % 2 === 0 ? '✨' : theme.particle}
          </div>
        ))}
        {/* Soft glowing ambient orb */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] ${theme.glow} rounded-full blur-3xl pointer-events-none`} />
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 bg-white/10 px-3 py-1.5 rounded-full border border-sky-300/20 backdrop-blur-md">
            <span>💙</span>
            <span>A Heartfelt Apology</span>
          </div>
        )}

        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-sky-200/20 text-sky-200 shadow-sm transition active:scale-90 backdrop-blur-md"
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-sky-400/60" /> : <Volume2 className="w-4 h-4 text-sky-300 animate-pulse" />}
        </button>
      </header>

      {/* Main Experience Flow */}
      <main className="flex-1 flex items-center justify-center p-4 max-w-xl mx-auto w-full z-10">

        {/* STAGE 0: GENTLE INVITATION */}
        {stage === 0 && (
          <div className="text-center space-y-6 animate-fadeIn py-6">
            <div className="relative inline-block">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center text-5xl shadow-2xl shadow-sky-600/30 mx-auto animate-float">
                💙
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-400 to-indigo-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full shadow">
                FOR YOU
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
                A Message From The Heart
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                To Dear <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                  {data.recipientName || 'Someone Special'}
                </span>
              </h1>
              {data.senderName && (
                <p className="text-sm font-medium text-sky-200/80 mt-2">
                  With sincere regret from <span className="font-bold text-white">{data.senderName}</span>
                </p>
              )}
            </div>

            <button
              onClick={handleStartExperience}
              className="w-full max-w-xs mx-auto py-4 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Please Open This 💙</span>
            </button>
          </div>
        )}

        {/* STAGE 1: HONEST THOUGHTS & APOLOGY POINTS */}
        {stage === 1 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1 block">
                Part 1 • What I Realized
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                {data.headline || "I am genuinely sorry. 💙"}
              </h2>
              <p className="text-xs sm:text-sm text-sky-200/70 mb-6 max-w-md mx-auto">
                I never wanted to cause you hurt or disappointment. Here is what I want to sincerely promise you:
              </p>

              {/* Sincere Points Cards */}
              <div className="space-y-3 mb-8 text-left">
                {data.apologyPoints?.map((pt, index) => (
                  <div
                    key={pt.id || index}
                    className="p-4 rounded-2xl bg-white/5 border border-sky-400/20 flex items-start gap-3 backdrop-blur-md shadow-sm"
                  >
                    <span className="text-sky-400 font-bold text-lg mt-0.5">✦</span>
                    <p className="text-sm text-sky-100/90 leading-relaxed font-medium">
                      {pt.text}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStage(2)}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:scale-105 transition flex items-center gap-2 mx-auto"
              >
                <span>Remember Our Best Times 📸</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: MEMORY POLAROID LANE */}
        {stage === 2 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1 block">
                Part 2 • Treasured Memories
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-1">
                You Mean The World To Me ✨
              </h2>
              <p className="text-xs sm:text-sm text-sky-200/70 mb-6">
                Looking back at moments that remind me how lucky I am to have you.
              </p>

              {data.photos && data.photos.length > 0 ? (
                <div className="relative max-w-sm mx-auto flex items-center justify-center">
                  {/* Left Side Arrow */}
                  {data.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : data.photos.length - 1))}
                      className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-sky-300 hover:text-white shadow-xl border border-sky-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
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
                                activePhotoIdx === idx ? 'w-6 bg-sky-500' : 'bg-sky-900/60'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-sky-300/70">
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
                      className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/95 hover:bg-slate-800 text-sky-300 hover:text-white shadow-xl border border-sky-400/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
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
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-sky-500/30 hover:scale-105 transition flex items-center gap-2"
                >
                  <span>Open Sealed Apology Letter 📜</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: SEALED WAX APOLOGY LETTER */}
        {stage === 3 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className="glass-dark rounded-3xl p-6 sm:p-8 border border-sky-500/20 shadow-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1 block">
                Part 3 • A Letter From My Heart
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-white mb-2">
                My Sincere Words 💌
              </h2>

              {!envelopeOpened ? (
                /* Sealed Envelope */
                <div className="py-8 flex flex-col items-center">
                  <div 
                    onClick={handleOpenLetter}
                    className="relative w-64 sm:w-72 h-44 bg-gradient-to-b from-slate-900 to-blue-950 rounded-2xl shadow-2xl border border-sky-500/40 flex items-center justify-center cursor-pointer group hover:scale-105 transition transform"
                  >
                    <div className="absolute inset-0 border-t-[80px] border-t-sky-900/40 border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent pointer-events-none" />
                    
                    {/* Wax Stamp Seal */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white text-2xl shadow-2xl z-10 group-hover:scale-110 transition animate-pulse border border-sky-300/40">
                      💙
                    </div>
                  </div>

                  <p className="text-xs font-bold text-sky-400 mt-6 animate-pulse">
                    👉 Tap the blue seal to unseal and read!
                  </p>
                </div>
              ) : (
                /* Unfolded Letter */
                <div className="py-2 text-left space-y-4 animate-fadeIn">
                  <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-amber-200/70 shadow-2xl font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {data.letter}

                    <div className="mt-6 text-right font-handwriting text-xl text-slate-700">
                      With genuine love & regret, <br />
                      <span className="text-2xl font-bold text-blue-600">{data.senderName || 'Me'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStage(4)}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-sky-500/40 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Continue to My Wish 🕊️</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 4: FORGIVENESS DECISION */}
        {stage === 4 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="glass-dark rounded-3xl p-6 sm:p-10 border border-sky-500/30 shadow-2xl relative">
              <div className="w-20 h-20 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-4xl mx-auto mb-4 border border-sky-400/30 animate-pulse">
                🕊️
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight mb-4">
                Will you forgive me?
              </h2>

              <p className="text-sm text-sky-200/80 max-w-md mx-auto mb-10 leading-relaxed">
                I miss your smile more than words can say. Please know that making things right with you means everything to me.
              </p>

              {/* Two Loving Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => handleForgive('forgiven')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-base shadow-xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2.5"
                >
                  <Heart className="w-5 h-5 fill-current text-sky-200" />
                  <span>I forgive you 💙</span>
                </button>

                <button
                  onClick={() => handleForgive('hug')}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-sky-200 font-bold text-base border border-white/20 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>I need a warm hug first 🥺🫂</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: RECONCILED CELEBRATION */}
        {stage === 5 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center text-5xl shadow-2xl mx-auto animate-bounce">
              {forgiveChoice === 'hug' ? '🫂' : '💙'}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2 block">
                {forgiveChoice === 'hug' ? 'Sending The Biggest Hug!' : 'A Fresh Beginning'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-white leading-tight">
                {forgiveChoice === 'hug' ? 'Warm Hug Delivered! 🫂' : 'Thank You With All My Heart 💙'}
              </h1>
              <p className="text-base text-sky-100 mt-3 max-w-md mx-auto leading-relaxed">
                {data.forgiveMessage || "Thank you for your forgiving heart. You have no idea how much this means to me. I promise to cherish you always!"}
              </p>
            </div>

            {/* Response CTA */}
            <div className="space-y-3 max-w-sm mx-auto pt-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  forgiveChoice === 'hug'
                    ? `I read your apology letter 🥺 I forgive you, now come give me a big warm hug! 💙🫂`
                    : `I read your apology letter and I forgive you 💙 Thank you for being so sincere. Let's patch up! ✨`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Message Back on WhatsApp 💌</span>
              </a>

              <button
                onClick={() => {
                  setStage(1);
                  setEnvelopeOpened(false);
                  setForgiveChoice(null);
                }}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-sky-200 font-bold text-xs border border-white/20 shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Apology Experience</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-sky-300/40 z-10">
        Made with Little Surprise 💙
      </footer>
    </div>
  );
}
