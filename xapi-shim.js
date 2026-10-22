/*
 * W.I.S.E Programme LMS — xAPI helper loaded into course pages.
 * Browsers don't pass *synchronous* web requests through the service worker,
 * and some xAPI courses (e.g. Articulate Storyline when closing) send their last
 * save that way. This hands those requests straight to the LMS page instead.
 * Keep this file next to index.html. You never need to edit it.
 */
(function () {
  var me = document.currentScript && document.currentScript.src;
  if (!me || !window.XMLHttpRequest) return;
  var endpoint = new URL('xapi/', me).href;

  function lms() {
    var w = window;
    for (var i = 0; i < 10; i++) {
      try { if (w.__lmsXapi) return w.__lmsXapi; } catch (e) {}
      if (w.parent === w) break;
      w = w.parent;
    }
    try { if (window.opener && window.opener.__lmsXapi) return window.opener.__lmsXapi; } catch (e) {}
    return null;
  }

  var P = XMLHttpRequest.prototype, open = P.open, send = P.send, setHeader = P.setRequestHeader;
  P.open = function (method, url, async) {
    this.__lms = null;
    var abs = '';
    try { abs = new URL(url, location.href).href; } catch (e) {}
    if (async === false && abs.indexOf(endpoint) === 0 && lms()) this.__lms = { method: method, url: abs, headers: {} };
    return open.apply(this, arguments);
  };
  P.setRequestHeader = function (k, v) {
    if (this.__lms) this.__lms.headers[String(k).toLowerCase()] = v;
    return setHeader.apply(this, arguments);
  };
  P.send = function (body) {
    if (!this.__lms) return send.apply(this, arguments);
    var req = this.__lms, xhr = this, r;
    req.body = body == null ? '' : String(body);
    try { r = lms()(req); } catch (e) { r = { status: 500, body: String(e), type: 'text/plain' }; }
    function set(k, v) { Object.defineProperty(xhr, k, { value: v, configurable: true }); }
    set('readyState', 4); set('status', r.status); set('statusText', r.status < 300 ? 'OK' : 'Error');
    set('responseText', r.body || ''); set('response', r.body || ''); set('responseURL', req.url);
    xhr.getResponseHeader = function (n) {
      n = String(n).toLowerCase();
      return n === 'content-type' ? (r.type || null) : n === 'x-experience-api-version' ? '1.0.3' : null;
    };
    xhr.getAllResponseHeaders = function () { return 'content-type: ' + (r.type || '') + '\r\nx-experience-api-version: 1.0.3\r\n'; };
    try { if (xhr.onreadystatechange) xhr.onreadystatechange(); } catch (e) {}
    try { if (xhr.onload) xhr.onload(); } catch (e) {}
  };
})();
