/* ===== Module 6 — Nutrition and Health Trends =====
   Content source: the user's slide deck "Module 6 — Nutrition and Health Trends" (48 slides). */
(function () {
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => Array.from(el.querySelectorAll(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const IMG = window.IMG = { weight: "assets/img/sec_weight.webp", gut: "assets/img/sec_gut.webp", cells: "assets/img/sec_cells.webp" };
const refade = n => { n.classList.remove("fade"); void n.offsetWidth; n.classList.add("fade"); };
const F = "-apple-system,Inter,sans-serif";
function countUp(el, to, dec = 0, ms = 1200) {
  const t0 = performance.now();
  (function f(t) { const p = Math.min(1, (t - t0) / (reduce ? 1 : ms)), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(f); })(t0);
}
/* segmented control */
function seg(el, labels, onPick, api, key) {
  const bar = $(".seg", el), seen = new Set();
  bar.setAttribute("role", "tablist");
  bar.innerHTML = labels.map((l, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${l}</button>`).join("");
  const go = (i, snd) => { $$("button", bar).forEach((b, j) => b.setAttribute("aria-selected", i === j)); seen.add(i); if (snd) api.sfx("tap"); onPick(i); if (seen.size === labels.length) api.interacted(key); };
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i, true); });
  go(0, false);
}
/* Myth-or-fact card: guess, then the card flips in 3D to reveal the answer */
const mythTile = (id, eyebrow, claim, isMyth, verdict, back, onFlip) => ({
  id, title: "Myth or fact", cls: "center",
  html: () => `<p class="eyebrow">${eyebrow}</p><h2 class="h-md">Myth or fact?</h2>
    <div class="myth"><div class="myth-in">
      <div class="myth-f"><span class="qm" aria-hidden="true">“</span><p>${claim}</p><span class="small">Tap Myth or Fact</span></div>
      <div class="myth-b"><span class="vbadge">${verdict}</span>${back}</div>
    </div></div>
    <div class="mopts" data-mf><button data-a="1" style="--b:linear-gradient(135deg,#f43f5e,#fb923c)">Myth</button><button data-a="0" style="--b:linear-gradient(135deg,#16a34a,#06b6d4)">Fact</button></div>
    <p class="cap" data-res aria-live="polite"></p>`,
  enter(el, api) {
    $$("[data-mf] button", el).forEach(b => b.addEventListener("click", () => {
      const ok = (b.dataset.a === "1") === isMyth;
      api.sfx(ok ? "correct" : "wrong"); setTimeout(() => api.sfx("whoosh"), 250);
      $$("[data-mf] button", el).forEach(x => { x.disabled = true; x.classList.toggle("on", (x.dataset.a === "1") === isMyth); });
      $(".myth", el).classList.add("flipped");
      const r = $("[data-res]", el); r.innerHTML = ok ? "<b>You got it.</b>" : "<b>Not quite.</b> Here's why."; refade(r);
      if (onFlip) setTimeout(() => onFlip(el, api), 450);
      api.interacted(id);
    }));
  }
});
const endTile = (id, head, text, cta) => ({
  id, title: "Section complete", end: true, cls: "center next-tile",
  html: () => `<svg class="check" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="url(#gx${id})" stroke-width="4"/><defs><linearGradient id="gx${id}"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient></defs><path d="M22 37l9 9 19-20" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" class="tick"/></svg>
    <p class="eyebrow">Lesson complete</p><h2 class="h-lg">${head}</h2><p class="body">${text}</p>
    <div class="ctas"><button class="pill" data-act="next">${cta}</button><button class="more" data-act="home">Course map</button></div>`,
  enter(el, api) { const t = $(".tick", el); t.style.transition = "stroke-dashoffset .7s cubic-bezier(.16,1,.3,1) .2s"; t.style.strokeDashoffset = 0; api.sfx("fanfare"); api.confetti(); }
});
const person = '<svg viewBox="0 0 20 32" aria-hidden="true"><circle cx="10" cy="6" r="5"/><path d="M3 31V19a7 7 0 0 1 14 0v12z"/></svg>';
const iconRow = (pct, col) => `<span class="iarr" style="--p:${pct}%;--c:${col}"><span class="iarr-bg">${person.repeat(10)}</span><span class="iarr-fg">${person.repeat(10)}</span></span>`;


/* ===================== Drawn 2.5D body & health icons (viewBox 0 0 64 64) ===================== */
const SHD = `<ellipse cx="32" cy="58" rx="20" ry="3.6" fill="#000" opacity=".10"/>`;
const ORG = {
  heart: `${SHD}<path d="M32 54C14 42 8 32 8 23a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 9-6 19-24 31z" fill="#ef4444"/><path d="M14 22a7 7 0 0 1 9-6" stroke="#fff" stroke-width="3" opacity=".55" fill="none" stroke-linecap="round"/>`,
  brain: `${SHD}<path d="M18 46c-8-2-11-10-8-17 0-8 6-14 13-14 3-4 9-5 13-2 6-2 13 2 14 9 6 3 7 11 3 16-1 6-7 9-13 8-3 3-9 4-13 1-3 1-7 1-9-1z" fill="#f9a8d4"/><path d="M32 16v32M22 24c4 1 6 4 6 8M42 22c-4 2-5 5-5 9M18 36c4-1 7 1 8 4M46 36c-4-1-7 1-8 4" stroke="#db2777" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="20" rx="5" ry="2" fill="#fff" opacity=".45"/>`,
  kidney: `${SHD}<path d="M20 10c-10 2-14 14-12 26s10 20 18 16c6-3 2-10 4-16 2-5 6-8 4-14-2-8-8-13-14-12z" fill="#e11d48"/><path d="M44 10c10 2 14 14 12 26s-10 20-18 16c-6-3-2-10-4-16-2-5-6-8-4-14 2-8 8-13 14-12z" fill="#e11d48"/><path d="M30 30h-6M34 30h6" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round"/><ellipse cx="16" cy="20" rx="2.5" ry="5" fill="#fff" opacity=".4"/>`,
  eye: `${SHD}<path d="M4 32c8-12 18-18 28-18s20 6 28 18c-8 12-18 18-28 18S12 44 4 32z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><circle cx="32" cy="32" r="12" fill="#0ea5e9"/><circle cx="32" cy="32" r="6" fill="#0f172a"/><circle cx="28" cy="28" r="3" fill="#fff"/>`,
  nerve: `${SHD}<path d="M22 56V30c0-3 5-3 5 0V14c0-3 5-3 5 0v14-17c0-3 5-3 5 0v17-13c0-3 5-3 5 0v24c0 10-6 17-14 17z" fill="#fdba74"/><g stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"><path d="M14 22l-5-3M13 30H7M15 38l-5 3M52 20l5-3M54 28h6"/></g><circle cx="32" cy="44" r="5" fill="#ef4444" opacity=".5"/>`,
  drop: `${SHD}<path d="M32 6C22 22 14 30 14 40a18 18 0 0 0 36 0c0-10-8-18-18-34z" fill="#dc2626"/><rect x="25" y="34" width="14" height="10" rx="2" fill="#fff" transform="rotate(-12 32 39)"/><rect x="25" y="34" width="14" height="10" rx="2" fill="none" stroke="#fecaca" transform="rotate(-12 32 39)"/><path d="M22 30c1-4 3-8 6-12" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`,
  gauge: `${SHD}<rect x="8" y="12" width="40" height="40" rx="8" fill="#e2e8f0"/><rect x="13" y="17" width="30" height="20" rx="4" fill="#0f172a"/><text x="28" y="27" text-anchor="middle" font-size="9" font-weight="700" fill="#4ade80" font-family="Inter,sans-serif">120</text><text x="28" y="35" text-anchor="middle" font-size="7" font-weight="700" fill="#4ade80" font-family="Inter,sans-serif">80</text><circle cx="20" cy="45" r="3" fill="#16a34a"/><circle cx="36" cy="45" r="3" fill="#94a3b8"/><path d="M48 30c8 0 10 6 8 14" stroke="#64748b" stroke-width="3" fill="none"/><ellipse cx="56" cy="48" rx="5" ry="6" fill="#1e3a8a"/>`,
  artery: `${SHD}<path d="M4 22h56v20H4z" fill="#fecaca"/><path d="M4 22h56M4 42h56" stroke="#ef4444" stroke-width="4"/><path d="M22 23c4 6 16 6 20 0v-1H22zM24 41c4-5 12-5 16 0z" fill="#facc15"/><g fill="#dc2626"><circle cx="10" cy="32" r="3"/><circle cx="18" cy="30" r="3"/><circle cx="48" cy="33" r="3"/><circle cx="56" cy="31" r="3"/><circle cx="32" cy="32" r="2.4"/></g>`,
  ribbon: `${SHD}<path d="M32 6c-8 0-12 6-12 12 0 8 8 16 12 22 4-6 12-14 12-22 0-6-4-12-12-12z" fill="none" stroke="#ec4899" stroke-width="7"/><path d="M26 34L14 54l8-2 4 6 10-18M38 34l12 20-8-2-4 6-10-18" fill="#ec4899"/>`,
  lungs: `${SHD}<path d="M32 8v22" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/><path d="M30 26c-4-6-12-6-16 4-4 10-6 20-2 24 6 4 18 0 18-10z" fill="#f472b6"/><path d="M34 26c4-6 12-6 16 4 4 10 6 20 2 24-6 4-18 0-18-10z" fill="#f472b6"/><ellipse cx="18" cy="34" rx="2.5" ry="6" fill="#fff" opacity=".4"/>`,
  germ: `${SHD}<circle cx="32" cy="32" r="14" fill="#84cc16"/><g stroke="#65a30d" stroke-width="3" stroke-linecap="round"><path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M46 18l-4 4M18 46l4-4"/></g><circle cx="27" cy="29" r="2.4" fill="#365314"/><circle cx="37" cy="30" r="2" fill="#365314"/><path d="M10 54L54 10" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>`,
  dna: `${SHD}<path d="M20 6c0 14 24 18 24 26S20 44 20 58M44 6c0 14-24 18-24 26s24 12 24 26" stroke="#8b5cf6" stroke-width="4" fill="none"/><path d="M24 14h16M26 22h12M26 42h12M24 50h16" stroke="#c4b5fd" stroke-width="3" stroke-linecap="round"/>`,
  city: `${SHD}<rect x="8" y="28" width="14" height="28" fill="#94a3b8"/><rect x="24" y="14" width="16" height="42" fill="#64748b"/><rect x="42" y="24" width="14" height="32" fill="#94a3b8"/><g fill="#fde68a"><rect x="28" y="20" width="3" height="3"/><rect x="33" y="20" width="3" height="3"/><rect x="28" y="28" width="3" height="3"/><rect x="33" y="34" width="3" height="3"/><rect x="12" y="34" width="3" height="3"/><rect x="46" y="30" width="3" height="3"/></g><path d="M8 10c4-4 10-4 12 0" stroke="#cbd5e1" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  person: `${SHD}<circle cx="32" cy="14" r="8" fill="#fdba74"/><path d="M18 56V34a14 14 0 0 1 28 0v22z" fill="#35694a"/><path d="M26 30h12" stroke="#b4cca6" stroke-width="3" stroke-linecap="round"/><path d="M44 18a8 8 0 0 1 8 8" stroke="#ef4444" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  plate: `${SHD}<ellipse cx="32" cy="36" rx="26" ry="16" fill="#e5e7eb"/><ellipse cx="32" cy="34" rx="22" ry="12" fill="#fff"/><path d="M32 34V22a22 12 0 0 0-22 12z" fill="#f59e0b"/><path d="M32 34V22a22 12 0 0 1 22 12z" fill="#ef4444"/><path d="M10 34a22 12 0 0 0 44 0z" fill="#22c55e"/>`,
  scale: `${SHD}<rect x="10" y="20" width="44" height="34" rx="9" fill="#e2e8f0"/><rect x="18" y="26" width="28" height="12" rx="4" fill="#0f172a"/><text x="32" y="35" text-anchor="middle" font-size="8" font-weight="700" fill="#4ade80" font-family="Inter,sans-serif">-7%</text><path d="M16 50h32" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`,
  shoe: `${SHD}<path d="M8 40c0-8 2-18 8-20l6 8c6 2 14 2 18 6l12 4c6 2 6 10 0 10H12c-3 0-4-4-4-8z" fill="#16a34a"/><path d="M8 46h48" stroke="#fff" stroke-width="4"/><path d="M22 30l6-4M26 34l6-4M30 36l6-4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  dumbbell: `${SHD}<rect x="16" y="28" width="32" height="8" rx="3" fill="#94a3b8"/><rect x="8" y="18" width="10" height="28" rx="3" fill="#35694a"/><rect x="46" y="18" width="10" height="28" rx="3" fill="#35694a"/><rect x="4" y="24" width="6" height="16" rx="2" fill="#2f5c41"/><rect x="54" y="24" width="6" height="16" rx="2" fill="#2f5c41"/>`,
  smoke: `${SHD}<rect x="6" y="36" width="44" height="9" rx="2" fill="#fff" stroke="#e5e7eb"/><rect x="40" y="36" width="10" height="9" fill="#f59e0b"/><path d="M52 30c4-4-2-8 2-12M58 30c4-4-2-8 2-12" stroke="#cbd5e1" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M6 56L58 10" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>`,
  glass: `${SHD}<path d="M18 8h28l-2 18c-1 8-6 12-12 12s-11-4-12-12z" fill="#fde68a" opacity=".5" stroke="#d6d3d1" stroke-width="2"/><path d="M20 18h24l-1 8c-1 6-5 9-11 9s-10-3-11-9z" fill="#b91c1c"/><path d="M32 38v14M22 54h20" stroke="#d6d3d1" stroke-width="3" stroke-linecap="round"/><path d="M6 56L58 10" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>`,
  pill: `${SHD}<g transform="rotate(-35 32 32)"><rect x="12" y="22" width="40" height="18" rx="9" fill="#fff" stroke="#e5e7eb" stroke-width="2"/><path d="M32 22h11a9 9 0 0 1 0 18H32z" fill="#35694a"/></g>`,
  clock: `${SHD}<circle cx="32" cy="32" r="22" fill="#fff" stroke="#35694a" stroke-width="4"/><path d="M32 18v14l9 6" stroke="#202d22" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="32" cy="32" r="2.6" fill="#202d22"/>`,
  doctor: `${SHD}<circle cx="32" cy="16" r="9" fill="#fdba74"/><path d="M16 56V36a16 16 0 0 1 32 0v20z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M26 30v10a6 6 0 0 0 12 0v-4" stroke="#0ea5e9" stroke-width="2.4" fill="none"/><circle cx="38" cy="34" r="2.6" fill="#0ea5e9"/><path d="M30 42h4M32 40v4" stroke="#dc2626" stroke-width="2"/>`,
  fibre: `${SHD}<path d="M14 54c4-16 10-30 18-42M24 56c2-14 8-28 20-40M34 56c2-10 10-22 22-28" stroke="#65a30d" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 14c-8 2-10 10-6 16 6-2 8-10 6-16zM44 18c-8 0-12 8-9 14 7 0 10-8 9-14zM54 28c-8-2-13 5-11 12 7 1 12-5 11-12z" fill="#84cc16"/>`
};
const ic = (k, s = 44) => `<span class="food" role="img" aria-hidden="true" style="--fs:${s}px"><svg viewBox="0 0 64 64">${flatIcon(ORG[k] || "", s >= 30)}</svg></span>`;
const icG = (k, x, y, s) => `<g transform="translate(${x - s / 2} ${y - s / 2}) scale(${s / 64})">${flatIcon(ORG[k] || "", false)}</g>`;
const anyIc = (k, s) => ORG[k] ? ic(k, s) : food(k, s);


/* ===== extra drawings for Module 6 ===== */
Object.assign(ORG, {
  palm: `${SHD}<path d="M20 56V28c0-3 4-3 4 0v-12c0-3 4-3 4 0v12-15c0-3 4-3 4 0v15-12c0-3 4-3 4 0v14-6c0-3 4-3 4 0v14c0 10-6 18-14 18z" fill="#fdba74"/><ellipse cx="31" cy="40" rx="8" ry="6" fill="#fb923c" opacity=".35"/>`,
  fist: `${SHD}<rect x="16" y="20" width="32" height="30" rx="12" fill="#fdba74"/><path d="M18 30h28M18 38h28" stroke="#ea9a5a" stroke-width="2"/><path d="M24 22v8M32 21v9M40 22v8" stroke="#ea9a5a" stroke-width="2"/><path d="M14 36c0-6 8-6 10-2v8c-2 4-10 2-10-6z" fill="#fdba74"/>`,
  cupped: `${SHD}<path d="M6 30c10 22 42 22 52 0-6 0-8 4-10 6-6-2-26-2-32 0-2-2-4-6-10-6z" fill="#fdba74"/><path d="M32 30v16" stroke="#ea9a5a" stroke-width="2"/><ellipse cx="32" cy="30" rx="20" ry="6" fill="#4cbf55"/><ellipse cx="24" cy="28" rx="5" ry="3" fill="#86efac"/>`,
  thumb: `${SHD}<rect x="18" y="30" width="28" height="22" rx="8" fill="#fdba74"/><path d="M24 30V14c0-5 8-5 8 0v16" fill="#fdba74"/><ellipse cx="28" cy="15" rx="3" ry="2.4" fill="#fde7d4"/><path d="M20 38h24M20 45h24" stroke="#ea9a5a" stroke-width="2"/>`,
  moon: `${SHD}<path d="M40 8a22 22 0 1 0 16 34A18 18 0 1 1 40 8z" fill="#6366f1"/><circle cx="20" cy="16" r="2" fill="#fde68a"/><circle cx="52" cy="14" r="1.6" fill="#fde68a"/><path d="M44 22h8l-8 8h8" stroke="#c7d2fe" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  gut: `${SHD}<path d="M18 14h28c6 0 8 6 4 10-4 3-12 1-14 5s6 6 10 6c6 0 6 8 0 8H26c-6 0-6 8 0 8h10v6" fill="none" stroke="#f472b6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="28" cy="24" r="2.4" fill="#16a34a"/><circle cx="40" cy="38" r="2.4" fill="#0ea5e9"/><circle cx="30" cy="46" r="2.4" fill="#f59e0b"/>`,
  cell: `${SHD}<circle cx="32" cy="32" r="24" fill="#bae6fd"/><circle cx="32" cy="32" r="24" fill="none" stroke="#38bdf8" stroke-width="3"/><circle cx="30" cy="30" r="9" fill="#818cf8"/><circle cx="28" cy="28" r="3" fill="#c7d2fe"/><ellipse cx="44" cy="42" rx="6" ry="3.4" fill="#fb923c" transform="rotate(-25 44 42)"/><ellipse cx="18" cy="42" rx="4" ry="2.4" fill="#4ade80"/>`,
  mito: `${SHD}<ellipse cx="32" cy="32" rx="26" ry="15" fill="#fb923c" transform="rotate(-18 32 32)"/><ellipse cx="32" cy="32" rx="21" ry="10" fill="#fed7aa" transform="rotate(-18 32 32)"/><path d="M14 36c4-8 6 6 10-2s6 6 10-2 6 6 10-2 4 2 6 0" stroke="#ea580c" stroke-width="2.4" fill="none" stroke-linecap="round" transform="rotate(-18 32 32)"/>`,
  microbe: `${SHD}<rect x="12" y="22" width="40" height="20" rx="10" fill="#4ade80"/><path d="M12 32H6M52 32h6M20 22l-3-6M32 22v-7M44 22l3-6M20 42l-3 6M44 42l3 6" stroke="#16a34a" stroke-width="2.4" stroke-linecap="round"/><circle cx="26" cy="30" r="2.4" fill="#166534"/><circle cx="38" cy="34" r="2" fill="#166534"/>`,
  stairs: `${SHD}<path d="M8 54V44h12V34h12V24h12V14h12v40z" fill="#94a3b8"/><path d="M8 44h12V34h12V24h12V14h12" stroke="#475569" stroke-width="2" fill="none"/><circle cx="38" cy="10" r="4" fill="#fdba74"/><path d="M38 14v8l-4 6M38 22l4 4" stroke="#35694a" stroke-width="3" stroke-linecap="round"/>`,
  label: `${SHD}<rect x="14" y="8" width="36" height="46" rx="4" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M19 15h26" stroke="#111" stroke-width="3"/><path d="M19 22h26M19 28h18M19 34h22M19 40h14M19 46h20" stroke="#94a3b8" stroke-width="2"/><circle cx="44" cy="44" r="8" fill="none" stroke="#35694a" stroke-width="3"/><path d="M50 50l6 6" stroke="#35694a" stroke-width="3.4" stroke-linecap="round"/>`,
  balance: `${SHD}<path d="M32 12v40M20 52h24" stroke="#475569" stroke-width="3.4" stroke-linecap="round"/><path d="M10 20h44" stroke="#475569" stroke-width="3" stroke-linecap="round"/><path d="M10 20l-6 14h12zM54 20l-6 14h12z" fill="#35694a"/><path d="M4 34a6 4 0 0 0 12 0zM48 34a6 4 0 0 0 12 0z" fill="#b4cca6"/><circle cx="32" cy="12" r="4" fill="#f59e0b"/>`,
  smog: `${SHD}<rect x="8" y="30" width="12" height="24" fill="#94a3b8"/><rect x="24" y="22" width="10" height="32" fill="#64748b"/><path d="M28 22v-8" stroke="#64748b" stroke-width="4"/><circle cx="30" cy="10" r="5" fill="#cbd5e1"/><circle cx="38" cy="8" r="6" fill="#d1d5db"/><circle cx="46" cy="12" r="7" fill="#e5e7eb"/><rect x="38" y="34" width="16" height="20" fill="#94a3b8"/>`
});

/* ===================== LESSON 1 — Weight management ===================== */
const BAL = [
  { k: "Weight gain", eq: "IN > OUT", t: "Extra energy is stored as body fat.", a: 10, col: "#dc2626" },
  { k: "Weight stable", eq: "IN = OUT", t: "Energy used matches energy eaten.", a: 0, col: "#35694a" },
  { k: "Weight loss", eq: "IN < OUT", t: "The body uses stored fat for energy.", a: -10, col: "#0ea5e9" }
];
const CAL100 = ["banana", "berries", "crisps", "chocolate", "broccoli", "capsicum", "apple", "strawberry", "cheese"];
const HANDS = [["palm", "Palm", "Protein", "Fish, chicken, tofu"], ["fist", "Fist", "Carbs", "Cooked rice, noodles"], ["cupped", "Two cupped hands", "Vegetables", "Cabbage, lettuce"], ["thumb", "Thumb", "Fats", "Oil, butter, peanut butter"]];
const TIPS = [
  ["crisps", "Ultra-processed food", "20 adults ate an ultra-processed diet and an unprocessed diet for 14 days each, as much as they wanted. Limiting ultra-processed food may help prevent and treat obesity."],
  ["sweetdrink", "Sugary drinks", "Adding sugar-sweetened drinks led to 0.83 kg more weight gain. Removing them led to 0.49 kg weight loss, compared with control groups."],
  ["moon", "Poor sleep", "Ghrelin (hunger) goes up and leptin (fullness) goes down, so we eat more. Tiredness also means we move less."],
  ["clock", "Late meals", "Eating at night and later in the day is linked to more weight gain over time. The body also burns less energy digesting food at night."]
];
const MOVES = [["stairs", "Take the stairs", "Instead of the lift for 1–3 floors"], ["shoe", "Walk while you talk", "Stand or walk during phone calls"], ["clock", "Break up sitting", "Stand and stretch every 30–60 min"], ["greens", "Active chores", "Gardening, sweeping, washing the car"], ["dumbbell", "Strength at home", "Squats, wall push-ups, water-bottle weights"], ["person", "Move together", "Evening walks with family or friends"]];
const WPLAN = [["balance", "Energy balance", "Watch drinks and extras. Move every day, including strength twice a week."], ["palm", "Portions", "Half plate vegetables. Use your hand as a guide. Ask for less rice."], ["fibre", "Fibre", "Aim for 25–30 g a day from whole grains, legumes, fruit and vegetables."], ["apple", "Food quality", "Mostly fresh foods. Limit ultra-processed foods and sweet drinks."], ["label", "Food labels", "Check serving size, sugar, saturated fat and sodium per 100 g."]];
const checkList = (id, items) => ({
  html: () => `<div class="plan5">${items.map(([k, t, d], i) => `<button aria-pressed="false" data-k="${i}">${anyIc(k, 40)}<span><b>${t}</b><small>${d}</small></span><i class="tick"></i></button>`).join("")}</div><div class="cuffbar"><i data-bar></i></div>`,
  enter(el, api) { const bs = $$(".plan5 button", el), bar = $("[data-bar]", el); let done = false;
    bs.forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "pop" : "tap");
      const n = bs.filter(x => x.getAttribute("aria-pressed") === "true").length; bar.style.width = n / bs.length * 100 + "%";
      if (n === bs.length && !done) { done = true; api.sfx("unlock"); api.confetti(); api.interacted(id); } })); }
});
const flipCards = (id, items, front, back, cls = "") => ({
  html: () => `<div class="swaps ${cls}">${items.map((m, i) => `<button class="sw" aria-pressed="false" data-k="${i}"><span class="sw-in"><span class="sw-f">${anyIc(m[0], 40)}<b>${m[1]}</b>${front ? `<small>${front}</small>` : ""}</span><span class="sw-b"><small>${back || m[1]}</small><em>${m[2]}</em></span></span></button>`).join("")}</div>`,
  enter(el, api) { const seen = new Set();
    $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size === items.length) { api.sfx("unlock"); api.interacted(id); } })); }
});
const tipCards = flipCards("w-tip", TIPS, "Tap to see the evidence", "", "tip4");
const wplan = checkList("w-plan", WPLAN);

const L1 = [
  { id: "w-balance", title: "Calories in, calories out", cls: "center",
    html: () => `<p class="eyebrow">Energy balance</p><h2 class="h-lg">In vs out.</h2><div class="seg"></div>
      <svg class="seesaw" viewBox="0 0 320 150" aria-hidden="true"><path d="M160 112l-22 34h44z" fill="#35694a"/><g data-beam style="transform-origin:160px 108px;transition:transform .7s cubic-bezier(.34,1.56,.64,1)"><rect x="30" y="102" width="260" height="10" rx="5" fill="#202d22"/>
        <g transform="translate(46 34)"><rect width="74" height="66" rx="14" fill="#facc15"/><text x="37" y="30" text-anchor="middle" font-size="15" font-weight="800" fill="#202d22" font-family="Inter,sans-serif">IN</text><text x="37" y="50" text-anchor="middle" font-size="11" fill="#202d22" font-family="Inter,sans-serif">Energy eaten</text></g>
        <g transform="translate(200 34)"><rect width="74" height="66" rx="14" fill="#38bdf8"/><text x="37" y="30" text-anchor="middle" font-size="15" font-weight="800" fill="#082f49" font-family="Inter,sans-serif">OUT</text><text x="37" y="50" text-anchor="middle" font-size="11" fill="#082f49" font-family="Inter,sans-serif">Energy used</text></g></g></svg>
      <p class="cap" data-say aria-live="polite"></p>
      <p class="small" style="margin-top:14px"><b>Where “calories out” goes</b></p>
      <div class="eout"><span style="flex:65;background:#35694a">Resting metabolism<b>60–70%</b></span><span style="flex:10;background:#f59e0b">Digest<b>5–15%</b></span><span style="flex:15;background:#0ea5e9">Activity<b>10–20%</b></span></div>
      <p class="small" style="margin-top:10px">Small daily extras add up to several kilograms over months and years. Small cuts work the same way in reverse.</p>`,
    enter(el, api) { const beam = $("[data-beam]", el), say = $("[data-say]", el);
      seg(el, BAL.map(b => b.k), i => { const b = BAL[i]; beam.style.transform = `rotate(${b.a}deg)`; say.innerHTML = `<b style="color:${b.col}">${b.eq}.</b> ${b.t}`; refade(say); }, api, "w-balance"); } },

  { id: "w-100", title: "What 100 calories look like", cls: "center",
    html: () => `<p class="eyebrow">Do you know?</p><h2 class="h-lg">What does 100 calories look like?</h2><p class="body">Tap the plates.</p>
      <div class="cal9">${CAL100.map((f, i) => `<button data-k="${i}" aria-label="${FOOD_LABEL[f]}"><span class="plate">${food(f, 44)}</span><small>${FOOD_LABEL[f]}</small><em>100 kcal</em></button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) { const seen = new Set(), say = $("[data-say]", el);
      $$(".cal9 button", el).forEach(b => b.addEventListener("click", () => { b.classList.add("on"); api.sfx("pop"); seen.add(b.dataset.k);
        if (seen.size === 3) { say.innerHTML = "<b>Every plate is 100 calories.</b> Fruit and vegetables fill the plate, while a small piece of chocolate or cheese hardly covers it."; refade(say); api.interacted("w-100"); } })); } },

  { id: "w-hand", title: "Size your meal with your hand", cls: "center",
    html: () => `<p class="eyebrow">Portion size</p><h2 class="h-lg">Your hand is the guide.</h2><p class="body">Per meal. Tap each hand.</p>
      <div class="hand4">${HANDS.map(([k, h], i) => `<button data-k="${i}">${ic(k, 54)}<b>${h}</b></button>`).join("")}</div>
      <div class="handout" data-v aria-live="polite"><span>Bigger servings mean more calories: we tend to eat what's in front of us.</span></div>`,
    enter(el, api) { const v = $("[data-v]", el), seen = new Set();
      $$(".hand4 button", el).forEach(b => b.addEventListener("click", () => { $$(".hand4 button", el).forEach(x => x.classList.toggle("on", x === b)); const [, h, g, ex] = HANDS[b.dataset.k];
        v.innerHTML = `<b>${h} = ${g}</b><span>${ex}</span>`; refade(v); api.sfx("pop"); seen.add(b.dataset.k); if (seen.size === 4) api.interacted("w-hand"); })); } },

  { id: "w-tip", title: "What tips the scale", cls: "center",
    html: () => `<p class="eyebrow">Trends in the research</p><h2 class="h-lg">What tips the scale.</h2>${tipCards.html()}`,
    enter(el, api) { tipCards.enter(el, api); } },

  { id: "w-help", title: "What helps", cls: "center",
    html: () => `<p class="eyebrow">What helps</p><h2 class="h-lg">Three things that work.</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      const P = [
        () => `<div class="fib"><div class="fib-head">${food("oats", 46)}<span><b>Fibre keeps you full for longer</b>, so you tend to eat less without feeling deprived.</span></div>
          <p class="small">240 volunteers tried two diets:</p><div class="fib2"><span><small>Full heart-health diet</small><b>−2.67 kg</b></span><span class="hi"><small>Only goal: eat 30 g fibre a day</small><b>−2.1 kg</b></span></div>
          <p class="small">One simple change did almost as well. Higher fibre is also linked to lower risk of heart disease and type 2 diabetes.</p></div>`,
        () => `<p class="small" style="margin-top:12px">Three groups over 90 days. The first two ate 1,200–1,300 kcal a day.</p><div class="mr3">${[["Meal replacement for dinner", 7.4, "#35694a"], ["Less rice at lunch", 4.1, "#7fb069"], ["No change", 1.0, "#cbd5e1"]].map(([t, kg, c], i) => `<div><span>${t}</span><i style="--w:${kg / 7.4 * 100}%;--c:${c};--d:${i * .12}s"></i><b>${kg} kg</b></div>`).join("")}</div><p class="small">The meal replacement group lost the most weight and body fat, and had the biggest BMI drop.</p>`,
        () => `<div class="mv6">${MOVES.map(([k, t, d], i) => `<span style="--d:${i * .06}s">${anyIc(k, 34)}<b>${t}</b><small>${d}</small></span>`).join("")}</div>`
      ];
      seg(el, ["Fibre", "Meal replacement", "Move more"], i => { v.innerHTML = P[i](); refade(v); }, api, "w-help"); } },

  { id: "w-plan", title: "Your daily action plan", cls: "center",
    html: () => `<p class="eyebrow">Weight management</p><h2 class="h-lg">Your daily plan.</h2><p class="body">Tap each one you'll try.</p>${wplan.html()}`,
    enter(el, api) { wplan.enter(el, api); } },

  endTile("l1-end", "Weight management, done.", "Next: your gut, and why it matters for weight and health.", "Next lesson")
];

/* ===================== LESSON 2 — Gut health ===================== */
const PERSON = [
  { k: "Person A", col: "#16a34a", out: "Good", t: [["Stable blood sugar", "no big spike"], ["Efficient energy use", "better insulin sensitivity"], ["Less fat storage", "more calories used"], ["Healthy weight", "maintained"]] },
  { k: "Person B", col: "#a855f7", out: "Less favourable", t: [["Higher blood sugar spike", "slower return to normal"], ["More fat storage", "less efficient insulin response"], ["Lower energy expenditure", "more calories stored"], ["Gradual weight gain", "over time"]] }
];
const GUTB = [
  { k: "Balanced", col: "#16a34a", ic: "microbe", t: ["Many different helpful microbes", "Strong, healthy gut lining", "Calm, well-trained immune system", "Regular, comfortable bowel habits", "Steadier appetite and blood sugar"] },
  { k: "Dysbiosis", col: "#dc2626", ic: "gut", t: ["Fewer helpful microbes, less variety", "Weaker barrier, sometimes called “leaky gut”", "Ongoing low-grade inflammation", "May have bloating or irregular bowel habits", "Linked with obesity, type 2 diabetes and IBS"] }
];
const BIOT = [
  ["onion", "Prebiotics", "Food for your microbes", "Fibres in food that help good microbes grow and work. Oats, legumes, onion and garlic."],
  ["yoghurt", "Probiotics", "Live microbes", "Live microorganisms such as bacteria and fungi. Yoghurt, kefir, tempeh and kimchi contain them."],
  ["microbe", "Postbiotics", "What microbes make", "Substances microbes produce, such as short-chain fatty acids (SCFAs), enzymes and cell parts. They help shape gut microbes and benefit health."]
];
const GPLAN = [["berries", "Variety", "Aim for 30 different plant foods every week."], ["onion", "Feed microbes", "Prebiotic fibre at every meal: oats, legumes, onion, garlic."], ["yoghurt", "Fermented foods", "A daily serving of yoghurt, kefir, tempeh or kimchi."], ["crisps", "Limit", "Ultra-processed food, sugary drinks, smoking and excess alcohol."], ["brain", "Mind your brain", "Manage stress, sleep 7–9 hours and move every day."]];
const gplan = checkList("g-plan", GPLAN);
const biot = flipCards("g-biotics", BIOT.map(b => [b[0], b[1], b[3]]), "", "", "bio3");

const L2 = [
  { id: "g-same", title: "Same food, different results", cls: "center",
    html: () => `<p class="eyebrow">Did you know?</p><h2 class="h-lg">Same meal. Different results.</h2>
      <div class="same"><div class="same-meal">${food("chicken", 40)}${food("rice", 40)}${food("greens", 40)}<small>Grilled chicken, brown rice, vegetables</small></div></div>
      <div class="seg"></div><div data-v aria-live="polite"></div>
      <p class="small">It depends on genetics, gut microbiome, lifestyle and overall health.</p>`,
    enter(el, api) { const v = $("[data-v]", el);
      seg(el, PERSON.map(p => p.k), i => { const p = PERSON[i];
        v.innerHTML = `<div class="pr4" style="--c:${p.col}">${p.t.map(([a, b], n) => `<span style="--d:${n * .06}s"><b>${a}</b><small>${b}</small></span>`).join("")}</div><p class="pr-out" style="color:${p.col}">Metabolic outcome: <b>${p.out}</b></p>`; refade(v); }, api, "g-same"); } },

  { id: "g-organ", title: "Your gut microbiome", cls: "center",
    html: () => `<p class="eyebrow">Gut microbiome</p><h2 class="h-lg">The largest metabolic organ.</h2>
      <div class="big38">${ic("gut", 70)}<span><b data-n>0</b> trillion microbes live in your gut.</span></div>
      <div class="roles">${[["plate", "Digestion"], ["pill", "Medicine metabolism"], ["person", "Immunity"]].map(([k, t]) => `<span>${anyIc(k, 34)}<b>${t}</b></span>`).join("")}</div>
      <p class="body" style="margin-top:12px">Tap each card.</p>
      <div class="swaps fact2">${[["dna", "Malaysian microbiomes differ", "Even people living in the same place have different gut microbes depending on ethnicity, diet and lifestyle."], ["clock", "It changes with age", "From birth to old age, gut microbes shift with diet, delivery mode, medicines and lifestyle."]].map((m, i) => `<button class="sw" aria-pressed="false" data-k="${i}"><span class="sw-in"><span class="sw-f">${ic(m[0], 36)}<b>${m[1]}</b></span><span class="sw-b"><em>${m[2]}</em></span></span></button>`).join("")}</div>`,
    enter(el, api) { countUp($("[data-n]", el), 38); api.sfx("rise"); const seen = new Set();
      $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size === 2) api.interacted("g-organ"); })); } },

  { id: "g-balance", title: "Balanced gut vs dysbiosis", cls: "center",
    html: () => `<p class="eyebrow">Balanced vs imbalanced</p><h2 class="h-lg">Which gut are you feeding?</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      seg(el, ["Balanced", "Dysbiosis", "What feeds it"], i => {
        if (i < 2) { const g = GUTB[i]; v.innerHTML = `<div class="gb" style="--c:${g.col}">${ic(g.ic, 54)}<ul>${g.t.map((t, n) => `<li style="--d:${n * .06}s">${t}</li>`).join("")}</ul></div>`; }
        else v.innerHTML = `<div class="feed2"><div class="good">${food("greens", 40)}${food("beans", 40)}<b>High plant fibre</b><span>Feeds helpful bacteria that make SCFAs (like butyrate), which support gut hormones and insulin sensitivity.</span></div><div class="bad">${food("meat", 40)}${food("sausage", 40)}<b>High animal fat, low fibre</b><span>Feeds bacteria that make harmful by-products (ammonia, TMAO, LPS) and hurt glucose control.</span></div></div>`;
        refade(v); }, api, "g-balance"); } },

  { id: "g-biotics", title: "Prebiotics, probiotics, postbiotics", cls: "center",
    html: () => `<p class="eyebrow">The “biotics”</p><h2 class="h-lg">Pre, pro, post.</h2><p class="body">Tap each card.</p>${biot.html()}`,
    enter(el, api) { biot.enter(el, api); } },

  { id: "g-plan", title: "Gut health: your daily action plan", cls: "center",
    html: () => `<p class="eyebrow">Gut health</p><h2 class="h-lg">Your daily plan.</h2><p class="body">Tap each one you'll try.</p>${gplan.html()}`,
    enter(el, api) { gplan.enter(el, api); } },

  endTile("l2-end", "Gut health, done.", "Last lesson: your cells, and how to support healthy aging.", "Next lesson")
];

/* ===================== LESSON 3 — Cellular health ===================== */
const HALL = [
  { k: "Things that go wrong first", col: "#6366f1", t: [["Genomic instability", "DNA builds up damage and mutations."], ["Telomere attrition", "The protective caps on chromosomes wear down."], ["Epigenetic alterations", "The on/off instructions for genes get scrambled."], ["Loss of proteostasis", "Cells can't fold, maintain or dispose of proteins properly."], ["Disabled autophagy", "The cell's recycling system breaks down."]] },
  { k: "Flawed coping", col: "#f59e0b", t: [["Deregulated nutrient-sensing", "The “fed or starving?” signal gets miscalibrated."], ["Mitochondrial dysfunction", "Mitochondria make less energy and leak harmful by-products."], ["Cellular senescence", "Damaged cells stop dividing but don't die, and inflame neighbours."]] },
  { k: "The visible impact", col: "#dc2626", t: [["Stem cell exhaustion", "Fewer repair cells to regenerate tissue."], ["Altered communication", "Cells send and receive distorted signals."], ["Chronic inflammation", "The immune system stays in low-grade alert."], ["Dysbiosis", "The balance of good and bad gut bacteria is disrupted."]] }
];
const POLY = [["mito", "Resveratrol", "Switches on the production of new, healthy mitochondria."], ["greentea", "EGCG", "Found in green tea. Boosts the cell's antioxidant defences against free radicals."], ["cell", "Curcumin", "Helps keep the mitochondrial network working properly."], ["microbe", "Urolithin A", "Made by gut bacteria from certain plant compounds. Clears out damaged mitochondria."]];
const NUTR = [
  ["Antioxidants & polyphenols", "Neutralise free radicals that damage cells.", ["capsicum", "berries", "greentea", "turmeric"], "Colourful vegetables and fruits, tea, herbs and spices (e.g. turmeric)"],
  ["Omega-3", "Calm inflammation; keep cell membranes healthy.", ["fish", "sardine", "salmon", "nuts"], "Ikan kembung, sardines, salmon, walnuts, flaxseed"],
  ["Protein", "Repairs cells and maintains muscle as we age.", ["fish", "egg", "tofu", "tempeh"], "Fish, eggs, legumes, tofu, tempeh, chicken"],
  ["Folate & B12", "Needed to make and repair DNA.", ["greens", "beans", "egg", "milk"], "Leafy greens and legumes (folate); fish, eggs and milk (B12)"],
  ["Zinc, selenium, magnesium", "Power DNA repair and antioxidant enzymes.", ["nuts", "seeds", "oats", "sardine"], "Nuts, seeds, whole grains, seafood"],
  ["Vitamin D", "Supports cell regulation and immunity.", ["sun", "fish", "egg"], "Sensible sun exposure, oily fish, eggs"],
  ["Fibre", "Feeds gut microbes that help reduce inflammation.", ["oats", "beans", "greens", "apple"], "Whole grains, legumes, vegetables, fruit"]
];
const poly = flipCards("c-poly", POLY, "", "", "poly4");

const L3 = [
  { id: "c-cell", title: "Your cells", cls: "center",
    html: () => `<p class="eyebrow">Cellular health</p><h2 class="h-lg"><span class="num" data-n>0</span> trillion cells.</h2>
      <p class="body">The cell is the smallest living unit of the body. You have about 30 trillion of them.</p>
      <div class="cdef">${[["cell", "Cellular health", "How well cells make energy, repair damage, clear waste and communicate."], ["clock", "Cellular aging", "The gradual loss of a cell's ability to work and repair itself over time."]].map(([k, t, d], i) => `<div style="--d:${i * .15}s">${ic(k, 46)}<span><b>${t}</b><small>${d}</small></span></div>`).join("")}</div>`,
    enter(el, api) { countUp($("[data-n]", el), 30); $(".cdef", el).classList.add("go"); api.sfx("rise"); api.interacted("c-cell"); } },

  { id: "c-hall", title: "The 12 hallmarks of aging", cls: "center",
    html: () => `<p class="eyebrow">Why do our cells age?</p><h2 class="h-lg">12 hallmarks of aging.</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el); let base = 0;
      seg(el, ["Start", "Coping", "Impact"], i => { const h = HALL[i]; base = HALL.slice(0, i).reduce((a, x) => a + x.t.length, 0);
        v.innerHTML = `<p class="hall-k" style="color:${h.col}">${h.k}</p><div class="hall">${h.t.map(([t, d], n) => `<div style="--c:${h.col};--d:${n * .06}s"><i>${base + n + 1}</i><span><b>${t}</b><small>${d}</small></span></div>`).join("")}</div>`; refade(v); }, api, "c-hall"); } },

  { id: "c-tip", title: "The tipping point", cls: "center",
    html: () => `<p class="eyebrow">Aging drivers</p><h2 class="h-lg">The tipping point.</h2>
      <p class="body">Inside factors (DNA, mitochondria, inflammation) and outside ones (diet, stress, sleep, pollution, smoking) push cells to age faster.</p>
      <div class="tipbox"><div class="wrow"><span>Aging damage</span><b data-p>Low</b></div><input type="range" min="0" max="100" value="20" aria-label="Aging damage" data-r>
      <div class="tipbar"><i data-bar></i><span class="tp">Tipping point</span></div>
      <div class="dz" data-dz>${["Heart disease", "Stroke", "Diabetes", "Joint degeneration", "Parkinson's", "Alzheimer's", "Cancer"].map(t => `<span>${t}</span>`).join("")}</div>
      <p class="small" data-say>Drag to the right.</p></div>`,
    enter(el, api) { const r = $("[data-r]", el), bar = $("[data-bar]", el), dz = $("[data-dz]", el), say = $("[data-say]", el), p = $("[data-p]", el); let over = false;
      const u = () => { const x = +r.value; bar.style.width = x + "%"; bar.style.background = x > 60 ? "#dc2626" : x > 40 ? "#f59e0b" : "#35694a"; p.textContent = x > 60 ? "High" : x > 40 ? "Rising" : "Low";
        const on = x > 60; dz.classList.toggle("on", on); say.textContent = on ? "Past the tipping point, organ function keeps declining and the risk of age-related disease rises." : "Drag to the right.";
        if (on && !over) { over = true; api.sfx("wrong"); api.interacted("c-tip"); } else if (!on) over = false; };
      r.addEventListener("input", u); u(); } },

  { id: "c-poly", title: "Polyphenols and cellular aging", cls: "center",
    html: () => `<p class="eyebrow">Polyphenols</p><h2 class="h-lg">Keep the power plants running.</h2><p class="body">Polyphenols help keep mitochondria healthy, calm inflammation and reduce damaged cells. Tap each card.</p>${poly.html()}`,
    enter(el, api) { poly.enter(el, api); } },

  { id: "c-food", title: "Nutrients that protect your cells", cls: "center",
    html: () => `<p class="eyebrow">On your plate</p><h2 class="h-lg">Nutrients that protect your cells.</h2>
      <div class="nut7">${NUTR.map((n, i) => `<button data-k="${i}">${n[0]}</button>`).join("")}</div><div class="nutv" data-v aria-live="polite"><span class="small">Tap a nutrient.</span></div>`,
    enter(el, api) { const v = $("[data-v]", el), seen = new Set();
      $$(".nut7 button", el).forEach(b => b.addEventListener("click", () => { $$(".nut7 button", el).forEach(x => x.classList.toggle("on", x === b)); const [t, how, fs, where] = NUTR[b.dataset.k];
        v.innerHTML = `<b>${t}</b><span>${how}</span>${foods(fs, 40)}<small>${where}</small>`; refade(v); api.sfx("pop"); seen.add(b.dataset.k); if (seen.size >= 3) api.interacted("c-food"); })); } },

  endTile("l3-end", "All three lessons done.", "The knowledge check is unlocked. Answer the questions to complete the module.", "Take the knowledge check")
];
const ART = k => `<svg viewBox="0 0 160 160"><circle cx="80" cy="84" r="58" fill="#eff5e9"/>${k}</svg>`;
const VIDEO = "https://players.brightcove.net/5048125494001/EECYz3XbU_default/index.html?videoId=";
const videoTile = (id, vid, label, g1, g2) => ({
  id, title: "Video", cls: "dark center",
  html: () => `<p class="eyebrow">Watch first</p><h2 class="h-md">Start with the video.</h2>
    <div class="video"><button class="poster" style="--g1:${g1};--g2:${g2}" aria-label="Play video: ${label}">
      <span class="play"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg></span><span class="lab">${label}</span></button></div>`,
  enter(el, api) {
    if (window.LINK_OUT) {
      const old = $(".poster", el), a = document.createElement("a");
      a.className = "poster"; a.href = VIDEO + vid; a.target = "_blank"; a.rel = "noopener"; a.style.cssText = old.getAttribute("style");
      a.innerHTML = old.innerHTML.replace(`<span class="lab">${label}</span>`, `<span class="lab">Opens in a new tab</span>`); a.setAttribute("aria-label", "Watch video: " + label + " (opens in a new tab)");
      a.addEventListener("click", () => { api.sfx("pop"); api.played(id, label); }); old.replaceWith(a); return;
    }
    $(".poster", el).addEventListener("click", () => {
      api.sfx("pop");
      const f = document.createElement("iframe");
      f.src = VIDEO + vid + "&autoplay=true&playsinline=true"; f.title = label;
      f.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture"; f.allowFullscreen = true;
      const box = $(".video", el); box.innerHTML = ""; box.appendChild(f); api.played(id, label);
    });
  }
});
/* Pocket notes page shown inside a lesson: view and zoom only, no download */
const notesTile = (id, n, head) => ({
  id, title: "Pocket notes", cls: "center pn-tile",
  html: () => `<p class="eyebrow">Pocket notes${window.PN_SRC.length > 1 ? ` · page ${n + 1} of ${window.PN_SRC.length}` : ""}</p><h2 class="h-md">${head}</h2>
    <button class="pn-thumb" aria-label="Zoom pocket notes page ${n + 1}" oncontextmenu="return false"><img src="${window.PN_SRC[n]}" alt="Module 5 pocket notes, page ${n + 1}" draggable="false"><span class="pn-hint">Tap to zoom</span></button>`,
  enter(el, api) {
    $(".pn-thumb", el).addEventListener("click", () => {
      api.sfx("pop"); api.interacted(id);
      const z = document.createElement("div"); z.className = "pn-zoom"; z.setAttribute("role", "dialog"); z.setAttribute("aria-label", "Pocket notes, zoomed");
      z.innerHTML = `<button class="x" aria-label="Close"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 5l14 14M19 5L5 19" stroke="#1d1d1f" stroke-width="2.4" stroke-linecap="round"/></svg></button><img src="${window.PN_SRC[n]}" alt="" draggable="false" oncontextmenu="return false">`;
      const close = () => { api.sfx("tap"); z.remove(); document.removeEventListener("keydown", esc); };
      const esc = e => { if (e.key === "Escape") close(); };
      z.querySelector(".x").addEventListener("click", close); document.addEventListener("keydown", esc);
      const im = z.querySelector("img"); im.addEventListener("click", () => { im.classList.toggle("big"); api.sfx("tap"); });
      document.body.appendChild(z); z.querySelector(".x").focus();
    });
  }
});
L3.splice(L3.length - 1, 0, notesTile("l3-notes", 0, "The whole module on one page."));
/* one "Watch first" video at the start of each lesson (user's Part 1–3 links) */
L1.unshift(videoTile("l1-video", "6408583339112", "Part 1: Weight Management", "rgba(53,105,74,.75)", "rgba(127,176,105,.55)"));
L2.unshift(videoTile("l2-video", "6408583340112", "Part 2: Gut Health", "rgba(31,122,107,.75)", "rgba(63,179,158,.55)"));
L3.unshift(videoTile("l3-video", "6408582162112", "Part 3: Cellular Health", "rgba(77,124,15,.75)", "rgba(132,204,22,.55)"));
window.SECTIONS = [
  { id: "s1", n: 1, name: "Weight management.", title: "Part 1: Weight Management", nav: "Weight management", sub: "Energy balance, portions, and what helps or hurts.", acc: "linear-gradient(90deg,#35694a,#7fb069)", accs: "#35694a", c: ["#35694a", "#7fb069"], photo: "weight", tiles: L1 },
  { id: "s2", n: 2, name: "Gut health.", title: "Part 2: Gut Health", nav: "Gut health", sub: "Your microbiome, dysbiosis and the “biotics”.", acc: "linear-gradient(90deg,#1f7a6b,#3fb39e)", accs: "#1f7a6b", c: ["#1f7a6b", "#3fb39e"], photo: "gut", tiles: L2 },
  { id: "s3", n: 3, name: "Cellular health.", title: "Part 3: Cellular Health", nav: "Cellular health", sub: "Why cells age, and the nutrients that protect them.", acc: "linear-gradient(90deg,#4d7c0f,#84cc16)", accs: "#4d7c0f", c: ["#4d7c0f", "#84cc16"], photo: "cells", tiles: L3 }
];
})();
