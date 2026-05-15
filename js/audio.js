window.CQAudio = (() => {
  let ctx = null;
  let unlocked = false;
  let musicEnabled = true;
  let sfxEnabled = true;
  let bgmTimer = null;
  let stepGate = 0;
  const notes = [196, 247, 262, 330, 294, 247, 220, 262];
  let noteIndex = 0;

  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function unlock() {
    try {
      ensure();
      unlocked = true;
      refreshMusic();
    } catch (err) {
      console.warn('Audio unlock failed', err);
    }
  }

  function tone(freq = 440, duration = 0.08, type = 'square', volume = 0.035) {
    if (!sfxEnabled || !unlocked) return;
    ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playMusicNote() {
    if (!musicEnabled || !unlocked) return;
    ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = notes[noteIndex % notes.length];
    gain.gain.value = 0.014;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    noteIndex += 1;
  }

  function refreshMusic() {
    if (!musicEnabled || !unlocked) {
      clearInterval(bgmTimer);
      bgmTimer = null;
      return;
    }
    if (bgmTimer) return;
    bgmTimer = setInterval(playMusicNote, 360);
  }

  function getState() {
    return { music: musicEnabled, sfx: sfxEnabled };
  }

  return {
    getState,
    unlock,
    toggleMusic() {
      musicEnabled = !musicEnabled;
      if (musicEnabled) unlock();
      refreshMusic();
      return getState();
    },
    toggleSfx() {
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) unlock();
      return getState();
    },
    sfx(name) {
      if (name === 'select') tone(440, 0.06);
      if (name === 'interact') { tone(330, 0.05); setTimeout(() => tone(440, 0.05), 55); }
      if (name === 'correct') { tone(523, 0.07); setTimeout(() => tone(659, 0.09), 80); }
      if (name === 'wrong') { tone(160, 0.12, 'sawtooth', 0.03); setTimeout(() => tone(120, 0.12, 'sawtooth', 0.025), 100); }
      if (name === 'unlock') { [392, 494, 587, 784].forEach((n, i) => setTimeout(() => tone(n, 0.08), i * 75)); }
      if (name === 'step') {
        const now = performance.now();
        if (now - stepGate < 240) return;
        stepGate = now;
        tone(110, 0.035, 'square', 0.012);
      }
    }
  };
})();
