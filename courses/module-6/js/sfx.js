/* ===== Sound effects — synthesised with Web Audio, no audio files ===== */
window.SFX = (function () {
  let ctx = null, master = null;
  let muted = false;
  try { muted = localStorage.getItem("wise-m6-muted") === "1"; } catch (e) {}

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 0.42;
      /* light reverb for a fuller, "tebal" sound */
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.connect(ctx.destination);
      const dry = ctx.createGain(); dry.gain.value = 1; master.connect(dry); dry.connect(comp);
      try { const len = ctx.sampleRate * 1.1, ir = ctx.createBuffer(2, len, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
        const cv = ctx.createConvolver(); cv.buffer = ir; const wet = ctx.createGain(); wet.gain.value = 0.18; master.connect(cv); cv.connect(wet); wet.connect(comp); } catch (e) {}
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(freq, dur, { type = "sine", vol = 0.6, at = 0, slide = 0, attack = 0.006 } = {}) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, { vol = 0.25, at = 0, from = 400, to = 3000, q = 0.8 } = {}) {
    const c = ac(); if (!c || muted) return;
    const t = c.currentTime + at, len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q;
    f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur);
  }

  /* deep sine thump: pitch drops ~150 -> 50 Hz */
  const thump = (vol = 0.9, at = 0, f0 = 150, f1 = 50, dur = 0.22) => tone(f0, dur, { vol, at, slide: f1 - f0, attack: 0.004 });
  const bell = (f, at = 0, vol = 0.22, dur = 0.7) => { tone(f, dur, { vol, at, attack: 0.008 }); tone(f * 2, dur * 0.6, { vol: vol * 0.25, at, type: "triangle" }); };
  const fx = {
    tap() { thump(0.75, 0, 140, 55, 0.14); noise(0.05, { vol: 0.06, from: 900, to: 500, q: 1.2 }); },
    pop() { thump(0.8, 0, 170, 60, 0.18); bell(392, 0.02, 0.12, 0.35); },
    bubble() { thump(0.5, 0, 120 + Math.random() * 60, 60, 0.16); },
    whoosh() { noise(0.42, { vol: 0.2, from: 180, to: 1400, q: 0.7 }); thump(0.45, 0.05, 110, 45, 0.3); },
    snip() { noise(0.08, { vol: 0.25, from: 1200, to: 2400, q: 1.5 }); thump(0.4, 0, 160, 70, 0.1); },
    tick() { thump(0.35, 0, 200, 90, 0.06); },
    spark() { bell(784, 0, 0.16, 0.5); bell(1175, 0.07, 0.12, 0.6); },
    rise() { tone(110, 0.5, { vol: 0.4, slide: 220 }); noise(0.45, { vol: 0.1, from: 200, to: 1600 }); },
    fall() { tone(260, 0.45, { vol: 0.4, slide: -180 }); },
    correct() { thump(0.85); bell(523, 0.03, 0.22); bell(784, 0.13, 0.2, 0.9); },
    wrong() { thump(0.9, 0, 120, 40, 0.3); tone(98, 0.32, { type: "triangle", vol: 0.28, at: 0.04, slide: -30 }); },
    unlock() { thump(0.8); [392, 523, 659].forEach((f, i) => bell(f, 0.04 + i * 0.08, 0.18)); },
    fanfare() {
      thump(1, 0, 160, 45, 0.4); noise(0.6, { vol: 0.12, from: 150, to: 900 });
      [392, 523, 659, 784].forEach((f, i) => bell(f, 0.08 + i * 0.12, 0.2, 0.9));
      bell(1047, 0.6, 0.16, 1.4); thump(0.7, 0.58, 130, 45, 0.35);
    }
  };

  function play(name) { if (!muted && fx[name]) try { fx[name](); } catch (e) {} }
  function setMuted(m) {
    muted = m;
    try { localStorage.setItem("wise-m6-muted", m ? "1" : "0"); } catch (e) {}
    if (!m) play("tap");
  }
  return { play, setMuted, isMuted: () => muted, unlock: ac };
})();
