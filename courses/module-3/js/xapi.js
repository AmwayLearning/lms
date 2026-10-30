/* ===== xAPI (Tin Can) tracking — Module 3 ===== */
window.COURSE = {
  id: "https://wiseprogramme.com/xapi/courses/nutrients-utilisation-in-human",   // must match tincan.xml
  name: "Nutrients Utilisation in Human: Metabolic Pathways",
};

window.XAPI = (function () {
  const q = new URLSearchParams(location.search);
  let endpoint = q.get("endpoint");
  const auth = q.get("auth");
  let actor = null;
  try { actor = JSON.parse(q.get("actor")); } catch (e) {}
  if (actor && Array.isArray(actor.mbox)) actor = { name: [].concat(actor.name)[0], mbox: actor.mbox[0] };
  if (actor && Array.isArray(actor.account)) actor = { name: [].concat(actor.name)[0], account: actor.account[0] };
  const registration = q.get("registration");
  const activityId = q.get("activity_id") || COURSE.id;
  const enabled = !!(endpoint && actor);
  if (endpoint && !endpoint.endsWith("/")) endpoint += "/";
  const LOCAL_KEY = "wise-m3-v2-state";

  const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16);
    }));
  const headers = (json = true) => {
    const h = { "X-Experience-API-Version": "1.0.3" };
    if (json) h["Content-Type"] = "application/json";
    if (auth) h.Authorization = auth;
    return h;
  };
  const VERB = v => ({
    id: v.startsWith("http") ? v : "http://adlnet.gov/expapi/verbs/" + v,
    display: { "en-US": v.split("/").pop() }
  });
  const ctx = () => {
    const c = { contextActivities: { grouping: [{ id: activityId }] } };
    if (registration) c.registration = registration;
    return c;
  };
  const queue = [];
  let flushing = false;

  async function flush() {
    if (!enabled || flushing || !queue.length) return;
    flushing = true;
    const batch = queue.splice(0, queue.length);
    try {
      const r = await fetch(endpoint + "statements", { method: "POST", headers: headers(), body: JSON.stringify(batch), keepalive: true });
      if (!r.ok) throw new Error(r.status);
    } catch (e) { queue.unshift(...batch); console.warn("xAPI send failed", e); }
    flushing = false;
  }

  function send(verb, object, extra = {}) {
    const st = Object.assign({
      id: uuid(), actor: actor || { name: "Preview learner", mbox: "mailto:preview@example.com" },
      verb: VERB(verb), object, context: ctx(), timestamp: new Date().toISOString()
    }, extra);
    if (!enabled) { console.debug("[xAPI preview]", verb, object.id); return; }
    queue.push(st); flush();
  }

  const course = () => ({ id: activityId, objectType: "Activity",
    definition: { name: { "en-US": COURSE.name }, type: "http://adlnet.gov/expapi/activities/course" } });
  const child = (id, name, type = "http://adlnet.gov/expapi/activities/module") => ({
    id: activityId + "/" + id, objectType: "Activity",
    definition: { name: { "en-US": name }, type }
  });
  const ctxChild = () => { const c = ctx(); c.contextActivities.parent = [{ id: activityId }]; return c; };

  /* ---- State API (resume) ---- */
  function stateUrl() {
    const p = new URLSearchParams({ activityId, agent: JSON.stringify(actor), stateId: "progress-v2" });
    if (registration) p.set("registration", registration);
    return endpoint + "activities/state?" + p.toString();
  }
  async function loadState() {
    if (enabled) {
      try {
        const r = await fetch(stateUrl(), { headers: headers(false) });
        if (r.ok) { const t = await r.text(); if (t) return JSON.parse(t); }
      } catch (e) { console.warn("state load failed", e); }
      return null;
    }
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch (e) { return null; }
  }
  let saveTimer = null;
  function saveState(s) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      if (enabled) {
        try { await fetch(stateUrl(), { method: "PUT", headers: headers(), body: JSON.stringify(s), keepalive: true }); }
        catch (e) { console.warn("state save failed", e); }
      } else { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(s)); } catch (e) {} }
    }, 250);
  }
  function clearLocal() { try { localStorage.removeItem(LOCAL_KEY); } catch (e) {} }

  const started = Date.now();
  const iso = ms => "PT" + Math.max(1, Math.round(ms / 1000)) + "S";

  return {
    enabled, saveState, loadState, clearLocal, flush,
    initialized(resumed) { send(resumed ? "http://adlnet.gov/expapi/verbs/resumed" : "initialized", course()); },
    experienced(id, name) { send("experienced", child(id, name, "http://adlnet.gov/expapi/activities/lesson"), { context: ctxChild() }); },
    sectionCompleted(id, name) { send("completed", child(id, name), { context: ctxChild() }); },
    played(id, name) {
      send("https://w3id.org/xapi/video/verbs/played", child(id, name, "https://w3id.org/xapi/video/activity-type/video"), { context: ctxChild() });
    },
    interacted(id, name) { send("interacted", child(id, name, "http://adlnet.gov/expapi/activities/interaction"), { context: ctxChild() }); },
    downloaded(id, name) { send("http://id.tincanapi.com/verb/downloaded", child(id, name, "http://id.tincanapi.com/activitytype/document"), { context: ctxChild() }); },
    answered(q, choiceIds, correct) {
      send("answered", {
        id: activityId + "/quiz/" + q.id, objectType: "Activity",
        definition: {
          name: { "en-US": q.prompt.slice(0, 120) }, type: "http://adlnet.gov/expapi/activities/cmi.interaction",
          interactionType: "choice", correctResponsesPattern: [q.answer],
          choices: q.options.map(o => ({ id: o.id, description: { "en-US": o.text } }))
        }
      }, { result: { response: choiceIds, success: correct }, context: ctxChild() });
    },
    quizResult(raw, max) {
      const scaled = max ? raw / max : 0;
      send("completed", child("quiz", "Knowledge check", "http://adlnet.gov/expapi/activities/assessment"), {
        result: { score: { raw, min: 0, max, scaled: +scaled.toFixed(2) }, completion: true }, context: ctxChild()
      });
      return true;
    },
    completed(raw, max) { const r = { completion: true, duration: iso(Date.now() - started) }; if (max) r.score = { raw, min: 0, max, scaled: +(raw / max).toFixed(2) }; send("completed", course(), { result: r }); },
    terminated() { send("terminated", course(), { result: { duration: iso(Date.now() - started) } }); flush(); }
  };
})();
