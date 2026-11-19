/* ===== Course shell — Apple-style pages, 2.5D figures, progress, quiz ===== */
(function () {
const app = document.getElementById("app");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const PN = ["assets/docs/Module_6_Pocket_Notes.jpg"];
window.PN_SRC = PN;
/* PDF slides: path to the PDF in assets/docs. Leave empty to show "coming soon". */
const PDF_PATH = "assets/docs/Module_6_Nutrition_and_Health_Trends_Slides.pdf";
const PDF_FILE = PDF_PATH ? "Module_6_Nutrition_and_Health_Trends_Slides.pdf" : "";
/* Amway+ link for the PDF slides: paste the link between the quotes below. Leave empty to show "link coming soon". */
const AMWAY_PLUS_URL = "https://ap.click.amway.com/CtiZiK4a";
const QUIZ = [
  { id: "energy-out", prompt: "Which part of “calories out” uses the most energy each day?",
    options: [{ id: "a", text: "Exercise" }, { id: "b", text: "Digesting food" }, { id: "c", text: "Resting metabolism, the energy your body uses just to stay alive" }, { id: "d", text: "Fidgeting and everyday movement" }], answer: "c",
    explain: "Resting metabolic rate (RMR) uses about 60–70% of daily energy. Digesting food uses about 5–15%, and physical activity, including exercise and everyday movement, about 10–20%." },
  { id: "hand-portion", prompt: "Using your hand as a portion guide, how much cooked rice or noodles is one portion per meal?",
    options: [{ id: "a", text: "One palm" }, { id: "b", text: "One fist" }, { id: "c", text: "Two cupped hands" }, { id: "d", text: "One thumb" }], answer: "b",
    explain: "A fist is one portion of carbs like cooked rice or noodles. A palm is protein, two cupped hands are vegetables, and a thumb is fats like oil or butter." },
  { id: "sleep", prompt: "Why can poor sleep lead to weight gain?",
    options: [{ id: "a", text: "Ghrelin (hunger hormone) rises and leptin (fullness hormone) falls, so we eat more" }, { id: "b", text: "Sleep burns most of the day's calories" }, { id: "c", text: "Poor sleep slows digestion so food stays longer in the gut" }, { id: "d", text: "It doesn't; sleep has no link to weight" }], answer: "a",
    explain: "Sleep disturbance raises ghrelin and lowers leptin, which increases food intake. Tiredness also lowers physical activity. Together these contribute to weight gain." },
  { id: "prebiotic", prompt: "Which daily habit feeds your helpful gut bacteria directly?",
    options: [{ id: "a", text: "Eating prebiotic fibre at every meal, such as oats, legumes, onion and garlic" }, { id: "b", text: "Eating the same few foods every day" }, { id: "c", text: "Choosing more ultra-processed snacks" }, { id: "d", text: "Cutting out all plant foods" }], answer: "a",
    explain: "Prebiotic fibre feeds beneficial microbes, which make short-chain fatty acids (SCFAs) that support metabolic health. Aim for variety too: about 30 different plant foods a week." },
  { id: "omega3", prompt: "Which nutrient calms inflammation and keeps cell membranes healthy, and is found in ikan kembung and sardines?",
    options: [{ id: "a", text: "Vitamin D" }, { id: "b", text: "Omega-3 fatty acids" }, { id: "c", text: "Zinc" }, { id: "d", text: "Fibre" }], answer: "b",
    explain: "Omega-3 fatty acids calm inflammation and keep cell membranes healthy. Find them in ikan kembung, sardines, salmon, walnuts and flaxseed." }
];

/* ---------- state ---------- */
let S = { seen: {}, done: {}, quiz: { last: null, passed: false }, completedSent: false };
const TOTAL = SECTIONS.reduce((n, s) => n + s.tiles.length, 0) + 1;
const save = () => XAPI.saveState(S);
const pct = () => Math.min(100, Math.round((SECTIONS.reduce((n, s) => n + (S.seen[s.id] || []).length, 0) + (S.quiz.passed ? 1 : 0)) / TOTAL * 100));
function paintRing() { if ($("#menuList").childElementCount) nav(CUR); const p = pct(); $("#ringFg").style.strokeDashoffset = 87.96 * (1 - p / 100); $("#ringText").textContent = p + "%"; }
const allDone = () => true;   /* knowledge check is open any time (user: no need to finish all lessons first) */

/* ---------- helpers ---------- */
let toastT; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400); }
function confetti() {
  if (reduce) return; const c = document.createElement("div"); c.className = "confetti";
  const cols = ["#ff8a00", "#ff3d6e", "#a855f7", "#0a84ff", "#16a34a", "#ffc700"];
  for (let i = 0; i < 60; i++) { const p = document.createElement("i"); p.style.left = Math.random() * 100 + "vw"; p.style.background = cols[i % 6];
    p.style.setProperty("--dx", (Math.random() * 200 - 100) + "px"); p.style.setProperty("--rot", Math.random() * 900 + "deg");
    p.style.animationDuration = 1.8 + Math.random() * 1.5 + "s"; p.style.animationDelay = Math.random() * .4 + "s"; c.appendChild(p); }
  document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
}
const once = new Set();
const api = { sfx: n => SFX.play(n), confetti, played: (i, t) => XAPI.played(i, t), interacted: k => { if (!once.has(k)) { once.add(k); XAPI.interacted(k, k); } } };
let cleanups = [];
function setView(html) {
  cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = [];
  app.innerHTML = html; app.focus({ preventScroll: true }); window.scrollTo(0, 0);
}
const setAcc = sec => { const r = document.documentElement.style; if (sec) { r.setProperty("--acc", sec.acc); r.setProperty("--accs", sec.accs); } else { r.removeProperty("--acc"); r.removeProperty("--accs"); } };

/* ---------- 2.5D: shade flat SVG shapes with gloss + depth ---------- */
const SHADE = new Set(["circle", "ellipse", "polygon", "rect", "path"]);
function shadeNode(n) {
  if (n.nodeType !== 1 || !SHADE.has(n.localName) || n.dataset.ov || n._ov || n.closest("defs")) return;
  const fill = n.getAttribute("fill") || "";
  if (!fill || fill === "none" || fill.startsWith("url") || fill === "#fff" || fill === "#1d1d1f") return;
  if (n.localName === "rect" && +n.getAttribute("height") < 10) return;
  const o = n.cloneNode(true); o.removeAttribute("id"); o.removeAttribute("class"); o.dataset.ov = 1;
  o.setAttribute("fill", `url(#${/circle|ellipse/.test(n.localName) ? "gl-sph" : "gl-lin"})`);
  o.setAttribute("stroke", "none"); o.style.pointerEvents = "none"; o.style.animation = n.style.animation;
  n.after(o); n._ov = o;
}
function shade(svg) {
  svg.querySelectorAll("circle,ellipse,polygon,rect,path").forEach(shadeNode);
  const mo = new MutationObserver(ms => ms.forEach(m => {
    m.removedNodes.forEach(r => { if (r._ov) r._ov.remove(); });
    m.addedNodes.forEach(a => { if (a.nodeType !== 1) return; if (SHADE.has(a.localName)) shadeNode(a); else a.querySelectorAll && a.querySelectorAll("circle,ellipse,polygon,rect,path").forEach(shadeNode); });
  }));
  mo.observe(svg, { childList: true, subtree: true }); cleanups.push(() => mo.disconnect());
}
/* figures tilt in perspective with scroll, and follow the pointer */
function tilt(root) {
  const figs = $$(".fig", root);
  if (reduce || !figs.length) return;
  let raf = 0;
  const upd = () => { raf = 0; const vh = innerHeight;
    figs.forEach(f => { const r = f.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh; f.style.setProperty("--rx", Math.max(-14, Math.min(22, c * 26)).toFixed(2) + "deg"); }); };
  const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
  addEventListener("scroll", on, { passive: true }); addEventListener("resize", on); upd();
  cleanups.push(() => { removeEventListener("scroll", on); removeEventListener("resize", on); });
  figs.forEach(f => {
    f.addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const r = f.getBoundingClientRect(); f.style.setProperty("--ry", (((e.clientX - r.left) / r.width - .5) * 14).toFixed(2) + "deg"); });
    f.addEventListener("pointerleave", () => f.style.setProperty("--ry", "0deg"));
  });
}

/* ---------- global nav ---------- */
let CUR = null;
const M_IC = {
  home: `<svg viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z" fill="#fff"/></svg>`,
  notes: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="M9 8h6M9 12h6M9 16h4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  quiz: `<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};
function nav(cur) {
  CUR = cur;
  const item = (key, ic, bg, title, sub, st = "", cls = "") => `<button class="mi ${cls}" data-j="${key}" ${cur === key ? 'aria-current="page"' : ""}><span class="ic" style="background:${bg}">${ic}</span><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="st${st === "Done" ? " ok" : ""}">${st}</span></button>`;
  $("#menuList").innerHTML =
    item("home", M_IC.home, "linear-gradient(135deg,#636366,#1d1d1f)", "Home", "Course start") + '<div class="mi-sep"></div>' +
    SECTIONS.map(s => { const n = (S.seen[s.id] || []).length, p = Math.min(100, Math.round(n / s.tiles.length * 100));
      return item(s.id, s.n, `linear-gradient(135deg,${s.c[0]},${s.c[1]})`, s.nav, "Lesson " + s.n, S.done[s.id] ? "Done" : p ? p + "%" : ""); }).join("") + '<div class="mi-sep"></div>' +
    item("notes", M_IC.notes, "linear-gradient(135deg,#0a84ff,#5e5ce6)", "Pocket notes and PDF slides", "") +
    item("quiz", M_IC.quiz, allDone() ? "linear-gradient(135deg,#16a34a,#06b6d4)" : "#86868b", "Knowledge check", allDone() ? "" : `After all ${SECTIONS.length} lessons`, S.quiz.passed ? "Done" : "", allDone() ? "" : "locked");
  $$("#menuList .mi").forEach(b => b.addEventListener("click", () => { SFX.play("tap"); menu(false); go(b.dataset.j); }));
}
function menu(open) {
  const m = $("#menu"), sc = $("#scrim"), b = $("#toJump");
  if (open === undefined) open = m.hidden;
  m.hidden = !open; sc.hidden = !open; b.setAttribute("aria-expanded", open);
  if (open) { SFX.play("pop"); const c = m.querySelector('[aria-current="page"]') || m.querySelector(".mi"); c && c.focus({ preventScroll: true }); }
}
function go(t) { if (t === "home") return home(); if (t === "notes") notes(); else if (t === "quiz") { if (allDone()) quiz(); else { SFX.play("wrong"); toast(`Finish all ${SECTIONS.length} lessons to unlock the knowledge check.`); } } else if (t === "home") home(); else section(t); }

/* ---------- home ---------- */
const PLATE_ART = `<svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="62" fill="#e5e7eb"/><path d="M80 80V26a54 54 0 0 0 0 108z" fill="#22c55e"/><path d="M80 80V26a54 54 0 0 1 54 54z" fill="#f59e0b"/><path d="M80 80h54a54 54 0 0 1-54 54z" fill="#f43f5e"/></svg>`;
function home() {
  setAcc(null); nav(null);
  const card = (s, dark) => { const seen = (S.seen[s.id] || []).length, p = Math.round(seen / s.tiles.length * 100);
    return `<button class="btile c2${dark ? " dark" : ""}${s.n > 3 ? " wide" : ""}" data-go="${s.id}" style="--acc:${s.acc}">
      <p class="eyebrow" style="color:${s.accs}">Lesson ${s.n}</p><h3 class="h-md grad">${s.name}</h3><p class="body" style="font-size:17px;margin-top:8px">${s.sub}</p>
      <span class="meta">${S.done[s.id] ? "Completed" : p ? p + "% done" : "Start"}<span class="track"><i style="width:${p}%"></i></span></span>
      <span class="art">${s.photo ? `<span class="art-photo"><img src="${IMG[s.photo]}" alt="" draggable="false"></span>` : (s.art || PLATE_ART)}</span></button>`; };
  setView(`
    <section class="hero">
      <p class="eyebrow">Module 6</p>
      <h1 class="h-xl">Nutrition and Health Trends.</h1>
      <p class="sub">Weight, gut and cells. What the science says now.</p>
      <div class="ctas"><button class="pill" data-go="s1">Start course</button><button class="more" data-go="notes">Pocket notes and PDF slides</button></div>
      <div class="hero-art"><img src="assets/img/cover.webp" srcset="assets/img/cover-sm.webp 760w, assets/img/cover.webp 1400w" sizes="(max-width:760px) 100vw, 1100px" alt="A smiling woman in a hijab eating a healthy salad bowl, with fruit, oats, nuts, a water bottle and a yoga mat"></div>
    </section>
    <section class="hl">
      <h2 class="h-lg">Three short lessons.<br><span style="color:var(--ink2)">About 8 minutes.</span></h2>
      <div class="bento">
        ${SECTIONS.map((s, n) => card(s, n === 1 || n === 3)).join("")}
        <button class="btile small c3" data-go="notes"><svg viewBox="0 0 52 52"><rect x="8" y="4" width="36" height="44" rx="8" fill="#0a84ff"/><path d="M16 18h20M16 26h20M16 34h12" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg><span><h3 class="h-sm">Pocket notes and PDF slides</h3><span class="more" style="min-height:0;font-size:15px">View notes, download slides</span></span></button>
        <button class="btile small c3${allDone() ? "" : " locked"}" data-go="quiz"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="${allDone() ? "#16a34a" : "#86868b"}"/><path d="M16 27l7 7 13-15" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span><h3 class="h-sm">Knowledge check</h3><span class="small" style="font-size:14px">${S.quiz.passed ? `Done · ${S.quiz.last}% · Try again anytime` : allDone() ? `${QUIZ.length} questions` : `Unlocks after all ${SECTIONS.length} lessons`}</span></span></button>
      </div>
    </section>`);
  $$("[data-go]").forEach(b => b.addEventListener("click", () => { SFX.play("tap"); go(b.dataset.go); }));
  requestAnimationFrame(() => setTimeout(() => { const h = $(".hero-art"); if (h) h.classList.add("in"); }, 60));
  $$(".btile .art svg").forEach(shade);
}

/* ---------- section page ---------- */
function section(id, at) {
  const sec = SECTIONS.find(s => s.id === id), k = SECTIONS.indexOf(sec), list = sec.tiles;
  setAcc(sec); nav(id);
  S.seen[id] = S.seen[id] || []; S.pos = S.pos || {};
  let i = at != null ? at : Math.min(S.pos[id] || 0, list.length - 1), cur = null, slideClean = null, busy = false;
  setView(`
    <div class="pager" style="--c1:${sec.c[0]};--c2:${sec.c[1]}">
      <header class="phead"><div class="pt"><b class="grad">${sec.name.replace(".", "")}</b><span id="pcount"></span></div><i class="lbar" id="lbar"></i></header>
      <div class="stage" id="stage" aria-live="polite"></div>
      <nav class="pnav" aria-label="Lesson navigation">
        <button class="pback" id="pback" aria-label="Previous screen"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div class="pdots" id="pdots">${list.map((t, n) => `<button aria-label="Screen ${n + 1}: ${t.title}" data-n="${n}"></button>`).join("")}</div>
        <button class="pill pnext" id="pnext"></button>
      </nav>
    </div>`);
  document.body.classList.add("pager-on");
  const stage = $("#stage"), back = $("#pback"), next = $("#pnext");
  const last = SECTIONS.length - 1, finish = () => { if (k < last) section(SECTIONS[k + 1].id, 0); else go("quiz"); };
  function show(n, dir) {
    if (busy || n < 0 || n >= list.length) return;
    if (slideClean) { try { slideClean(); } catch (e) {} slideClean = null; }
    i = n; const t = list[i];
    const el = document.createElement("article");
    el.className = "tile slide " + (t.cls || "") + (t.bare ? " bare-slide" : "");
    el.dataset.id = t.id; el.setAttribute("aria-label", t.title);
    el.innerHTML = `<div class="slide-in">${t.bare ? `<p class="eyebrow">Key takeaways</p><h2 class="h-md" style="margin-bottom:16px">Three ideas to remember.</h2>` : ""}${t.html()}</div>`;
    stage.appendChild(el);
    const old = cur; cur = el;
    if (old && !reduce && dir) {
      busy = true;
      old.animate([{ transform: "none", opacity: 1 }, { transform: `translateX(${-dir * 30}%) rotateY(${dir * 22}deg) scale(.92)`, opacity: 0 }], { duration: 420, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }).onfinish = () => old.remove();
      el.animate([{ transform: `translateX(${dir * 34}%) rotateY(${-dir * 22}deg) scale(.92)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" }).onfinish = () => { busy = false; };
    } else if (old) old.remove();
    $$(".fig svg, .check", el).forEach(shade); tilt(el);
    if (t.enter) { const c = t.enter(el, api); if (typeof c === "function") slideClean = c; }
    $$("[data-act]", el).forEach(b => b.addEventListener("click", () => { SFX.play("tap"); b.dataset.act === "home" ? home() : finish(); }));
    if (!S.seen[id].includes(t.id)) { S.seen[id].push(t.id); XAPI.experienced(t.id, t.title); }
    const isEnd = !!t.end || i === list.length - 1;
    if (isEnd && !S.done[id]) { S.done[id] = true; XAPI.sectionCompleted(sec.id, sec.title); }
    S.pos[id] = i;
    $("#pcount").textContent = `${i + 1} of ${list.length}`;
    $("#lbar").style.width = (i + 1) / list.length * 100 + "%";
    $$("#pdots button").forEach((d, m) => { d.toggleAttribute("aria-current", m === i); d.classList.toggle("seen", S.seen[id].includes(list[m].id)); });
    back.disabled = i === 0;
    next.textContent = isEnd ? (k < last ? "Next lesson" : "Knowledge check") : "Next";
    paintRing(); save();
  }
  back.addEventListener("click", () => { if (i > 0) { SFX.play("whoosh"); show(i - 1, -1); } });
  next.addEventListener("click", () => { if (list[i].end || i === list.length - 1) { SFX.play("tap"); finish(); } else { SFX.play("whoosh"); show(i + 1, 1); } });
  $$("#pdots button").forEach(d => d.addEventListener("click", () => { const n = +d.dataset.n; if (n !== i) { SFX.play("whoosh"); show(n, n > i ? 1 : -1); } }));
  /* swipe left / right */
  let sx = 0, sy = 0, st = 0;
  stage.addEventListener("touchstart", e => { if (e.target.closest("input[type=range],.seg")) { st = 0; return; } const p = e.touches[0]; sx = p.clientX; sy = p.clientY; st = Date.now(); }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (!st) return; const p = e.changedTouches[0], dx = p.clientX - sx, dy = p.clientY - sy; st = 0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) { if (dx < 0 && i < list.length - 1) next.click(); else if (dx > 0) back.click(); }
  }, { passive: true });
  const key = e => { if (e.target.closest("input,textarea") || !$("#menu").hidden) return; if (e.key === "ArrowRight") next.click(); if (e.key === "ArrowLeft") back.click(); };
  addEventListener("keydown", key);
  cleanups.push(() => { removeEventListener("keydown", key); if (slideClean) slideClean(); document.body.classList.remove("pager-on"); });
  show(i, 0);
}

/* ---------- notes ---------- */
function notes() {
  setAcc(null); nav("notes");
  const pdfBtn = PDF_FILE
    ? (window.LINK_OUT ? (AMWAY_PLUS_URL ? `<a class="pill" href="${AMWAY_PLUS_URL}" target="_blank" rel="noopener" data-dl="slides">Open PDF slides</a>` : `<button class="pill" disabled>PDF slides coming soon</button>`)
      : `<a class="pill" href="${PDF_PATH}" download="${PDF_FILE}" data-dl="slides">Download PDF slides</a>`)
    : `<button class="pill" disabled aria-disabled="true">PDF slides coming soon</button>`;
  setView(`
    <section class="notes-head"><p class="eyebrow" style="color:var(--blue)">Pocket notes and PDF slides</p><h1 class="h-lg">The whole module.<br>On one page.</h1>
      <div class="ctas">${pdfBtn}</div>
      <p class="small" style="margin-top:12px">${PDF_FILE ? "Slides: 48 slides · PDF · 2.7 MB." : "The PDF slides will be available here soon."} Tap the pocket notes to zoom in.</p>
      <div class="aplus">
        <p><b>Using Amway+?</b> If the PDF won't download, copy this link and open it in your usual browser (like Chrome or Safari).</p>
        <div class="aplus-row">
          <input type="text" readonly id="aplusUrl" aria-label="Link to the PDF slides" value="${AMWAY_PLUS_URL || "Link coming soon"}" ${AMWAY_PLUS_URL ? "" : "disabled"}>
          <button class="aplus-btn" id="aplusCopy" ${AMWAY_PLUS_URL ? "" : "disabled"}>Copy link</button>
        </div>
      </div></section>
    <div class="pages">
      ${PN.map((src, n) => `<figure class="page-fig"><button class="notes-img" data-zoom="${n}" aria-label="Zoom pocket notes page ${n + 1}" oncontextmenu="return false"><img draggable="false" src="${src}" alt="Module 6 pocket notes: key takeaways for weight management, gut health and cellular health" loading="lazy"></button><figcaption>Page ${n + 1} of ${PN.length}</figcaption></figure>`).join("")}
    </div>
    <div class="zoom" role="dialog" aria-label="Pocket notes, zoomed"><button class="x" aria-label="Close"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 5l14 14M19 5L5 19" stroke="#1d1d1f" stroke-width="2.4" stroke-linecap="round"/></svg></button><div class="zoom-tabs" role="tablist">${PN.map((_, n) => `<button role="tab" data-zp="${n}">Page ${n + 1}</button>`).join("")}</div><img draggable="false" oncontextmenu="return false" alt="" id="zoomImg"></div>`);
  $$("[data-dl]").forEach(a => a.addEventListener("click", () => { SFX.play("pop"); XAPI.downloaded(a.dataset.dl, a.textContent); }));
  const cp = $("#aplusCopy"), inp = $("#aplusUrl");
  cp.addEventListener("click", async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(AMWAY_PLUS_URL); ok = true; } catch (e) {}
    if (!ok) { try { inp.disabled = false; inp.select(); inp.setSelectionRange(0, 9999); ok = document.execCommand("copy"); } catch (e) {} }
    SFX.play(ok ? "correct" : "wrong");
    cp.textContent = ok ? "Copied ✓" : "Copy failed";
    toast(ok ? "Link copied. Paste it into Chrome or Safari." : "Couldn't copy. Press and hold the link to copy it.");
    if (ok) XAPI.interacted("amway-plus-link", "Copied Amway+ PDF link");
    setTimeout(() => cp.textContent = "Copy link", 2200);
  });
  inp.addEventListener("focus", () => inp.select());
  const z = $(".zoom"), zi = $("#zoomImg");
  const page = n => { zi.src = PN[n]; $$("[data-zp]", z).forEach(b => b.setAttribute("aria-selected", +b.dataset.zp === n)); z.scrollTop = 0; };
  $$("[data-zoom]").forEach(b => b.addEventListener("click", () => { SFX.play("pop"); page(+b.dataset.zoom); z.classList.add("open"); document.body.style.overflow = "hidden"; XAPI.interacted("pocket-notes-p" + (+b.dataset.zoom + 1), "Zoomed pocket notes page"); }));
  $$("[data-zp]", z).forEach(b => b.addEventListener("click", () => { SFX.play("tap"); page(+b.dataset.zp); }));
  $(".x", z).addEventListener("click", () => { SFX.play("tap"); z.classList.remove("open"); document.body.style.overflow = ""; });
  cleanups.push(() => document.body.style.overflow = "");
}

/* ---------- quiz ---------- */
function quiz() {
  setAcc(null); nav("quiz");
  let qi = 0, score = 0;
  function render() {
    const q = QUIZ[qi];
    setView(`<div class="quiz"><p class="eyebrow" style="color:var(--blue)">Knowledge check</p><h1 class="h-lg">Let's see what stuck.</h1>
      <div class="qprog">${QUIZ.map((_, k) => `<i class="${k <= qi ? "on" : ""}"></i>`).join("")}</div>
      <div class="qcard fade"><p class="qmeta">Question ${qi + 1} of ${QUIZ.length}</p><h2>${q.prompt}${q.statement ? `<em>“${q.statement}”</em>` : ""}</h2>
        <div class="opts" role="radiogroup">${q.options.map((o, k) => `<button class="opt" role="radio" aria-checked="false" data-id="${o.id}"><span class="k">${"ABCD"[k]}</span>${o.text}</button>`).join("")}</div>
        <div data-ex></div><div class="qact"><button class="pill" data-check disabled>Check answer</button></div></div></div>`);
    let pick = null, checked = false;
    $$(".opt").forEach(o => o.addEventListener("click", () => { if (checked) return; SFX.play("tap"); pick = o.dataset.id; $$(".opt").forEach(x => x.setAttribute("aria-checked", x === o)); $("[data-check]").disabled = false; }));
    $("[data-check]").addEventListener("click", function () {
      if (!checked) { checked = true; const ok = pick === q.answer; if (ok) score++;
        $$(".opt").forEach(x => { x.disabled = true; if (x.dataset.id === q.answer) x.classList.add("right"); else if (x.dataset.id === pick) x.classList.add("wrong"); });
        SFX.play(ok ? "correct" : "wrong"); XAPI.answered(q, pick, ok);
        $("[data-ex]").innerHTML = `<div class="explain"><b>${ok ? "That's right." : "Not quite."}</b>${q.explain}</div>`;
        this.textContent = qi < QUIZ.length - 1 ? "Next question" : "See my result";
      } else { SFX.play("whoosh"); qi++; qi < QUIZ.length ? render() : result(); }
    });
  }
  function result() {
    const p = Math.round(score / QUIZ.length * 100); XAPI.quizResult(score, QUIZ.length);
    S.quiz.last = p; S.quiz.passed = true;
    if (!S.completedSent) { XAPI.completed(score, QUIZ.length); S.completedSent = true; }
    paintRing(); save();
    setView(`<div class="quiz"><div class="qcard result fade">
      <div class="score grad" style="--acc:var(--g-all)"><span data-n>0</span>%</div>
      <h2 class="h-md" style="margin-top:10px">Module complete.</h2>
      <p class="body" style="margin:12px auto 0">You answered ${score} of ${QUIZ.length} correctly. You've completed Module 6: Nutrition and Health Trends.</p>
      <div class="ctas"><button class="pill" data-a="home">Back to course</button><button class="more" data-a="notes">Pocket notes and PDF slides</button><button class="more" data-a="retry">Try again</button></div></div></div>`);
    const n = $("[data-n]"), t0 = performance.now();
    (function f(t) { const q = Math.min(1, (t - t0) / 1300); n.textContent = Math.round(p * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(f); })(t0);
    setTimeout(() => { SFX.play("fanfare"); confetti(); }, 900);
    $$("[data-a]").forEach(b => b.addEventListener("click", () => { SFX.play("tap"); b.dataset.a === "retry" ? quiz() : go(b.dataset.a); }));
  }
  render();
}

/* ---------- chrome & boot ---------- */
const sb = $("#soundBtn");
const paintSound = () => { const m = SFX.isMuted(); sb.setAttribute("aria-pressed", m); sb.setAttribute("aria-label", m ? "Sound off" : "Sound on"); };
sb.addEventListener("click", () => { SFX.setMuted(!SFX.isMuted()); paintSound(); toast(SFX.isMuted() ? "Sound off" : "Sound on"); });
$("#toJump").addEventListener("click", () => menu());
$("#scrim").addEventListener("click", () => menu(false));
addEventListener("keydown", e => { if (e.key === "Escape" && !$("#menu").hidden) { menu(false); $("#toJump").focus(); } });
document.addEventListener("pointerdown", () => SFX.unlock(), { once: true });
let ended = false; const end = () => { if (ended) return; ended = true; XAPI.saveState(S); XAPI.terminated(); };
addEventListener("pagehide", end); addEventListener("beforeunload", end);
(async () => { paintSound(); const st = await XAPI.loadState(); if (st && typeof st === "object") { S = Object.assign(S, st); SECTIONS.forEach(s => { const ok = new Set(s.tiles.map(t => t.id)); S.seen[s.id] = (S.seen[s.id] || []).filter(x => ok.has(x)); if (!S.seen[s.id].length) delete S.seen[s.id]; }); } XAPI.initialized(!!st); paintRing(); home(); })();
})();
