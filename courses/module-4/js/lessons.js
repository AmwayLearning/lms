/* ===== Module 4 — Nutrition Throughout the Life Stages =====
   Content source: the user's 2-page pocket notes and the knowledge-check explanations. */
(function () {
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => Array.from(el.querySelectorAll(s));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const IMG = window.IMG = { stage1: "assets/img/stage1.webp", stage2: "assets/img/stage2.webp", stage3: "assets/img/stage3.webp", stage4: "assets/img/stage4.webp" };
const refade = n => { n.classList.remove("fade"); void n.offsetWidth; n.classList.add("fade"); };

/* segmented control helper */
function seg(el, labels, onPick, api, key) {
  const bar = $(".seg", el), seen = new Set();
  bar.setAttribute("role", "tablist");
  bar.innerHTML = labels.map((l, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${l}</button>`).join("");
  const go = (i, snd) => {
    $$("button", bar).forEach((b, j) => b.setAttribute("aria-selected", i === j));
    seen.add(i); if (snd) api.sfx("tap"); onPick(i);
    if (seen.size === labels.length) api.interacted(key);
  };
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i, true); });
  go(0, false);
  return go;
}

/* ---------- icons for the "focus" badges (drawn, white on gradient) ---------- */
const I = {
  bump: '<circle cx="10" cy="5" r="2.4"/><path d="M8.5 9.5C7 12 7 16 9 19.5l.5 1.5M9.5 9.5c3.5 0 7.5 2.5 7.5 6 0 2.3-1.8 3.5-4 3.5H9.4"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M12 9v5M9.5 11.5h5"/>',
  brain: '<path d="M11 5a2.8 2.8 0 0 0-5 1.6A3 3 0 0 0 4.5 12 3 3 0 0 0 7 17.5 2.6 2.6 0 0 0 11 19z"/><path d="M13 5a2.8 2.8 0 0 1 5 1.6 3 3 0 0 1 1.5 5.4 3 3 0 0 1-2.5 5.5A2.6 2.6 0 0 1 13 19z"/>',
  muscle: '<path d="M5 17c1.5-1.5 2-4.5 2-8l2.5-3 2.5 1.5-1.5 2.5c2 .2 3.5 1.3 4.3 3 1.8-.8 3.7 0 4.7 1.8-1 3.6-4.7 5.2-8.5 5.2-2.6 0-4.8-.8-6-3z"/>',
  bone: '<path d="M7.7 5.3a2.2 2.2 0 1 0-2.4 2.4l-.1.1a2.2 2.2 0 1 0 3 3L15 17.6a2.2 2.2 0 1 0 3 3l.1-.1a2.2 2.2 0 1 0 2.4-2.4 2.2 2.2 0 1 0-3-3L10.7 8.3a2.2 2.2 0 1 0-3-3z" transform="scale(.92) translate(1 0)"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  gut: '<path d="M9 3v3c0 2.2 3.5 2 3.5 4.5S8 12 8 15s3.5 3.6 5.5 2 4.5-1 4.5 1.5-2 3-4 3"/>'
};
const ic = (k, bg) => `<span class="bdg-ic" style="background:${bg}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg></span>`;
const badges = (list, bg) => `<div class="badges">${list.map(([k, t], n) => `<div class="bdg" style="animation-delay:${.15 + n * .12}s">${ic(k, bg)}<span>${t}</span></div>`).join("")}</div>`;

/* ---------- shared screens ---------- */
const introTile = (id, photo, n, age, title, lede, focus, bg) => ({
  id, title: "Life stage " + n, cls: "intro",
  html: () => `<div class="intro-grid">
      <div class="intro-photo"><img src="${IMG[photo]}" alt="" draggable="false"><span class="intro-n" style="background:${bg}">${n}</span></div>
      <div class="intro-copy"><p class="eyebrow">Life stage ${n} · ${age}</p><h2 class="h-lg">${title}</h2><p class="body">${lede}</p>
        <p class="small" style="margin-top:14px;font-size:13px">What good nutrition helps build</p>${badges(focus, bg)}</div>
    </div>`,
  enter(el, api) { api.sfx("whoosh"); setTimeout(() => api.sfx("spark"), 450); }
});
const endTile = (id, head, text, cta) => ({
  id, title: "Section complete", end: true, cls: "center next-tile",
  html: () => `<svg class="check" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="url(#gx${id})" stroke-width="4"/><defs><linearGradient id="gx${id}"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient></defs><path d="M22 37l9 9 19-20" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" class="tick"/></svg>
    <h2 class="h-lg">${head}</h2><p class="body">${text}</p>
    <div class="ctas"><button class="pill" data-act="next">${cta}</button><button class="more" data-act="home">Course map</button></div>`,
  enter(el, api) { const t = $(".tick", el); t.style.transition = "stroke-dashoffset .7s cubic-bezier(.16,1,.3,1) .2s"; t.style.strokeDashoffset = 0; api.sfx("fanfare"); api.confetti(); }
});

const STAGES = [
  ["stage1", "Pregnancy & early years", "Before birth to toddler", [["bump", "Healthy pregnancy"], ["shield", "Stronger immunity"], ["brain", "Brain development"]], "linear-gradient(135deg,#ff8a00,#ff3d6e)"],
  ["stage2", "9–18 years", "School-age & adolescence", [["muscle", "Growth & strength"], ["bone", "Bone health"], ["drop", "Healthy blood (iron)"]], "linear-gradient(135deg,#0a84ff,#5e5ce6)"],
  ["stage3", "19–64 years", "Young adulthood to midlife", [["muscle", "Muscle maintenance"], ["heart", "Heart health"], ["bone", "Strong bones"]], "linear-gradient(135deg,#16a34a,#06b6d4)"],
  ["stage4", "65+ years", "Elderly", [["muscle", "Maintain muscle strength"], ["bone", "Strong bones"], ["gut", "Digestive health & hydration"]], "linear-gradient(135deg,#a855f7,#ec4899)"]
];

/* ===================== SECTION 1 — Preconception, pregnancy & early childhood ===================== */
const PREG = [["Folic acid", "#16a34a"], ["Iron", "#e11d48"], ["Iodine", "#0a84ff"], ["Calcium", "#94a3b8"], ["Vitamin D", "#ffb800"], ["DHA", "#06b6d4"]];
const s1 = [
  { id: "s1-journey", title: "Nutrition across the life stages", cls: "center",
    html: () => `<p class="eyebrow">Key takeaway</p><h2 class="h-lg">Nutrition needs change at each life stage.</h2>
      <p class="body">Tap a stage to see what good nutrition helps build.</p>
      <div class="journey" role="group" aria-label="Life stages">
        <svg class="jline" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 82 C 110 82, 120 30, 200 46 S 300 14, 380 14" stroke="url(#jg)" stroke-width="4" fill="none" stroke-linecap="round" class="a-flow"/><defs><linearGradient id="jg"><stop offset="0" stop-color="#ff8a00"/><stop offset=".35" stop-color="#0a84ff"/><stop offset=".7" stop-color="#16a34a"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs></svg>
        ${STAGES.map((s, n) => `<button class="jstop" data-i="${n}" aria-pressed="${n === 0}"><span class="jimg" style="--b:${s[4]}"><img src="${IMG[s[0]]}" alt="" draggable="false"></span><b>${s[1]}</b></button>`).join("")}
      </div>
      <div class="jinfo" aria-live="polite"></div>`,
    enter(el, api) {
      const info = $(".jinfo", el), seen = new Set();
      const show = (i, snd) => {
        seen.add(i); $$(".jstop", el).forEach((b, j) => b.setAttribute("aria-pressed", i === j));
        const s = STAGES[i];
        info.innerHTML = `<p class="jt">${s[2]}</p>${badges(s[3], s[4])}`; refade(info);
        if (snd) api.sfx("pop"); if (seen.size === 4) api.interacted("s1-journey");
      };
      $$(".jstop", el).forEach(b => b.addEventListener("click", () => show(+b.dataset.i, true)));
      $$(".jstop", el).forEach((b, n) => b.animate([{ transform: "translateY(30px) scale(.6)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 600, delay: 150 + n * 140, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
      show(0, false);
    } },

  introTile("s1-intro", "stage1", 1, "Preconception to early childhood", "Pregnancy & early years.",
    "What a mother eats supports her own health and her baby's development, and good habits start from the very first foods.", STAGES[0][3], STAGES[0][4]),

  { id: "s1-preg", title: "Pregnancy nutrients", cls: "center",
    html: () => `<p class="eyebrow">Pregnancy</p><h2 class="h-lg">Six nutrients for two.</h2>
      <p class="body">Tap each nutrient to send it to the baby.</p>
      <div class="fig"><svg viewBox="0 0 340 258" data-preg aria-label="Pregnancy nutrients">
        <circle cx="170" cy="118" r="70" fill="#ffe1e8"/>
        <circle cx="170" cy="118" r="70" fill="url(#gl-sph)" opacity=".5"/>
        <circle data-glow cx="170" cy="118" r="44" fill="#ffc2d1" opacity=".25"/>
        <g data-baby style="transform-origin:170px 118px">
          <ellipse cx="176" cy="128" rx="30" ry="24" fill="#ffb1c1"/>
          <circle cx="152" cy="102" r="17" fill="#ffb1c1"/>
          <path d="M150 128c6 10 18 14 28 10" stroke="#ff8fa8" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>
        ${PREG.map(([t, c], i) => { const a = -Math.PI / 2 + i * Math.PI / 3, x = 170 + 128 * Math.cos(a) * 1.0, y = 118 + 96 * Math.sin(a);
          return `<g class="orb" data-i="${i}" role="button" tabindex="0" aria-label="Give ${t}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="17" fill="${c}"/><text y="32" text-anchor="middle" class="svgt" font-size="11.5">${t}</text></g>`; }).join("")}
      </svg></div>
      <p class="cap" aria-live="polite"><b data-n>0</b> of 6 delivered</p>`,
    enter(el, api) {
      const svg = $("[data-preg]", el), glow = $("[data-glow]", el), baby = $("[data-baby]", el), cap = $(".cap", el); let n = 0;
      const give = g => {
        if (g.dataset.done) return; g.dataset.done = 1; api.sfx("whoosh");
        const m = g.getAttribute("transform").match(/translate\(([-\d.]+) ([-\d.]+)\)/), x0 = +m[1], y0 = +m[2];
        const dot = g.querySelector("circle").cloneNode(); svg.appendChild(dot);
        g.style.opacity = .35; g.style.pointerEvents = "none";
        const t0 = performance.now();
        (function f(t) { const p = Math.min(1, (t - t0) / (reduce ? 1 : 650)), e = p * p * (3 - 2 * p);
          dot.setAttribute("transform", `translate(${x0 + (170 - x0) * e} ${y0 + (118 - y0) * e}) scale(${1 - .6 * e})`);
          if (p < 1) requestAnimationFrame(f); else {
            dot.remove(); n++; api.sfx("bubble");
            glow.setAttribute("r", 44 + n * 4); glow.setAttribute("opacity", .25 + n * .1);
            baby.animate([{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 420 });
            if (n < 6) cap.innerHTML = `<b data-n>${n}</b> of 6 delivered`;
            else { cap.innerHTML = "Folic acid, iron, iodine, calcium, vitamin D and DHA support <b>maternal health and foetal development</b>."; refade(cap); api.sfx("unlock"); api.interacted("s1-preg"); }
          } })(t0);
      };
      $$(".orb", el).forEach(g => { g.addEventListener("click", () => give(g)); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); give(g); } }); });
      $$(".orb", el).forEach((g, i) => g.querySelector("circle").animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 500, delay: 200 + i * 90, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
    } },

  { id: "s1-feeding", title: "Infant feeding",
    html: () => `<p class="eyebrow">Early infancy & childhood</p><h2 class="h-lg">First foods, step by step.</h2>
      <p class="body">Drag the slider through the first years.</p>
      <div class="fig"><svg viewBox="0 0 340 130" aria-hidden="true">
        <line x1="24" y1="70" x2="316" y2="70" stroke="#e5e5ea" stroke-width="10" stroke-linecap="round"/>
        <line data-prog x1="24" y1="70" x2="24" y2="70" stroke="url(#fg1)" stroke-width="10" stroke-linecap="round"/>
        <defs><linearGradient id="fg1"><stop offset="0" stop-color="#ff8a00"/><stop offset="1" stop-color="#ff3d6e"/></linearGradient></defs>
        <g data-m="0" transform="translate(24 70)"><circle r="20" fill="#7cc4ff"/><path d="M0 -10s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z" fill="#fff"/><text y="40" text-anchor="middle" class="svgs" font-size="11">Birth</text></g>
        <g data-m="1" transform="translate(97 70)"><circle r="20" fill="#ffb800"/><path d="M-10 -2h20a10 9 0 0 1-20 0z" fill="#fff"/><text y="40" text-anchor="middle" class="svgs" font-size="11">6 months</text></g>
        <g data-m="2" transform="translate(316 70)"><circle r="20" fill="#16a34a"/><circle r="10" fill="#fff"/><circle r="5" fill="#16a34a"/><text y="40" text-anchor="middle" class="svgs" font-size="11">2 years+</text></g>
        <g data-kid transform="translate(24 30)"><circle r="13" fill="#ffd6c2"/><circle cx="-4" cy="-1" r="1.6" fill="#1d1d1f"/><circle cx="4" cy="-1" r="1.6" fill="#1d1d1f"/><path d="M-4 4q4 3 8 0" stroke="#1d1d1f" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>
      </svg></div>
      <input type="range" min="0" max="30" value="0" step="1" aria-label="Child's age in months" id="feedAge" style="--rt:linear-gradient(90deg,#ff8a00,#ff3d6e)">
      <div class="verdict fade" aria-live="polite"></div>`,
    enter(el, api) {
      const r = $("input", el), v = $(".verdict", el), kid = $("[data-kid]", el), prog = $("[data-prog]", el); let phase = -1, touched = false;
      const X = m => 24 + Math.min(m, 24) / 24 * 292;
      const T = [["0–6 months", "<b>Exclusive breastfeeding</b> supports growth, development and immune function."],
        ["From around 6 months", "Introduce <b>diverse, nutrient-rich complementary foods</b>, with emphasis on <b>iron-rich foods</b>."],
        ["Up to 2 years and beyond", "<b>Continue breastfeeding</b> up to 2 years or beyond, and encourage a <b>balanced diet</b> as children grow."]];
      const upd = () => {
        const m = +r.value, x = X(m), p = m < 6 ? 0 : m < 24 ? 1 : 2;
        kid.setAttribute("transform", `translate(${x} 30)`); prog.setAttribute("x2", x);
        $$("[data-m]", el).forEach((g, j) => g.style.opacity = j <= p ? 1 : .35);
        if (p !== phase) { phase = p; v.innerHTML = `<h3>${T[p][0]}</h3><p>${T[p][1]}</p>`; refade(v); if (touched) api.sfx(p ? "unlock" : "tap"); }
        if (p === 2 && touched) api.interacted("s1-feeding");
      };
      r.addEventListener("input", () => { touched = true; upd(); }); upd();
    } },

  endTile("s1-end", "Stage 1 done.", "Next: the growth-spurt years, from 9 to 18.", "Start Section 2")
];

/* ===================== SECTION 2 — School-age & adolescence ===================== */
const NEEDS2 = [
  ["Energy & protein", "Support <b>growth spurts</b> and <b>muscle development</b>.",
    `<line x1="110" y1="18" x2="110" y2="176" stroke="#d2d2d7" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<line x1="104" y1="${30 + k * 22}" x2="116" y2="${30 + k * 22}" stroke="#d2d2d7" stroke-width="3"/>`).join("")}
     <g style="transform-origin:180px 176px;animation:grow 2.6s cubic-bezier(.16,1,.3,1) both"><circle cx="180" cy="44" r="18" fill="#ffd6c2"/><rect x="160" y="66" width="40" height="70" rx="16" fill="#0a84ff"/><rect x="164" y="132" width="13" height="44" rx="6" fill="#1d4ed8"/><rect x="183" y="132" width="13" height="44" rx="6" fill="#1d4ed8"/></g>
     ${[0, 1, 2, 3].map(k => `<circle r="7" fill="${k % 2 ? "#ffb800" : "#f43f5e"}"><animateMotion dur="2.2s" begin="${k * .55}s" repeatCount="indefinite" path="M${250 + k * 8} 190 C 260 140, 230 110, 200 100"/></circle>`).join("")}
     <text x="262" y="60" class="svgs" font-size="11">energy</text><circle cx="254" cy="56" r="5" fill="#ffb800"/><text x="262" y="78" class="svgs" font-size="11">protein</text><circle cx="254" cy="74" r="5" fill="#f43f5e"/>`],
  ["Calcium & vitamin D", "Support <b>bone growth</b> and <b>mineralisation</b>.",
    `<defs><clipPath id="boneclip"><path d="M70 70a22 22 0 1 1 30-26l140 0a22 22 0 1 1 30 26 22 22 0 1 1-30 26H100a22 22 0 1 1-30-26z"/></clipPath></defs>
     <path d="M70 70a22 22 0 1 1 30-26l140 0a22 22 0 1 1 30 26 22 22 0 1 1-30 26H100a22 22 0 1 1-30-26z" fill="#f1f1f4" stroke="#d2d2d7" stroke-width="2" transform="translate(0 40)"/>
     <g clip-path="url(#boneclip)" transform="translate(0 40)"><rect x="40" y="140" width="260" height="120" fill="#f8fafc"><animate attributeName="y" from="140" to="10" dur="2.4s" fill="freeze" calcMode="spline" keySplines=".16 1 .3 1"/></rect>
       ${Array.from({ length: 26 }, (_, k) => `<circle cx="${70 + (k * 37) % 210}" cy="${40 + (k * 23) % 70}" r="3.5" fill="#94a3b8" opacity="0"><animate attributeName="opacity" from="0" to=".9" begin="${.3 + k * .07}s" dur=".3s" fill="freeze"/></circle>`).join("")}</g>
     <g transform="translate(284 34)" class="a-spin" style="animation-duration:12s">${Array.from({ length: 8 }, (_, k) => `<path d="M0 -26v-8" stroke="#ffb800" stroke-width="4" stroke-linecap="round" transform="rotate(${k * 45})"/>`).join("")}</g><circle cx="284" cy="34" r="17" fill="#ffc700"/><text x="284" y="38" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="11" fill="#1d1d1f">D</text>`],
  ["Iron", "Supports <b>healthy blood</b>, especially for <b>menstruating girls</b>.",
    `<defs><path id="vein" d="M10 110 C 80 60, 140 160, 200 100 S 300 70, 330 100"/></defs>
     <use href="#vein" stroke="#fecdd3" stroke-width="44" fill="none" stroke-linecap="round"/>
     ${Array.from({ length: 7 }, (_, k) => `<g><animateMotion dur="3.2s" begin="${-k * .46}s" repeatCount="indefinite" rotate="auto"><mpath href="#vein"/></animateMotion><ellipse rx="11" ry="7" fill="#e11d48"/><ellipse rx="5" ry="2.6" fill="#be123c"/></g>`).join("")}
     <g transform="translate(170 26)"><path d="M0 -16s12 13 12 22a12 12 0 0 1-24 0c0-9 12-22 12-22z" fill="#e11d48"/><text y="10" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="10" fill="#fff">Fe</text></g>`]];
const s2 = [
  introTile("s2-intro", "stage2", 2, "9–18 years", "Growth-spurt years.",
    "School-age children and teens grow fast, so their bodies need the right building blocks.", STAGES[1][3], STAGES[1][4]),

  { id: "s2-needs", title: "What teens need", cls: "center",
    html: () => `<p class="eyebrow">Key nutrients</p><h2 class="h-lg">Three building blocks.</h2>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 340 200" data-svg aria-hidden="true"></svg></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      seg(el, NEEDS2.map(n => n[0]), i => { $("[data-svg]", el).innerHTML = NEEDS2[i][2]; const c = $(".cap", el); c.innerHTML = NEEDS2[i][1]; refade(c); api.sfx(["rise", "spark", "bubble"][i]); }, api, "s2-needs");
    } },

  endTile("s2-end", "Stage 2 done.", "Next: staying strong through adulthood, from 19 to 64.", "Start Section 3")
];

/* ===================== SECTION 3 — Young adulthood to midlife ===================== */
const FOUR = [
  ["muscle", "Protein", "Supports muscle maintenance and tissue repair."],
  ["heart", "Energy balance", "Balance energy intake with expenditure as activity levels and energy needs change."],
  ["heart", "Heart health", "Choose plenty of fruits, vegetables, whole grains and legumes, and favour unsaturated fats."],
  ["bone", "Bone health", "Adequate calcium, vitamin D and protein support bone health."]];
const HEART = [["Fruits", "#f43f5e"], ["Vegetables", "#16a34a"], ["Whole grains", "#d97706"], ["Legumes", "#a16207"], ["Unsaturated fats", "#ffb800"]];
const s3 = [
  introTile("s3-intro", "stage3", 3, "19–64 years", "Strong through adulthood.",
    "Adult life is about maintaining what you've built: muscle, heart and bones.", STAGES[2][3], STAGES[2][4]),

  { id: "s3-four", title: "Four things to look after", cls: "center",
    html: () => `<p class="eyebrow">Nutritional focus</p><h2 class="h-lg">Four things to look after.</h2><p class="body">Tap each card to flip it.</p>
      <div class="flip4">${FOUR.map((f, n) => `<button class="f4" aria-pressed="false" data-i="${n}"><span class="f4-in"><span class="f4-f">${ic(f[0], "linear-gradient(135deg,#16a34a,#06b6d4)")}<b>${f[1]}</b></span><span class="f4-b">${f[2]}</span></span></button>`).join("")}</div>`,
    enter(el, api) {
      const seen = new Set();
      $$(".f4", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx("whoosh"); seen.add(b.dataset.i); if (seen.size === 4) api.interacted("s3-four"); }));
    } },

  endTile("s3-end", "Stage 3 done.", "Next: ageing well, at 65 and beyond.", "Start Section 4")
];

/* ===================== SECTION 4 — Elderly 65+ ===================== */
const NEEDS4 = [
  ["Protein", "Helps maintain <b>muscle mass and strength</b>. Needs may increase with ageing, activity level and health status.",
    `<g style="transform-origin:170px 120px"><path d="M60 150c20-14 28-46 30-84l26-24 22 16-14 24c24 2 40 14 50 34 22-10 46-2 58 20-12 40-56 58-100 58-30 0-56-10-72-44z" fill="#f9a8d4"><animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur="1.6s" repeatCount="indefinite" additive="sum"/></path>
     <path d="M150 130c16-10 40-8 54 6" stroke="#ec4899" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/></g>
     ${[0, 1, 2].map(k => `<circle r="8" fill="#f43f5e"><animateMotion dur="2s" begin="${k * .65}s" repeatCount="indefinite" path="M300 30 C 280 70, 240 90, 200 120"/></circle>`).join("")}<text x="300" y="20" text-anchor="middle" class="svgs" font-size="11">protein</text>`],
  ["Calcium & vitamin D", "Support <b>maintenance of bone health</b>.",
    `<path d="M70 70a22 22 0 1 1 30-26l140 0a22 22 0 1 1 30 26 22 22 0 1 1-30 26H100a22 22 0 1 1-30-26z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" transform="translate(0 46)"/>
     ${Array.from({ length: 14 }, (_, k) => `<circle cx="${84 + (k * 41) % 180}" cy="${100 + (k * 17) % 34}" r="4" fill="#94a3b8"><animate attributeName="r" values="3;5;3" dur="2s" begin="${k * .14}s" repeatCount="indefinite"/></circle>`).join("")}
     <circle cx="284" cy="38" r="17" fill="#ffc700"/><text x="284" y="42" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="11" fill="#1d1d1f">D</text>
     <g transform="translate(60 34)"><circle r="17" fill="#e2e8f0"/><text y="4" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="10" fill="#1d1d1f">Ca</text></g>`],
  ["Vitamin B12", "Supports <b>normal nerve function</b> and <b>red blood cell formation</b>.",
    `<path id="nrv" d="M20 70 C 90 30, 150 110, 220 60 S 300 50, 330 70" stroke="#c4b5fd" stroke-width="8" fill="none" stroke-linecap="round"/>
     <circle r="9" fill="#a855f7"><animateMotion dur="1.6s" repeatCount="indefinite"><mpath href="#nrv"/></animateMotion></circle>
     <circle r="5" fill="#fff"><animateMotion dur="1.6s" repeatCount="indefinite"><mpath href="#nrv"/></animateMotion></circle>
     <text x="40" y="34" class="svgs" font-size="11">nerve signal</text>
     ${[0, 1, 2, 3, 4].map(k => `<g transform="translate(${70 + k * 50} ${150 + (k % 2) * 12})"><ellipse rx="18" ry="11" fill="#e11d48"><animate attributeName="ry" values="11;9;11" dur="1.8s" begin="${k * .3}s" repeatCount="indefinite"/></ellipse><ellipse rx="8" ry="4" fill="#be123c"/></g>`).join("")}
     <text x="40" y="190" class="svgs" font-size="11">red blood cells</text>`],
  ["Fibre & hydration", "Fibre supports <b>digestive health</b>, while adequate fluid intake helps maintain <b>hydration</b>.",
    `<defs><clipPath id="glass"><path d="M210 40h80l-10 140h-60z"/></clipPath></defs>
     <path d="M210 40h80l-10 140h-60z" fill="#f0f9ff" stroke="#bae6fd" stroke-width="3"/>
     <g clip-path="url(#glass)"><rect x="200" y="180" width="100" height="150" fill="#38bdf8"><animate attributeName="y" from="180" to="70" dur="2.2s" fill="freeze" calcMode="spline" keySplines=".16 1 .3 1"/></rect>
       <path d="M200 70 q12 -6 25 0 t25 0 t25 0 t25 0 v12h-100z" fill="#7dd3fc"><animate attributeName="d" dur="2.2s" fill="freeze" values="M200 180 q12 -6 25 0 t25 0 t25 0 t25 0 v12h-100z;M200 70 q12 -6 25 0 t25 0 t25 0 t25 0 v12h-100z"/></path></g>
     <path id="gutp" d="M70 40v20c0 16 30 14 30 32s-40 10-40 34 34 26 50 12 40-8 40 12-20 24-40 24" stroke="#fbcfe8" stroke-width="16" fill="none" stroke-linecap="round"/>
     ${[0, 1, 2, 3].map(k => `<circle r="5" fill="#16a34a"><animateMotion dur="3.4s" begin="${-k * .85}s" repeatCount="indefinite"><mpath href="#gutp"/></animateMotion></circle>`).join("")}`]];
const s4 = [
  introTile("s4-intro", "stage4", 4, "65+ years", "Ageing well.",
    "Later life is about keeping muscle, bones, nerves and digestion working well.", STAGES[3][3], STAGES[3][4]),

  { id: "s4-needs", title: "Key nutrients at 65+", cls: "center",
    html: () => `<p class="eyebrow">Key nutrients</p><h2 class="h-lg">Four to focus on.</h2>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 340 210" data-svg aria-hidden="true"></svg></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      seg(el, NEEDS4.map(n => n[0]), i => { $("[data-svg]", el).innerHTML = NEEDS4[i][2]; const c = $(".cap", el); c.innerHTML = NEEDS4[i][1]; refade(c); api.sfx(["rise", "spark", "spark", "bubble"][i]); }, api, "s4-needs");
    } },

  endTile("s4-end", "Stage 4 done.", "Last stop: the habits that apply at every age.", "Start Section 5")
];

/* ===================== SECTION 5 — Universal nutritional guidelines ===================== */
const s5 = [
  { id: "s5-plate", title: "Suku Suku Separuh", cls: "center",
    html: () => `<p class="eyebrow">Balanced diet</p><h2 class="h-lg">Suku Suku Separuh.</h2>
      <p class="body">A quarter, a quarter, a half. Tap each food group to fill the plate.</p>
      <div class="plate3d"><svg viewBox="0 0 260 260" aria-label="Plate divided into a quarter grains, a quarter protein and half vegetables and fruits">
        <circle cx="130" cy="130" r="122" fill="#fff" stroke="#e5e5ea" stroke-width="4"/>
        <circle cx="130" cy="130" r="104" fill="#f5f5f7"/>
        <path data-p="2" d="M130 130 L130 26 A104 104 0 0 0 130 234 Z" fill="#22c55e"/>
        <path data-p="0" d="M130 130 L130 26 A104 104 0 0 1 234 130 Z" fill="#f59e0b"/>
        <path data-p="1" d="M130 130 L234 130 A104 104 0 0 1 130 234 Z" fill="#f43f5e"/>
        <g data-l="2" opacity="0"><text x="80" y="128" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="22" fill="#fff">½</text><text x="80" y="148" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="600" font-size="11" fill="#fff">Veg & fruits</text></g>
        <g data-l="0" opacity="0"><text x="172" y="90" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="20" fill="#fff">¼</text><text x="172" y="106" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="600" font-size="11" fill="#fff">Grains</text></g>
        <g data-l="1" opacity="0"><text x="172" y="172" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="20" fill="#fff">¼</text><text x="172" y="188" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="600" font-size="11" fill="#fff">Protein</text></g>
      </svg></div>
      <div class="chips2"><button data-k="0" style="--c:#f59e0b">¼ Grains or other carbs</button><button data-k="1" style="--c:#f43f5e">¼ Protein foods</button><button data-k="2" style="--c:#22c55e">½ Vegetables & fruits</button></div>
      <p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const cap = $(".cap", el); let n = 0;
      $$("[data-p]", el).forEach(p => { p.style.transformOrigin = "130px 130px"; p.style.transform = "scale(0)"; p.style.transition = "transform .7s cubic-bezier(.34,1.56,.64,1)"; });
      $$(".chips2 button", el).forEach(b => b.addEventListener("click", () => {
        if (b.disabled) return; b.disabled = true; b.classList.add("on"); n++;
        const k = b.dataset.k; $(`[data-p="${k}"]`, el).style.transform = "scale(1)"; setTimeout(() => $(`[data-l="${k}"]`, el).setAttribute("opacity", 1), 350);
        api.sfx("pop");
        if (n === 3) { cap.innerHTML = "<b>¼ grains or other carbohydrate sources, ¼ protein foods, ½ vegetables and fruits.</b>"; refade(cap); api.sfx("unlock"); api.interacted("s5-plate"); }
      }));
    } },

  { id: "s5-habits", title: "Everyday habits", cls: "center",
    html: () => `<p class="eyebrow">Every life stage</p><h2 class="h-lg">Three everyday habits.</h2>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 340 190" data-svg aria-hidden="true"></svg></div>
      <div data-extra></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const svg = $("[data-svg]", el), ex = $("[data-extra]", el), cap = $(".cap", el); let cleanup = null;
      const H = [
        ["Hydration", "Choose <b>plain water</b> and stay hydrated.", () => {
          svg.innerHTML = `<defs><clipPath id="gl2"><path d="M130 24h80l-10 150h-60z"/></clipPath></defs><path d="M130 24h80l-10 150h-60z" fill="#f0f9ff" stroke="#bae6fd" stroke-width="3"/><g clip-path="url(#gl2)"><rect data-water x="120" y="174" width="100" height="160" fill="#38bdf8" style="transition:transform .8s cubic-bezier(.16,1,.3,1)"/></g>`;
          ex.innerHTML = `<button class="pill ghost" data-pour style="margin-top:6px">Pour water</button>`; let lvl = 0;
          $("[data-pour]", el).addEventListener("click", () => { lvl = lvl >= 3 ? 0 : lvl + 1; $("[data-water]", el).style.transform = `translateY(${-lvl * 46}px)`; api.sfx(lvl ? "bubble" : "tap"); });
          setTimeout(() => $("[data-pour]", el) && $("[data-pour]", el).click(), 300);
        }],
        ["Portion control", "Adjust portions to meet your <b>energy needs</b>.", () => {
          svg.innerHTML = `<g data-bowl style="transform-origin:170px 150px;transition:transform .4s cubic-bezier(.34,1.56,.64,1)"><ellipse cx="170" cy="96" rx="78" ry="16" fill="#86efac"/>${[0, 1, 2, 3, 4, 5].map(k => `<circle cx="${118 + k * 20}" cy="${88 - (k % 2) * 8}" r="11" fill="${["#22c55e", "#f59e0b", "#f43f5e", "#16a34a", "#fb923c", "#84cc16"][k]}"/>`).join("")}<path d="M90 96h160a80 64 0 0 1-160 0z" fill="#fff" stroke="#e5e5ea" stroke-width="3"/></g>`;
          ex.innerHTML = `<input type="range" min="0" max="100" value="50" aria-label="Energy needs" id="portion" style="--rt:linear-gradient(90deg,#14b8a6,#0a84ff)"><div class="ticks"><span>Lower energy needs</span><span>Higher energy needs</span></div>`;
          $("#portion", el).addEventListener("input", e => { $("[data-bowl]", el).style.transform = `scale(${.7 + e.target.value / 100 * .5})`; api.interacted("s5-portion"); });
        }],
        ["Nutrient-dense foods", "Choose a <b>variety of nutrient-rich foods</b> daily.", () => {
          svg.innerHTML = `<path d="M70 100h200a100 76 0 0 1-200 0z" fill="#fff" stroke="#e5e5ea" stroke-width="3"/><g data-items></g>`;
          ex.innerHTML = `<button class="pill ghost" data-add style="margin-top:6px">Add variety</button>`; let k = 0;
          const cols = ["#22c55e", "#f59e0b", "#f43f5e", "#a855f7", "#0ea5e9", "#84cc16", "#fb923c", "#e11d48", "#14b8a6"];
          $("[data-add]", el).addEventListener("click", () => {
            const g = $("[data-items]", el); if (k >= 9) { g.innerHTML = ""; k = 0; }
            const x = 110 + (k % 5) * 30, y = 86 - Math.floor(k / 5) * 20;
            g.insertAdjacentHTML("beforeend", `<circle cx="${x}" cy="${y}" r="14" fill="${cols[k]}" style="transform-box:fill-box;transform-origin:center;animation:pop .45s cubic-bezier(.34,1.56,.64,1) both"/>`); k++; api.sfx("pop");
          });
          for (let j = 0; j < 3; j++) setTimeout(() => $("[data-add]", el) && $("[data-add]", el).click(), 200 + j * 250);
        }]];
      seg(el, H.map(h => h[0]), i => { H[i][2](); cap.innerHTML = H[i][1]; refade(cap); }, api, "s5-habits");
    } },

  { id: "s5-take", title: "Key takeaways", bare: true,
    html: () => `<div class="take">
      <div class="tile"><div class="big grad" style="--acc:linear-gradient(90deg,#ff8a00,#ff3d6e)">Needs change.</div><p>Nutrition needs change at each life stage.</p></div>
      <div class="tile dark"><div class="big grad" style="--acc:linear-gradient(90deg,#0a84ff,#a855f7)">Support every stage.</div><p>Good nutrition supports growth, health and overall wellness.</p></div>
      <div class="tile"><div class="big grad" style="--acc:var(--g-all)">Build the foundation.</div><p>Build a strong foundation for long-term health and better quality of life.</p></div>
    </div>` },

  endTile("s5-end", "You're ready.", "The knowledge check is unlocked. Answer the questions to complete the module.", "Take the knowledge check")
];

window.SECTIONS = [
  { id: "s1", n: 1, name: "Early years.", title: "Preconception, Pregnancy & Early Childhood", nav: "Early years", sub: "Pregnancy, breastfeeding and first foods.", acc: "linear-gradient(90deg,#ff8a00,#ff3d6e)", accs: "#f2581f", c: ["#ff8a00", "#ff3d6e"], photo: "stage1", tiles: s1 },
  { id: "s2", n: 2, name: "Growing up.", title: "School-age & Adolescence (9–18 years)", nav: "Growing up", sub: "Fuel for growth spurts, bones and blood.", acc: "linear-gradient(90deg,#0a84ff,#5e5ce6)", accs: "#0a6fd8", c: ["#0a84ff", "#5e5ce6"], photo: "stage2", tiles: s2 },
  { id: "s3", n: 3, name: "Adult years.", title: "Young Adulthood to Midlife (19–64 years)", nav: "Adult years", sub: "Muscle, heart and bones, kept in balance.", acc: "var(--g-all)", accs: "#0f9f6e", c: ["#16a34a", "#06b6d4"], photo: "stage3", tiles: s3 },
  { id: "s4", n: 4, name: "Later life.", title: "Elderly (65+ years)", nav: "Later life", sub: "Strength, bones, B12, fibre and water.", acc: "var(--g-fat)", accs: "#9333ea", c: ["#a855f7", "#ec4899"], photo: "stage4", tiles: s4 },
  { id: "s5", n: 5, name: "Every stage.", title: "Universal Nutritional Guidelines", nav: "Every stage", sub: "Four habits that work at any age.", acc: "linear-gradient(90deg,#14b8a6,#0a84ff)", accs: "#0d9488", c: ["#14b8a6", "#0a84ff"], photo: null, tiles: s5 }
];
})();
