/* ===== Module 4 — Nutrition Throughout the Life Stages =====
   Content source: the user's slide deck "Module 4 Final — Nutrition Throughout Life Stages" (60 slides),
   the 2-page pocket notes and the knowledge-check explanations. */
(function () {
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => Array.from(el.querySelectorAll(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const IMG = window.IMG = { stage1: "assets/img/stage1.webp", stage2: "assets/img/stage2.webp", stage3: "assets/img/stage3.webp", stage4: "assets/img/stage4.webp" };
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
    <p class="eyebrow">Section complete</p><h2 class="h-lg">${head}</h2><p class="body">${text}</p>
    <div class="ctas"><button class="pill" data-act="next">${cta}</button><button class="more" data-act="home">Course map</button></div>`,
  enter(el, api) { const t = $(".tick", el); t.style.transition = "stroke-dashoffset .7s cubic-bezier(.16,1,.3,1) .2s"; t.style.strokeDashoffset = 0; api.sfx("fanfare"); api.confetti(); }
});
const person = '<svg viewBox="0 0 20 32" aria-hidden="true"><circle cx="10" cy="6" r="5"/><path d="M3 31V19a7 7 0 0 1 14 0v12z"/></svg>';
const iconRow = (pct, col) => `<span class="iarr" style="--p:${pct}%;--c:${col}"><span class="iarr-bg">${person.repeat(10)}</span><span class="iarr-fg">${person.repeat(10)}</span></span>`;

/* ===================== SECTION 1 — Why it matters (The Master Plan) ===================== */
const BURDEN = [
  [["21.2", "of under-fives are stunted: too short for their age. Roughly 1 child in 5."], ["46.5", "of children aged 6–59 months are anaemic."], ["15.3", "of under-fives are underweight."]],
  [["28.0", "of children and teens aged 5–19 are overweight or obese."], ["54.4", "of adults are overweight or obese."], ["63", "of teens drink at least one sugary drink every day."]]];
const s1 = [
  { id: "s1-years", title: "Adding life to years", cls: "center",
    html: () => `<p class="eyebrow">Why this matters</p><h2 class="h-lg">Longer lives. Not always healthier ones.</h2>
      <div class="lifebar">
        <div class="lb-track"><i class="lb-good" style="width:87%"></i><i class="lb-poor" style="left:87%;width:13%"></i><span class="lb-dot" data-dot></span></div>
        <div class="lb-scale"><span>Birth</span><span>65.5</span><span>75.3</span></div>
      </div>
      <input type="range" min="0" max="75" value="0" aria-label="Age along the average Malaysian life" id="lifeAge" style="--rt:linear-gradient(90deg,#16a34a 0 87%,#f43f5e 87%)">
      <p class="cap" data-say aria-live="polite">Drag along an average Malaysian life.</p>
      <div class="stats3">
        <div><b class="grad" style="--acc:var(--g-all)"><span data-c="75.3">0</span></b><span>years life expectancy<br><small>Women 77.9 · Men 73.1</small></span></div>
        <div><b class="grad" style="--acc:linear-gradient(90deg,#0a84ff,#16a34a)"><span data-c="65.5">0</span></b><span>years in good health</span></div>
        <div><b class="grad" style="--acc:linear-gradient(90deg,#f43f5e,#fb923c)"><span data-c="9.8">0</span></b><span>years in poor health, about 1 in 8</span></div>
      </div>`,
    enter(el, api) {
      $$("[data-c]", el).forEach((n, i) => setTimeout(() => countUp(n, +n.dataset.c, 1), 200 + i * 150));
      const r = $("input", el), dot = $("[data-dot]", el), say = $("[data-say]", el); let zone = -1;
      const upd = () => { const a = +r.value, z = a > 65.5 ? 1 : 0; dot.style.left = (a / 75.3 * 100) + "%";
        if (z !== zone) { zone = z; say.innerHTML = z ? "<b>The last 9.8 years</b> are typically lived in poor health. Good nutrition across life is about shrinking this gap." : "Medicine has added years to life. <b>Nutrition adds life to years.</b>"; refade(say); if (+r.value) api.sfx(z ? "fall" : "rise"); }
        if (a > 70) api.interacted("s1-years"); };
      r.addEventListener("input", upd); upd();
    } },

  { id: "s1-burden", title: "The double burden", cls: "center",
    html: () => `<p class="eyebrow">The national picture</p><h2 class="h-lg">Too little and too much.</h2>
      <p class="body">Malaysia is under-nourished and over-nourished at the same time, sometimes in the same household.</p>
      <div class="seg"></div><div class="burden" aria-live="polite"></div>
      <p class="small" style="margin-top:10px">Source: NHMS 2022–2024, Ministry of Health Malaysia.</p>`,
    enter(el, api) {
      const box = $(".burden", el);
      seg(el, ["↓ Too little", "↑ Too much"], i => {
        const col = i ? "#f59e0b" : "#0a84ff";
        box.innerHTML = BURDEN[i].map(([n, t]) => `<div class="brow"><b style="color:${col}">${n}%</b>${iconRow(+n, col)}<span>${t}</span></div>`).join(""); refade(box);
        api.sfx(i ? "rise" : "fall");
      }, api, "s1-burden");
    } },

  endTile("s1-end", "Why it matters: done.", "Next: building the foundation, from before birth to age 8.", "Start Section 2")
];

/* ===================== SECTION 2 — Building the foundation (preconception to 8) ===================== */
const PREG = [
  ["Folate", "#16a34a", "Builds the <b>neural tube</b> (brain and spinal cord), which closes by day 28. Needs rise 50%, from 400 to 600 µg.", ["greens","dhal"]],
  ["Iron", "#e11d48", "Mum's blood volume grows about 45%, and baby stores iron for its first 6 months. The need is so high that <b>supplements are standard antenatal care</b>.", ["meat","greens"]],
  ["Iodine", "#0a84ff", "Makes baby's <b>thyroid hormone</b> for brain development. Only about 64% of homes use iodised salt.", ["fish","egg"]],
  ["Choline", "#a16207", "Builds cell membranes and <b>memory circuits</b>. Best sources: egg yolk, liver, soya. Two eggs a day is a simple fix.", ["egg","liver","tofu"]],
  ["DHA", "#06b6d4", "About 40% of the fatty acids in baby's brain grey matter and 60% of the retina. <b>Oily fish 2–3 times a week</b>.", ["fish","sardine"]],
  ["Calcium & D", "#94a3b8", "Builds baby's <b>skeleton</b>. If mum's intake is short, the baby draws calcium from her bones.", ["ikanbilis","milk"]]];
const FEED = [
  [0, "Birth to 6 months", "<b>Breast milk only.</b> It protects immunity and the gut, with fewer infections. In Malaysia, 47% of babies are exclusively breastfed at 6 months.", ["milk"]],
  [6, "6 months: the iron cliff", "Baby's iron stores run out. Start <b>iron-rich first foods</b>: meat, liver, egg yolk, fish, dhal and dark leafy greens.", ["meat","liver","egg","fish","dhal","greens"]],
  [9, "9–10 months", "Introduce <b>lumps and chewable textures</b> to help acceptance and reduce picky eating later.", ["congee","banana"]],
  [12, "Before 12 months", "Avoid <b>honey</b>, added salt and sugar, choking hazards, and cow's milk as a main drink.", ["honey","milk"]],
  [24, "2 years and beyond", "Keep breastfeeding alongside family foods. By age 2, the brain has reached <b>about 80% of its adult weight</b>.", ["rice","fish","veg"]]];
const s2 = [
  mythTile("s2-two", "Pregnancy", "You're eating for two now.", true, "Myth",
    `<p class="mb-t">You're eating for <b>one-and-a-bit</b>. Quality goes up sharply. Quantity barely moves.</p>
     <div class="tri">${[["1st trimester", 80], ["2nd trimester", 280], ["3rd trimester", 470]].map(([t, k]) => `<div><i data-h="${k / 4.7}"></i><b>+${k}</b><span>${t}</span></div>`).join("")}</div>
     <p class="small">${food("roti", 40)} kcal a day extra. +280 kcal is about <b>one roti canai</b>.</p>`,
    el => $$(".tri i", el).forEach((b, k) => setTimeout(() => b.style.height = b.dataset.h + "%", k * 160))),

  { id: "s2-six", title: "Pregnancy nutrients", cls: "center",
    html: () => `<p class="eyebrow">Pregnancy</p><h2 class="h-lg">Six nutrients that go up.</h2>
      <div class="fig"><svg viewBox="0 0 340 258" data-preg aria-label="Pregnancy nutrients">
        <circle cx="170" cy="118" r="70" fill="#ffe1e8"/>
        <circle data-glow cx="170" cy="118" r="44" fill="#ffc2d1" opacity=".25"/>
        <g data-baby style="transform-origin:170px 118px"><ellipse cx="176" cy="128" rx="30" ry="24" fill="#ffb1c1"/><circle cx="152" cy="102" r="17" fill="#ffb1c1"/><path d="M150 128c6 10 18 14 28 10" stroke="#ff8fa8" stroke-width="5" fill="none" stroke-linecap="round"/></g>
        ${PREG.map(([t, c], i) => { const a = -Math.PI / 2 + i * Math.PI / 3, x = 170 + 128 * Math.cos(a), y = 118 + 96 * Math.sin(a);
          return `<g class="orb" data-i="${i}" role="button" tabindex="0" aria-label="${t}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="17" fill="${c}"/><text y="32" text-anchor="middle" class="svgt" font-size="11.5">${t}</text></g>`; }).join("")}
      </svg></div>
      <p class="cap" data-cap aria-live="polite">Tap each nutrient. Tip: start <b>folic acid 400 µg daily</b>, ideally 3 months before conception. For dads, sperm takes about 74 days to develop.</p>`,
    enter(el, api) {
      const svg = $("[data-preg]", el), glow = $("[data-glow]", el), baby = $("[data-baby]", el), cap = $("[data-cap]", el); let n = 0;
      const give = g => {
        const i = +g.dataset.i; cap.innerHTML = `${foods(PREG[i][3], 34)}<b style="color:${PREG[i][1]}">${PREG[i][0]}.</b> ${PREG[i][2]}`; refade(cap);
        if (g.dataset.done) { api.sfx("tap"); return; } g.dataset.done = 1; api.sfx("whoosh");
        const m = g.getAttribute("transform").match(/translate\(([-\d.]+) ([-\d.]+)\)/), x0 = +m[1], y0 = +m[2];
        const dot = g.querySelector("circle").cloneNode(); svg.appendChild(dot); g.style.opacity = .45;
        const t0 = performance.now();
        (function f(t) { const p = Math.min(1, (t - t0) / (reduce ? 1 : 650)), e = p * p * (3 - 2 * p);
          dot.setAttribute("transform", `translate(${x0 + (170 - x0) * e} ${y0 + (118 - y0) * e}) scale(${1 - .6 * e})`);
          if (p < 1) requestAnimationFrame(f); else { dot.remove(); n++; api.sfx("bubble"); glow.setAttribute("r", 44 + n * 4); glow.setAttribute("opacity", .25 + n * .1);
            baby.animate([{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 420 });
            if (n === 6) { api.sfx("unlock"); api.interacted("s2-six"); } } })(t0);
      };
      $$(".orb", el).forEach(g => { g.addEventListener("click", () => give(g)); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); give(g); } }); });
      $$(".orb", el).forEach((g, i) => g.querySelector("circle").animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 500, delay: 200 + i * 90, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
    } },

  { id: "s2-feed", title: "The first 1,000 days",
    html: () => `<p class="eyebrow">The first 1,000 days</p><h2 class="h-lg">First foods, step by step.</h2>
      <div class="fig"><svg viewBox="0 0 340 120" aria-hidden="true">
        <line x1="24" y1="70" x2="316" y2="70" stroke="#e5e5ea" stroke-width="10" stroke-linecap="round"/>
        <line data-prog x1="24" y1="70" x2="24" y2="70" stroke="#ff6a2b" stroke-width="10" stroke-linecap="round"/>
        ${FEED.map(([m], k) => { const x = 24 + m / 24 * 292, cols = ["#7cc4ff", "#e11d48", "#ffb800", "#a855f7", "#16a34a"]; return `<g data-m="${k}" transform="translate(${x.toFixed(1)} 70)"><circle r="${k === 1 ? 17 : 14}" fill="${cols[k]}"/><text y="${k % 2 ? -26 : 36}" text-anchor="middle" class="svgs" font-size="10.5">${m === 24 ? "2 yrs+" : m + " mo"}</text></g>`; }).join("")}
        <g data-kid transform="translate(24 70)"><circle r="11" fill="#ffd6c2" stroke="#fff" stroke-width="3"/><circle cx="-3.5" cy="-1" r="1.5" fill="#1d1d1f"/><circle cx="3.5" cy="-1" r="1.5" fill="#1d1d1f"/><path d="M-3.5 3.5q3.5 2.5 7 0" stroke="#1d1d1f" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>
      </svg></div>
      <input type="range" min="0" max="26" value="0" step="1" aria-label="Child's age in months" id="feedAge" style="--rt:linear-gradient(90deg,#ff8a00,#ff3d6e)">
      <div class="verdict fade" aria-live="polite"></div>`,
    enter(el, api) {
      const r = $("input", el), v = $(".verdict", el), kid = $("[data-kid]", el), prog = $("[data-prog]", el); let ph = -1, touched = false;
      const upd = () => { const m = +r.value, x = 24 + Math.min(m, 24) / 24 * 292; let p = 0; FEED.forEach((f, k) => { if (m >= f[0]) p = k; });
        kid.setAttribute("transform", `translate(${x} 70)`); prog.setAttribute("x2", x);
        $$("[data-m]", el).forEach((g, j) => g.style.opacity = j <= p ? 1 : .35);
        if (p !== ph) { ph = p; v.innerHTML = `<h3>${FEED[p][1]}</h3>${foods(FEED[p][3], 36, p !== 3)}<p>${FEED[p][2]}</p>`; refade(v); if (touched) api.sfx(p === 1 ? "spark" : "tap"); }
        if (p === 4 && touched) api.interacted("s2-feed"); };
      r.addEventListener("input", () => { touched = true; upd(); }); upd();
    } },

  mythTile("s2-milk", "Ages 1–8", "My child needs a special growing-up milk to be taller and smarter.", true, "Myth",
    `${foods(["tin"], 46)}<p class="mb-t">For a healthy child over 1 who eats a varied diet, growing-up milk is an <b>expensive optional extra</b>. Many have sugar high on the ingredient list.</p>
     <p class="small" style="margin:10px 0 6px">What really drives height:</p>
     <div class="drivers">${["Genetics", "A varied diet", "Sleep", "Fewer infections"].map((t, k) => `<span style="animation-delay:${.2 + k * .1}s">${t}</span>`).join("")}</div>
     <p class="small" style="margin-top:10px">Picky eater? Expect <b>10–15 tries</b> before a new food is accepted.</p>`),

  endTile("s2-end", "The foundation: done.", "Next: the engine room, ages 9 to 39.", "Start Section 3")
];

/* ===================== SECTION 3 — The engine room (9–39) ===================== */
const BONE = a => a <= 9 ? 45 : a <= 10.5 ? 45 + (a - 9) / 1.5 * 5 : a <= 14.5 ? 50 + (a - 10.5) / 4 * 39 : a <= 18 ? 89 + (a - 14.5) / 3.5 * 6 : a <= 25 ? 95 + (a - 18) / 7 * 5 : 100;
const s3 = [
  { id: "s3-bone", title: "The bone bank", cls: "center",
    html: () => `<p class="eyebrow">Ages 9–18</p><h2 class="h-lg">The bone bank.</h2>
      <p class="body">The teenage years are your <b>biggest deposit window</b>. Drag through the years.</p>
      <div class="fig"><svg viewBox="0 0 300 200" aria-hidden="true">
        <defs><clipPath id="jarc"><path d="M95 40h110v12c18 8 24 22 24 44v70a22 22 0 0 1-22 22H93a22 22 0 0 1-22-22V96c0-22 6-36 24-44z"/></clipPath></defs>
        <path d="M95 40h110v12c18 8 24 22 24 44v70a22 22 0 0 1-22 22H93a22 22 0 0 1-22-22V96c0-22 6-36 24-44z" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
        <g clip-path="url(#jarc)"><rect data-fill x="60" y="188" width="180" height="160" fill="#e7dcc8"/>
          <g data-specks>${Array.from({ length: 22 }, (_, k) => `<circle cx="${82 + (k * 37) % 140}" cy="${100 + (k * 23) % 85}" r="3" fill="#cdbb98"/>`).join("")}</g></g>
        <rect x="88" y="26" width="124" height="18" rx="6" fill="#16a34a"/>
        <text data-pct x="150" y="120" text-anchor="middle" font-family="${F}" font-weight="700" font-size="30" fill="#1d1d1f">45%</text>
        <text x="150" y="140" text-anchor="middle" class="svgs" font-size="11">of adult bone mass</text>
      </svg></div>
      <input type="range" min="9" max="30" value="9" step=".5" aria-label="Age in years" id="boneAge" style="--rt:linear-gradient(90deg,#16a34a,#06b6d4)">
      <div class="ticks"><span>Age 9</span><span data-age>Age 9</span><span>Age 30</span></div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) {
      const r = $("input", el), fill = $("[data-fill]", el), pct = $("[data-pct]", el), say = $("[data-say]", el); let st = -1, touched = false;
      const T = ["Teens need <b>1,300 mg of calcium a day</b> (ages 10–18), the highest of any age.",
        "<b>Peak deposit years.</b> About 39% of all bone mineral goes in during the 4 years around age 12–14.",
        "By about 16–18, <b>~95% of adult bone mass</b> is in place.",
        "After the twenties, bone is a <b>withdrawal-only account</b>. A fracture at 70 is partly a deposit never made at 14."];
      const upd = () => { const a = +r.value, p = BONE(a), s = a < 11 ? 0 : a < 15 ? 1 : a < 20 ? 2 : 3;
        fill.setAttribute("y", 188 - p / 100 * 148); pct.textContent = Math.round(p) + "%"; $("[data-age]", el).textContent = "Age " + Math.floor(a);
        if (s !== st) { st = s; say.innerHTML = T[s]; refade(say); if (touched) api.sfx(s === 3 ? "fall" : "bubble"); }
        if (s === 3 && touched) api.interacted("s3-bone"); };
      r.addEventListener("input", () => { touched = true; upd(); }); upd();
    } },

  { id: "s3-calcium", title: "Calcium without milk", cls: "center",
    html: () => `<p class="eyebrow">Calcium, calcium, calcium</p><h2 class="h-lg">Calcium beyond the milk glass.</h2>
      <p class="body"><b>22–37%</b> of Malaysian children are lactose intolerant, and children get only <b>about 30%</b> of the calcium they need. Tap a food.</p>
      <div class="cal">${[["Whole ikan bilis & sardines", "Eat the head and bones. Whole ikan bilis has up to <b>8× more calcium</b> than cleaned.", "#0ea5e9"],
        ["Tofu & tau-kua", "About <b>164 mg calcium per 100 g</b>. An affordable option.", "#f59e0b"],
        ["Bayam (spinach)", "About <b>287 mg calcium</b> and 5 mg iron per 100 g.", "#16a34a"],
        ["Fortified soya milk", "Choose one with <b>added calcium</b>. Plain soya milk has much less.", "#a855f7"]].map((c, k) => `<button data-k="${k}" style="--c:${c[2]}" aria-pressed="false"><span class="cal-ic">${food(["ikanbilis","tofu","greens","soyamilk"][k], 44)}</span><b>${c[0]}</b><span class="cal-t">${c[1]}</span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".cal button", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "pop" : "tap"); seen.add(b.dataset.k); if (seen.size === 4) api.interacted("s3-calcium"); })); } },

  { id: "s3-iron", title: "The iron gap", cls: "dark center",
    html: () => `<p class="eyebrow" style="color:#fb7185">Girls, ages 10–18</p><h2 class="h-lg">The iron gap opens at the first period.</h2>
      <div class="seg"></div>
      <div class="ironbars"><div><i data-iron style="background:linear-gradient(0deg,#e11d48,#fb7185)"></i><b data-mg>9 mg</b><span>iron a day</span></div>
        <div><i data-an style="background:linear-gradient(0deg,#9f1239,#f43f5e)"></i><b data-ap>11.1%</b><span data-al>anaemic at 13</span></div></div>
      <p class="cap">Signs are easy to dismiss: <b>tiredness, poor focus, breathless on stairs, feeling cold, brittle nails</b>. 66–76% of these cases are iron-deficiency anaemia, which is preventable.</p>`,
    enter(el, api) {
      seg(el, ["Before periods", "After periods start"], i => {
        $("[data-iron]", el).style.height = (i ? 100 : 41) + "%"; $("[data-an]", el).style.height = (i ? 100 : 48) + "%";
        $("[data-mg]", el).textContent = (i ? 22 : 9) + " mg"; $("[data-ap]", el).textContent = i ? "23.1%" : "11.1%"; $("[data-al]", el).textContent = i ? "anaemic by 17" : "anaemic at 13";
        api.sfx(i ? "rise" : "tap");
      }, api, "s3-iron");
    } },

  mythTile("s3-shake", "Ages 19–39", "If you're serious about fitness, you need a protein shake.", true, "Myth",
    `<p class="mb-t">Protein powder is a <b>convenience food</b>. What matters is your total protein for the day.</p>
     <div class="pgoal"><div><b>61 g</b><span>a day for men</span></div><div><b>52 g</b><span>a day for women</span></div><div><b>1.6 g/kg</b><span>is enough for muscle growth</span></div></div>
     <p class="small" style="margin-top:10px">Eggs, fish, dhal, tempeh and tau-kua get you there too.</p>${foods(["egg","fish","dhal","tempeh","taukua"], 34)}`),

  endTile("s3-end", "The engine room: done.", "Next: preservation and protection, from 40 to 90+.", "Start Section 4")
];

/* ===================== SECTION 4 — Preserve & protect (40–90+) ===================== */
const SILENT = [["Diabetes", 15.6, 9.7, "More than 1 in 3 don't know", "#f59e0b"], ["High blood pressure", 29.2, 17.3, "4 in 10 don't know", "#e11d48"], ["High cholesterol", 33.3, 15.2, "More than half don't know", "#a855f7"]];
const donut = (tot, known, col) => { const C = 2 * Math.PI * 38, k = known / 100 * C, u = (tot - known) / 100 * C;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="38" fill="none" stroke="#f1f1f4" stroke-width="14"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${k} ${C}" transform="rotate(-90 50 50)"/>
    <circle data-hid cx="50" cy="50" r="38" fill="none" stroke="#1d1d1f" stroke-width="14" stroke-dasharray="0 ${C}" stroke-dashoffset="${-k}" transform="rotate(-90 50 50)" data-u="${u}" data-c="${C}" style="transition:stroke-dasharray 1s cubic-bezier(.16,1,.3,1)"/>
    <text x="50" y="56" text-anchor="middle" font-family="${F}" font-weight="700" font-size="17" fill="#1d1d1f">${tot}%</text></svg>`; };
const s4 = [
  { id: "s4-silent", title: "Silent conditions", cls: "center",
    html: () => `<p class="eyebrow">Midlife, 40–64</p><h2 class="h-lg">None of these hurt.</h2>
      <p class="body">That's the problem. Many Malaysian adults have them without knowing.</p>
      <div class="donuts">${SILENT.map(s => `<div>${donut(s[1], s[2], s[4])}<b>${s[0]}</b><span data-note>${s[2]}% know</span></div>`).join("")}</div>
      <button class="pill" data-reveal style="margin-top:14px">Show the undiagnosed</button>
      <p class="cap" aria-live="polite" data-say>Over 40 and not checked in two years? Get your <b>blood pressure, glucose and cholesterol</b> checked at any Klinik Kesihatan.</p>`,
    enter(el, api) {
      $("[data-reveal]", el).addEventListener("click", function () {
        this.disabled = true; api.sfx("spark");
        $$("[data-hid]", el).forEach((c, k) => setTimeout(() => { c.setAttribute("stroke-dasharray", `${c.dataset.u} ${c.dataset.c}`); }, k * 200));
        $$("[data-note]", el).forEach((n, k) => { n.innerHTML = `<b style="color:#1d1d1f">${SILENT[k][3]}</b>`; });
        api.interacted("s4-silent");
      });
    } },

  { id: "s4-protein", title: "Protein at every meal", cls: "center",
    html: () => `<p class="eyebrow">Ages 65+</p><h2 class="h-lg">More protein, not less.</h2>
      <p class="body">Older muscle needs about <b>double the protein per meal</b> to respond. Aim for <b>25–30 g at each main meal</b>.</p>
      <div class="meter"><div class="m-track"><i data-meter></i><span class="m-goal" style="left:83%"><b>25–30 g</b></span></div><p data-mv>${foods(["nasilemak","roti","kaya"], 30)}<b>5–10 g</b> · nasi lemak, roti canai or kaya toast</p></div>
      <p class="small" style="margin:12px 0 6px">Upgrade breakfast with one of these:</p>
      <div class="chips2">${["Palm-sized fish or chicken", "Three eggs", "Large dhal + tofu"].map((t, k) => `<button data-k="${k}" style="--c:${["#0ea5e9", "#f59e0b", "#16a34a"][k]}">${foods([["fish","chicken"],["eggs3"],["dhal","tofu"]][k], 28)}${t}</button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) {
      const m = $("[data-meter]", el); requestAnimationFrame(() => setTimeout(() => m.style.width = "27%", 100));
      $$(".chips2 button", el).forEach(b => b.addEventListener("click", () => {
        $$(".chips2 button", el).forEach(x => x.classList.toggle("on", x === b)); m.style.width = "92%"; api.sfx("rise");
        $("[data-mv]", el).innerHTML = `<b>About 25–30 g</b> · ${b.textContent.toLowerCase()}`;
        const s = $("[data-say]", el); s.innerHTML = "That's one meal on target. Healthy older adults need <b>at least 1.0–1.2 g of protein per kg</b> a day."; refade(s);
        api.interacted("s4-protein");
      }));
    } },

  { id: "s4-strength", title: "Strength fades faster than size", cls: "dark",
    html: () => `<p class="eyebrow">Sarcopenia</p><h2 class="h-lg">Strength fades faster than size.</h2>
      <p class="body">At 75, muscle strength falls <b>3–4% a year</b>, three to five times faster than muscle mass (<b>0.8–1%</b>). Drag to see the gap grow.</p>
      <div class="sbars">
        <div class="sb"><span class="sl">Muscle mass</span><span class="st"><i data-mass style="background:linear-gradient(90deg,#a855f7,#ec4899)"></i></span><b data-mv>100%</b></div>
        <div class="sb"><span class="sl">Muscle strength</span><span class="st"><i data-str style="background:linear-gradient(90deg,#ff8a00,#f43f5e)"></i></span><b data-sv>100%</b></div>
      </div>
      <input type="range" min="0" max="10" value="0" step="1" aria-label="Years after age 75" id="sYears" style="--rt:linear-gradient(90deg,#a855f7,#f43f5e)">
      <div class="ticks"><span>Age 75</span><span data-yr>Now</span><span>Age 85</span></div>
      <div class="duo2" style="margin-top:12px"><div class="tcard"><h3>&lt;27 kg / &lt;16 kg</h3><p>Grip strength in men / women that signals probable sarcopenia.</p></div><div class="tcard"><h3>Load the muscle</h3><p>Twice a week: stairs, carrying, bands, standing up from a chair. Protein does nothing without this.</p></div></div>`,
    enter(el, api) {
      const r = $("input", el); let last = 0;
      const upd = () => { const y = +r.value, m = 100 * Math.pow(1 - .009, y), s = 100 * Math.pow(1 - .035, y);
        $("[data-mass]", el).style.width = m + "%"; $("[data-str]", el).style.width = s + "%";
        $("[data-mv]", el).textContent = Math.round(m) + "%"; $("[data-sv]", el).textContent = Math.round(s) + "%";
        $("[data-yr]", el).textContent = y ? `After ${y} year${y > 1 ? "s" : ""}` : "Now";
        if (y !== last) { api.sfx("tick"); last = y; } if (y >= 8) api.interacted("s4-strength"); };
      r.addEventListener("input", upd); requestAnimationFrame(upd);
    } },

  { id: "s4-two", title: "B12 and thirst", cls: "center",
    html: () => `<p class="eyebrow">Ages 65+</p><h2 class="h-lg">Two things the ageing body stops doing well.</h2>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 340 170" data-svg aria-hidden="true"></svg></div>
      <div class="verdict fade" aria-live="polite"></div>`,
    enter(el, api) {
      const svg = $("[data-svg]", el), v = $(".verdict", el);
      const B12 = `<path d="M60 30c-10 36 0 62 38 80 46 22 112 18 150-10 20-14 18-46-6-56-28-10-52 10-84 6-28-4-40-26-98-20z" fill="#fde2e7" stroke="#fbcfe8" stroke-width="3"/>
        ${[0, 1, 2, 3].map(k => `<g transform="translate(${110 + k * 34} ${70 + (k % 2) * 16})"><rect x="-14" y="-9" width="28" height="18" rx="6" fill="#f59e0b"/><circle r="6" fill="#a855f7"/><path d="M-4 -12v-4a4 4 0 0 1 8 0v4" stroke="#78350f" stroke-width="2" fill="none"/></g>`).join("")}
        <text x="170" y="150" text-anchor="middle" class="svgs" font-size="11">B12 stays locked in food protein</text>`;
      const H2O = `<defs><clipPath id="gl3"><path d="M40 30h70l-9 120H49z"/></clipPath></defs><path d="M40 30h70l-9 120H49z" fill="#f0f9ff" stroke="#bae6fd" stroke-width="3"/>
        <g clip-path="url(#gl3)"><rect x="30" y="150" width="90" height="140" fill="#38bdf8"><animate attributeName="y" values="150;70;150" dur="4s" repeatCount="indefinite"/></rect></g>
        ${["Water", "Soup", "Congee", "Fruit", "Milk"].map((t, k) => `<g transform="translate(${160 + (k % 3) * 62} ${48 + Math.floor(k / 3) * 62})"><circle r="24" fill="${["#e0f2fe", "#fef3c7", "#f5efe6", "#ffe4e6", "#f1f5f9"][k]}"/>${foodG(["water","soup","congee","watermelon","milk"][k], 0, 0, 40)}<text y="38" text-anchor="middle" class="svgs" font-size="11">${t}</text></g>`).join("")}`;
      seg(el, ["Vitamin B12", "Thirst"], i => {
        svg.innerHTML = i ? H2O : B12; api.sfx(i ? "bubble" : "spark");
        v.innerHTML = i ? `<h3 style="color:#0369a1">The thirst signal fades</h3><p>Thirst, kidney function and body water all decline. Risks: <b>confusion, falls, constipation, UTIs, kidney injury</b>. From 70, schedule drinks through the day: water, soup, congee, fruit, milk.</p>`
          : `<h3 style="color:#7e22ce">B12: the absorption problem</h3><p><b>8–9% of adults over 65</b> have atrophic gastritis, so B12 in food isn't released and absorbed. Effects: fatigue, nerve damage, poor balance, memory problems. <b>Testing</b> is advised for over-65s, vegetarians and people on metformin or long-term acid-suppressing medicine.</p>`;
        refade(v);
      }, api, "s4-two");
    } },

  mythTile("s4-mind", "Brain health", "The MIND diet is proven to protect older adults from dementia.", true, "Not proven",
    `<p class="mb-t">An observational study linked it to <b>53% lower Alzheimer's</b>, but couldn't prove cause. A 2023 trial (NEJM, 604 older adults, 3 years) tested it:</p>
     <div class="mbars"><div><i data-h="100" style="background:linear-gradient(0deg,#a855f7,#ec4899)"></i><b>+0.205</b><span>MIND</span></div><div><i data-h="83" style="background:linear-gradient(0deg,#0a84ff,#5e5ce6)"></i><b>+0.170</b><span>Control diet</span></div></div>
     <p class="small" style="margin-top:8px">Both groups improved. The difference was <b>not significant</b>. MIND is still a healthy pattern.</p>`,
    el => $$(".mbars i", el).forEach(i => i.style.height = i.dataset.h + "%")),

  endTile("s4-end", "Preserve & protect: done.", "Last stop: the universal truths that apply at every age.", "Start Section 5")
];

/* ===================== SECTION 5 — Universal truths ===================== */
const SWAPS = [["Sweet drinks, teh tarik, juice", "Plain water, kopi or teh kosong", "Saves money and cuts the most sugar."],
  ["Imported salmon, cod", "Kembung, selar, sardin, cencaru", "Same omega-3 family, a fraction of the price."],
  ["Cleaned ikan bilis", "Whole ikan bilis, bones and head", "Up to 8× more calcium."],
  ["Chicken breast every day", "Egg, dhal, tempeh, tau-kua", "Excellent protein for less."],
  ["Imported berries, apples", "Papaya, guava, banana", "Guava has twice the vitamin C of an orange."],
  ["Imported salad leaves", "Kangkung, bayam, sawi, ulam", "Bayam: ~287 mg calcium per 100 g."]];
const SWF = [[["sweetdrink","tehtarik"],["water","kopi"]],[["salmon"],["fish","sardine"]],[["ikanbilis"],["ikanbilis"]],[["chicken"],["egg","dhal","tempeh"]],[["berries","apple"],["papaya","guava","banana"]],[["salad"],["kangkung","greens"]]];
const ONEF = [["water","kopi"],["veg"],["egg","fish"],null,null,null];
const MYTHS4 = [[["herbal"], "“It's herbal, so it's natural and safe.”", "“Natural” is a marketing word, not a safety category.", "Slimming products are often spiked with banned drugs. Check the NPRA registration number first."],
  [["coconut", "oil"], "“Coconut oil is healthy; seed oils are poison.”", "Both halves are wrong.", "Coconut oil raises LDL cholesterol. Plant oils are linked to lower mortality. Use liquid plant oil as your default."],
  [["rice"], "“Rice is making Malaysians diabetic.”", "Neither extreme holds up.", "About 50–55% of energy from carbs links to the longest life. Pair rice with protein and vegetables."],
  [["pill"], "“Everyone over 60 needs a multivitamin.”", "A low-cost hedge, not a treatment.", "It doesn't prevent cancer or heart disease. A well-nourished diet is the foundation."]];
const ONE = [["Change the drink", "Water, kopi kosong or teh o kosong instead of sweet drinks."], ["Add one vegetable dish", "At one meal a day. Just add, don't remove."], ["Fix breakfast's protein", "Add an egg, ikan bilis, fish or tau-kua."],
  ["Say “kurang manis”", "And “kurang masin”. Your taste adapts within weeks."], ["Book the blood test", "Over 40 and not checked in 2 years? Any Klinik Kesihatan."], ["Load the muscle", "Twice a week: stairs, carrying, standing up from a chair."]];
const s5 = [
  { id: "s5-plate", title: "Suku Suku Separuh", cls: "center",
    html: () => `<p class="eyebrow">Malaysia's healthy plate</p><h2 class="h-lg">Suku Suku Separuh.</h2>
      <p class="body">One image for every age, from 2 to 90. Tap each part to fill the plate.</p>
      <div class="plate3d"><svg viewBox="0 0 260 260" aria-label="Plate: a quarter grains, a quarter protein, half vegetables and fruit">
        <circle cx="130" cy="130" r="122" fill="#fff" stroke="#e5e5ea" stroke-width="4"/><circle cx="130" cy="130" r="104" fill="#f5f5f7"/>
        <path data-p="2" d="M130 130 L130 26 A104 104 0 0 0 130 234 Z" fill="#22c55e"/>
        <path data-p="0" d="M130 130 L130 26 A104 104 0 0 1 234 130 Z" fill="#f59e0b"/>
        <path data-p="1" d="M130 130 L234 130 A104 104 0 0 1 130 234 Z" fill="#f43f5e"/>
        ${foodG("veg", 70, 184, 34)}${foodG("papaya", 104, 206, 28)}${foodG("rice", 170, 56, 30)}${foodG("fish", 158, 212, 32)}${foodG("egg", 208, 152, 24)}<g data-l="2" opacity="0"><text x="80" y="128" text-anchor="middle" font-family="${F}" font-weight="700" font-size="22" fill="#fff">½</text><text x="80" y="148" text-anchor="middle" font-family="${F}" font-weight="600" font-size="11" fill="#fff">Veg & fruit</text></g>
        <g data-l="0" opacity="0"><text x="172" y="90" text-anchor="middle" font-family="${F}" font-weight="700" font-size="20" fill="#fff">¼</text><text x="172" y="106" text-anchor="middle" font-family="${F}" font-weight="600" font-size="11" fill="#fff">Grains</text></g>
        <g data-l="1" opacity="0"><text x="172" y="172" text-anchor="middle" font-family="${F}" font-weight="700" font-size="20" fill="#fff">¼</text><text x="172" y="188" text-anchor="middle" font-family="${F}" font-weight="600" font-size="11" fill="#fff">Protein</text></g>
      </svg></div>
      <div class="chips2"><button data-k="2" style="--c:#22c55e">½ Vegetables & fruit</button><button data-k="1" style="--c:#f43f5e">¼ Protein</button><button data-k="0" style="--c:#f59e0b">¼ Grains</button></div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) {
      const T = { 2: "<b>Half the plate: vegetables and fruit.</b> The part most Malaysian plates are missing, and the biggest change most of us could make.",
        1: "<b>A quarter: protein.</b> Fish, poultry, egg, meat, legumes. For older adults, make this quarter generous.",
        0: "<b>A quarter: grains.</b> Rice, noodles, bread, tubers. Halve the usual rice portion; don't eliminate it." };
      const say = $("[data-say]", el); let n = 0;
      $$("[data-p]", el).forEach(p => { p.style.transformOrigin = "130px 130px"; p.style.transform = "scale(0)"; p.style.transition = "transform .7s cubic-bezier(.34,1.56,.64,1)"; });
      $$(".chips2 button", el).forEach(b => b.addEventListener("click", () => {
        const k = b.dataset.k; say.innerHTML = T[k] + (n >= 2 && !b.disabled ? " Water as the default drink, fruit as dessert." : ""); refade(say);
        if (b.disabled) return; b.disabled = true; b.classList.add("on"); n++;
        $(`[data-p="${k}"]`, el).style.transform = "scale(1)"; setTimeout(() => $(`[data-l="${k}"]`, el).setAttribute("opacity", 1), 350); api.sfx("pop");
        if (n === 3) { api.sfx("unlock"); api.interacted("s5-plate"); }
      }));
    } },

  { id: "s5-swaps", title: "Eating well on less", cls: "center",
    html: () => `<p class="eyebrow">Eating well on less</p><h2 class="h-lg">Malaysian swaps that work.</h2>
      <p class="body">Tap a card to make the swap.</p>
      <div class="swaps">${SWAPS.map((s, k) => `<button class="sw" aria-pressed="false" data-k="${k}"><span class="sw-in"><span class="sw-f">${foods(SWF[k][0], 30)}<small>Instead of</small><b>${s[0]}</b></span><span class="sw-b">${foods(SWF[k][1], 30)}<small>Try</small><b>${s[1]}</b><em>${s[2]}</em></span></span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size >= 4) api.interacted("s5-swaps"); })); } },

  { id: "s5-myths", title: "Four quick myths", cls: "center",
    html: () => `<p class="eyebrow">Myth-busters</p><h2 class="h-lg">Four claims you'll hear.</h2>
      <p class="body">Tap each card for the evidence.</p>
      <div class="swaps mygrid">${MYTHS4.map((m, k) => `<button class="sw" aria-pressed="false" data-k="${k}"><span class="sw-in"><span class="sw-f">${foods(m[0], 30)}<small>Myth</small><b>${m[1]}</b></span><span class="sw-b"><small>The evidence</small><b>${m[2]}</b><em>${m[3]}</em></span></span></button>`).join("")}</div>`,
    enter(el, api) { const seen = new Set();
      $$(".sw", el).forEach(b => b.addEventListener("click", () => { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); api.sfx(on ? "whoosh" : "tap"); seen.add(b.dataset.k); if (seen.size >= 4) { api.sfx("unlock"); api.interacted("s5-myths"); } })); } },

  { id: "s5-one", title: "Pick one thing", cls: "center",
    html: () => `<p class="eyebrow">This week</p><h2 class="h-lg">Pick ONE thing.</h2>
      <p class="body">One change, kept up, beats nine abandoned.</p>
      <div class="one">${ONE.map((o, k) => `<button data-k="${k}" aria-pressed="false">${ONEF[k] ? foods(ONEF[k], 26) : ""}<b>${o[0]}</b><span>${o[1]}</span></button>`).join("")}</div>
      <p class="cap" data-say aria-live="polite"></p>`,
    enter(el, api) {
      $$(".one button", el).forEach(b => b.addEventListener("click", () => {
        $$(".one button", el).forEach(x => x.setAttribute("aria-pressed", x === b)); api.sfx("unlock"); api.confetti();
        const s = $("[data-say]", el); s.innerHTML = `Your one thing: <b>${ONE[b.dataset.k][0].replace(/[“”]/g, "")}</b>. Small changes compound.`; refade(s);
        api.interacted("s5-one");
      }));
    } },

  endTile("s5-end", "All five sections done.", "The knowledge check is unlocked. Answer the questions to complete the module.", "Take the knowledge check")
];

const ART1 = `<svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="56" fill="none" stroke="#e5e7eb" stroke-width="18"/><circle cx="80" cy="80" r="56" fill="none" stroke="#16a34a" stroke-width="18" stroke-dasharray="306 352" transform="rotate(-90 80 80)"/><circle cx="80" cy="80" r="56" fill="none" stroke="#f43f5e" stroke-width="18" stroke-dasharray="46 352" stroke-dashoffset="-306" transform="rotate(-90 80 80)"/><text x="80" y="88" text-anchor="middle" font-family="${F}" font-weight="700" font-size="24" fill="#1d1d1f">9.8</text></svg>`;
window.SECTIONS = [
  { id: "s1", n: 1, name: "Why it matters.", title: "The Master Plan: Why Nutrition Is a Moving Target", nav: "Why it matters", sub: "Healthy years, and Malaysia's double burden.", acc: "linear-gradient(90deg,#5e5ce6,#0ea5e9)", accs: "#4f46e5", c: ["#5e5ce6", "#0ea5e9"], art: ART1, tiles: s1 },
  { id: "s2", n: 2, name: "The foundation.", title: "Building the Foundation: Preconception to Age 8", nav: "Foundation (before birth–8)", sub: "Pregnancy, the first 1,000 days and early childhood.", acc: "linear-gradient(90deg,#ff8a00,#ff3d6e)", accs: "#f2581f", c: ["#ff8a00", "#ff3d6e"], photo: "stage1", tiles: s2 },
  { id: "s3", n: 3, name: "The engine room.", title: "The Engine Room: Ages 9 to 39", nav: "Engine room (9–39)", sub: "Peak bone, the iron gap and protein myths.", acc: "var(--g-all)", accs: "#0f9f6e", c: ["#16a34a", "#06b6d4"], photo: "stage2", tiles: s3 },
  { id: "s4", n: 4, name: "Preserve & protect.", title: "Preservation & Protection: Ages 40 to 90+", nav: "Protect (40+)", sub: "Silent conditions, muscle, B12, thirst and the brain.", acc: "var(--g-fat)", accs: "#9333ea", c: ["#a855f7", "#ec4899"], photo: "stage4", tiles: s4 },
  { id: "s5", n: 5, name: "Universal truths.", title: "Universal Truths: What Applies to Everyone", nav: "Universal truths", sub: "The healthy plate, smart swaps, four myths and one change.", acc: "linear-gradient(90deg,#14b8a6,#0a84ff)", accs: "#0d9488", c: ["#14b8a6", "#0a84ff"], tiles: s5 }
];
})();
