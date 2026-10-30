/* ===== Lesson content — 3 sections, each a scrolling page of tiles ===== */
(function () {
const VIDEO = "https://players.brightcove.net/5048125494001/EECYz3XbU_default/index.html?videoId=";
const $ = (s, el) => el.querySelector(s);
const $$ = (s, el) => Array.from(el.querySelectorAll(s));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const NS = "http://www.w3.org/2000/svg";
const refade = n => { n.classList.remove("fade"); void n.offsetWidth; n.classList.add("fade"); };
function countUp(el, to, dec = 0, ms = 1300) {
  const t0 = performance.now();
  (function f(t) { const p = Math.min(1, (t - t0) / (reduce ? 1 : ms)), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(f); })(t0);
}
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
  bar.addEventListener("click", e => { const b = e.target.closest("button"); if (b) { go(+b.dataset.i, true); bar.dataset.user = 1; } });
  go(0, false);
  return go;
}

/* ---------- shared tiles ---------- */
const videoTile = (id, vid, label, g1, g2) => ({
  id, title: "Video", cls: "dark center",
  html: () => `<p class="eyebrow">Watch first</p><h2 class="h-md">Start with the video.</h2>
    <div class="video"><button class="poster" style="--g1:${g1};--g2:${g2}" aria-label="Play video: ${label}">
      <span class="play"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg></span><span class="lab">${label}</span></button></div>`,
  enter(el, api) {
    $(".poster", el).addEventListener("click", () => {
      api.sfx("pop");
      const f = document.createElement("iframe");
      f.src = VIDEO + vid + "&autoplay=true&playsinline=true"; f.title = label;
      f.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture"; f.allowFullscreen = true;
      const box = $(".video", el); box.innerHTML = ""; box.appendChild(f); api.played(id, label);
    });
  }
});
const nextTile = (id, head, text, cta) => ({
  id, title: "Section complete", end: true, cls: "center next-tile",
  html: () => `<svg class="check" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="url(#gx${id})" stroke-width="4"/><defs><linearGradient id="gx${id}"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient></defs><path d="M22 37l9 9 19-20" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" class="tick"/></svg>
    <h2 class="h-lg">${head}</h2><p class="body">${text}</p>
    <div class="ctas"><button class="pill" data-act="next">${cta}</button><button class="more" data-act="home">Course map</button></div>`,
  enter(el, api) { const t = $(".tick", el); t.style.transition = "stroke-dashoffset .7s cubic-bezier(.16,1,.3,1) .2s"; t.style.strokeDashoffset = 0; api.sfx("fanfare"); api.confetti(); }
});

/* ===================== SECTION 1 ===================== */
const s1 = [
  videoTile("s1-video", "6407645664112", "Introduction and Carbohydrate Metabolism", "rgba(255,138,0,.55)", "rgba(255,61,110,.45)"),

  { id: "s1-plate", title: "One plate, three nutrients",
    html: () => `<p class="eyebrow">Food is fuel</p><h2 class="h-lg">One plate.<br>Three nutrients.</h2>
      <p class="body">A plate of nasi lemak carries <b>carbohydrates, protein and fats</b>. Each gram releases a different amount of energy when your body burns it. Tap a nutrient.</p>
      <div class="plate-grid">
        <div class="plate-img"><img src="assets/img/nasi.webp" alt="Nasi lemak with rice, egg, anchovies, peanuts, cucumber and sambal" loading="lazy"></div>
        <div>
          <div class="groups">
            <button class="group" data-g="0"><span class="kc grad" style="--acc:var(--g-carb)"><span data-k="4">0</span><small>kcal / g</small></span><b>Carbohydrates</b><span class="d">Rice, cucumber, sugar in sambal</span></button>
            <button class="group" data-g="1"><span class="kc grad" style="--acc:var(--g-pro)"><span data-k="4">0</span><small>kcal / g</small></span><b>Protein</b><span class="d">Hard-boiled egg, anchovies, peanuts</span></button>
            <button class="group" data-g="2"><span class="kc grad" style="--acc:var(--g-fat)"><span data-k="9">0</span><small>kcal / g</small></span><b>Fats</b><span class="d">Coconut milk, cooking oil</span></button>
          </div>
          <p class="cap">The whole plate: roughly <b>550–650 kcal</b>.</p>
        </div>
      </div>`,
    enter(el, api) {
      $$("[data-k]", el).forEach((n, i) => setTimeout(() => countUp(n, +n.dataset.k, 0, 900), 300 + i * 200));
      const box = $(".groups", el), seen = new Set();
      $$(".group", el).forEach(g => g.addEventListener("click", () => {
        const on = !g.classList.contains("on");
        $$(".group", el).forEach(x => x.classList.remove("on"));
        box.classList.toggle("focus", on); if (on) g.classList.add("on");
        api.sfx("pop"); seen.add(g.dataset.g); if (seen.size === 3) api.interacted("s1-plate");
      }));
    } },

  { id: "s1-energy", title: "Where your energy goes", cls: "dark",
    html: () => `<p class="eyebrow">Energy out</p><h2 class="h-lg">Where your energy goes.</h2>
      <p class="body">Most of it is spent <b>just keeping you alive</b>, even lying in bed all day. It varies with age, muscle mass and activity level.</p>
      <div class="stack"><i style="background:var(--g-all)" data-w="65"></i><i style="background:var(--g-atp)" data-w="12"></i><i style="background:var(--g-carb)" data-w="23"></i></div>
      <div class="stats">
        <div class="stat"><div class="num grad" style="--acc:var(--g-all)">60–70%</div><div class="lab">Basal metabolic rate</div><p>Breathing, heartbeat, brain, keeping warm.</p></div>
        <div class="stat"><div class="num grad" style="--acc:var(--g-atp)">5–15%</div><div class="lab">Diet-induced thermogenesis</div><p>Digesting, absorbing and processing your food.</p></div>
        <div class="stat"><div class="num grad" style="--acc:var(--g-carb)">10–20%</div><div class="lab">Physical activity</div><p>Exercise like running or badminton, plus everyday moves like standing, talking and cooking.</p></div>
      </div>
      <h3 class="h-sm" style="margin-top:48px">Protein costs the most to digest.</h3>
      <div class="bars">
        <div><span>0–3%</span><i data-h="12" style="background:var(--g-fat)"></i><small>Fats</small></div>
        <div><span>5–10%</span><i data-h="32" style="background:var(--g-carb)"></i><small>Carbs</small></div>
        <div><span>20–30%</span><i data-h="95" style="background:var(--g-pro)"></i><small>Protein</small></div>
      </div>
      <p class="cap" style="margin-top:28px">Eat more than you burn and energy balance is <b>positive: weight gain</b>. Burn more than you eat and it's <b>negative: weight loss</b>.</p>`,
    enter(el, api) {
      setTimeout(() => $$(".stack i", el).forEach(i => i.style.width = i.dataset.w + "%"), 200);
      setTimeout(() => { $$(".bars i", el).forEach((b, k) => setTimeout(() => b.style.height = b.dataset.h + "%", k * 200)); api.sfx("rise"); }, 700);
    } },

  { id: "s1-digest", title: "From rice to glucose", cls: "center",
    html: () => `<p class="eyebrow">Digestion</p><h2 class="h-lg">From rice to glucose.</h2>
      <p class="body">Starch is a long chain of sugar units. Your gut cuts it, link by link, until single glucose molecules can enter your blood.</p>
      <div class="seg"></div><div class="chain" aria-hidden="true"></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const S = [
        ["Mouth", [12], "<b>Salivary amylase</b> starts breaking starch into shorter chains."],
        ["Stomach", [6, 6], "Stomach acid <b>switches amylase off</b>, so carb digestion pauses."],
        ["Small intestine", [3, 2, 3, 1, 2, 1], "<b>Pancreatic amylase</b> and enzymes on the intestinal lining finish the job: single sugars like glucose."],
        ["Bloodstream", [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "Glucose is <b>absorbed into the blood</b> and carried to your cells. Fibre moves on to the large intestine, where gut bacteria partly break it down."]];
      const ch = $(".chain", el), cap = $(".cap", el); let auto;
      const go = seg(el, S.map(s => s[0]), i => {
        ch.innerHTML = S[i][1].map((n, g) => `<span class="grp${n > 1 ? " multi" : ""}" style="animation-delay:${g * .05}s">${'<span class="bead"></span>'.repeat(n)}</span>`).join("");
        cap.innerHTML = S[i][2]; refade(cap); if (i) api.sfx("snip");
      }, api, "s1-digest");
      let k = 0;
      auto = setInterval(() => { if ($(".seg", el).dataset.user) return clearInterval(auto); k = (k + 1) % 4; go(k, false); }, 3200);
      return () => clearInterval(auto);
    } },

  { id: "s1-glycolysis", title: "Glycolysis", cls: "dark center",
    html: () => `<p class="eyebrow">Inside every cell</p><h2 class="h-lg">Glycolysis.<br><span class="grad">Fast energy.</span></h2>
      <p class="body">About <b>10 quick chemical steps</b> split one glucose into two pyruvate, releasing usable energy (ATP). <b>No oxygen needed.</b></p>
      <div class="fig"><svg viewBox="0 0 360 190" aria-label="Glucose splitting into 2 pyruvate and 2 ATP">
        <g data-glu style="transform-origin:180px 92px"><polygon points="180,62 206,77 206,107 180,122 154,107 154,77" fill="#ff8a00"/><text x="180" y="97" text-anchor="middle" fill="#fff" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="13">Glucose</text></g>
        ${["p", "p", "a", "a"].map(t => t === "p" ? `<g data-n opacity="0"><polygon points="0,-17 15,9 -15,9" fill="#16a34a"/><text y="28" text-anchor="middle" class="svgt" font-size="11">Pyruvate</text></g>` : `<g data-n opacity="0"><circle r="15" fill="#ffc700"/><text y="4" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="10" fill="#1d1d1f">ATP</text></g>`).join("")}
        <text data-step x="180" y="170" text-anchor="middle" class="svgs" font-size="14"></text>
      </svg></div>
      <button class="pill" data-run>Run glycolysis</button>`,
    enter(el, api) {
      const g = $("[data-glu]", el), st = $("[data-step]", el), btn = $("[data-run]", el), P = $$("[data-n]", el);
      const T = [[95, 95], [265, 95], [130, 40], [230, 40]];
      const put = (n, x, y, o) => { n.setAttribute("transform", `translate(${x} ${y})`); n.setAttribute("opacity", o); };
      btn.addEventListener("click", async () => {
        btn.disabled = true; P.forEach(p => put(p, 180, 92, 0)); g.style.opacity = 1;
        for (let s = 1; s <= 10; s++) { st.textContent = `Step ${s} of 10`; api.sfx("tick"); g.animate([{ transform: "none" }, { transform: `rotate(${s % 2 ? 7 : -7}deg) scale(${1 + s * .015})` }, { transform: "none" }], { duration: 170 }); await sleep(reduce ? 0 : 190); }
        g.style.opacity = 0; api.sfx("pop");
        const t0 = performance.now();
        await new Promise(r => (function f(t) { const p = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3);
          P.forEach((n, i) => put(n, 180 + (T[i][0] - 180) * e, 92 + (T[i][1] - 92) * e, e)); p < 1 ? requestAnimationFrame(f) : r(); })(t0));
        api.sfx("spark"); st.textContent = "2 pyruvate + 2 ATP";
        btn.disabled = false; btn.textContent = "Run it again"; api.interacted("s1-glycolysis");
      });
    } },

  { id: "s1-store", title: "Store and release", pair: true,
    html: () => `<p class="eyebrow">The sugar bank</p><h2 class="h-md">Store it. Release it.</h2>
      <p class="body">Extra glucose is packed away as <b>glycogen in the liver and muscle</b>, then released between meals.</p>
      <div class="seg"></div>
      <div class="fig"><svg viewBox="0 0 300 200" aria-hidden="true">
        <path d="M40 66c26-36 104-44 180-30 34 6 52 26 44 48-10 26-60 30-104 52-34 17-78 17-104-5C30 114 26 90 40 66z" fill="#c2412d"/>
        <path d="M150 140V104M150 112l-26-20M150 112l26-20M124 92l-14-18M124 92l5-22M176 92l14-18M176 92l-5-22" stroke="#ffd9a0" stroke-width="3" fill="none" stroke-linecap="round"/>
        <g data-knots></g><rect x="14" y="174" width="272" height="20" rx="10" fill="#f9d6d2"/><text x="26" y="188" class="svgs" font-size="10">Bloodstream</text><g data-flow></g>
      </svg></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const knots = $("[data-knots]", el), flow = $("[data-flow]", el), cap = $(".cap", el);
      const spots = [[150, 104], [124, 92], [176, 92], [110, 74], [129, 70], [190, 74], [171, 70], [137, 102], [163, 102], [150, 124]];
      let filled = 0, mode = 0, timer;
      const hex = (x, y) => { const p = document.createElementNS(NS, "polygon"); const pts = []; for (let k = 0; k < 6; k++) { const a = Math.PI / 3 * k - Math.PI / 6; pts.push((x + 7 * Math.cos(a)).toFixed(1) + "," + (y + 7 * Math.sin(a)).toFixed(1)); } p.setAttribute("points", pts.join(" ")); p.setAttribute("fill", "#ffc700"); return p; };
      const draw = () => { knots.innerHTML = ""; spots.slice(0, filled).forEach(([x, y]) => knots.appendChild(hex(x, y))); };
      const travel = (a, b, cb) => { const h = hex(0, 0); flow.appendChild(h); const an = h.animate([{ transform: `translate(${a[0]}px,${a[1]}px)`, opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${b[0]}px,${b[1]}px)` }], { duration: reduce ? 1 : 850, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" }); an.onfinish = () => { h.remove(); cb && cb(); }; };
      seg(el, ["After a meal", "Between meals"], i => {
        mode = i;
        cap.innerHTML = i ? "<b>Glycogenolysis:</b> liver glycogen is broken back down to glucose and released into the blood." : "<b>Glycogenesis:</b> extra glucose is packed into storage as glycogen.";
        refade(cap);
      }, api, "s1-store");
      timer = setInterval(() => {
        if (!mode && filled < spots.length) travel([30 + Math.random() * 240, 184], spots[filled], () => { filled++; draw(); api.sfx("bubble"); });
        else if (mode && filled > 0) { filled--; draw(); travel(spots[filled], [30 + Math.random() * 240, 184]); }
      }, 520);
      return () => clearInterval(timer);
    } },

  { id: "s1-gng", title: "Gluconeogenesis",
    html: () => `<p class="eyebrow">Backup supply</p><h2 class="h-md">Make new glucose.</h2>
      <p class="body">When you're not eating, the liver builds glucose from <b>amino acids</b> (protein) and <b>glycerol</b> (fat) to keep your brain fuelled. This is <b>gluconeogenesis</b>.</p>
      <div class="fig"><svg viewBox="0 0 300 200" aria-hidden="true">
        <defs><path id="ga" d="M48 44 C100 44 100 94 128 98"/><path id="gb" d="M48 156 C100 156 100 108 128 104"/><path id="gc" d="M186 100 C220 100 230 64 254 60"/></defs>
        <use href="#ga" stroke="#f43f5e" stroke-width="3" fill="none" class="a-flow" opacity=".45"/><use href="#gb" stroke="#a855f7" stroke-width="3" fill="none" class="a-flow" opacity=".45"/><use href="#gc" stroke="#ff8a00" stroke-width="3" fill="none" class="a-flow" opacity=".45"/>
        <circle cx="32" cy="44" r="18" fill="#ffe4e8"/><circle cx="27" cy="41" r="6" fill="#f43f5e"/><circle cx="38" cy="48" r="4.5" fill="#f43f5e"/><text x="32" y="78" text-anchor="middle" class="svgs" font-size="10">Amino acids</text>
        <circle cx="32" cy="156" r="18" fill="#f3e8ff"/><path d="M25 148 L32 162 L39 148" stroke="#a855f7" stroke-width="2.5" fill="none"/><circle cx="25" cy="148" r="5" fill="#a855f7"/><circle cx="32" cy="162" r="5" fill="#a855f7"/><circle cx="39" cy="148" r="5" fill="#a855f7"/><text x="32" y="190" text-anchor="middle" class="svgs" font-size="10">Glycerol</text>
        <path d="M120 92c12-22 62-24 70-6 6 12-4 26-26 32-26 6-52 0-44-26z" fill="#c2412d"/><text x="156" y="138" text-anchor="middle" class="svgt" font-size="11">Liver</text>
        <path d="M244 64c-6-18 8-28 20-26 13-2 26 7 22 22-2 13-13 17-22 17s-17-3-20-13z" fill="#fbcfe8" stroke="#f43f5e" stroke-width="2"/><text x="266" y="100" text-anchor="middle" class="svgs" font-size="10">Brain</text>
        <circle r="5.5" fill="#f43f5e"><animateMotion dur="2.2s" repeatCount="indefinite"><mpath href="#ga"/></animateMotion></circle>
        <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#a855f7"><animateMotion dur="2.4s" begin=".6s" repeatCount="indefinite"><mpath href="#gb"/></animateMotion></rect>
        <polygon points="0,-7 6,-3.5 6,3.5 0,7 -6,3.5 -6,-3.5" fill="#ff8a00"><animateMotion dur="1.8s" begin=".9s" repeatCount="indefinite"><mpath href="#gc"/></animateMotion></polygon>
        <polygon points="0,-7 6,-3.5 6,3.5 0,7 -6,3.5 -6,-3.5" fill="#ff8a00"><animateMotion dur="1.8s" begin="1.8s" repeatCount="indefinite"><mpath href="#gc"/></animateMotion></polygon>
      </svg></div>
      <p class="cap">Mainly during <b>fasting, sleep or long exercise</b>.</p>` },

  { id: "s1-sugar", title: "Sugar in Malaysia", cls: "dark center",
    html: () => `<p class="eyebrow">Did you know?</p>
      <div class="h-xl grad" style="--acc:var(--g-atp)"><span data-n>0</span> kg</div>
      <p class="body" style="margin:16px auto 0">of sugar and sweeteners per person, per year, in <b>Malaysia</b>. Luxembourg tops the world list at <b>166.15 kg</b>.</p>
      <p class="small" style="margin-top:22px">Source: worldpopulationreview.com, 2022</p>`,
    enter(el, api) { countUp($("[data-n]", el), 41.46, 2, 1600); api.sfx("rise"); } },

  nextTile("s1-end", "Section 1 done.", "Next: how your body digests, burns and stores fat and protein.", "Start Section 2")
];

/* ===================== SECTION 2 ===================== */
const FAT = [
  ["Fat", "Oil from your meal arrives as <b>large droplets</b>. Fat doesn't dissolve in water, so it needs a special process.", `<g class="a-float"><circle cx="180" cy="95" r="58" fill="#ffc700"/><circle cx="160" cy="74" r="12" fill="#fff" opacity=".55"/></g>`],
  ["Stomach", "Mixing breaks fat into <b>smaller droplets</b>. A little is digested by <b>gastric lipase</b>.", [[120, 80, 30], [190, 70, 26], [240, 110, 28], [160, 130, 22], [210, 145, 18]].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffc700" style="animation:pop .5s ${i * .08}s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:center"/>`).join("")],
  ["Bile", "Bile, made in the liver and stored in the gallbladder, works <b>like dish soap</b>: it splits droplets so enzymes can reach them.", Array.from({ length: 14 }, (_, i) => { const x = 70 + (i % 7) * 36, y = 70 + Math.floor(i / 7) * 52 + (i % 2) * 10; return `<g style="animation:pop .45s ${i * .04}s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:center"><circle cx="${x}" cy="${y}" r="12" fill="#ffc700"/>${[0, 1, 2, 3, 4].map(k => `<circle cx="${(x + 15 * Math.cos(k * 1.256)).toFixed(1)}" cy="${(y + 15 * Math.sin(k * 1.256)).toFixed(1)}" r="3.2" fill="#16a34a"/>`).join("")}</g>`; }).join("")],
  ["Lipase", "<b>Pancreatic lipase</b> cuts each triglyceride into <b>2 free fatty acids + 1 monoglyceride</b>.", `<rect x="120" y="50" width="16" height="96" rx="6" fill="#a855f7"/>
     <path d="M136 62h96" stroke="#ffc700" stroke-width="9" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;0 0;46 -26" keyTimes="0;.45;1" dur="1.4s" fill="freeze"/></path>
     <path d="M136 98h96" stroke="#ffc700" stroke-width="9" stroke-linecap="round"/>
     <path d="M136 134h96" stroke="#ffc700" stroke-width="9" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0;0 0;46 26" keyTimes="0;.45;1" dur="1.4s" fill="freeze"/></path>
     <text x="128" y="172" text-anchor="middle" class="svgs" font-size="11">Monoglyceride</text><text x="300" y="104" text-anchor="middle" class="svgs" font-size="11">2 fatty acids</text>`],
  ["Micelles", "Bile salts wrap the pieces into <b>tiny carriers (micelles)</b> that ferry them to the gut wall.", `<rect x="300" y="20" width="40" height="160" rx="10" fill="#f9d6d2"/><text x="320" y="196" text-anchor="middle" class="svgs" font-size="11">Gut wall</text>
     ${[[70, 70], [120, 130], [170, 80]].map(([x, y], i) => `<g><animateTransform attributeName="transform" type="translate" values="0 0;${270 - x} ${100 - y}" dur="2.6s" begin="${i * .5}s" repeatCount="indefinite"/><circle cx="${x}" cy="${y}" r="10" fill="#ffc700"/>${Array.from({ length: 10 }, (_, k) => `<circle cx="${(x + 19 * Math.cos(k * .628)).toFixed(1)}" cy="${(y + 19 * Math.sin(k * .628)).toFixed(1)}" r="4" fill="#16a34a"/>`).join("")}</g>`).join("")}`],
  ["Absorption", "Inside gut cells they're rebuilt into triglycerides, packed into <b>chylomicrons</b>, and sent via lymph into the blood.", `<defs><path id="abs" d="M40 100 H150 C190 100 200 60 240 60 H330"/></defs>
     <rect x="110" y="40" width="90" height="120" rx="16" fill="#f9d6d2"/><text x="155" y="178" text-anchor="middle" class="svgs" font-size="11">Gut cell</text><text x="290" y="40" text-anchor="middle" class="svgs" font-size="11">Lymph → blood</text>
     <use href="#abs" stroke="#a855f7" stroke-width="3" fill="none" class="a-flow" opacity=".4"/>
     ${[0, .9, 1.8].map(b => `<circle r="13" fill="#ffc700" stroke="#0a84ff" stroke-width="4"><animateMotion dur="2.7s" begin="${b}s" repeatCount="indefinite"><mpath href="#abs"/></animateMotion></circle>`).join("")}`]];
const LIPO = [["Chylomicrons", 56, 90, "Carry fat from your meal, from the intestine to tissues."], ["VLDL", 40, 55, "Carries fat made by the liver out to tissues for energy or storage."], ["LDL", 26, 8, "Carries cholesterol from the liver to tissues. In excess, it can deposit cholesterol in artery walls."], ["HDL", 18, 5, "Carries cholesterol back to the liver for processing and removal."]];

const s2 = [
  videoTile("s2-video", "6407645867112", "Lipid and Protein Metabolism", "rgba(168,85,247,.55)", "rgba(236,72,153,.45)"),

  { id: "s2-fat", title: "From oil to fatty acids", cls: "center",
    html: () => `<p class="eyebrow">Fat digestion</p><h2 class="h-lg">From oil to fatty acids.</h2>
      <p class="body">Six steps carry the oil in your meal into your bloodstream.</p>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 360 200" data-svg aria-hidden="true"></svg></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      seg(el, FAT.map(f => f[0]), i => {
        $("[data-svg]", el).innerHTML = FAT[i][2]; const c = $(".cap", el); c.innerHTML = FAT[i][1]; refade(c);
        if (i === 3) setTimeout(() => api.sfx("snip"), 600); if (i === 1 || i === 2) api.sfx("bubble");
      }, api, "s2-fat");
    } },

  { id: "s2-beta", title: "Beta-oxidation", cls: "dark center",
    html: () => `<p class="eyebrow">In the mitochondria</p><h2 class="h-lg">Beta-oxidation.<br><span class="grad">Two carbons at a time.</span></h2>
      <p class="body">A fatty acid is a long carbon chain. Your body <b>clips off 2 carbons per cycle</b>, making acetyl-CoA. Slower than glucose, but sustained, perfect for rest, fasting and long, easy activity.</p>
      <div class="chain"><div data-c style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center"></div></div>
      <div class="pairs" data-p aria-live="polite"></div>
      <div class="chips"><span class="chip">Cycles <b data-y="c">0</b></span><span class="chip">FADH₂ <b data-y="f">0</b></span><span class="chip">NADH <b data-y="n">0</b></span><span class="chip">Acetyl-CoA <b data-y="a">0</b></span></div>
      <div style="margin-top:24px;display:flex;gap:14px;justify-content:center;align-items:center"><button class="pill" data-snip>✂︎ Clip 2 carbons</button><button class="more" data-reset>Reset</button></div>`,
    enter(el, api) {
      const C = $("[data-c]", el), P = $("[data-p]", el); let n;
      const inc = k => { const b = $(`[data-y="${k}"]`, el); b.textContent = +b.textContent + 1; };
      const reset = () => { n = 16; P.innerHTML = ""; C.innerHTML = '<span class="bead" style="--bd:#ffc700">C</span>'.repeat(16); $$("[data-y]", el).forEach(b => b.textContent = 0); $("[data-snip]", el).disabled = false; };
      $("[data-snip]", el).addEventListener("click", () => {
        if (n <= 2) return; api.sfx("snip");
        const two = $$(".bead", C).slice(0, 2); two.forEach(b => b.classList.add("out"));
        setTimeout(() => {
          two.forEach(b => b.remove()); n -= 2; ["c", "f", "n", "a"].forEach(inc); api.sfx("spark");
          P.insertAdjacentHTML("beforeend", '<span class="pair">Acetyl-CoA</span>');
          if (n === 2) { setTimeout(() => { C.innerHTML = '<span style="font-weight:600">Chain fully clipped: 8 acetyl-CoA.</span>'; P.insertAdjacentHTML("beforeend", '<span class="pair">Acetyl-CoA</span>'); inc("a"); api.sfx("unlock"); }, 300); $("[data-snip]", el).disabled = true; api.interacted("s2-beta"); }
        }, 360);
      });
      $("[data-reset]", el).addEventListener("click", () => { api.sfx("tap"); reset(); });
      reset();
    } },

  { id: "s2-keto", title: "Ketogenesis", pair: true,
    html: () => `<p class="eyebrow">Backup fuel</p><h2 class="h-md">Ketones keep your brain going.</h2>
      <p class="body">A <b>normal, healthy backup</b> when glucose runs low.</p>
      <ol class="steps">
        <li><span><b>Carbs run low</b>Fasting, very low-carb eating or long exercise.</span></li>
        <li><span><b>Fat tissue releases fatty acids</b>They travel to the liver.</span></li>
        <li><span><b>The liver breaks them down</b>β-oxidation makes acetyl-CoA.</span></li>
        <li><span><b>Acetyl-CoA becomes ketones</b>Mainly acetoacetate and beta-hydroxybutyrate.</span></li>
        <li><span><b>Ketones enter the blood</b>Fuel for the brain, muscle and heart.</span></li>
      </ol>`,
    enter(el, api) { $$(".steps li", el).forEach((li, i) => setTimeout(() => li.classList.add("in"), 200 + i * 300)); } },

  { id: "s2-dka", title: "Ketosis vs ketoacidosis",
    html: () => `<p class="eyebrow">Know the difference</p><h2 class="h-md">Ketosis is not ketoacidosis.</h2>
      <p class="body">Stress, extreme starvation or diabetes can push the liver to make ketones.</p>
      <div class="seg"></div><div class="verdict" aria-live="polite"></div>`,
    enter(el, api) {
      const V = [["Ketosis: usually mild", "In healthy people with normal insulin function, it's generally <b>mild and reversible</b>.", "#f0fbf3", "#16a34a"],
        ["Ketoacidosis: an emergency", "An <b>uncontrolled build-up</b> makes the blood too acidic. Signs: excessive thirst, nausea, fruity breath, confusion, rapid breathing. It needs <b>urgent insulin and fluid treatment</b>.", "#fff1f3", "#e11d48"]];
      const v = $(".verdict", el);
      seg(el, ["Ketosis", "Ketoacidosis"], i => { v.style.background = V[i][2]; v.innerHTML = `<h3 style="color:${V[i][3]}">${V[i][0]}</h3><p>${V[i][1]}</p>`; refade(v); }, api, "s2-dka");
    } },

  { id: "s2-lipo", title: "Fat storage and transport", cls: "center",
    html: () => `<p class="eyebrow">Storage & transport</p><h2 class="h-lg">Stored in fat cells.<br>Carried by lipoproteins.</h2>
      <p class="body">Extra fat is stored as triglycerides in <b>adipose tissue</b>, your long-term energy reserve. To travel in blood, it rides in carriers of different sizes. Tap one.</p>
      <div class="lipo">${LIPO.map((l, i) => `<button aria-pressed="${!i}" data-i="${i}"><span class="ball" style="width:${l[1] * 1.7}px;height:${l[1] * 1.7}px;--tg:${l[2]}%"></span>${l[0]}</button>`).join("")}</div>
      <p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const cap = $(".cap", el), seen = new Set();
      const show = i => { seen.add(i); $$(".lipo button", el).forEach((b, j) => b.setAttribute("aria-pressed", i === j)); cap.innerHTML = `<b>${LIPO[i][0]}</b> (about ${LIPO[i][2]}% triglyceride). ${LIPO[i][3]}`; refade(cap); if (seen.size === 4) api.interacted("s2-lipo"); };
      $$(".lipo button", el).forEach(b => b.addEventListener("click", () => { api.sfx("bubble"); show(+b.dataset.i); }));
      $$(".ball", el).forEach((b, i) => b.animate([{ transform: "scale(0)" }, { transform: "none" }], { duration: 700, delay: i * 120, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" }));
      show(0);
    } },

  { id: "s2-collagen", title: "Collagen", cls: "dark center",
    html: () => `<p class="eyebrow" style="color:#fb7185">Protein</p>
      <div class="h-xl grad" style="--acc:var(--g-pro)"><span data-a>0</span>–<span data-b>0</span>%</div>
      <p class="body" style="margin:16px auto 0">of all protein in your body is <b>collagen</b>, the scaffolding of skin, tendons, ligaments and bones. Eating collagen doesn't mean it goes straight to your skin.</p>`,
    enter(el, api) { countUp($("[data-a]", el), 25, 0, 1200); countUp($("[data-b]", el), 35, 0, 1400); api.sfx("rise"); } },

  { id: "s2-protein", title: "Protein: break down, pool, build", cls: "center",
    html: () => `<p class="eyebrow" style="color:#e11d48">Protein metabolism</p><h2 class="h-lg">Break down. Pool. Build.</h2>
      <p class="body">Protein is a chain of amino acids. Your body takes it apart, keeps a pool of free amino acids, and builds new proteins from them.</p>
      <div class="seg"></div><div class="fig"><svg viewBox="0 0 360 200" data-svg aria-hidden="true"></svg></div><p class="cap" aria-live="polite"></p>`,
    enter(el, api) {
      const col = ["#f43f5e", "#0a84ff", "#16a34a", "#ff8a00", "#a855f7", "#ffc700"];
      const beads = (groups, y) => { let x = 30, k = 0, out = ""; groups.forEach((n, g) => { for (let j = 0; j < n; j++) { out += `<circle cx="${x}" cy="${y}" r="10" fill="${col[k++ % 6]}" style="animation:pop .45s ${g * .06}s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:center"/>`; x += 22; } x += 10; }); return out; };
      const S = [
        ["Digest", "In the stomach, <b>acid and pepsin</b> start cutting the chain. In the small intestine, enzymes finish the job: <b>single amino acids</b> enter the blood.",
          `<text x="180" y="40" text-anchor="middle" class="svgs" font-size="12">Egg protein</text>${beads([12], 64).replace(/cx="(\d+)"/g, (m, v) => `cx="${+v + 32}"`)}<text x="180" y="112" text-anchor="middle" class="svgs" font-size="12">↓ stomach & small intestine</text>${beads([1, 1, 1, 1, 1, 1, 1, 1, 1], 150)}`],
        ["Pool", "The <b>amino acid pool</b> fills from digestion and recycled body protein, and drains into new proteins or energy. There's <b>no storage</b>; 9 amino acids are essential from food.",
          `<defs><path id="i1" d="M30 30 C80 30 110 60 140 92"/><path id="i2" d="M330 30 C280 30 250 60 220 92"/><path id="o1" d="M150 150 C120 180 80 186 40 188"/><path id="o2" d="M210 150 C240 180 280 186 320 188"/></defs>
           ${["i1", "i2", "o1", "o2"].map(p => `<use href="#${p}" stroke="#f43f5e" stroke-width="2.5" fill="none" class="a-flow" opacity=".35"/>`).join("")}
           <rect x="110" y="84" width="140" height="70" rx="20" fill="#ffe4e8" stroke="#f43f5e" stroke-width="2.5"/><text x="180" y="116" text-anchor="middle" class="svgt" font-size="12">Pool of free</text><text x="180" y="132" text-anchor="middle" class="svgt" font-size="12">amino acids</text>
           <text x="6" y="18" class="svgs" font-size="10.5">From digestion</text><text x="354" y="18" text-anchor="end" class="svgs" font-size="10.5">Recycled body protein</text>
           <text x="6" y="198" class="svgs" font-size="10.5">New proteins</text><text x="354" y="198" text-anchor="end" class="svgs" font-size="10.5">Energy / glucose</text>
           ${[["i1", 0], ["i1", 1.2], ["i2", .6], ["i2", 1.8], ["o1", .3], ["o1", 1.5], ["o2", .9], ["o2", 2.1]].map(([p, b], i) => `<circle r="6" fill="${col[i % 6]}"><animateMotion dur="2.4s" begin="${b}s" repeatCount="indefinite"><mpath href="#${p}"/></animateMotion></circle>`).join("")}`],
        ["Build", "DNA is copied into <b>mRNA</b>, which travels to a <b>ribosome</b>. The ribosome reads it and links amino acids in order: a new protein, like muscle's <b>actin and myosin</b>.",
          `<path d="M20 140 h320" stroke="#16a34a" stroke-width="5" stroke-linecap="round"/><text x="340" y="164" text-anchor="end" class="svgs" font-size="11">mRNA</text>
           <g><animateTransform attributeName="transform" type="translate" values="0 0;150 0" dur="3s" fill="freeze"/><ellipse cx="80" cy="120" rx="38" ry="22" fill="#0a84ff"/><ellipse cx="80" cy="152" rx="46" ry="18" fill="#1d1d1f"/>
           ${Array.from({ length: 7 }, (_, i) => `<circle cx="${80 - i * 20}" cy="${80 - (i % 2) * 10}" r="9" fill="${col[i % 6]}" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${i * .42}s" dur=".2s" fill="freeze"/></circle>`).join("")}</g><text x="20" y="190" class="svgs" font-size="11">Ribosome builds the chain →</text>`]];
      seg(el, S.map(s => s[0]), i => {
        $("[data-svg]", el).innerHTML = S[i][2]; const c = $(".cap", el); c.innerHTML = S[i][1]; refade(c);
        if (i === 0) api.sfx("snip"); if (i === 2) for (let k = 0; k < 7; k++) setTimeout(() => api.sfx("tick"), k * 420);
      }, api, "s2-protein");
    } },

  nextTile("s2-end", "Section 2 done.", "Last stop: how carbs, fat and protein connect, and how your body switches fuel.", "Start Section 3")
];

/* ===================== SECTION 3 ===================== */
const PH = [["After a meal", "Uses the nutrients you just ate, and stores the extra as glycogen or fat.", [100, 10, 10, 5, 10]],
  ["A few hours", "Blood glucose dips, so the body taps stored glycogen.", [75, 20, 30, 5, 10]],
  ["Overnight (8–24 h)", "Glycogen runs low, so the liver starts gluconeogenesis.", [30, 60, 50, 20, 20]],
  ["1–3+ days", "Fat breakdown speeds up and ketones fuel the brain, sparing glucose and muscle.", [10, 60, 90, 85, 25]],
  ["Starvation", "With fat reserves low, muscle breakdown becomes a major energy source: the last-resort survival response.", [5, 70, 30, 60, 95]]];
const GA = [["Glycogen stores", "var(--g-carb)"], ["Gluconeogenesis", "linear-gradient(90deg,#0a84ff,#06b6d4)"], ["Fat breakdown", "var(--g-atp)"], ["Ketones", "var(--g-fat)"], ["Protein breakdown", "var(--g-pro)"]];

const s3 = [
  videoTile("s3-video", "6407646058112", "Bringing It All Together", "rgba(22,163,74,.55)", "rgba(6,182,212,.45)"),

  { id: "s3-fuel", title: "Integration of metabolism", cls: "dark center",
    html: () => `<p class="eyebrow">Integration of metabolism</p><h2 class="h-lg">Three fuels.<br><span class="grad">One energy hub.</span></h2>
      <p class="body">Each nutrient has its own pathway, but all meet at <b>acetyl-CoA</b> and the <b>citric acid cycle</b>. Send one in.</p>
      <div class="fig"><svg viewBox="0 0 360 320" data-map aria-hidden="true">
        <path id="fC" d="M62 46 V112 C62 150 120 170 166 182" stroke="#ff8a00" stroke-width="4" fill="none" opacity=".35"/>
        <path id="fF" d="M180 46 V168" stroke="#a855f7" stroke-width="4" fill="none" opacity=".35"/>
        <path id="fP" d="M298 46 V112 C298 150 240 170 194 182" stroke="#f43f5e" stroke-width="4" fill="none" opacity=".35"/>
        <path id="fP2" d="M298 112 H86" stroke="#f43f5e" stroke-width="2.5" fill="none" stroke-dasharray="4 6" opacity=".5"/>
        <path id="fPy" d="M62 126 C62 150 120 170 166 182" fill="none"/>
        <path id="fP3" d="M298 112 C320 200 260 262 222 262" stroke="#f43f5e" stroke-width="2.5" fill="none" stroke-dasharray="4 6" opacity=".5"/>
        <path id="fK" d="M180 206 V226" stroke="#fff" stroke-width="4" fill="none" opacity=".3"/>
        ${[[22, "#ff8a00", "Carbs"], [140, "#a855f7", "Fats"], [258, "#f43f5e", "Protein"]].map(([x, c, t]) => `<rect x="${x}" y="14" width="80" height="34" rx="17" fill="${c}"/><text x="${x + 40}" y="36" text-anchor="middle" fill="#fff" font-family="-apple-system,Inter,sans-serif" font-weight="600" font-size="13">${t}</text>`).join("")}
        <rect x="8" y="96" width="108" height="30" rx="15" fill="#1d1d1f" stroke="#ff8a00" stroke-width="1.5"/><text x="62" y="115" text-anchor="middle" class="svgt" font-size="11">Glucose → pyruvate</text>
        <rect x="132" y="80" width="96" height="30" rx="15" fill="#1d1d1f" stroke="#a855f7" stroke-width="1.5"/><text x="180" y="99" text-anchor="middle" class="svgt" font-size="11">Fatty acids</text>
        <rect x="258" y="96" width="80" height="30" rx="15" fill="#1d1d1f" stroke="#f43f5e" stroke-width="1.5"/><text x="298" y="115" text-anchor="middle" class="svgt" font-size="11">Amino acids</text>
        <g data-hub><rect x="128" y="168" width="104" height="38" rx="19" fill="#0a84ff"/><text x="180" y="192" text-anchor="middle" fill="#fff" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="14">Acetyl-CoA</text></g>
        <g transform="translate(180 268)"><circle r="40" fill="#1d1d1f"/><g data-cyc style="transform-box:fill-box;transform-origin:center"><circle r="40" fill="none" stroke="#f43f5e" stroke-width="4" stroke-dasharray="54 9"/></g><text y="-3" text-anchor="middle" class="svgt" font-size="11">Citric acid</text><text y="11" text-anchor="middle" class="svgt" font-size="11">cycle</text></g>
        <path d="M222 268 H270" stroke="#ffc700" stroke-width="4"/>
        <g transform="translate(300 268)" data-sun><circle r="26" fill="#ffc700"/><text y="5" text-anchor="middle" font-family="-apple-system,Inter,sans-serif" font-weight="700" font-size="14" fill="#1d1d1f">ATP</text></g>
        <g data-parts></g>
      </svg></div>
      <div class="fuel"><button data-f="C" style="background:#ff8a00">Send carbs</button><button data-f="F" style="background:#a855f7">Send fats</button><button data-f="P" style="background:#f43f5e">Send protein</button></div>
      <div class="atpc">ATP made<b class="grad" style="--acc:var(--g-atp)" data-atp>0</b></div>
      <p class="cap" aria-live="polite">This shared pathway gives your body <b>metabolic flexibility</b>.</p>`,
    enter(el, api) {
      const svg = $("[data-map]", el), parts = $("[data-parts]", el), cyc = $("[data-cyc]", el); let atp = 0, rot = 0; const used = new Set();
      const P = id => $("#" + id, svg);
      const ride = (path, color, dur) => new Promise(res => {
        const len = path.getTotalLength(), n = document.createElementNS(NS, "circle"); n.setAttribute("r", 7); n.setAttribute("fill", color); n.setAttribute("stroke", "#fff"); n.setAttribute("stroke-width", 2); parts.appendChild(n);
        const t0 = performance.now();
        (function f(t) { const p = Math.min(1, (t - t0) / (reduce ? 1 : dur)), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pt = path.getPointAtLength(len * e); n.setAttribute("transform", `translate(${pt.x} ${pt.y})`); p < 1 ? requestAnimationFrame(f) : (n.remove(), res()); })(t0);
      });
      const spin = async () => { rot += 360; cyc.style.transition = "transform 1.2s cubic-bezier(.16,1,.3,1)"; cyc.style.transform = `rotate(${rot}deg)`; await sleep(reduce ? 0 : 900); atp++; $("[data-atp]", el).textContent = atp; api.sfx("spark"); $("[data-sun]", el).animate([{ opacity: 1 }, { opacity: .5 }, { opacity: 1 }], { duration: 400 }); };
      const caps = { C: "Carbs: glucose → pyruvate → <b>acetyl-CoA</b>.", F: "Fats: fatty acids are clipped into <b>acetyl-CoA</b>.", P: "Protein: amino acids have <b>multiple entry points</b>: pyruvate, acetyl-CoA or straight into the cycle." };
      $$(".fuel button", el).forEach(b => b.addEventListener("click", async () => {
        const f = b.dataset.f; used.add(f); api.sfx("whoosh"); const cap = $(".cap", el); cap.innerHTML = caps[f]; refade(cap);
        if (f === "C") await ride(P("fC"), "#ff8a00", 1200);
        if (f === "F") await ride(P("fF"), "#ffc700", 900);
        if (f === "P") { const k = Math.floor(Math.random() * 3);
          if (k === 0) await ride(P("fP"), "#f43f5e", 1200);
          else if (k === 1) { await ride(P("fP2"), "#f43f5e", 900); await ride(P("fPy"), "#f43f5e", 600); }
          else { await ride(P("fP3"), "#f43f5e", 1300); await spin(); if (used.size === 3) api.interacted("s3-fuel"); return; } }
        await ride(P("fK"), "#0a84ff", 350); await spin();
        if (used.size === 3) { cap.innerHTML = "All three fuels reach the same hub. That's <b>metabolic flexibility</b>."; api.interacted("s3-fuel"); }
      }));
    } },

  { id: "s3-fasting", title: "Fasting and starvation",
    html: () => `<p class="eyebrow">Adaptability & survival</p><h2 class="h-lg">When food runs out.</h2>
      <p class="body">Drag the timeline. Watch your body <b>switch fuels</b> to protect the brain and spare muscle.</p>
      <input type="range" min="0" max="4" step="1" value="0" aria-label="Time without food" style="--rt:linear-gradient(90deg,#16a34a,#ffc700,#f43f5e)">
      <div class="ticks"><span>Fed</span><span>Hours</span><span>Overnight</span><span>Days</span><span>Starving</span></div>
      <div class="phase fade" data-name></div><p class="cap fade" data-desc style="margin-top:6px"></p>
      <div class="gauges">${GA.map(g => `<div class="gauge"><span>${g[0]}</span><span class="t"><i style="background:${g[1]}"></i></span></div>`).join("")}</div>
      <p class="small" style="margin-top:14px">Bars show the direction of change, not exact measurements.</p>`,
    enter(el, api) {
      const r = $("input", el); let last = -1;
      const upd = () => { const i = +r.value; if (i === last) return; if (last >= 0) api.sfx(i > last ? "fall" : "rise"); last = i;
        const n = $("[data-name]", el), d = $("[data-desc]", el); n.textContent = PH[i][0]; d.textContent = PH[i][1]; refade(n); refade(d);
        $$(".gauge i", el).forEach((b, k) => b.style.width = PH[i][2][k] + "%"); if (i === 4) api.interacted("s3-fasting"); };
      r.addEventListener("input", upd); setTimeout(upd, 100);
    } },

  { id: "s3-cells", title: "How fat cells grow", cls: "center",
    html: () => `<p class="eyebrow">Energy balance</p><h2 class="h-lg">Fat cells grow two ways.</h2>
      <div class="fig" style="display:flex;justify-content:center;gap:clamp(20px,8vw,80px)">
        <div><svg viewBox="0 0 140 120" width="150" data-hyper aria-hidden="true"></svg><p class="h-sm" style="margin-top:8px">More cells</p><p class="small">Hyperplasia</p></div>
        <div><svg viewBox="0 0 140 120" width="150" aria-hidden="true"><circle cx="70" cy="60" r="18" fill="#ffc700"><animate attributeName="r" values="18;46;46;18" keyTimes="0;.45;.85;1" dur="4s" repeatCount="indefinite"/></circle></svg><p class="h-sm" style="margin-top:8px">Bigger cells</p><p class="small">Hypertrophy</p></div>
      </div>
      <p class="body" style="margin-top:28px">Fat cell <b>number rises mostly in late childhood and early puberty</b>, then stays fairly fixed. Adults mainly gain fat as cells get bigger. That's why childhood matters, and why simple habits like <b>reading food labels</b> help.</p>`,
    enter(el) {
      const svg = $("[data-hyper]", el), pos = [[70, 60], [40, 40], [100, 40], [40, 82], [100, 82], [70, 22], [70, 98]]; let n = 1;
      const draw = () => svg.innerHTML = pos.slice(0, n).map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="16" fill="#ffc700" style="${i === n - 1 ? "animation:pop .4s cubic-bezier(.34,1.56,.64,1) both;transform-box:fill-box;transform-origin:center" : ""}"/>`).join("");
      draw(); const t = setInterval(() => { n = n >= pos.length ? 1 : n + 1; draw(); }, 650); return () => clearInterval(t);
    } },

  { id: "s3-take", title: "Key takeaways", bare: true,
    html: () => `<div class="take">
      <div class="tile reveal"><div class="big grad" style="--acc:var(--g-carb)">Food is fuel.</div><p>Rice, egg and oil become glucose, amino acids and fatty acids. Each is metabolised differently, but all can become energy.</p></div>
      <div class="tile dark reveal"><div class="big grad" style="--acc:var(--g-atp)">Balance decides.</div><p>Stored or burned comes down to calories in vs calories out, and your body manages that balance constantly.</p></div>
      <div class="tile reveal"><div class="big grad" style="--acc:var(--g-all)">Your body adapts.</div><p>The pathways are connected. When one fuel runs low, your body shifts to another, fed or fasting.</p></div>
    </div>` },

  nextTile("s3-end", "You're ready.", "The knowledge check is unlocked. Answer the 4 questions to complete the module.", "Take the knowledge check")
];

window.SECTIONS = [
  { id: "s1", n: 1, name: "Carbohydrates.", title: "Introduction and Carbohydrate Metabolism", nav: "Carbohydrates", sub: "From the rice on your plate to energy in every cell.", acc: "var(--g-carb)", accs: "#f2581f", c: ["#ff8a00", "#ff3d6e"], tiles: s1 },
  { id: "s2", n: 2, name: "Fats & protein.", title: "Lipid and Protein Metabolism", nav: "Lipids & protein", sub: "How fat is burned and stored, and how protein is broken down and rebuilt.", acc: "var(--g-fat)", accs: "#9333ea", c: ["#a855f7", "#ec4899"], tiles: s2 },
  { id: "s3", n: 3, name: "All together.", title: "Bringing It All Together", nav: "All together", sub: "One energy hub, and a body that adapts when food runs low.", acc: "var(--g-all)", accs: "#0f9f6e", c: ["#16a34a", "#06b6d4"], tiles: s3 }
];
})();
