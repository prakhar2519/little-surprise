import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Heart, Image as ImageIcon, 
  Share2, Copy, Check, Eye, Trash2, Plus, Flame
} from 'lucide-react';
import { compressImage, generateShareUrl, saveSurpriseToHistory, uploadPhotoToServer } from '../../utils/compression';
import MusicSelector from './MusicSelector';

const LOVE_THEMES = [
  { id: 'sweet_rose', name: 'Sweet Rose', bg: 'from-pink-100 via-rose-50 to-pink-50', primary: 'bg-rose-500' },
  { id: 'romantic_sunset', name: 'Romantic Sunset', bg: 'from-amber-100 via-rose-50 to-orange-50', primary: 'bg-amber-500' },
  { id: 'cherry_blossom', name: 'Velvet Romance', bg: 'from-red-950 via-rose-900 to-slate-950', primary: 'bg-red-600' },
  { id: 'cotton_candy', name: 'Cotton Candy', bg: 'from-purple-100 via-pink-50 to-rose-50', primary: 'bg-purple-500' },
];

const PRESET_REASONS = [
  "The way your laugh instantly brightens up my darkest days.",
  "How safe and peaceful I feel whenever you are next to me.",
  "Your pure, kind heart that always looks out for others.",
  "The adorable little things you do without even realizing.",
  "How you always believe in my dreams, even when I doubt myself.",
  "Because loving you is the easiest and most natural thing I have ever done."
];

export default function ShowLoveBuilder({ onBack, onPreviewExperience }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    type: 'show_love',
    recipientName: '',
    senderName: '',
    theme: 'sweet_rose',
    headline: "A reminder of all the reasons why you have my whole heart. 💕",
    reasons: [
      { id: '1', title: 'Your Contagious Smile 😊', text: "The way your eyes crinkle and your smile lights up the entire room whenever you are happy." },
      { id: '2', title: 'My Safe Haven 🏡', text: "No matter how chaotic the world gets, one hug from you makes everything instantly okay." },
      { id: '3', title: 'Your Beautiful Soul 💖', text: "You have the kindest, most caring heart, and you inspire me to be a better person every single day." },
      { id: '4', title: 'All Our Silly Moments 🤪', text: "Because I can be 100% my weird, unfiltered self with you, and you love me even more for it." }
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
        caption: 'Every single second with you is my favorite memory 💕',
        fit: 'contain'
      }
    ],
    letter: `My Dearest,\n\nSometimes in the rush of ordinary days, I forget to say out loud just how deeply, unconditionally, and wonderfully loved you are.\n\nYou are my best friend, my greatest adventure, and the sweetest surprise life has ever given me. Thank you for choosing me, for standing by me, and for filling my life with so much happiness.\n\nI love you more than words could ever describe, today and for all the days to come. 💕`,
    finaleNote: `Forever & always, to infinity and beyond! ❤️✨`,
    musicTrack: 'show_love',
    customAudioUrl: '',
    customAudioName: ''
  });

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Photo Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 600, 0.65);
      const photoUrl = await uploadPhotoToServer(compressed);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, { id: 'p_' + Date.now(), url: photoUrl, caption: 'With the love of my life 💕', fit: 'contain' }]
      }));
    } catch (err) {
      alert('Could not upload photo. Please try a different image.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (id) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== id)
    }));
  };

  const updatePhotoCaption = (id, caption) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(p => p.id === id ? { ...p, caption } : p)
    }));
  };

  const togglePhotoFit = (id) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(p => {
        if (p.id === id) {
          const current = p.fit || 'contain';
          return { ...p, fit: current === 'contain' ? 'cover' : 'contain' };
        }
        return p;
      })
    }));
  };

  const updateReason = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const addReason = () => {
    if (formData.reasons.length >= 6) return;
    setFormData(prev => ({
      ...prev,
      reasons: [
        ...prev.reasons,
        { id: 'r_' + Date.now(), title: 'Another Reason I Love You 💕', text: "Because you make my world a million times brighter just by existing." }
      ]
    }));
  };

  const removeReason = (id) => {
    if (formData.reasons.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.filter(r => r.id !== id)
    }));
  };

  // Finalize & Generate Link
  const handleFinalize = async () => {
    setIsGenerating(true);
    const saved = saveSurpriseToHistory(formData);
    const url = await generateShareUrl(saved);
    setShareUrl(url);
    setIsGenerating(false);
    setStep(6);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? 'Back to Surprises' : 'Previous Step'}</span>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === i + 1
                  ? 'w-6 bg-pink-500'
                  : step > i + 1
                  ? 'w-2 bg-pink-300'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-500 ml-2">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100">
        
        {/* STEP 1: WHO IS IT FOR */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🥰</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Show Your Love
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Show them exactly why you love them with personal reasons, photos, and a sealed letter.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Partner's Name / Pet Name *
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Maya, My Sweetheart, or Honey"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Name / How they call you *
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                placeholder="e.g. Liam, or Your Number One Fan"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Romantic Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LOVE_THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.id })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      formData.theme === t.id
                        ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${t.primary} shadow-sm`} />
                    <span className="text-xs font-bold text-slate-700">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!formData.recipientName.trim()}
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span>Continue to Reasons Why I Love You</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: REASONS WHY I LOVE YOU */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Reasons Why I Love You
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Interactive tap-to-reveal cards detailing all the reasons you cherish them.
              </p>
            </div>

            <div className="space-y-4">
              {formData.reasons.map((reason, idx) => (
                <div key={reason.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                      Reason #{idx + 1}
                    </span>
                    {formData.reasons.length > 1 && (
                      <button
                        onClick={() => removeReason(reason.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reason.title}
                    onChange={e => updateReason(reason.id, 'title', e.target.value)}
                    placeholder="Short Title / Emoji..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-pink-500 text-sm font-bold text-slate-800 outline-none"
                  />
                  <textarea
                    rows={2}
                    value={reason.text}
                    onChange={e => updateReason(reason.id, 'text', e.target.value)}
                    placeholder="Why this makes them so special..."
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-pink-500 text-xs font-medium text-slate-700 outline-none resize-none"
                  />
                </div>
              ))}
            </div>

            {formData.reasons.length < 6 && (
              <button
                type="button"
                onClick={addReason}
                className="w-full py-2.5 rounded-xl border border-dashed border-pink-200 text-pink-600 hover:bg-pink-50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Reason (Max 6)</span>
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-base shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Favorite Photos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PHOTO MEMORIES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">📸</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Our Favorite Photos
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Upload your special snapshots. They display as beautiful nostalgic Polaroids.
              </p>
            </div>

            {/* Photo List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.photos.map(photo => {
                const fit = photo.fit || 'contain';
                return (
                  <div key={photo.id} className="relative polaroid-card rounded-2xl border border-slate-100 p-3 bg-white">
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                      <button
                        type="button"
                        onClick={() => togglePhotoFit(photo.id)}
                        className="px-2 py-1 bg-black/60 hover:bg-black text-white text-[10px] font-bold rounded-lg transition"
                      >
                        {fit === 'contain' ? '🔍 Full Photo' : '🖼️ Fill'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="w-full h-56 sm:h-64 rounded-xl mb-3 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100">
                      <img
                        src={photo.url}
                        alt="Memory"
                        className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                      />
                    </div>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={e => updatePhotoCaption(photo.id, e.target.value)}
                      placeholder="Add memory caption..."
                      className="w-full text-xs font-handwriting text-slate-700 border-b border-dashed border-slate-300 pb-1 outline-none text-center"
                    />
                  </div>
                );
              })}
            </div>

            {formData.photos.length < 4 && (
              <label className="block w-full cursor-pointer py-6 rounded-2xl border-2 border-dashed border-pink-200 text-center hover:bg-pink-50/50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <ImageIcon className="w-7 h-7 text-pink-500" />
                  <span className="font-bold text-sm text-pink-600">
                    {isUploading ? 'Compressing photo...' : '+ Upload A Photo From Device'}
                  </span>
                  <span className="text-xs text-slate-400">Optimized for instant private link delivery</span>
                </div>
              </label>
            )}

            {/* Background Music Selector */}
            <div className="pt-2">
              <MusicSelector
                selectedTrack={formData.musicTrack}
                customAudioUrl={formData.customAudioUrl}
                customAudioName={formData.customAudioName}
                defaultTrack="show_love"
                themeColor="pink"
                onChange={({ musicTrack, customAudioUrl, customAudioName }) => {
                  setFormData(prev => ({ ...prev, musicTrack, customAudioUrl, customAudioName }));
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-base shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Sealed Love Letter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SEALED LOVE LETTER */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Sealed Love Letter
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Your heartfelt letter sealed with a digital heart wax stamp.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Love Letter *
              </label>
              <textarea
                rows={7}
                value={formData.letter}
                onChange={e => setFormData({ ...formData, letter: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition text-sm font-medium leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-base shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Love Meter Finale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: LOVE METER & CELEBRATION */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💖</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Interactive Love Meter Finale
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                They get to tap the Love Meter to supercharge it from 100% to INFINITY ∞ %!
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Finale Love Note
              </label>
              <input
                type="text"
                value={formData.finaleNote}
                onChange={e => setFormData({ ...formData, finaleNote: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition text-base font-semibold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800">Tap-to-Charge Love Meter</div>
                <div className="text-xs text-slate-600">Recipient taps the meter to burst hearts & explosion of confetti!</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                disabled={isGenerating}
                onClick={handleFinalize}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-bold text-base shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Generating Short Link...' : 'Generate Free Link!'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SHAREABLE LINK READY */}
        {step === 6 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              💕
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Love Surprise is Ready!
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Send this private link to <span className="font-bold text-slate-800">{formData.recipientName}</span>. 
                When they open it on their phone, they'll experience your personalized reasons, photo memories, sealed letter, and the Love Meter!
              </p>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-left">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent flex-1 text-xs sm:text-sm text-slate-700 outline-none truncate font-mono select-all font-semibold"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-pink-500 text-slate-700 hover:text-pink-600 font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Sharing Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey ${formData.recipientName} 💕 I made a Little Surprise for you to show why I love you! Open this: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>

              <button
                onClick={() => onPreviewExperience(formData)}
                className="py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4" />
                <span>Test Live Preview</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Saved in your browser history</span>
              <button
                onClick={onBack}
                className="text-pink-600 hover:underline font-bold"
              >
                Create Another Surprise →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
