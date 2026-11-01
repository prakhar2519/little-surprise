import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Heart, Image as ImageIcon, 
  Share2, Copy, Check, Eye, Trash2, Plus, MessageCircleHeart
} from 'lucide-react';
import { compressImage, generateShareUrl, saveSurpriseToHistory, uploadPhotoToServer } from '../../utils/compression';
import MusicSelector from './MusicSelector';

const APOLOGY_THEMES = [
  { id: 'ocean_breeze', name: 'Calm Ocean', bg: 'from-sky-100 via-blue-50 to-indigo-50', primary: 'bg-sky-500' },
  { id: 'midnight_peace', name: 'Quiet Midnight', bg: 'from-slate-900 via-blue-950 to-slate-950', primary: 'bg-blue-600' },
  { id: 'gentle_sage', name: 'Peaceful Sage', bg: 'from-teal-100 via-emerald-50 to-cyan-50', primary: 'bg-teal-600' },
  { id: 'lavender_sky', name: 'Soft Lavender', bg: 'from-indigo-100 via-purple-50 to-sky-50', primary: 'bg-indigo-500' },
];

const PRESET_POINTS = [
  "I am deeply sorry for how I handled things, and I realize I hurt your feelings.",
  "You never deserved my sharp words or impatient reaction.",
  "You matter way too much to me for my ego to stand in the way.",
  "I promise to listen more with an open heart and do better.",
  "I truly miss your smile and our happy conversations."
];

export default function ApologyBuilder({ onBack, onPreviewExperience }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    type: 'apology',
    recipientName: '',
    senderName: '',
    theme: 'ocean_breeze',
    headline: "I am really sorry, and I want to make things right. 💙",
    apologyPoints: [
      { id: '1', text: "I realize I reacted poorly, and I am sincerely sorry for hurting you." },
      { id: '2', text: "Your feelings are completely valid and matter so much to me." },
      { id: '3', text: "I value our bond way too much to let misunderstandings come between us." },
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
        caption: 'Our happiest moments mean the entire world to me ✨',
        fit: 'contain'
      }
    ],
    letter: `Hey,\n\nI’ve been doing a lot of thinking, and I hate that I became the reason behind your upset mood. A simple text message felt too small and careless to express how genuinely sorry I am.\n\nYou have been one of the kindest, most supportive people in my life, and I never want my mistakes to dim the warmth between us.\n\nI take full responsibility, and I promise to be more patient, thoughtful, and understanding. I hope you can find it in your heart to forgive me. 💙`,
    forgiveMessage: `Thank you for your forgiving heart. You have no idea how much this means to me. I promise to cherish you always! 💙🫂`,
    musicTrack: 'apology',
    customAudioUrl: '',
    customAudioName: ''
  });

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle Photo Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 600, 0.65);
      const photoUrl = await uploadPhotoToServer(compressed);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, { id: 'p_' + Date.now(), url: photoUrl, caption: 'When we were all smiles 💙', fit: 'contain' }]
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

  const updatePoint = (id, text) => {
    setFormData(prev => ({
      ...prev,
      apologyPoints: prev.apologyPoints.map(pt => pt.id === id ? { ...pt, text } : pt)
    }));
  };

  const addPoint = () => {
    if (formData.apologyPoints.length >= 5) return;
    setFormData(prev => ({
      ...prev,
      apologyPoints: [
        ...prev.apologyPoints,
        { id: 'pt_' + Date.now(), text: "I promise to be better and never take you for granted." }
      ]
    }));
  };

  const removePoint = (id) => {
    if (formData.apologyPoints.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      apologyPoints: prev.apologyPoints.filter(pt => pt.id !== id)
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
                  ? 'w-6 bg-sky-500'
                  : step > i + 1
                  ? 'w-2 bg-sky-300'
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
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-sky-100">
        
        {/* STEP 1: WHO IS IT FOR */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💙</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                A Meaningful Apology
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                For apologies that need more care than a dry text message.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Their Name / Nickname *
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Maya, Sam, or My Love"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Name / How they know you *
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                placeholder="e.g. Liam, or Someone who cares deeply"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Choose Color Atmosphere
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {APOLOGY_THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.id })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      formData.theme === t.id
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-300'
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.01] active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span>Continue to Honest Thoughts</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: SINCERE POINTS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🕊️</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                What I Want To Say
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Sincere reflections that show them you genuinely understand and care.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Apology Headline *
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition text-base font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Honest Reflections & Commitments
              </label>
              <div className="space-y-3">
                {formData.apologyPoints.map((pt, idx) => (
                  <div key={pt.id} className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </div>
                    <textarea
                      rows={2}
                      value={pt.text}
                      onChange={e => updatePoint(pt.id, e.target.value)}
                      className="w-full text-sm font-medium text-slate-800 outline-none resize-none bg-transparent"
                    />
                    {formData.apologyPoints.length > 1 && (
                      <button
                        onClick={() => removePoint(pt.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {formData.apologyPoints.length < 5 && (
                <button
                  type="button"
                  onClick={addPoint}
                  className="mt-3 w-full py-2.5 rounded-xl border border-dashed border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Point</span>
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Shared Memories</span>
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
                Remembering Good Times
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Remind them of the special bond and smiles you share together.
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
              <label className="block w-full cursor-pointer py-6 rounded-2xl border-2 border-dashed border-sky-200 text-center hover:bg-sky-50/50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <ImageIcon className="w-7 h-7 text-sky-500" />
                  <span className="font-bold text-sm text-sky-600">
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
                defaultTrack="apology"
                themeColor="sky"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Sealed Apology Letter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SEALED LETTER */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Sealed Apology Letter
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Your sincere words sealed with a calming wax stamp.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Apology Letter *
              </label>
              <textarea
                rows={7}
                value={formData.letter}
                onChange={e => setFormData({ ...formData, letter: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition text-sm font-medium leading-relaxed"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-base shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Forgiveness Finale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FORGIVENESS FINALE */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🫂</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Forgiveness & Reconciliation
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                The recipient gets a comforting "I Forgive You" and "I Need a Hug" choice.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Gratitude Message (Shown when they forgive you)
              </label>
              <textarea
                rows={3}
                value={formData.forgiveMessage}
                onChange={e => setFormData({ ...formData, forgiveMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition text-sm font-medium"
              />
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white font-bold text-base shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
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
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              💙
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Apology Link is Ready
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Send this private link to <span className="font-bold text-slate-800">{formData.recipientName}</span>. 
                They can open it privately in their browser to read your heartfelt apology and memories.
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
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-500 text-slate-700 hover:text-sky-600 font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Sharing Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey ${formData.recipientName} 💙 I made a Little Surprise for you from my heart. Please open this: ${shareUrl}`)}`}
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
                className="text-sky-600 hover:underline font-bold"
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
