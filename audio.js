window.CQAudio = (() => {
  let ctx = null;
  let enabled = false;
  let bgmTimer = null;
  let stepGate = 0;
  const notes = [196, 247, 262, 330, 294, 247, 220, 262];
  let noteIndex = 0;

  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function tone(freq = 440, duration = 0.08, type = 'square', volume = 0.035) {
    if (!enabled) return;
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

  function startBgm() {
    if (!enabled || bgmTimer) return;
    ensure();
    bgmTimer = setInterval(() => {
      tone(notes[noteIndex % notes.length], 0.11, 'square', 0.018);
      noteIndex += 1;
    }, 340);
  }

  function stopBgm() {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }

  return {
    isEnabled: () => enabled,
    toggle() {
      enabled = !enabled;
      if (enabled) {
        ensure();
        startBgm();
        tone(523, 0.08, 'square', 0.04);
      } else {
        stopBgm();
      }
      return enabled;
    },
    enable() {
      enabled = true;
      ensure();
      startBgm();
      return enabled;
    },
    off() {
      enabled = false;
      stopBgm();
      return enabled;
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
