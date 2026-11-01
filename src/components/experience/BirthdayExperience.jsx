import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, VolumeX, Sparkles, Heart, ArrowRight, 
  RotateCcw, Share2, Check, Cake, Gift, Mail,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  playPopSound, playSparkleSound, playWaxCrackSound, 
  playBlowCandleSound, playMusic, stopMusic 
} from '../../utils/sound';

const THEME_STYLES = {
  rose: {
    bg: 'bg-gradient-to-b from-rose-100/70 via-pink-50 to-rose-50',
    blob1: 'bg-pink-400/40',
    blob2: 'bg-rose-400/30',
    badge: 'text-rose-700 border-rose-300 bg-white/95',
    btnGradient: 'from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 shadow-rose-500/30',
    giftBoxGradient: 'from-rose-400 to-pink-500 shadow-rose-500/30',
    dotActive: 'bg-rose-500',
    iconColor: 'text-rose-600',
    tag: 'from-rose-500 to-pink-500',
    headerTitle: 'from-rose-600 to-pink-600',
    cardBorder: 'border-rose-200',
    envelope: 'from-rose-100 to-pink-200 border-rose-300',
    envelopeFlap: 'border-t-rose-300/50'
  },
  golden: {
    bg: 'bg-gradient-to-b from-amber-100/80 via-yellow-50 to-orange-100/70',
    blob1: 'bg-amber-400/40',
    blob2: 'bg-orange-400/30',
    badge: 'text-amber-900 border-amber-300 bg-amber-50/95',
    btnGradient: 'from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30',
    giftBoxGradient: 'from-amber-400 to-orange-400 shadow-amber-500/30',
    dotActive: 'bg-amber-500',
    iconColor: 'text-amber-700',
    tag: 'from-amber-500 to-orange-500',
    headerTitle: 'from-amber-700 via-orange-600 to-yellow-600',
    cardBorder: 'border-amber-200',
    envelope: 'from-amber-100 to-yellow-200 border-amber-300',
    envelopeFlap: 'border-t-amber-300/50'
  },
  lavender: {
    bg: 'bg-gradient-to-b from-purple-100/70 via-indigo-50 to-purple-50',
    blob1: 'bg-purple-400/40',
    blob2: 'bg-indigo-400/30',
    badge: 'text-purple-900 border-purple-300 bg-purple-50/95',
    btnGradient: 'from-purple-500 via-indigo-500 to-pink-500 hover:from-purple-600 hover:to-indigo-600 shadow-purple-500/30',
    giftBoxGradient: 'from-purple-400 to-indigo-400 shadow-purple-500/30',
    dotActive: 'bg-purple-500',
    iconColor: 'text-purple-700',
    tag: 'from-purple-500 to-indigo-500',
    headerTitle: 'from-purple-700 via-indigo-600 to-pink-600',
    cardBorder: 'border-purple-200',
    envelope: 'from-purple-100 to-indigo-200 border-purple-300',
    envelopeFlap: 'border-t-purple-300/50'
  },
  ocean: {
    bg: 'bg-gradient-to-b from-sky-100/80 via-cyan-50 to-blue-50',
    blob1: 'bg-sky-400/40',
    blob2: 'bg-cyan-400/30',
    badge: 'text-sky-900 border-sky-300 bg-sky-50/95',
    btnGradient: 'from-sky-500 via-cyan-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-500/30',
    giftBoxGradient: 'from-sky-400 to-blue-400 shadow-sky-500/30',
    dotActive: 'bg-sky-500',
    iconColor: 'text-sky-700',
    tag: 'from-sky-500 to-blue-500',
    headerTitle: 'from-sky-700 via-cyan-600 to-blue-600',
    cardBorder: 'border-sky-200',
    envelope: 'from-sky-100 to-blue-200 border-sky-300',
    envelopeFlap: 'border-t-sky-300/50'
  }
};

export default function BirthdayExperience({ data, isPreview = false, onExitPreview }) {
  const [stage, setStage] = useState(0); // 0: Intro, 1: Cake, 2: Balloons, 3: Photos, 4: Letter, 5: Finale
  const [isMuted, setIsMuted] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState([]);
  const [activeRevealedMessage, setActiveRevealedMessage] = useState(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const theme = THEME_STYLES[data?.theme] || THEME_STYLES.rose;

  // Auto-start music on mount (and auto-unlocks on first user tap)
  useEffect(() => {
    if (!isMuted) {
      playMusic(data?.musicTrack || data?.music || 'birthday', data?.customAudioUrl, 'birthday');
    }
    return () => {
      stopMusic();
    };
  }, [data]);

  // Audio start on first interaction
  const handleStartExperience = () => {
    setStage(1);
    if (!isMuted) {
      playMusic(data?.musicTrack || data?.music || 'birthday', data?.customAudioUrl, 'birthday');
    }
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      playMusic(data?.musicTrack || data?.music || 'birthday', data?.customAudioUrl, 'birthday');
    } else {
      setIsMuted(true);
      stopMusic();
    }
  };

  // Blow candle
  const handleBlowCandle = () => {
    if (candleBlown) return;
    setCandleBlown(true);
    playBlowCandleSound();
    playSparkleSound();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Pop balloon
  const handlePopBalloon = (balloon) => {
    if (poppedBalloons.includes(balloon.id)) return;

    playPopSound();
    setPoppedBalloons(prev => [...prev, balloon.id]);
    setActiveRevealedMessage(balloon.message);

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  // Open envelope
  const handleOpenEnvelope = () => {
    if (envelopeOpened) return;
    playWaxCrackSound();
    setEnvelopeOpened(true);
    playSparkleSound();

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  // Trigger grand finale confetti
  const handleEnterFinale = () => {
    setStage(5);
    playSparkleSound();
    
    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-slate-800 flex flex-col justify-between relative overflow-x-hidden select-none transition-colors duration-500`}>
      {/* Floating ambient pastel bubbles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className={`absolute top-10 left-10 w-48 h-48 ${theme.blob1} rounded-full blur-2xl animate-float`} />
        <div className={`absolute bottom-20 right-10 w-64 h-64 ${theme.blob2} rounded-full blur-3xl animate-float`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Top Header Bar */}
      <header className="p-4 flex items-center justify-between max-w-2xl mx-auto w-full z-20">
        {isPreview ? (
          <button
            onClick={onExitPreview}
            className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            ← Exit Preview Mode
          </button>
        ) : (
          <div className={`flex items-center gap-1.5 text-xs font-bold ${theme.badge} px-3.5 py-1.5 rounded-full shadow-sm border`}>
            <span>🎂</span>
            <span>Birthday Surprise</span>
          </div>
        )}

        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-700 shadow-sm transition active:scale-90"
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className={`w-4 h-4 ${theme.iconColor} animate-pulse`} />}
        </button>
      </header>

      {/* Main Experience Flow */}
      <main className="flex-1 flex items-center justify-center p-4 max-w-xl mx-auto w-full z-10">
        
        {/* STAGE 0: WELCOME INVITATION */}
        {stage === 0 && (
          <div className="text-center space-y-6 animate-fadeIn py-6">
            <div className="relative inline-block">
              <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${theme.giftBoxGradient} text-white flex items-center justify-center text-5xl shadow-2xl mx-auto animate-float`}>
                🎁
              </div>
              <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${theme.tag} text-white text-xs font-extrabold px-3 py-1 rounded-full shadow`}>
                FOR YOU!
              </div>
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor} mb-2 block`}>
                A Special Delivery Has Arrived
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-slate-900">
                Happy Birthday, <br />
                <span className={`bg-gradient-to-r ${theme.headerTitle} bg-clip-text text-transparent`}>
                  {data.recipientName || 'Dear One'}!
                </span>
              </h1>
              {data.senderName && (
                <p className="text-sm font-medium text-slate-500 mt-2">
                  Specially crafted with love by <span className="font-bold text-slate-700">{data.senderName}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleStartExperience}
                className={`w-full max-w-xs mx-auto py-4 rounded-full bg-gradient-to-r ${theme.btnGradient} text-white font-bold text-base shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group`}
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Tap to Open Your Surprise ✨</span>
              </button>
              <p className="text-[11px] text-slate-400 font-medium">
                Tap button to start with music ♫
              </p>
            </div>
          </div>
        )}

        {/* STAGE 1: THE CAKE & BLOW THE CANDLE */}
        {stage === 1 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-4">
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border ${theme.cardBorder} shadow-xl`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor} mb-2 block`}>
                Step 1 of 4 • Make a Wish
              </span>
              
              <h2 className="text-2xl font-serif-display font-bold text-slate-900 mb-2">
                {candleBlown ? "Wish Granted! ✨" : "Make a Wish!"}
              </h2>
              
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
                {data.wishPrompt || "Close your eyes, make your biggest wish, and tap the candle to blow it out! 🎂"}
              </p>

              {/* The Cake & Candle */}
              <div className="relative py-6 flex flex-col items-center justify-center">
                {/* The Candle */}
                <div 
                  onClick={handleBlowCandle}
                  className="cursor-pointer group flex flex-col items-center z-10 transition transform active:scale-95"
                  title="Click to blow candle"
                >
                  {/* Flame or Smoke */}
                  {!candleBlown ? (
                    <div className="candle-flame w-6 h-9 mb-1 shadow-lg cursor-pointer" />
                  ) : (
                    <div className="text-xs font-bold text-slate-400 mb-1 animate-pulse">
                      💨 *poof*
                    </div>
                  )}
                  {/* Candle Stick */}
                  <div className="w-4 h-14 rounded-t-sm bg-gradient-to-b from-amber-200 via-pink-200 to-pink-300 border-x border-amber-300 shadow-sm" />
                </div>

                {/* Cake Top Layer */}
                <div className="w-48 sm:w-56 h-16 rounded-2xl bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 border-2 border-rose-300/80 shadow-md flex items-center justify-around px-4 -mt-2 z-0">
                  <span className="text-lg">🍓</span>
                  <span className="text-lg">🍒</span>
                  <span className="text-lg">🍓</span>
                  <span className="text-lg">🍒</span>
                </div>

                {/* Cake Base Layer */}
                <div className="w-60 sm:w-72 h-20 rounded-2xl bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 border-2 border-amber-200 shadow-lg flex items-center justify-around px-6 -mt-3">
                  <span className="text-xs font-extrabold tracking-wider text-rose-500 uppercase">
                    Happy Birthday {data.age ? `${data.age}th` : '🎉'}
                  </span>
                </div>

                {/* Cake Plate */}
                <div className="w-72 sm:w-80 h-3 rounded-full bg-slate-200 shadow-md -mt-1" />
              </div>

              {/* Button Prompt */}
              {!candleBlown ? (
                <button
                  onClick={handleBlowCandle}
                  className="mt-6 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-sm shadow-md transition animate-bounce"
                >
                  👉 Tap Candle to Blow Out & Make Wish!
                </button>
              ) : (
                <button
                  onClick={() => setStage(2)}
                  className={`mt-6 px-7 py-3.5 rounded-full bg-gradient-to-r ${theme.btnGradient} text-white font-bold text-sm shadow-lg transition flex items-center gap-2 mx-auto`}
                >
                  <span>Continue to Balloons</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE 2: BALLOON POP SURPRISES */}
        {stage === 2 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 border ${theme.cardBorder} shadow-xl`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor} mb-1 block`}>
                Step 2 of 4 • Pop Surprises
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-slate-900 mb-1">
                Pop Your Birthday Balloons! 🎈
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Tap each floating balloon to pop it and reveal secret love messages inside!
              </p>

              {/* Floating Balloons Array */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 min-h-[160px]">
                {data.balloons.map((balloon, index) => {
                  const isPopped = poppedBalloons.includes(balloon.id);
                  return (
                    <button
                      key={balloon.id}
                      disabled={isPopped}
                      onClick={() => handlePopBalloon(balloon)}
                      className={`relative transition-all duration-300 transform active:scale-90 ${
                        isPopped ? 'opacity-30 scale-75 cursor-default' : 'hover:scale-110 cursor-pointer animate-float'
                      }`}
                      style={{ animationDelay: `${index * 0.4}s` }}
                    >
                      {/* Balloon */}
                      <div className={`w-16 h-20 sm:w-20 sm:h-24 rounded-full ${balloon.color} shadow-lg relative flex items-center justify-center text-white font-extrabold text-xs`}>
                        {isPopped ? '💥' : '🎈'}
                        {/* Balloon string */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Revealed Message Box */}
              {activeRevealedMessage && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-slate-800 text-sm font-semibold animate-fadeIn shadow-sm">
                  ✨ "{activeRevealedMessage}"
                </div>
              )}

              {/* Progress & Next */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{poppedBalloons.length} of {data.balloons.length} balloons popped</span>
                <button
                  onClick={() => setStage(3)}
                  className={`px-4 py-2 rounded-xl bg-gradient-to-r ${theme.btnGradient} text-white font-bold transition flex items-center gap-1.5 shadow`}
                >
                  <span>Next: Memories 📸</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: MEMORY POLAROID LANE */}
        {stage === 3 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border ${theme.cardBorder} shadow-xl`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor} mb-1 block`}>
                Step 3 of 4 • Nostalgia Lane
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-slate-900 mb-1">
                Sweetest Memories 📸
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Looking back at some of our favorite unforgettable moments.
              </p>

              {/* Polaroid Card Display with Side Arrows */}
              {data.photos && data.photos.length > 0 ? (
                <div className="relative max-w-sm mx-auto flex items-center justify-center">
                  {/* Left Side Arrow */}
                  {data.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : data.photos.length - 1))}
                      className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      aria-label="Previous photo"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}

                  <div className="w-full max-w-xs">
                    <div className="polaroid-card rounded-2xl border border-slate-100 shadow-2xl p-3 bg-white">
                      <div className="w-full h-64 sm:h-80 rounded-xl mb-4 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100">
                        <img
                          src={data.photos[activePhotoIdx].url}
                          alt="Memory"
                          className={`w-full h-full ${data.photos[activePhotoIdx].fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                        />
                      </div>
                      <p className="font-handwriting text-base sm:text-lg text-slate-800 min-h-[2rem]">
                        "{data.photos[activePhotoIdx].caption || 'A moment to remember'}"
                      </p>
                    </div>

                    {/* Photo selector dots & counter */}
                    {data.photos.length > 1 && (
                      <div className="flex flex-col items-center gap-2 mt-4">
                        <div className="flex justify-center gap-2">
                          {data.photos.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`h-3 rounded-full transition-all ${
                                activePhotoIdx === idx ? `w-6 ${theme.dotActive}` : 'w-3 bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
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
                      className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                      aria-label="Next photo"
                      title="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-8 text-slate-400">No photos added</div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setStage(4)}
                  className={`px-7 py-3.5 rounded-full bg-gradient-to-r ${theme.btnGradient} text-white font-bold text-sm shadow-lg transition flex items-center gap-2`}
                >
                  <span>Open Your Sealed Letter 💌</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: SEALED WAX ENVELOPE */}
        {stage === 4 && (
          <div className="text-center space-y-5 w-full animate-fadeIn py-4">
            <div className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border ${theme.cardBorder} shadow-xl`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.iconColor} mb-1 block`}>
                Final Step • A Letter For You
              </span>
              <h2 className="text-2xl font-serif-display font-bold text-slate-900 mb-2">
                A Sealed Birthday Note 💌
              </h2>

              {!envelopeOpened ? (
                /* Sealed Envelope view */
                <div className="py-8 flex flex-col items-center">
                  <div 
                    onClick={handleOpenEnvelope}
                    className={`relative w-64 sm:w-72 h-44 bg-gradient-to-b ${theme.envelope} rounded-2xl shadow-xl border flex items-center justify-center cursor-pointer group hover:scale-105 transition transform`}
                  >
                    {/* Envelope flap lines */}
                    <div className={`absolute inset-0 border-t-[80px] ${theme.envelopeFlap} border-l-[140px] border-l-transparent border-r-[140px] border-r-transparent pointer-events-none`} />
                    
                    {/* Wax Stamp Seal */}
                    <div className="wax-seal w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-serif font-bold shadow-2xl z-10 group-hover:scale-110 transition">
                      🎂
                    </div>
                  </div>

                  <p className={`text-xs font-bold ${theme.iconColor} mt-6 animate-pulse`}>
                    👉 Tap the wax seal to unseal and read!
                  </p>
                </div>
              ) : (
                /* Unfolded Letter view */
                <div className="py-2 text-left space-y-4 animate-fadeIn">
                  <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-amber-200/70 shadow-inner font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {data.letter}

                    {data.secretNote && (
                      <div className={`mt-6 pt-4 border-t border-dashed border-amber-200 text-xs sm:text-sm ${theme.iconColor} font-sans font-semibold`}>
                        {data.secretNote}
                      </div>
                    )}

                    <div className="mt-6 text-right font-handwriting text-xl text-slate-700">
                      With love, <br />
                      <span className={`text-2xl font-bold ${theme.iconColor}`}>{data.senderName || 'Alex'}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleEnterFinale}
                    className={`w-full py-4 rounded-full bg-gradient-to-r ${theme.btnGradient} text-white font-bold text-base shadow-xl hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Celebrate Happy Birthday! 🎉</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 5: GRAND FINALE CELEBRATION */}
        {stage === 5 && (
          <div className="text-center space-y-6 w-full animate-fadeIn py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center text-5xl shadow-2xl mx-auto animate-bounce">
              🎉
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-serif-display font-extrabold text-slate-900 leading-tight">
                Happy Birthday, <br />
                <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                  {data.recipientName}! 🎂
                </span>
              </h1>
              <p className="text-base text-slate-600 mt-3 max-w-md mx-auto">
                Wishing you a magical year ahead filled with happiness, adventures, and endless love!
              </p>
            </div>

            {/* Response CTA */}
            <div className="space-y-3 max-w-sm mx-auto pt-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Thank you so much for the sweet birthday surprise! I absolutely loved it! ❤️🎂`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Say Thank You on WhatsApp 💌</span>
              </a>

              <button
                onClick={() => {
                  setStage(1);
                  setCandleBlown(false);
                  setPoppedBalloons([]);
                  setEnvelopeOpened(false);
                }}
                className="w-full py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Birthday Surprise</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="p-4 text-center text-xs text-slate-400 z-10">
        Made with Little Surprise 🎁
      </footer>
    </div>
  );
}
