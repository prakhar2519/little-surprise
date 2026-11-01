// Web Audio API Synthesizer for 100% free, reliable, offline-ready sound effects and melodies

let audioCtx = null;
let currentBgOscs = [];
let bgLoopTimeout = null;
let isBgPlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play balloon pop sound
export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

// Play magical sparkle / chime sound
export function playSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    const startTime = now + idx * 0.06;
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

// Play wax stamp breaking sound
export function playWaxCrackSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Gentle paper rustle / stamp break
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

// Play candle blow sound
export function playBlowCandleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // White noise puff
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
}

// Play romantic or celebratory background music in loop
let currentCustomAudio = null;

export async function startBackgroundMusic(mood = 'romantic') {
  stopBackgroundMusic();

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      // Browser blocked autoplay before user gesture
    }
  }

  // If still suspended, wait for user gesture before scheduling
  if (ctx.state === 'suspended') {
    isBgPlaying = false;
    return;
  }

  isBgPlaying = true;

  const romanticMelody = [
    // [frequency, durationInBeats]
    [329.63, 1], [392.00, 1], [493.88, 2],
    [440.00, 1], [392.00, 1], [329.63, 2],
    [293.66, 1], [329.63, 1], [392.00, 2],
    [369.99, 2], [293.66, 2],
    [329.63, 1.5], [392.00, 0.5], [493.88, 1.5], [587.33, 0.5],
    [523.25, 2], [493.88, 2]
  ];

  const birthdayMelody = [
    // Happy Birthday notes
    [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2],
    [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2],
    [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 2],
    [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2]
  ];

  const apologyMelody = [
    // Soothing, gentle Canon in D style calming chords
    [293.66, 1.5], [440.00, 1.5], [369.99, 1.5], [293.66, 1.5],
    [329.63, 1.5], [392.00, 1.5], [329.63, 1.5], [293.66, 2],
    [261.63, 1.5], [329.63, 1.5], [392.00, 1.5], [329.63, 1.5],
    [293.66, 2], [369.99, 1.5], [440.00, 2.5]
  ];

  const loveMelody = [
    // Warm, joyful romantic love melody
    [392.00, 1], [440.00, 1], [493.88, 1.5], [587.33, 1.5],
    [523.25, 1], [493.88, 1], [440.00, 2],
    [392.00, 1], [440.00, 1], [493.88, 1], [392.00, 1],
    [440.00, 1.5], [493.88, 0.5], [523.25, 2], [493.88, 2]
  ];

  const musicBoxMelody = [
    // Delicate music box tune
    [523.25, 0.75], [659.25, 0.75], [783.99, 1.5], [659.25, 0.75],
    [587.33, 0.75], [523.25, 0.75], [440.00, 1.5], [523.25, 0.75],
    [659.25, 1.5], [783.99, 1.5], [880.00, 1.5], [783.99, 2]
  ];

  const acousticMelody = [
    // Calm guitar-style acoustic chords
    [329.63, 1], [392.00, 1], [440.00, 1.5], [493.88, 1.5],
    [440.00, 1], [392.00, 1], [329.63, 2], [293.66, 2],
    [261.63, 1.5], [329.63, 1.5], [392.00, 2], [329.63, 2]
  ];

  let melody = romanticMelody;
  let tempo = 0.65;
  let waveType = 'sine';

  if (mood === 'birthday') {
    melody = birthdayMelody;
    tempo = 0.45;
    waveType = 'triangle';
  } else if (mood === 'apology') {
    melody = apologyMelody;
    tempo = 0.75;
    waveType = 'sine';
  } else if (mood === 'show_love') {
    melody = loveMelody;
    tempo = 0.55;
    waveType = 'sine';
  } else if (mood === 'music_box') {
    melody = musicBoxMelody;
    tempo = 0.5;
    waveType = 'sine';
  } else if (mood === 'peaceful_acoustic') {
    melody = acousticMelody;
    tempo = 0.7;
    waveType = 'triangle';
  }

  function schedulePhrase() {
    if (!isBgPlaying) return;
    const now = ctx.currentTime;
    let offset = 0.05;

    melody.forEach(([freq, beats]) => {
      const dur = beats * tempo;
      const noteStart = now + offset;
      const attack = Math.min(0.04, dur * 0.15);
      const decayEnd = noteStart + Math.max(attack + 0.03, dur * 0.9);

      // Primary tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.22, noteStart + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, decayEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(decayEnd + 0.02);
      currentBgOscs.push(osc);

      // Gentle overtone for rich music box / acoustic warmth
      const overtoneOsc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(freq * 2, noteStart);

      overtoneGain.gain.setValueAtTime(0.0001, noteStart);
      overtoneGain.gain.linearRampToValueAtTime(0.06, noteStart + attack);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, decayEnd);

      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      overtoneOsc.start(noteStart);
      overtoneOsc.stop(decayEnd + 0.02);
      currentBgOscs.push(overtoneOsc);

      offset += dur;
    });

    const totalDuration = offset * 1000;
    bgLoopTimeout = setTimeout(() => {
      schedulePhrase();
    }, totalDuration + 1200); // 1.2s gentle breath before loop
  }

  schedulePhrase();
}

export function stopBackgroundMusic() {
  isBgPlaying = false;
  if (bgLoopTimeout) {
    clearTimeout(bgLoopTimeout);
    bgLoopTimeout = null;
  }
  currentBgOscs.forEach(osc => {
    try { osc.stop(); } catch(e) {}
  });
  currentBgOscs = [];
}

// Unified playMusic that handles both synthesized tracks and custom MP3s
let unlockListenerAttached = false;
let pendingMusicRequest = null;

function setupAutoplayUnlock() {
  if (typeof window === 'undefined') return;

  const unlockAudio = async () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (currentCustomAudio && pendingMusicRequest?.customAudioUrl) {
        if (currentCustomAudio.paused) {
          await currentCustomAudio.play().catch(() => {});
        }
      } else if (pendingMusicRequest && pendingMusicRequest.trackId !== 'none') {
        if (!isBgPlaying) {
          startBackgroundMusic(pendingMusicRequest.effectiveMood);
        }
      }
    } catch (e) {
      console.warn('Unlock audio error:', e);
    }
  };

  const events = ['click', 'touchstart', 'touchend', 'pointerdown'];
  events.forEach(evt => {
    window.addEventListener(evt, unlockAudio, { capture: true, once: false });
  });
}

export function playMusic(trackId = 'default', customAudioUrl = null, fallbackMood = 'romantic') {
  stopMusic();

  if (trackId === 'none') {
    pendingMusicRequest = null;
    return;
  }

  const effectiveMood = (trackId && trackId !== 'default' && trackId !== 'custom') ? trackId : fallbackMood;
  pendingMusicRequest = { trackId, customAudioUrl, effectiveMood };

  setupAutoplayUnlock();

  if (customAudioUrl) {
    try {
      currentCustomAudio = new Audio(customAudioUrl);
      currentCustomAudio.loop = true;
      currentCustomAudio.volume = 0.55;
      currentCustomAudio.play().catch(e => {
        console.log('Audio autoplay deferred until first interaction:', e);
      });
    } catch (e) {
      console.error('Custom audio error:', e);
    }
    return;
  }

  startBackgroundMusic(effectiveMood);
}

export function stopMusic() {
  pendingMusicRequest = null;
  stopBackgroundMusic();
  if (currentCustomAudio) {
    try {
      currentCustomAudio.pause();
      currentCustomAudio.currentTime = 0;
    } catch (e) {}
    currentCustomAudio = null;
  }
}
