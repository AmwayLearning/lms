/* ===== Sound effects — synthesised with Web Audio, no audio files ===== */
window.SFX = (function () {
  let ctx = null, master = null;
  let muted = false;
  try { muted = localStorage.getItem("wise-m4-muted") === "1"; } catch (e) {}

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 0.32; master.connect(ctx.destination);
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

  const fx = {
    tap() { tone(660, 0.07, { type: "triangle", vol: 0.35 }); },
    pop() { tone(420, 0.12, { vol: 0.5, slide: 520 }); },
    bubble() { tone(300 + Math.random() * 300, 0.14, { vol: 0.35, slide: 600 }); },
    whoosh() { noise(0.32, { vol: 0.22, from: 300, to: 2400 }); },
    snip() { noise(0.06, { vol: 0.4, from: 3000, to: 6000, q: 2 }); tone(1600, 0.05, { type: "square", vol: 0.08, at: 0.02 }); },
    tick() { tone(1200, 0.03, { type: "square", vol: 0.08 }); },
    spark() { tone(1320, 0.09, { vol: 0.25 }); tone(1980, 0.12, { vol: 0.18, at: 0.05 }); },
    rise() { tone(220, 0.5, { type: "triangle", vol: 0.25, slide: 660 }); },
    fall() { tone(660, 0.45, { type: "triangle", vol: 0.25, slide: -440 }); },
    correct() { tone(660, 0.14, { type: "triangle", vol: 0.45 }); tone(990, 0.24, { type: "triangle", vol: 0.45, at: 0.1 }); },
    wrong() { tone(220, 0.16, { type: "sawtooth", vol: 0.14 }); tone(180, 0.24, { type: "sawtooth", vol: 0.14, at: 0.12 }); },
    unlock() { [523, 659, 784].forEach((f, i) => tone(f, 0.18, { type: "triangle", vol: 0.32, at: i * 0.07 })); },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.26, { type: "triangle", vol: 0.38, at: i * 0.11 }));
      tone(1319, 0.6, { type: "sine", vol: 0.3, at: 0.46 });
      noise(0.5, { vol: 0.08, at: 0.45, from: 4000, to: 9000 });
    }
  };

  function play(name) { if (!muted && fx[name]) try { fx[name](); } catch (e) {} }
  function setMuted(m) {
    muted = m;
    try { localStorage.setItem("wise-m4-muted", m ? "1" : "0"); } catch (e) {}
    if (!m) play("tap");
  }
  return { play, setMuted, isMuted: () => muted, unlock: ac };
})();
