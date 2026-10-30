/* ===== Course shell — Apple-style pages, 2.5D figures, progress, quiz ===== */
(function () {
const app = document.getElementById("app");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const PN = "assets/docs/Module_3_Pocket_Notes.jpg";
const QUIZ = [
  { id: "q1", prompt: "What is the process of breaking down glucose for quick energy called?",
    options: [{ id: "a", text: "Ketogenesis" }, { id: "b", text: "Glycogenesis" }, { id: "c", text: "Gluconeogenesis" }, { id: "d", text: "Glycolysis" }], answer: "d",
    explain: "Glycolysis is the breakdown of glucose into pyruvate to generate quick energy (ATP). Glycogenesis is making glycogen from glucose; gluconeogenesis is making new glucose from non-carb sources; ketogenesis is making ketone bodies from fat." },
  { id: "q2", prompt: "Where is glycogen mainly stored in the body?",
    options: [{ id: "a", text: "Blood" }, { id: "b", text: "Liver & muscle" }, { id: "c", text: "Fat tissue" }, { id: "d", text: "Brain" }], answer: "b",
    explain: "Glycogen is mainly stored in the liver (used to maintain blood glucose) and in skeletal muscle (used locally for muscle activity)." },
  { id: "q3", prompt: "When carbohydrate is very scarce, what fuels the brain as a backup?",
    options: [{ id: "a", text: "Amino acids" }, { id: "b", text: "Cholesterol" }, { id: "c", text: "Ketone bodies" }, { id: "d", text: "Fibre" }], answer: "c",
    explain: "When glucose is limited (e.g. during fasting or very low-carb intake), the liver produces ketone bodies from fat breakdown to help fuel the brain and spare glucose/protein." },
  { id: "q4", prompt: "Is this statement true or false?", statement: "Leftover amino acids can be used for energy or converted toward fat storage.",
    options: [{ id: "a", text: "True" }, { id: "b", text: "False" }], answer: "a",
    explain: "Excess amino acids cannot be stored in the body, so they are broken down and their carbon skeletons can be used for energy or converted into glucose or fatty acids and stored as fat when there is enough energy available. Therefore, the statement is true." }
];

/* ---------- state ---------- */
let S = { seen: {}, done: {}, quiz: { last: null, passed: false }, completedSent: false };
const TOTAL = SECTIONS.reduce((n, s) => n + s.tiles.length, 0) + 1;
const save = () => XAPI.saveState(S);
const pct = () => Math.min(100, Math.round((SECTIONS.reduce((n, s) => n + (S.seen[s.id] || []).length, 0) + (S.quiz.passed ? 1 : 0)) / TOTAL * 100));
function paintRing() { if ($("#menuList").childElementCount) nav(CUR); const p = pct(); $("#ringFg").style.strokeDashoffset = 87.96 * (1 - p / 100); $("#ringText").textContent = p + "%"; }
const allDone = () => SECTIONS.every(s => S.done[s.id]);

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
      return item(s.id, s.n, `linear-gradient(135deg,${s.c[0]},${s.c[1]})`, s.nav, "Section " + s.n, S.done[s.id] ? "Done" : p ? p + "%" : ""); }).join("") + '<div class="mi-sep"></div>' +
    item("notes", M_IC.notes, "linear-gradient(135deg,#0a84ff,#5e5ce6)", "Pocket notes and PDF slides", "") +
    item("quiz", M_IC.quiz, allDone() ? "linear-gradient(135deg,#16a34a,#06b6d4)" : "#86868b", "Knowledge check", allDone() ? "" : "After all 3 sections", S.quiz.passed ? "Done" : "", allDone() ? "" : "locked");
  $$("#menuList .mi").forEach(b => b.addEventListener("click", () => { SFX.play("tap"); menu(false); go(b.dataset.j); }));
}
function menu(open) {
  const m = $("#menu"), sc = $("#scrim"), b = $("#toJump");
  if (open === undefined) open = m.hidden;
  m.hidden = !open; sc.hidden = !open; b.setAttribute("aria-expanded", open);
  if (open) { SFX.play("pop"); const c = m.querySelector('[aria-current="page"]') || m.querySelector(".mi"); c && c.focus({ preventScroll: true }); }
}
function go(t) { if (t === "home") return home(); if (t === "notes") notes(); else if (t === "quiz") { if (allDone()) quiz(); else { SFX.play("wrong"); toast("Finish all 3 sections to unlock the knowledge check."); } } else if (t === "home") home(); else section(t); }

/* ---------- home ---------- */
const ART = {
  s1: `<svg viewBox="0 0 160 160"><polygon points="80,22 128,50 128,106 80,134 32,106 32,50" fill="#ff8a00"/><polygon points="80,52 104,66 104,94 80,108 56,94 56,66" fill="#ffc700"/></svg>`,
  s2: `<svg viewBox="0 0 160 160"><path d="M80 18c22 30 44 52 44 76a44 44 0 0 1-88 0c0-24 22-46 44-76z" fill="#a855f7"/><circle cx="64" cy="102" r="16" fill="#ec4899"/></svg>`,
  s3: `<svg viewBox="0 0 160 160"><circle cx="80" cy="44" r="22" fill="#ff8a00"/><circle cx="44" cy="106" r="22" fill="#a855f7"/><circle cx="116" cy="106" r="22" fill="#f43f5e"/><circle cx="80" cy="86" r="14" fill="#16a34a"/></svg>`
};
function home() {
  setAcc(null); nav(null);
  const next = SECTIONS.find(s => !S.done[s.id]), started = Object.keys(S.seen).length;
  const card = (s, cls, dark) => { const seen = (S.seen[s.id] || []).length, p = Math.round(seen / s.tiles.length * 100);
    return `<button class="btile ${cls}${dark ? " dark" : ""}" data-go="${s.id}" style="--acc:${s.acc}">
      <p class="eyebrow" style="color:${s.accs}">Section ${s.n}</p><h3 class="h-md grad">${s.name}</h3><p class="body" style="font-size:17px;margin-top:8px">${s.sub}</p>
      <span class="meta">${S.done[s.id] ? "Completed" : p ? p + "% done" : "Start"}<span class="track"><i style="width:${p}%"></i></span></span>
      <span class="art">${ART[s.id]}</span></button>`; };
  setView(`
    <section class="hero">
      <p class="eyebrow">Module 3</p>
      <h1 class="h-xl">Nutrients Utilisation in Human.</h1>
      <p class="sub">Metabolic pathways, made simple.</p>
      <div class="ctas"><button class="pill" data-go="s1">Start course</button><button class="more" data-go="notes">Pocket notes and PDF slides</button></div>
      <div class="hero-art"><img src="assets/img/cover.webp" srcset="assets/img/cover-sm.webp 760w, assets/img/cover.webp 1400w" sizes="(max-width:760px) 100vw, 1100px" alt="Illustration of a human body filled with healthy foods"></div>
    </section>
    <section class="hl">
      <h2 class="h-lg">Three short sections.<br><span style="color:var(--ink2)">One video each.</span></h2>
      <div class="bento">
        ${card(SECTIONS[0], "c2")}${card(SECTIONS[1], "c2", true)}${card(SECTIONS[2], "c2")}
        <button class="btile small c3" data-go="notes"><svg viewBox="0 0 52 52"><rect x="8" y="4" width="36" height="44" rx="8" fill="#0a84ff"/><path d="M16 18h20M16 26h20M16 34h12" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg><span><h3 class="h-sm">Pocket notes and PDF slides</h3><span class="more" style="min-height:0;font-size:15px">View notes, download slides</span></span></button>
        <button class="btile small c3${allDone() ? "" : " locked"}" data-go="quiz"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="${allDone() ? "#16a34a" : "#86868b"}"/><path d="M16 27l7 7 13-15" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span><h3 class="h-sm">Knowledge check</h3><span class="small" style="font-size:14px">${S.quiz.passed ? `Done · ${S.quiz.last}% · Try again anytime` : allDone() ? "4 questions" : "Unlocks after all 3 sections"}</span></span></button>
      </div>
    </section>`);
  $$("[data-go]").forEach(b => b.addEventListener("click", () => { SFX.play("tap"); go(b.dataset.go); }));
  requestAnimationFrame(() => setTimeout(() => { const h = $(".hero-art"); if (h) h.classList.add("in"); }, 60));
  $$(".btile .art svg").forEach(shade);
}

/* ---------- section page ---------- */
function section(id) {
  const sec = SECTIONS.find(s => s.id === id), k = SECTIONS.indexOf(sec);
  setAcc(sec); nav(id);
  const list = sec.tiles; let body = "";
  for (let i = 0; i < list.length; i++) {
    const t = list[i], tile = x => x.bare ? `<div data-id="${x.id}" class="bare">${x.html()}</div>` : `<article class="tile reveal ${x.cls || ""}" data-id="${x.id}" aria-label="${x.title}" style="--c1:${sec.c[0]};--c2:${sec.c[1]}">${x.html()}</article>`;
    if (t.pair && list[i + 1]) { body += `<div class="duo">${tile(t)}${tile(list[i + 1])}</div>`; i++; } else body += tile(t);
  }
  setView(`
    <div class="lnav"><div class="lnav-in"><h2>${sec.name.replace(".", "")}</h2><span class="count" id="lcount"></span><button class="pill sm" id="lnext">${k < 2 ? "Next section" : "Knowledge check"}</button></div><i class="lbar" id="lbar"></i></div>
    <section class="shero"><p class="eyebrow">Section ${sec.n} of 3</p><h1 class="h-xl grad">${sec.name}</h1><p class="body">${sec.sub}</p></section>
    <div class="page">${body}</div>`);
  S.seen[id] = S.seen[id] || [];
  const paintLocal = () => { const n = S.seen[id].length; $("#lcount").textContent = `${n} of ${list.length}`; $("#lbar").style.width = n / list.length * 100 + "%"; };
  const finish = () => { if (k < 2) section(SECTIONS[k + 1].id); else go("quiz"); };
  $("#lnext").addEventListener("click", () => { SFX.play("tap"); finish(); });
  $$(".fig svg, .check").forEach(shade);
  tilt(app);
  const byId = {}; list.forEach(t => byId[t.id] = t);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    el.classList.add("in"); $$(".reveal", el).forEach((r, i) => setTimeout(() => r.classList.add("in"), i * 120));
    const t = byId[el.dataset.id]; if (!t) return;
    if (t.enter) { const c = t.enter(el, api); if (typeof c === "function") cleanups.push(c); }
    $$("[data-act]", el).forEach(b => b.addEventListener("click", () => { SFX.play("tap"); b.dataset.act === "home" ? home() : finish(); }));
    if (!S.seen[id].includes(t.id)) { S.seen[id].push(t.id); XAPI.experienced(t.id, t.title); }
    if (t.end && !S.done[id]) { S.done[id] = true; XAPI.sectionCompleted(sec.id, sec.title); }
    paintLocal(); paintRing(); save();
  }), { threshold: .22, rootMargin: "0px 0px -8% 0px" });
  $$("[data-id]", app).forEach(el => io.observe(el));
  cleanups.push(() => io.disconnect());
  paintLocal();
}

/* ---------- notes ---------- */
function notes() {
  setAcc(null); nav("notes");
  setView(`
    <section class="notes-head"><p class="eyebrow" style="color:var(--blue)">Pocket notes and PDF slides</p><h1 class="h-lg">The whole module.<br>On one page.</h1>
      <div class="ctas"><a class="pill" href="assets/docs/Module_3_Nutrients_Utilisation_Slides.pdf" download="Module_3_Nutrients_Utilisation_Slides.pdf" data-dl="slides">Download PDF slides</a></div>
      <p class="small" style="margin-top:12px">Slides: 29 slides · PDF · 1.4 MB. Tap the pocket notes below to zoom in.</p></section>
    <button class="notes-img" data-zoom aria-label="Zoom pocket notes" oncontextmenu="return false"><img draggable="false" src="${PN}" alt="Module 3 pocket notes: energy balance; carbohydrate, fat and protein digestion and metabolism; integration of metabolism; adaptability and survival" width="1017" height="1546" loading="lazy"></button>
    <div class="zoom" role="dialog" aria-label="Pocket notes, zoomed"><button class="x" aria-label="Close"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 5l14 14M19 5L5 19" stroke="#1d1d1f" stroke-width="2.4" stroke-linecap="round"/></svg></button><img draggable="false" oncontextmenu="return false" src="${PN}" alt=""></div>`);
  $$("[data-dl]").forEach(a => a.addEventListener("click", () => { SFX.play("pop"); XAPI.downloaded(a.dataset.dl, a.textContent); }));
  const z = $(".zoom");
  $("[data-zoom]").addEventListener("click", () => { SFX.play("pop"); z.classList.add("open"); document.body.style.overflow = "hidden"; });
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
      <p class="body" style="margin:12px auto 0">You answered ${score} of ${QUIZ.length} correctly. You've completed Module 3: Nutrients Utilisation in Human.</p>
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
