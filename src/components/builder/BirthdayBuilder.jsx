import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Sparkles, Cake, Image as ImageIcon, 
  Mail, Share2, Copy, Check, Eye, Trash2, Plus, Volume2
} from 'lucide-react';
import { compressImage, generateShareUrl, saveSurpriseToHistory, uploadPhotoToServer } from '../../utils/compression';
import MusicSelector from './MusicSelector';

const THEMES = [
  { id: 'rose', name: 'Rose Blossom', bg: 'from-pink-100 via-rose-50 to-pink-50', primary: 'bg-brand-500' },
  { id: 'golden', name: 'Golden Sunshine', bg: 'from-amber-100 via-yellow-50 to-orange-50', primary: 'bg-amber-500' },
  { id: 'lavender', name: 'Lavender Dream', bg: 'from-purple-100 via-indigo-50 to-pink-50', primary: 'bg-purple-500' },
  { id: 'ocean', name: 'Ocean Breeze', bg: 'from-cyan-100 via-sky-50 to-blue-50', primary: 'bg-sky-500' },
];

const CAKE_STYLES = [
  { id: 'strawberry', name: 'Strawberry Delight', emoji: '🍓', color: 'bg-pink-300' },
  { id: 'chocolate', name: 'Chocolate Truffle', emoji: '🍫', color: 'bg-amber-800 text-white' },
  { id: 'rainbow', name: 'Rainbow Sparkle', emoji: '🌈', color: 'bg-gradient-to-r from-pink-300 via-yellow-200 to-sky-300' },
  { id: 'vanilla', name: 'Confetti Cream', emoji: '🎂', color: 'bg-amber-100' },
];

export default function BirthdayBuilder({ onBack, onPreviewExperience }) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    type: 'birthday',
    recipientName: '',
    senderName: '',
    age: '',
    theme: 'rose',
    cakeStyle: 'strawberry',
    wishPrompt: 'Close your eyes, make your biggest wish, and tap the candle to blow it out! 🎂✨',
    balloons: [
      { id: '1', color: 'bg-pink-400', message: 'You bring so much warmth & sunshine into my life! ☀️' },
      { id: '2', color: 'bg-purple-400', message: 'May this new year of your life be your happiest yet! 💫' },
      { id: '3', color: 'bg-amber-400', message: 'Never stop smiling because your laugh is contagious! 💖' },
    ],
    photos: [
      {
        id: 'p1',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
        caption: 'Cheers to our sweetest memories! ✨'
      }
    ],
    letter: `Happy Birthday! 🎉\n\nI just wanted to take a moment today to celebrate the wonderful human being you are. Thank you for always bringing so much joy, kindness, and unforgettable laughter wherever you go.\n\nI hope your day is as sweet and amazing as you are. Enjoy every single second of your day! ❤️`,
    secretNote: `P.S. There is a real surprise waiting for you next time we meet! 😉🎁`,
    musicTrack: 'birthday',
    customAudioUrl: '',
    customAudioName: ''
  });

  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const compressed = await compressImage(file, 600, 0.65);
      // Upload to server to get tiny URL instead of giant base64
      const photoUrl = await uploadPhotoToServer(compressed);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, { id: 'p_' + Date.now(), url: photoUrl, caption: 'A special moment together 📸' }]
      }));
    } catch (err) {
      alert('Could not process photo. Please try a different image.');
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

  const updateBalloonMessage = (id, message) => {
    setFormData(prev => ({
      ...prev,
      balloons: prev.balloons.map(b => b.id === id ? { ...b, message } : b)
    }));
  };

  const addBalloon = () => {
    if (formData.balloons.length >= 5) return;
    const colors = ['bg-rose-400', 'bg-sky-400', 'bg-emerald-400', 'bg-indigo-400'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setFormData(prev => ({
      ...prev,
      balloons: [
        ...prev.balloons,
        { id: 'b_' + Date.now(), color: randomColor, message: 'You deserve the entire universe today! 🎁' }
      ]
    }));
  };

  const removeBalloon = (id) => {
    if (formData.balloons.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      balloons: prev.balloons.filter(b => b.id !== id)
    }));
  };

  // Step 6: Finalize & Generate Short Link
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
                  ? 'w-6 bg-brand-500'
                  : step > i + 1
                  ? 'w-2 bg-brand-300'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-bold text-slate-500 ml-2">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100">
        {/* STEP 1: WHO IS IT FOR */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🎂</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Who are we celebrating?
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Let's set the stage for their personalized birthday surprise.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Birthday Person's Name *
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Sophia, Babe, Mom, or Alex"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-base font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Name / Nickname *
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="e.g. Your Secret Admirer, Chris"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Turning Age (Optional)
                </label>
                <input
                  type="text"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 21, 25, or Forever Young"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-base font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Choose Color Palette
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: t.id })}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                      formData.theme === t.id
                        ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-300'
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
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <span>Continue to Cake & Wishes</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: CAKE & CANDLE WISHES */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🎂</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Interactive Birthday Cake
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                They will tap the flickering candle to blow it out and make a wish!
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pick Their Favorite Cake Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CAKE_STYLES.map(cake => (
                  <button
                    key={cake.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, cakeStyle: cake.id })}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition ${
                      formData.cakeStyle === cake.id
                        ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-300'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{cake.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{cake.name}</div>
                      <div className="text-xs text-slate-400">Delicious & interactive</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Make-a-Wish Instruction Prompt
              </label>
              <textarea
                rows={3}
                value={formData.wishPrompt}
                onChange={e => setFormData({ ...formData, wishPrompt: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-sm font-medium"
              />
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold text-base shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Balloon Surprises</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BALLOON POP SURPRISES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🎈</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Pop-the-Balloon Surprises
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Each balloon reveals a secret compliment or message when they pop it!
              </p>
            </div>

            <div className="space-y-3">
              {formData.balloons.map((balloon, index) => (
                <div key={balloon.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-sm">
                  <div className={`w-8 h-8 rounded-full ${balloon.color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={balloon.message}
                      onChange={e => updateBalloonMessage(balloon.id, e.target.value)}
                      placeholder="Enter hidden balloon message..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-500 text-sm font-medium outline-none"
                    />
                  </div>
                  {formData.balloons.length > 1 && (
                    <button
                      onClick={() => removeBalloon(balloon.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition"
                      title="Remove balloon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {formData.balloons.length < 5 && (
              <button
                onClick={addBalloon}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-rose-200 text-brand-600 hover:bg-rose-50 font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Balloon (Max 5)</span>
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold text-base shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Photo Memories</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PHOTO MEMORIES */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">📸</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Photo Memories & Moments
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Upload your favorite photos with captions. They appear as cute interactive Polaroids!
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
                        title="Toggle full photo vs fill frame"
                      >
                        {fit === 'contain' ? '🔍 Full Photo' : '🖼️ Fill'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition"
                        title="Remove photo"
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
                      placeholder="Add a sweet memory caption..."
                      className="w-full text-xs font-handwriting text-slate-700 border-b border-dashed border-slate-300 pb-1 outline-none text-center"
                    />
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            {formData.photos.length < 4 && (
              <label className="block w-full cursor-pointer py-6 rounded-2xl border-2 border-dashed border-rose-200 text-center hover:bg-rose-50/50 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <ImageIcon className="w-7 h-7 text-brand-500" />
                  <span className="font-bold text-sm text-brand-600">
                    {isUploading ? 'Compressing photo...' : '+ Upload A Photo From Device'}
                  </span>
                  <span className="text-xs text-slate-400">Automatically optimized for instant private link sharing</span>
                </div>
              </label>
            )}

            {/* Background Music Selector */}
            <div className="pt-2">
              <MusicSelector
                selectedTrack={formData.musicTrack}
                customAudioUrl={formData.customAudioUrl}
                customAudioName={formData.customAudioName}
                defaultTrack="birthday"
                themeColor="rose"
                onChange={({ musicTrack, customAudioUrl, customAudioName }) => {
                  setFormData(prev => ({ ...prev, musicTrack, customAudioUrl, customAudioName }));
                }}
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold text-base shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition flex items-center justify-center gap-2"
              >
                <span>Next: Sealed Letter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SEALED BIRTHDAY LETTER */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">💌</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                The Sealed Birthday Letter
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                A heartfelt letter sealed with a digital wax stamp. They tap the stamp to break it open!
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Your Birthday Letter *
              </label>
              <textarea
                rows={6}
                value={formData.letter}
                onChange={e => setFormData({ ...formData, letter: e.target.value })}
                placeholder="Write your heartfelt words here..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-sm font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Secret P.S. Note (Revealed at the end)
              </label>
              <input
                type="text"
                value={formData.secretNote}
                onChange={e => setFormData({ ...formData, secretNote: e.target.value })}
                placeholder="e.g. P.S. Check your front door at 6 PM!"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition text-sm font-medium"
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
                className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-500 text-white font-bold text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.01] active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-60"
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
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              ✨
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Surprise Link is Ready!
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                Send this private link to <span className="font-bold text-slate-800">{formData.recipientName}</span>. 
                When they open it on their phone or laptop, the interactive birthday journey will unfold!
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
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-600 font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Sharing Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hey ${formData.recipientName}! 🎂 I made a Little Surprise for you! Open this link: ${shareUrl}`)}`}
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
                className="text-brand-600 hover:underline font-bold"
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
