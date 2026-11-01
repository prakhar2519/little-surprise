import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Play, Square, Upload, Link2, Volume2, 
  Check, Sparkles, Disc, Trash2, ArrowRight, Radio
} from 'lucide-react';
import { playMusic, stopMusic } from '../../utils/sound';

const TRACK_OPTIONS = [
  { id: 'birthday', name: 'Happy Birthday Melody', emoji: '🎂', desc: 'Upbeat, joyful celebration bells & chimes' },
  { id: 'romantic', name: 'Romantic Piano Serenade', emoji: '💖', desc: 'Heartfelt, emotional piano harmony' },
  { id: 'apology', name: 'Calming Canon in D', emoji: '💙', desc: 'Peaceful, tender and sincere acoustic chords' },
  { id: 'show_love', name: 'Sweet Romance Chords', emoji: '💕', desc: 'Warm, joyful melody full of affection' },
  { id: 'music_box', name: 'Enchanted Music Box', emoji: '✨', desc: 'Dreamy fairytale chime melody' },
  { id: 'peaceful_acoustic', name: 'Peaceful Acoustic Harmony', emoji: '🌿', desc: 'Tranquil and soothing gentle chords' },
  { id: 'none', name: 'No Background Music', emoji: '🔇', desc: 'Silent ambient experience without music' },
];

export default function MusicSelector({ 
  selectedTrack = 'default', 
  customAudioUrl = '', 
  customAudioName = '',
  onChange,
  defaultTrack = 'romantic',
  themeColor = 'rose'
}) {
  const [activeTab, setActiveTab] = useState(customAudioUrl || selectedTrack === 'custom' ? 'upload' : 'curated');
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Stop music when unmounting
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  const handleTogglePreview = (trackId, customUrl = null) => {
    if (playingTrackId === trackId) {
      stopMusic();
      setPlayingTrackId(null);
    } else {
      stopMusic();
      setPlayingTrackId(trackId);
      if (trackId === 'custom') {
        playMusic('custom', customUrl || customAudioUrl, defaultTrack);
      } else {
        playMusic(trackId, null, defaultTrack);
      }
    }
  };

  const handleSelectTrack = (trackId) => {
    onChange({
      musicTrack: trackId,
      customAudioUrl: trackId === 'custom' ? customAudioUrl : '',
      customAudioName: trackId === 'custom' ? customAudioName : ''
    });

    if (trackId === 'none') {
      stopMusic();
      setPlayingTrackId(null);
    } else if (trackId === 'custom') {
      if (customAudioUrl) {
        handleTogglePreview('custom', customAudioUrl);
      } else {
        stopMusic();
        setPlayingTrackId(null);
      }
    } else {
      if (playingTrackId === trackId) {
        stopMusic();
        setPlayingTrackId(null);
      } else {
        stopMusic();
        setPlayingTrackId(trackId);
        playMusic(trackId, null, defaultTrack);
      }
    }
  };

  // Upload custom MP3 / audio
  const handleAudioFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      alert('Please select a valid audio file (.mp3, .wav, .m4a, .ogg)');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioBase64: base64Data })
          });
          const result = await res.json();
          if (result.success && result.url) {
            onChange({
              musicTrack: 'custom',
              customAudioUrl: result.url,
              customAudioName: file.name
            });
            handleTogglePreview('custom', result.url);
          } else {
            onChange({
              musicTrack: 'custom',
              customAudioUrl: base64Data,
              customAudioName: file.name
            });
            handleTogglePreview('custom', base64Data);
          }
        } catch (err) {
          onChange({
            musicTrack: 'custom',
            customAudioUrl: base64Data,
            customAudioName: file.name
          });
          handleTogglePreview('custom', base64Data);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Audio file upload error', err);
      setIsUploading(false);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    onChange({
      musicTrack: 'custom',
      customAudioUrl: customUrlInput.trim(),
      customAudioName: 'Custom Audio Stream'
    });
    handleTogglePreview('custom', customUrlInput.trim());
  };

  const handleRemoveCustomAudio = () => {
    stopMusic();
    setPlayingTrackId(null);
    onChange({
      musicTrack: defaultTrack,
      customAudioUrl: '',
      customAudioName: ''
    });
    setActiveTab('curated');
  };

  const activeTrack = selectedTrack === 'default' ? defaultTrack : selectedTrack;
  const isCustomActive = selectedTrack === 'custom' || !!customAudioUrl;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rose-50 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Music className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800 flex items-center gap-2">
              <span>Background Music & Soundtrack</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                Audio
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Plays softly in the background when your surprise is opened
            </p>
          </div>
        </div>

        {playingTrackId && (
          <button
            onClick={() => {
              stopMusic();
              setPlayingTrackId(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-md transition animate-pulse shrink-0 self-start sm:self-auto"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Pause Music</span>
          </button>
        )}
      </div>

      {/* Tabs: Choose Curated Tunes OR Upload Song */}
      <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('curated')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'curated'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4 text-brand-500" />
          <span>Curated Melodies ({TRACK_OPTIONS.length - 1})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
            activeTab === 'upload'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4 text-rose-500" />
          <span>Upload Custom Song / MP3</span>
          {isCustomActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Now Playing Banner */}
      {playingTrackId && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-md animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-1 h-4">
              <span className="w-1 bg-white animate-bounce h-4 rounded-full"></span>
              <span className="w-1 bg-white animate-pulse h-2 rounded-full"></span>
              <span className="w-1 bg-white animate-bounce h-3 rounded-full"></span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-100 block tracking-wider">
                Now Playing Sample
              </span>
              <span className="font-extrabold text-xs sm:text-sm">
                {playingTrackId === 'custom'
                  ? `🎶 ${customAudioName || 'Custom Uploaded Song'}`
                  : `${TRACK_OPTIONS.find(t => t.id === playingTrackId)?.emoji} ${TRACK_OPTIONS.find(t => t.id === playingTrackId)?.name}`}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              stopMusic();
              setPlayingTrackId(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Pause</span>
          </button>
        </div>
      )}

      {/* VIEW 1: CURATED MELODIES */}
      {activeTab === 'curated' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRACK_OPTIONS.map((track) => {
              const isSelected = activeTrack === track.id && !isCustomActive;
              const isPlaying = playingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/40 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{track.emoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {track.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-brand-500 text-white font-bold px-1.5 py-0.2 rounded-full shrink-0">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{track.desc}</p>
                    </div>
                  </div>

                  {track.id !== 'none' && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPlaying && (
                        <span className="text-[10px] font-bold text-rose-600 animate-pulse hidden sm:inline">
                          Playing ♫
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePreview(track.id);
                        }}
                        title={isPlaying ? 'Pause Tune' : 'Play Tune'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-sm ${
                          isPlaying
                            ? 'bg-rose-500 text-white ring-2 ring-rose-400 ring-offset-1 animate-pulse'
                            : 'bg-white border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-600'
                        }`}
                      >
                        {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick link to custom upload */}
          <div 
            onClick={() => setActiveTab('upload')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border border-dashed border-rose-300 hover:border-rose-400 cursor-pointer flex items-center justify-between text-left transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎶</span>
              <div>
                <span className="font-bold text-xs sm:text-sm text-rose-900 block">
                  Have a specific song in mind? (Ed Sheeran, romantic song, etc.)
                </span>
                <span className="text-[11px] text-rose-600">
                  Switch to Upload Music section to upload any MP3 file from your device
                </span>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-white text-rose-600 text-xs font-bold border border-rose-200 shadow-sm shrink-0 flex items-center gap-1">
              <span>Upload MP3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED UPLOAD MUSIC SECTION */}
      {activeTab === 'upload' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm sm:text-base">
                <Disc className="w-5 h-5 text-rose-600 animate-spin-slow" />
                <span>Custom Music & Song Studio</span>
              </div>
              {customAudioUrl && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected & Ready</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              Upload any MP3 song, romantic melody, instrumental track, or personal recorded voice message from your phone or PC.
            </p>

            {customAudioUrl ? (
              /* Already Uploaded Audio Box */
              <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-md space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-sm text-slate-800 truncate block">
                        {customAudioName || 'Custom Uploaded Song'}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Ready to play in your surprise</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePreview('custom', customAudioUrl)}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition ${
                        playingTrackId === 'custom'
                          ? 'bg-rose-500 text-white ring-2 ring-rose-400 animate-pulse'
                          : 'bg-rose-500 hover:bg-rose-600 text-white'
                      }`}
                    >
                      {playingTrackId === 'custom' ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Preview</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveCustomAudio}
                      title="Remove audio"
                      className="p-2 rounded-xl border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Upload Area */
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
                  onChange={handleAudioFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer p-6 rounded-2xl bg-white border-2 border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-50/40 transition flex flex-col items-center justify-center gap-2 text-center shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="font-extrabold text-sm sm:text-base text-rose-900">
                    {isUploading ? 'Uploading and optimizing audio...' : '+ Click to Choose MP3 / Audio File'}
                  </span>
                  <span className="text-xs text-slate-500 max-w-sm">
                    Supports MP3, WAV, M4A, OGG. Perfect for romantic songs, movie themes, or voice notes.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-px bg-rose-200 flex-1"></div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">or paste direct audio link</span>
                  <div className="h-px bg-rose-200 flex-1"></div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/song.mp3"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-rose-200 text-xs sm:text-sm bg-white text-slate-700 outline-none focus:border-rose-500 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition shrink-0"
                  >
                    Apply Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
