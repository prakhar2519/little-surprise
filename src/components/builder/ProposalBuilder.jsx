import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Heart, Image as ImageIcon, 
  Mail, Share2, Copy, Check, Eye, Trash2, Plus, Volume2
} from 'lucide-react';
import { compressImage, generateShareUrl, saveSurpriseToHistory, uploadPhotoToServer } from '../../utils/compression';
import MusicSelector from './MusicSelector';

const PROPOSAL_THEMES = [
  { id: 'sunset_rose', name: 'Sunset Rose', bg: 'from-pink-900 via-rose-950 to-slate-950', primary: 'bg-rose-500' },
  { id: 'midnight_star', name: 'Midnight Starlight', bg: 'from-slate-950 via-purple-950 to-indigo-950', primary: 'bg-purple-500' },
  { id: 'velvet_red', name: 'Velvet Red', bg: 'from-red-950 via-rose-900 to-slate-950', primary: 'bg-red-600' },
  { id: 'golden_hour', name: 'Golden Glow', bg: 'from-amber-950 via-orange-950 to-slate-950', primary: 'bg-amber-500' },
];

const QUESTION_PRESETS = [
  "Will you marry me? 💍",
  "Will you be my girlfriend? 💖",
  "Will you be my forever? 🌹",
  "Will you be my Valentine? 💌",
];

export default function ProposalBuilder({ onBack, onPreviewExperience }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form state
  const [formData, setFormData] = useState({
    type: 'proposal',
    recipientName: '',
    senderName: '',
    petName: '',
    theme: 'sunset_rose',
    particleEffect: 'petals', // petals, hearts, stars
    question: "Will you marry me? 💍",
    enableRunawayNo: true,
    ringStyle: 'diamond', // diamond, rose_gold, sapphire
    memories: [
      {
        id: 'm1',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
        caption: 'The day we met, everything changed ✨'
      },
      {
        id: 'm2',
        url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
        caption: 'Every second with you is my favorite memory ❤️'
      }
    ],
    loveLetter: `My Love,\n\nFrom the very first moment our paths crossed, you brought an effortless magic and light into my world that I never knew was missing.\n\nYou are my best friend, my safe haven, and my favorite reason to smile. I cannot imagine living a single chapter of this life without you by my side.\n\nSo today, I have one question for you...`,
    yesMessage: `I promise to love, cherish, and make you laugh every single day for the rest of our lives! ❤️💍`,
    musicTrack: 'romantic',
    customAudioUrl: '',
    customAudioName: ''
  });

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Photo uploads
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 600, 0.65);
      // Upload to server for tiny URL
      const photoUrl = await uploadPhotoToServer(compressed);
      setFormData(prev => ({
        ...prev,
        memories: [...prev.memories, { id: 'm_' + Date.now(), url: photoUrl, caption: 'Another unforgettable memory together 🌹' }]
      }));
    } catch (err) {
      alert('Could not upload image. Please try a different photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeMemory = (id) => {
    setFormData(prev => ({
      ...prev,
      memories: prev.memories.filter(m => m.id !== id)
    }));
  };

  const updateMemoryCaption = (id, caption) => {
    setFormData(prev => ({
      ...prev,
      memories: prev.memories.map(m => m.id === id ? { ...m, caption } : m)
    }));
  };

  const toggleMemoryFit = (id) => {
    setFormData(prev => ({
      ...prev,
      memories: prev.memories.map(m => {
        if (m.id === id) {
          const current = m.fit || 'contain';
          return { ...m, fit: current === 'contain' ? 'cover' : 'contain' };
        }
        return m;
      })
    }));
  };

  // Finalize & Generate Short Link
  const [isGenerating, setIsGenerating] = useState(false);
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
      {/* Top bar with back and step counter */}
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
                  ? 'w-6 bg-rose-500'
                  : step > i + 1
                  ? 'w-2 bg-rose-300'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-500 ml-2">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-pink-100">
        {/* STEP 1: LOVERS' NAMES */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💍</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Big Moment
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Customize an unforgettable romantic proposal page for the person you cherish.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Partner's Name *
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Maya, Daniel, or My Sweetheart"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-base font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Name / Signature *
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="e.g. Yours forever, Liam"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Pet Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={e => setFormData({ ...formData, petName: e.target.value })}
                  placeholder="e.g. My Sunshine, Honey, Cutie"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-base font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Romantic Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROPOSAL_THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.id })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      formData.theme === t.id
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-300'
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 text-white font-bold text-base shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span>Continue to Romantic Atmosphere</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: ATMOSPHERE & VISUALS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">✨</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Romantic Atmosphere
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Set the mood with floating background effects and music.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Floating Background Particles
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'petals', label: 'Falling Rose Petals 🌹' },
                  { id: 'hearts', label: 'Floating Hearts 💖' },
                  { id: 'stars', label: 'Twinkling Stars ✨' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, particleEffect: opt.id })}
                    className={`p-4 rounded-2xl border text-center transition ${
                      formData.particleEffect === opt.id
                        ? 'border-rose-500 bg-rose-50 font-bold text-rose-700 ring-2 ring-rose-300'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800">Tender Piano Background Music</div>
                <div className="text-xs text-slate-500">Synthesized in real-time with smooth mute toggle for recipient</div>
              </div>
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 text-white font-bold text-base shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Our Journey Photos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OUR JOURNEY / MEMORIES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">📸</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Our Story in Photos
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Add moments that defined your love story. They appear as nostalgic polaroid snapshots.
              </p>
            </div>

            {/* Photo list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.memories.map(mem => {
                const fit = mem.fit || 'contain';
                return (
                  <div key={mem.id} className="relative polaroid-card rounded-2xl border border-slate-100 p-3 bg-white">
                    <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                      <button
                        type="button"
                        onClick={() => toggleMemoryFit(mem.id)}
                        className="px-2 py-1 bg-black/60 hover:bg-black text-white text-[10px] font-bold rounded-lg transition"
                        title="Toggle full photo vs fill frame"
                      >
                        {fit === 'contain' ? '🔍 Full Photo' : '🖼️ Fill'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMemory(mem.id)}
                        className="p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition"
                        title="Remove memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="w-full h-56 sm:h-64 rounded-xl mb-3 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100">
                      <img
                        src={mem.url}
                        alt="Memory"
                        className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
                      />
                    </div>
                    <input
                      type="text"
                      value={mem.caption}
                      onChange={e => updateMemoryCaption(mem.id, e.target.value)}
                      placeholder="Describe this memory..."
                      className="w-full text-xs font-handwriting text-slate-700 border-b border-dashed border-slate-300 pb-1 outline-none text-center"
                    />
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            {formData.memories.length < 4 && (
              <label className="block w-full cursor-pointer py-6 rounded-2xl border-2 border-dashed border-rose-200 text-center hover:bg-rose-50/50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <ImageIcon className="w-7 h-7 text-rose-500" />
                  <span className="font-bold text-sm text-rose-600">
                    {isUploading ? 'Compressing photo...' : '+ Upload A Photo From Device'}
                  </span>
                  <span className="text-xs text-slate-400">Optimized for fast instant loading in the share link</span>
                </div>
              </label>
            )}

            {/* Background Music Selector */}
            <div className="pt-2">
              <MusicSelector
                selectedTrack={formData.musicTrack}
                customAudioUrl={formData.customAudioUrl}
                customAudioName={formData.customAudioName}
                defaultTrack="romantic"
                themeColor="rose"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 text-white font-bold text-base shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Sealed Love Note</span>
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
                Your heartfelt letter, sealed with a beating heart wax seal.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Love Letter *
              </label>
              <textarea
                rows={6}
                value={formData.loveLetter}
                onChange={e => setFormData({ ...formData, loveLetter: e.target.value })}
                placeholder="Pour your heart out here..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-sm font-medium leading-relaxed"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 text-white font-bold text-base shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: The Big Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: THE BIG QUESTION & RUNAWAY NO BUTTON */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💍</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Big Question & The Ring
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                The finale of the experience: the velvet ring box and the playful question.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                The Question *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={e => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-base font-semibold"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {QUESTION_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, question: preset })}
                    className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Playful Runaway NO Toggle */}
            <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="runawayNo"
                checked={formData.enableRunawayNo}
                onChange={e => setFormData({ ...formData, enableRunawayNo: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded text-rose-600 focus:ring-rose-500 accent-rose-500 cursor-pointer"
              />
              <label htmlFor="runawayNo" className="cursor-pointer">
                <div className="font-bold text-sm text-slate-900">
                  Enable the Playful Runaway "NO" Button 😜
                </div>
                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  When enabled, if they try to click "No", the button playfully bounces away and displays cute funny messages! They can only say YES! ❤️
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Celebration Message (Shown on YES)
              </label>
              <textarea
                rows={2}
                value={formData.yesMessage}
                onChange={e => setFormData({ ...formData, yesMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition text-sm font-medium"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-brand-500 text-white font-bold text-base shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
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
              💍
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Proposal Link is Ready!
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Send this private link to <span className="font-bold text-slate-800">{formData.recipientName}</span>. 
                When they open it on their phone, the romantic story, memory polaroids, ring box, and the big question will unfold!
              </p>
            </div>

            {/* Link Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span>🌐 Public Link (Opens on any mobile phone & WhatsApp)</span>
                <span className="font-bold">✓ Active</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-left">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-transparent flex-1 text-xs sm:text-sm text-slate-700 outline-none truncate font-mono select-all font-semibold"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-rose-500 text-slate-700 hover:text-rose-600 font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Sharing Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey ${formData.recipientName} ❤️ I made a Little Surprise for you! Please open this link: ${shareUrl}`)}`}
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
                className="text-rose-600 hover:underline font-bold"
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
