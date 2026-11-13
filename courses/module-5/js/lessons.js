/* ===== Module 5 — Nutrition and NCDs =====
   Content source: the user's slide deck "Module 5 — Nutrition and NCDs: Preventing non-communicable diseases
   through lifestyle management" (66 slides). */
(function () {
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => Array.from(el.querySelectorAll(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const IMG = window.IMG = {};
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

/* ===================== SECTION 1 — What are NCDs? ===================== */
const CAUSES = [["dna", "Genetic", "Family history and the genes you inherit."], ["city", "Environmental", "Where you live, work and what you're exposed to."], ["person", "Physiological", "How your body works: blood pressure, blood sugar, weight."], ["plate", "Diet & lifestyle", "What you eat, how much you move, smoking and alcohol. The part you can change."]];
const EXAMPLES = [["heart", "Cardiovascular diseases"], ["drop", "Diabetes"], ["ribbon", "Cancer"], ["lungs", "Chronic lung diseases"]];
const s1 = [
  { id: "s1-what", title: "What are NCDs?", cls: "center",
    html: () => `<p class="eyebrow">Non-communicable diseases</p><h2 class="h-lg">Not caught.<br>Built up.</h2>
      <p class="body">NCDs are diseases that are <b>not spread from person to person</b>. They usually develop slowly, over a long time.</p>
      <div class="germ-fig">${ic("germ", 70)}<span class="small">Not caused by a germ infection</span></div>
      <p class="small" style="margin-top:14px">Tap each example.</p>
      <div class="ex4">${EXAMPLES.map(([k, t], i) => `<button data-k="${i}">${ic(k, 46)}<span>${t}</span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".ex4 button", el).forEach(b => b.addEventListener("click", () => { b.classList.add("on"); api.sfx("pop"); seen.add(b.dataset.k); if (seen.size === 4) { api.sfx("unlock"); api.interacted("s1-what"); } })); } },

  { id: "s1-why", title: "Why do they develop?", cls: "center",
    html: () => `<p class="eyebrow">Why do they develop?</p><h2 class="h-lg">Four forces.<br>One you control.</h2>
      <p class="body">Tap each cause.</p>
      <div class="cause4">${CAUSES.map(([k, t], i) => `<button data-k="${i}" class="${i === 3 ? "you" : ""}">${ic(k, 48)}<b>${t}</b></button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite">Genes and environment set the stage. Daily habits decide a lot of the story.</p>`,
    enter(el, api) { const seen = new Set(), say = $("[data-say]", el);
      $$(".cause4 button", el).forEach(b => b.addEventListener("click", () => { $$(".cause4 button", el).forEach(x => x.classList.toggle("on", x === b)); const c = CAUSES[b.dataset.k];
        say.innerHTML = `<b>${c[1]}.</b> ${c[2]}`; refade(say); api.sfx(b.classList.contains("you") ? "unlock" : "tap"); seen.add(b.dataset.k); if (seen.size === 4) api.interacted("s1-why"); })); } },

  { id: "s1-my", title: "NCDs in Malaysia", cls: "center",
    html: () => `<p class="eyebrow">NCDs in Malaysia</p><h2 class="h-lg"><span class="num" data-n>0</span><br>Malaysian adults live with all four.</h2>
      <p class="body">That's over half a million people, or <b>2.5% of adults</b>.</p>
      <div class="four4">${[["gauge", "Hypertension"], ["drop", "Diabetes"], ["artery", "High cholesterol"], ["scale", "Obesity"]].map(([k, t], i) => `${i ? '<i class="plus">+</i>' : ""}<span class="f4" style="--d:${i * .18}s">${ic(k, 44)}<small>${t}</small></span>`).join("")}</div>
      <div class="stat73"><span class="big73"><span data-p>0</span>%</span><span>of NCD deaths worldwide happen in low- and middle-income countries.</span></div>
      <p class="src">Sources: NHMS 2023; GBD 2021.</p>`,
    enter(el, api) { const n = $("[data-n]", el); n.textContent = "500,000+"; n.animate([{ transform: "scale(.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 600, easing: "cubic-bezier(.34,1.56,.64,1)" });
      $(".four4", el).classList.add("go"); countUp($("[data-p]", el), 73); api.sfx("rise"); api.interacted("s1-my"); } },

  endTile("s1-end", "You know what NCDs are.", "Next: the three big ones in Malaysia, how they're tested, and the warning signs.", "Next section")
];

/* ===================== SECTION 2 — The big three ===================== */
const BIG = [
  { k: "Diabetes", ic: "drop", col: "#dc2626", pct: 15.6, big: "1 in 6", bigL: "Malaysians live with diabetes", vs: "1 in 9 globally",
    lead: [["heart", "Heart disease"], ["brain", "Stroke"], ["kidney", "Kidney disease"], ["eye", "Blindness"], ["nerve", "Numb hands & feet"]],
    why: "Blood sugar that stays high damages blood vessels, nerves and major organs over time." },
  { k: "Blood pressure", ic: "gauge", col: "#2563eb", pct: 29.2, big: "1 in 3", bigL: "Malaysians live with hypertension", vs: "",
    lead: [["heart", "Heart disease"], ["brain", "Stroke"], ["kidney", "Kidney failure"], ["eye", "Vision loss"], ["person", "Sexual dysfunction"]],
    why: "Uncontrolled high blood pressure silently damages blood vessels and vital organs." },
  { k: "Cholesterol", ic: "artery", col: "#d97706", pct: 33.3, big: "7.6 million", bigL: "adults in Malaysia have high cholesterol", vs: "",
    lead: [["heart", "Heart attack"], ["brain", "Stroke"], ["gauge", "High blood pressure"], ["artery", "Blocked leg arteries"]],
    why: "Fatty deposits build up in the arteries, reducing blood flow." }
];
const iconArr10 = (pct, col) => `<span class="iarr10" style="--c:${col}">${Array.from({ length: 10 }, (_, i) => `<i class="${i < Math.round(pct / 10) ? "on" : ""}" style="--d:${i * .05}s">${person}</i>`).join("")}</span>`;
const BP = [[0, 119, "Optimal", "#16a34a", "Below 120 / 80"], [120, 129, "Normal", "#65a30d", "120–129 / 80–84"], [130, 139, "At risk", "#ca8a04", "130–139 / 85–89"], [140, 159, "Stage 1 (mild)", "#ea580c", "140–159 / 90–99"], [160, 179, "Stage 2 (moderate)", "#dc2626", "160–179 / 100–109"], [180, 220, "Stage 3 (severe)", "#991b1b", "180+ / 110+"]];
const SIGNS = [
  [["Increased thirst", "drop"], ["Slow-healing cuts", "nerve"], ["Fatigue", "person"], ["Blurred vision", "eye"], ["Frequent urination", "kidney"], ["Unexplained weight loss", "scale"]],
  [["Headache", "brain"], ["Blurry vision", "eye"], ["Chest pain", "heart"], ["Dizziness", "brain"], ["Shortness of breath", "lungs"], ["Nosebleed", "drop"], ["Palpitations", "heart"], ["Nausea or vomiting", "person"], ["Blood in urine", "kidney"]]
];
const CUFF = [["30 minutes before", "No smoking, exercise, caffeine or alcohol."], ["Rest 5 minutes", "Sit calmly and don't talk."], ["Sit up, back supported", "Legs uncrossed, feet flat on the floor."], ["Arm at heart level", "Rest it on a flat surface."], ["Cuff on bare skin", "Bottom edge just above the bend of the elbow. Not over clothing."], ["Check the device", "Use a calibrated, validated monitor with the right cuff size."], ["Take 2 readings", "1 minute apart. Morning (before medicine) and evening (before bed)."], ["Write it down", "Record every result. If one arm reads higher, use that arm from now on."]];
const s2 = [
  { id: "s2-size", title: "How big is the problem?", cls: "center",
    html: () => `<p class="eyebrow">How big is the problem?</p><h2 class="h-lg">The big three.</h2><div class="seg"></div>
      <div class="big3" data-v aria-live="polite"></div><p class="src">Source: NHMS 2023.</p>`,
    enter(el, api) { const v = $("[data-v]", el);
      seg(el, ["Diabetes", "Pressure", "Cholesterol"], i => { const b = BIG[i];
        v.innerHTML = `<div class="b3-top"><span class="b3-pct" style="color:${b.col}"><span data-c>0</span>%</span>${iconArr10(b.pct, b.col)}</div>
          <p class="b3-big"><b style="color:${b.col}">${b.big}</b> ${b.bigL}${b.vs ? ` <span class="vs">vs ${b.vs}</span>` : ""}</p>
          ${i === 2 ? `<p class="b3-note">1 in 2 adults with high cholesterol <b>don't know</b> they have it.</p>` : ""}
          <p class="small">${b.why} It can lead to:</p><div class="lead">${b.lead.map(([k, t], n) => `<span style="--d:${n * .07}s">${ic(k, 36)}<small>${t}</small></span>`).join("")}</div>`;
        refade(v); countUp($("[data-c]", v), b.pct, 1, 900); }, api, "s2-size"); } },

  { id: "s2-test", title: "How do we test for it?", cls: "center",
    html: () => `<p class="eyebrow">How do we test for it?</p><h2 class="h-lg">Know your numbers.</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      const panels = [
        () => `<p class="small" style="margin-top:12px">Diabetes is confirmed when a result reaches:</p><div class="tests3">${[["Fasting blood glucose", "≥ 7.0", "mmol/L", "Blood sugar after an 8-hour fast."], ["Glucose challenge test", "≥ 11.1", "mmol/L", "How quickly your body clears sugar from the blood."], ["HbA1c", "≥ 6.3", "%", "Your average blood sugar over the past 3 months."]].map(([t, n, u, d], i) => `<div class="t3" style="--d:${i * .1}s"><small>${t}</small><b>${n}<em>${u}</em></b><span>${d}</span></div>`).join("")}</div>`,
        () => `<div class="bpbox"><div class="bpread"><b data-sys>118</b><span>mmHg (top number)</span></div><div class="bpcat" data-cat></div>
          <input type="range" min="100" max="200" step="1" value="118" aria-label="Systolic blood pressure" data-r><div class="bpscale">${BP.map(b => `<i style="background:${b[3]};flex:${b[1] - b[0] + 1}"></i>`).join("")}</div>
          <p class="small" style="margin-top:8px">Drag to see the category for each reading.</p></div>`,
        () => `<div class="lipids">${[["LDL", "“Bad” cholesterol", "1.0 – 3.0", "mmol/L or lower, depending on heart risk", "#dc2626", "Builds fatty deposits that narrow arteries."], ["HDL", "“Good” cholesterol", "> 1.0 men<br>> 1.2 women", "mmol/L", "#2563eb", "Carries cholesterol back to the liver to be removed."], ["TG", "Triglycerides", "< 1.7", "mmol/L", "#d97706", "A type of fat the body uses to store energy."], ["TC", "Total cholesterol", "< 5.2", "mmol/L", "#7c3aed", ""]].map(([a, t, n, u, c, d], i) => `<div class="lp" style="--c:${c};--d:${i * .08}s"><span class="lp-b">${a}</span><span class="lp-t"><b>${t}</b>${d ? `<small>${d}</small>` : ""}</span><span class="lp-n"><b>${n}</b><small>${u}</small></span></div>`).join("")}</div>`
      ];
      seg(el, ["Glucose", "Pressure", "Cholesterol"], i => { v.innerHTML = panels[i](); refade(v);
        if (i === 1) { const r = $("[data-r]", v), sys = $("[data-sys]", v), cat = $("[data-cat]", v); let last = -1;
          const upd = () => { const x = +r.value, k = BP.findIndex(b => x >= b[0] && x <= b[1]), b = BP[k]; sys.textContent = x; sys.style.color = b[3];
            cat.innerHTML = `<b style="background:${b[3]}">${b[2]}</b><span>${b[4]} mmHg</span>${k >= 3 ? `<em>Hypertension</em>` : ""}`; if (k !== last) { if (last >= 0) api.sfx("tick"); last = k; } };
          r.addEventListener("input", upd); upd(); } }, api, "s2-test"); } },

  { id: "s2-signs", title: "Watch out for these symptoms", cls: "center",
    html: () => `<p class="eyebrow">Warning signs</p><h2 class="h-lg">Watch out for these.</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      seg(el, ["Diabetes", "Pressure", "Cholesterol"], i => {
        v.innerHTML = i < 2 ? `<div class="signs${i ? " s9" : ""}">${SIGNS[i].map(([t, k], n) => `<span style="--d:${n * .05}s">${ic(k, 34)}<small>${t}</small></span>`).join("")}</div>`
          : `<div class="nosign"><div class="ns-big">No symptoms</div><p class="body">Raised cholesterol usually gives <b>no warning signs</b>.</p><div class="half2">${person.replace("<svg", '<svg class="on"')}${person}</div><p class="body"><b>1 in 2</b> adults with high cholesterol don't know they have it. Only a blood test can tell.</p></div>`;
        refade(v); }, api, "s2-signs"); } },

  { id: "s2-cuff", title: "Measure blood pressure right", cls: "center",
    html: () => `<p class="eyebrow">Measuring at home</p><h2 class="h-lg">Get a true reading.</h2>
      <p class="body">Tap each step as you'd do it.</p>
      <div class="cuff">${CUFF.map(([t, d], i) => `<button aria-pressed="false" data-k="${i}"><i>${i + 1}</i><span><b>${t}</b><small>${d}</small></span></button>`).join("")}</div>
      <div class="cuffbar"><i data-bar></i></div>`,
    enter(el, api) { const bs = $$(".cuff button", el), bar = $("[data-bar]", el); let done = false;
      bs.forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "pop" : "tap");
        const n = bs.filter(x => x.getAttribute("aria-pressed") === "true").length; bar.style.width = n / bs.length * 100 + "%";
        if (n === bs.length && !done) { done = true; api.sfx("unlock"); api.confetti(); api.interacted("s2-cuff"); } })); } },

  endTile("s2-end", "You can spot the big three.", "Next: what makes these conditions worse in Malaysia.", "Next section")
];

/* ===================== SECTION 3 — What makes it worse? ===================== */
const CUISINE = [
  { k: "Malaysian", col: "#b45309", t: [["rice", "Carbohydrate-rich meals"], ["roti", "Deep-frying"], ["curry", "Rich sauces and gravies"], ["tehtarik", "High added sugar"]] },
  { k: "Vietnamese", col: "#16a34a", t: [["greens", "Vegetables in most meals"], ["soup", "Boiled, steamed, simmered or raw"], ["sauce", "Lighter dipping sauces*"], ["fish", "Lean protein"]] }
];
const SUGAR = [["bubbletea", "Bubble tea", "500 ml", 92], ["bottle", "Sweetened bottled drink", "500 ml", 60], ["chococake", "Chocolate cake", "1 slice", 44], ["soda", "Soft drink", "1 can", 39], ["layercake", "Layer cake", "1 piece", 14.5], ["jam", "Jam", "1 tbsp", 14], ["donut", "Doughnut", "1 piece", 10], ["cookie", "Cookie", "1 piece", 9.9]];
const s3 = [
  { id: "s3-plate", title: "Malaysia ranks 2nd in ASEAN for obesity", cls: "center",
    html: () => `<p class="eyebrow">Obesity</p><h2 class="h-lg">2nd in ASEAN.</h2>
      <p class="body">Malaysia has the second-highest obesity rate in ASEAN. Compare two cuisines.</p><div class="seg"></div>
      <div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      seg(el, CUISINE.map(c => c.k), i => { const c = CUISINE[i];
        v.innerHTML = `<div class="cuis" style="--c:${c.col}">${c.t.map(([f, t], n) => `<span style="--d:${n * .08}s">${f === "curry" ? food("soup", 44) : food(f, 44)}<b>${t}</b></span>`).join("")}</div>${i ? `<p class="small">*Dipping sauces can still contain sugar and salt.</p>` : ""}`;
        refade(v); }, api, "s3-plate"); } },

  { id: "s3-habits", title: "What makes the problem worse?", cls: "center",
    html: () => `<p class="eyebrow">What makes it worse?</p><h2 class="h-lg">Three daily habits.</h2><p class="body">Tap each card.</p>
      <div class="swaps hab3">${[["salt", "Salt", "Too much salt", "High salt intake is one of the main culprits behind high blood pressure."], ["shoe", "Walking", "Too little walking", "Malaysia is among the world's laziest countries for walking."], ["soda", "Sugar", "Too much sugar", "Malaysia consumes the most sugar per person in ASEAN."]].map(([k, t, h, d], i) => `<button class="sw" aria-pressed="false" data-k="${i}"><span class="sw-in"><span class="sw-f">${anyIc(k, 40)}<b>${t}</b></span><span class="sw-b"><small>${h}</small><em>${d}</em></span></span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size === 3) api.interacted("s3-habits"); })); } },

  { id: "s3-sugar", title: "Added sugar in food", cls: "center",
    html: () => `<p class="eyebrow">Added sugar</p><h2 class="h-lg">25 g a day. Max.</h2>
      <p class="body">That's about <b>5 teaspoons</b>. Tap a food to see how much of that limit it uses.</p>
      <div class="sug8">${SUGAR.map(([f, t], i) => `<button data-k="${i}" aria-label="${t}">${food(f, 40)}<small>${t}</small></button>`).join("")}</div>
      <div class="sugmeter"><div class="sm-top"><b data-g>—</b><span data-t>Pick a food</span></div><div class="sm-bar"><i data-bar></i><span class="sm-lim">25 g limit</span></div><div class="spoons" data-sp></div></div>`,
    enter(el, api) { const g = $("[data-g]", el), t = $("[data-t]", el), bar = $("[data-bar]", el), sp = $("[data-sp]", el), seen = new Set();
      $$(".sug8 button", el).forEach(b => b.addEventListener("click", () => { const [, name, por, gr] = SUGAR[b.dataset.k];
        $$(".sug8 button", el).forEach(x => x.classList.toggle("on", x === b));
        g.textContent = gr + " g"; t.textContent = `${name} · ${por}`; const p = gr / 25 * 100;
        bar.style.width = Math.min(100, gr) + "%"; bar.style.background = gr > 25 ? "#dc2626" : gr > 12.5 ? "#f59e0b" : "#16a34a";
        const tsp = Math.round(gr / 5 * 2) / 2; sp.innerHTML = `${"<i></i>".repeat(Math.floor(tsp))}${tsp % 1 ? '<i class="h"></i>' : ""}<span>≈ ${tsp} teaspoons${gr > 25 ? ` · <b>${Math.round(p)}% of the daily limit</b>` : ""}</span>`;
        api.sfx(gr > 25 ? "wrong" : "pop"); seen.add(b.dataset.k); if (seen.size >= 3) api.interacted("s3-sugar"); })); } },

  endTile("s3-end", "You have the power to change.", "Untreated, NCDs can mean lifelong treatment. Next: everyday strategies that help.", "Next section")
];

/* ===================== SECTION 4 — Strategies ===================== */
const FIBRE = [["Supports digestion and regular bowel movements", "nerve"], ["Improves cholesterol and lowers heart disease risk", "heart"], ["Steadies blood sugar and prevents insulin spikes", "drop"], ["Feeds the good bacteria in your gut", "fibre"], ["Keeps you full, so it controls appetite", "plate"]];
const SODIUM = [["salt", "Table salt"], ["msg", "MSG"], ["stock", "Stock cubes & pastes"], ["sauce", "Ketchup, soy & fish sauce"], ["sausage", "Processed meats"], ["noodles", "Instant noodles & canned food"]];
const FATS = [["Saturated fats", 0, "Limit these. Mostly in fatty meat, butter, ghee and coconut-based dishes."], ["PUFA", 1, "Polyunsaturated fat. Choose: improves heart health, lowers LDL and reduces inflammation."], ["MUFA", 1, "Monounsaturated fat. Choose: a healthy unsaturated fat that lowers LDL."], ["Trans fats", 0, "Limit these. Found in some deep-fried and processed foods."]];
const s4 = [
  { id: "s4-glucose", title: "Strategies for blood glucose", cls: "center",
    html: () => `<p class="eyebrow">Blood glucose</p><h2 class="h-lg">Three levers.</h2><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el);
      const P = [
        () => `<div class="wcalc"><p class="body">For people who are overweight with prediabetes, losing <b>7–10% of body weight within 6 months</b> helps prevent diabetes.</p>
          <div class="wrow"><span>My weight</span><b><span data-w>80</span> kg</b></div><input type="range" min="50" max="130" value="80" aria-label="Body weight in kg" data-r>
          <div class="wgoal">${ic("scale", 46)}<span>Aim to lose<br><b data-g>5.6–8 kg</b></span></div></div>`,
        () => `<div class="fibre">${FIBRE.map(([t, k], i) => `<span style="--d:${i * .08}s">${ic(k, 34)}<small>${t}</small></span>`).join("")}</div><p class="small">Find it in vegetables, whole fruit and wholegrains.</p>`,
        () => `<svg class="gicurve" viewBox="0 0 320 150" aria-label="Blood glucose after high-GI and low-GI food"><path d="M20 130h290M20 130V10" stroke="#cbd5e1" stroke-width="2"/><path class="hi" d="M20 120C60 120 70 20 110 18s50 80 80 100 60 10 120 6" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/><path class="lo" d="M20 120C70 120 90 72 140 70s80 20 170 30" fill="none" stroke="#16a34a" stroke-width="4" stroke-linecap="round"/><text x="116" y="14" font-size="12" font-weight="700" fill="#dc2626" font-family="Inter,sans-serif">High-GI food</text><text x="200" y="66" font-size="12" font-weight="700" fill="#16a34a" font-family="Inter,sans-serif">Low-GI food</text><text x="150" y="146" font-size="11" fill="#6e6e73" text-anchor="middle" font-family="Inter,sans-serif">Time (hours)</text></svg>
          <div class="giswap"><span>${food("whitebread", 34)}<small>Refined grains</small></span><i>→</i><span>${food("oats", 34)}<small>Wholegrains</small></span><span>${food("sweetdrink", 34)}<small>Sugary drinks</small></span><i>→</i><span>${food("guava", 34)}<small>Whole fruit</small></span></div>
          <p class="small">Swapping to lower-GI food lowers the sugar spike after meals and modestly improves HbA1c (by 0.14–0.5%). More fibre usually means a lower GI.</p>`
      ];
      seg(el, ["Weight", "Fibre", "Low GI"], i => { v.innerHTML = P[i](); refade(v);
        if (i === 0) { const r = $("[data-r]", v), w = $("[data-w]", v), g = $("[data-g]", v); const u = () => { const x = +r.value; w.textContent = x; g.textContent = `${(x * .07).toFixed(1)}–${(x * .1).toFixed(1)} kg`; }; r.addEventListener("input", () => { u(); }); r.addEventListener("change", () => api.sfx("tick")); u(); }
        if (i === 2) { $$(".gicurve path.hi, .gicurve path.lo", v).forEach((p, n) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect(); p.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1) ${n * .3}s`; p.style.strokeDashoffset = 0; }); api.sfx("rise"); } }, api, "s4-glucose"); } },

  { id: "s4-bp", title: "Strategies for blood pressure", cls: "center",
    html: () => `<p class="eyebrow">Blood pressure</p><h2 class="h-lg">Less salt. More plants.</h2>
      <div class="na"><div class="na-top"><span class="na-n">&lt; 2,300<small>mg sodium a day</small></span><span class="na-eq">≈</span><span class="na-tsp">${food("salt", 40)}<small>1 teaspoon of salt</small></span></div><p class="small">Even better: under 2,000 mg. Too much raises the risk of high blood pressure, heart disease and stroke.</p></div>
      <p class="body" style="margin-top:12px"><b>Sodium hides beyond the salt shaker.</b> Tap all six.</p>
      <div class="na6">${SODIUM.map(([f, t], i) => `<button data-k="${i}">${food(f, 38)}<small>${t}</small></button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) { const seen = new Set(), say = $("[data-say]", el);
      $$(".na6 button", el).forEach(b => b.addEventListener("click", () => { b.classList.add("on"); api.sfx("pop"); seen.add(b.dataset.k);
        if (seen.size === 6) { say.innerHTML = "<b>All found.</b> Pair less sodium with a DASH-style diet: more fruit and vegetables, less saturated and trans fat."; refade(say); api.sfx("unlock"); api.interacted("s4-bp"); } })); } },

  { id: "s4-chol", title: "Strategies for cholesterol", cls: "center",
    html: () => `<p class="eyebrow">Cholesterol</p><h2 class="h-lg">Swap the fat.</h2><p class="body">Tap a fat: choose it or limit it?</p>
      <div class="fats">${FATS.map(([t, ok], i) => `<button data-k="${i}" class="${ok ? "good" : "bad"}"><b>${t}</b><span>${ok ? "Choose" : "Limit"}</span></button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite">Plus these targets:</p>
      <div class="tg6">${[["fibre", "20–30 g", "fibre a day"], ["scale", "BMI < 23", "and 5–10% weight loss over 1–2 years"], ["person", "Waist", "under 90 cm (men), 80 cm (women)"], ["plate", "15–20%", "of calories from protein, mostly plant-based"], ["smoke", "Quit smoking", "heart risk drops within 6 months"], ["glass", "Limit alcohol", "it raises triglycerides"]].map(([k, a, b], i) => `<span style="--d:${i * .06}s">${ic(k, 32)}<b>${a}</b><small>${b}</small></span>`).join("")}</div>`,
    enter(el, api) { const seen = new Set(), say = $("[data-say]", el);
      $$(".fats button", el).forEach(b => b.addEventListener("click", () => { $$(".fats button", el).forEach(x => x.classList.toggle("on", x === b)); const f = FATS[b.dataset.k];
        say.innerHTML = `<b>${f[0]}.</b> ${f[2]}`; refade(say); api.sfx(f[1] ? "correct" : "wrong"); seen.add(b.dataset.k); if (seen.size === 4) api.interacted("s4-chol"); })); } },

  { id: "s4-move", title: "Physical activity", cls: "center",
    html: () => `<p class="eyebrow">Physical activity</p><h2 class="h-lg">150 minutes a week.</h2>
      <p class="body">Moderate to high intensity: brisk walking, swimming, cycling, dancing, badminton.</p>
      <div class="mv"><div class="wrow"><span>Minutes a day</span><b><span data-m>20</span> min × <span data-d>5</span> days</b></div>
      <input type="range" min="0" max="60" step="5" value="20" aria-label="Minutes of activity a day" data-r><input type="range" min="1" max="7" value="5" aria-label="Days a week" data-dr>
      <div class="mvring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#e5efe0" stroke-width="12"/><circle data-ring cx="60" cy="60" r="50" fill="none" stroke="#35694a" stroke-width="12" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="314" transform="rotate(-90 60 60)"/></svg><span><b data-t>100</b><small>of 150 min</small></span></div></div>
      <div class="mv3"><span>${ic("dumbbell", 34)}<b>2–3 days</b><small>resistance training</small></span><span>${ic("shoe", 34)}<b>8,000 steps</b><small>10,000 is better</small></span><span>${ic("heart", 34)}<b>Benefits</b><small>lower BP, steadier sugar, better cholesterol</small></span></div>`,
    enter(el, api) { const r = $("[data-r]", el), dr = $("[data-dr]", el), ring = $("[data-ring]", el), t = $("[data-t]", el); let hit = false;
      const u = () => { const tot = +r.value * +dr.value; $("[data-m]", el).textContent = r.value; $("[data-d]", el).textContent = dr.value; t.textContent = tot; ring.style.strokeDashoffset = 314 * (1 - Math.min(1, tot / 150)); ring.style.stroke = tot >= 150 ? "#16a34a" : "#35694a";
        if (tot >= 150 && !hit) { hit = true; api.sfx("unlock"); api.confetti(); api.interacted("s4-move"); } else if (tot < 150) hit = false; };
      [r, dr].forEach(x => { x.addEventListener("input", u); x.addEventListener("change", () => api.sfx("tick")); }); u(); } },

  endTile("s4-end", "Your strategy toolkit is ready.", "Last section: supplements, and how to take them safely.", "Next section")
];

/* ===================== SECTION 5 — Supplements, safely ===================== */
const SMYTH = [["“Natural” supplements can't interact with food or medicines.", "Many “natural” supplements are pharmacologically active and use the same liver enzymes as medicines. Natural doesn't mean inactive."], ["Vitamin and mineral supplements are always safe with prescription medicines.", "Some combinations are risky. Vitamin K supplements or vitamin K-rich foods can interfere with blood thinners like warfarin."], ["Herbal supplements don't need to be told to your doctor. They're “just herbs”.", "Herbal supplements can interact with prescription drugs. Your doctor needs the full picture to avoid dangerous interactions."]];
const s5 = [
  { id: "s5-myths", title: "Myths vs facts", cls: "center",
    html: () => `<p class="eyebrow">Supplements</p><h2 class="h-lg">Myth or fact?</h2><p class="body">Tap each card.</p>
      <div class="swaps sm3">${SMYTH.map(([m, f], i) => `<button class="sw" aria-pressed="false" data-k="${i}"><span class="sw-in"><span class="sw-f">${ic("pill", 30)}<small>Myth</small><b>${m}</b></span><span class="sw-b"><small>Fact</small><em>${f}</em></span></span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size === 3) { api.sfx("unlock"); api.interacted("s5-myths"); } })); } },

  { id: "s5-gap", title: "Tips to take supplements safely", cls: "center",
    html: () => `<p class="eyebrow">Take them safely</p><h2 class="h-lg">Mind the gap.</h2>
      <div class="gap"><span class="g1">${ic("pill", 40)}<b>Medicine first</b></span><span class="gline"><i></i><b>Wait 2–6 hours</b></span><span class="g2">${food("pill", 40)}<b>Supplement later</b></span></div>
      <div class="tips3"><span>${ic("doctor", 32)}<small>Bring a full list of your supplements and medicines to every healthcare visit.</small></span><span>${ic("clock", 32)}<small>Always check with your doctor or pharmacist before starting something new.</small></span></div>
      <p class="body" style="margin-top:12px"><b>Food and supplements interact too.</b></p><div class="seg"></div><div data-v aria-live="polite"></div>`,
    enter(el, api) { const v = $("[data-v]", el); $(".gap", el).classList.add("go"); api.sfx("whoosh");
      seg(el, ["Block absorption", "Boost absorption"], i => { v.innerHTML = i ? `<p class="cap"><b>Iron + vitamin C.</b> Vitamin C converts iron into a form that's much easier for the gut to absorb.</p>` : `<p class="cap"><b>Calcium + iron.</b> They compete for the same absorption pathway in the gut, so less iron gets absorbed.</p>`; refade(v); }, api, "s5-gap"); } },

  { id: "s5-take", title: "Key takeaways", cls: "center",
    html: () => `<p class="eyebrow">Key takeaways</p><h2 class="h-lg">Three things to keep.</h2>
      <div class="kt3">${[["plate", "Diet & lifestyle matter", "Daily choices directly affect NCDs like heart disease and diabetes."], ["shoe", "Balance & activity", "Eat a balanced diet, watch portions, and keep moving."], ["doctor", "Seek professional advice", "Talk to a healthcare professional if you're unsure about supplements or drug interactions."]].map(([k, t, d], i) => `<div style="--d:${i * .12}s">${ic(k, 44)}<span><b>${t}</b><small>${d}</small></span></div>`).join("")}</div>
      <p class="disc">This module is for education only and isn't medical advice. If you have a medical condition, take medicines or have health concerns, speak to your doctor or a qualified healthcare provider before making changes, and tell them about any supplements you use.</p>`,
    enter(el, api) { $(".kt3", el).classList.add("go"); api.sfx("spark"); api.interacted("s5-take"); } },

  endTile("s5-end", "All five sections done.", "The knowledge check is unlocked. Answer the questions to complete the module.", "Take the knowledge check")
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
  html: () => `<p class="eyebrow">Pocket notes · page ${n + 1} of 2</p><h2 class="h-md">${head}</h2>
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
/* 3 lessons (~8 min), following the deck's three parts */
const pick = (arr, ids) => ids.map(id => arr.find(t => t.id === id));
const L1 = [videoTile("l1-video", "6408324547112", "Part 1: Introduction to NCDs", "rgba(53,105,74,.75)", "rgba(127,176,105,.55)"), ...pick(s1, ["s1-what", "s1-my"]), ...pick(s2, ["s2-size", "s2-test", "s2-signs"]),
  notesTile("l1-notes", 0, "Lesson 1 on one page."),
  endTile("l1-end", "You know the big three.", "Next: why prevention matters, and what makes NCDs worse in Malaysia.", "Next lesson")];
const L2 = [videoTile("l2-video", "6408325606112", "Part 2: Importance of Prevention", "rgba(180,83,9,.7)", "rgba(245,158,11,.5)"), ...pick(s3, ["s3-plate", "s3-habits", "s3-sugar"]),
  endTile("l2-end", "You have the power to change.", "Untreated, NCDs can mean lifelong treatment. Next: everyday strategies that help.", "Next lesson")];
const L3 = [videoTile("l3-video", "6408326187112", "Part 3: Strategies to Support NCDs", "rgba(31,122,107,.75)", "rgba(22,163,74,.55)"), ...pick(s4, ["s4-glucose", "s4-bp", "s4-chol", "s4-move"]), ...pick(s5, ["s5-gap"]),
  notesTile("l3-notes", 1, "Your strategy cheat sheet."),
  endTile("l3-end", "All three lessons done.", "The knowledge check is unlocked. Answer the questions to complete the module.", "Take the knowledge check")];
window.SECTIONS = [
  { id: "s1", n: 1, name: "Introduction to NCDs.", title: "Part 1: Introduction to NCDs", nav: "Introduction to NCDs", sub: "What NCDs are, the big three, how they're tested and the signs.", acc: "linear-gradient(90deg,#35694a,#7fb069)", accs: "#35694a", c: ["#35694a", "#7fb069"], art: ART(`${icG("drop", 52, 70, 50)}${icG("gauge", 108, 70, 50)}${icG("artery", 80, 114, 52)}`), tiles: L1 },
  { id: "s2", n: 2, name: "Importance of prevention.", title: "Part 2: Importance of Prevention", nav: "Importance of prevention", sub: "Our plates, salt, sugar and sitting still.", acc: "linear-gradient(90deg,#b45309,#f59e0b)", accs: "#b45309", c: ["#b45309", "#f59e0b"], art: ART(`${foodG("bubbletea", 56, 70, 52)}${foodG("roti", 108, 76, 50)}${foodG("salt", 80, 116, 44)}`), tiles: L2 },
  { id: "s3", n: 3, name: "Strategies to support NCDs.", title: "Part 3: Strategies to Support NCDs Management", nav: "Strategies to support NCDs", sub: "Glucose, blood pressure, cholesterol, movement and supplements.", acc: "linear-gradient(90deg,#1f7a6b,#16a34a)", accs: "#1f7a6b", c: ["#1f7a6b", "#16a34a"], art: ART(`${foodG("greens", 56, 72, 54)}${icG("shoe", 108, 72, 50)}${icG("pill", 80, 116, 46)}`), tiles: L3 }
];
})();
