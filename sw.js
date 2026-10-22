/*
 * W.I.S.E Programme LMS — built-in xAPI endpoint (service worker)
 *
 * xAPI (Tin Can) courses send their tracking data as web requests to an
 * "LRS" address. This worker answers every request made to  <your site>/xapi/
 * and hands it to the open LMS window, which saves progress to Google Sheets.
 * Keep this file next to index.html. You never need to edit it.
 */
const XAPI_VERSION = '1.0.3';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const courses = new URL('courses/', self.registration.scope);
  if (event.request.mode === 'navigate' && url.href.indexOf(courses.href) === 0) {
    event.respondWith(addHelper(event.request)); // course pages get xapi-shim.js (see that file)
    return;
  }
  const base = new URL('xapi/', self.registration.scope);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return; // everything else loads normally
  event.respondWith(handle(event.request));
});

async function handle(req) {
  if (req.method === 'OPTIONS') return respond(204);
  const body = req.method === 'GET' || req.method === 'HEAD' ? '' : await req.text();
  const headers = {};
  req.headers.forEach((v, k) => { headers[k] = v; });
  const message = { type: 'xapi', req: { method: req.method, url: req.url, headers, body } };

  // Ask every open LMS window; the one playing this course answers.
  const windows = (await self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
    .filter(c => c.frameType !== 'nested' && !new URL(c.url).pathname.includes('/courses/'));
  if (!windows.length) return respond(503, 'The LMS page is not open.', 'text/plain');

  const reply = await new Promise(resolve => {
    let waiting = windows.length;
    const timer = setTimeout(() => resolve({ status: 504, body: 'The LMS page did not respond.', type: 'text/plain' }), 15000);
    windows.forEach(win => {
      const channel = new MessageChannel();
      channel.port1.onmessage = e => {
        if (e.data && e.data.skip) { if (--waiting === 0) { clearTimeout(timer); resolve({ status: 503, body: 'No xAPI course is open in the LMS.', type: 'text/plain' }); } return; }
        clearTimeout(timer); resolve(e.data);
      };
      win.postMessage(message, [channel.port2]);
    });
  });
  return respond(reply.status, reply.body, reply.type);
}

async function addHelper(req) {
  let res;
  try { res = await fetch(req); } catch (e) { return Response.error(); }
  if (!res.ok || !/text\/html/i.test(res.headers.get('content-type') || '')) return res;
  try {
    let html = await res.text();
    const tag = '<script src="' + new URL('xapi-shim.js', self.registration.scope).pathname + '"></script>';
    const head = html.match(/<head(\s[^>]*)?>/i), root = html.match(/<html(\s[^>]*)?>/i), doctype = html.match(/<!doctype[^>]*>/i);
    if (head) html = html.replace(head[0], head[0] + tag);
    else if (root) html = html.replace(root[0], root[0] + tag);
    else if (doctype) html = html.replace(doctype[0], doctype[0] + tag);
    else html = tag + html;
    const headers = new Headers(res.headers);
    headers.delete('content-length'); headers.delete('content-encoding');
    return new Response(html, { status: res.status, statusText: res.statusText, headers });
  } catch (e) { return fetch(req); }
}

function respond(status, body, type) {
  const headers = {
    'X-Experience-API-Version': XAPI_VERSION,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Experience-API-Version, If-Match, If-None-Match',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Cache-Control': 'no-store',
  };
  if (type) headers['Content-Type'] = type;
  const noBody = status === 204 || status === 304;
  return new Response(noBody ? null : (body || ''), { status, headers });
}
