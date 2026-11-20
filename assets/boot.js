/* Runs before first paint: restore theme, and hide content for entrance animations only while JS runs.
   If the main script never starts, everything is shown after 3s. */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try { var t = localStorage.getItem('theme'); if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t); } catch (e) {}
  setTimeout(function () { if (!window.__siteReady) d.classList.remove('js'); }, 3000);
})();
