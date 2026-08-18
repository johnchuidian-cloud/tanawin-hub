/* Tanawin suite — "Update available" banner.
 *
 * Suite contract: a dismissible banner, identical wording in every app, that
 * lets someone running an old build refresh into the new one. It NEVER
 * auto-reloads (that would destroy half-typed work in the other apps) and it
 * fails silent — a failed check is simply "no update", never an error shown
 * to a user.
 *
 * Mechanism note: the Hub has no build step, so rather than a version file
 * that someone has to remember to bump on every deploy, this compares the
 * ETag of the current page across polls. Self-maintaining: Cloudflare changes
 * the ETag whenever the deployed bytes change. Apps that DO have a build step
 * (Finance, Kitchen, Payroll) stamp a build id into /version.json instead.
 *
 * Cache-busting is mandatory, not decorative: Cloudflare's edge cache returns
 * stale copies to repeated identical requests, which would make this feature
 * silently never fire.
 */
(function () {
  var POLL_MS = 5 * 60 * 1000;
  var loadedTag = null;      // the version this page was loaded as — never updated
  var dismissedTag = null;   // the version the user dismissed, so we don't re-nag
  var banner = null;

  function currentTag(cb) {
    // Unique param per request — a reused timestamp still gets served from cache.
    var bust = Date.now().toString(36) + Math.random().toString(36).slice(2);
    fetch(location.pathname + '?x=' + bust, { method: 'HEAD', cache: 'no-store' })
      .then(function (res) {
        cb(res.headers.get('etag') || res.headers.get('last-modified'));
      })
      .catch(function () { /* offline, 500, blocked — stay quiet */ });
  }

  function ensureStyles() {
    if (document.getElementById('tw-update-style')) return;
    var s = document.createElement('style');
    s.id = 'tw-update-style';
    s.textContent =
      '.tw-update{position:fixed;top:0;left:0;right:0;z-index:9999;' +
      'display:flex;align-items:center;gap:12px;justify-content:center;' +
      'background:#FBFAF6;color:#1F1B16;padding:10px 14px;' +
      'font-family:-apple-system,system-ui,sans-serif;font-size:14px;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.25)}' +
      '.tw-update button{font:inherit;font-weight:600;cursor:pointer;' +
      'border:0;border-radius:8px;padding:6px 14px;' +
      'background:#9A3518;color:#FBFAF6}' +
      '.tw-update .tw-x{background:none;color:#6E6759;font-weight:400;' +
      'padding:6px 8px;font-size:18px;line-height:1}';
    document.head.appendChild(s);
  }

  function show(tag) {
    if (banner) return;
    ensureStyles();
    banner = document.createElement('div');
    banner.className = 'tw-update';
    banner.setAttribute('role', 'status');

    var text = document.createElement('span');
    text.textContent = 'Update available';

    var refresh = document.createElement('button');
    refresh.textContent = 'Refresh';
    refresh.onclick = function () { location.reload(); };

    var close = document.createElement('button');
    close.className = 'tw-x';
    close.setAttribute('aria-label', 'Dismiss');
    close.textContent = '×';
    close.onclick = function () {
      dismissedTag = tag;             // silent until a NEWER build appears
      banner.remove();
      banner = null;
    };

    banner.appendChild(text);
    banner.appendChild(refresh);
    banner.appendChild(close);
    document.body.appendChild(banner);
  }

  function check() {
    currentTag(function (tag) {
      if (!tag) return;                       // no ETag served — stay dormant
      if (loadedTag === null) { loadedTag = tag; return; }  // baseline only
      if (tag !== loadedTag && tag !== dismissedTag) show(tag);
    });
  }

  check();                                     // establish the baseline
  setInterval(function () {
    if (!document.hidden) check();             // don't poll a hidden tab
  }, POLL_MS);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) check();             // the "phone woke up" case
  });
})();
