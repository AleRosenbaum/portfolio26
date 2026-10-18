// Custom GA4 events for the portfolio. Each page loads gtag.js itself; this
// script only adds events on top. The password gate sends its own unlock
// events (see encrypt-cases.mjs).
//
// select_case        a case card on the home page        case_name
// contact_click      an email or LinkedIn link           channel, link_location
// access_request     "Ask me for access" on a gate       case_name
// case_read          25, 50, 75 and 100% of a case       case_name, percent_scrolled
// case_section_view  a section label reaches mid screen  case_name, section, section_index
(function () {
  // The gate replaces its document with the case on unlock, and the case loads
  // this script again, so guard per document rather than per window.
  var root = document.documentElement;
  if (root.hasAttribute('data-analytics')) return;
  root.setAttribute('data-analytics', '');

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  var caseName = document.body.getAttribute('data-case');
  var isGate = document.body.hasAttribute('data-gate');

  function linkLocation(link) {
    if (link.closest('.floating-portfolio-nav')) return 'nav';
    if (link.closest('.site-footer')) return 'footer';
    return 'page';
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';

    if (link.hasAttribute('data-track')) {
      track(link.getAttribute('data-track'), { case_name: caseName });
    } else if (link.classList.contains('case-card')) {
      track('select_case', { case_name: href.replace(/\.html$/, '') });
    } else if (href.indexOf('mailto:') === 0) {
      track('contact_click', { channel: 'email', link_location: linkLocation(link) });
    } else if (/linkedin\.com/.test(href)) {
      track('contact_click', { channel: 'linkedin', link_location: linkLocation(link) });
    }
  }, true);

  if (!caseName || isGate) return;

  // Which sections people reach, named by their labels ("Research",
  // "Results"...). A section counts once its label scrolls into the upper half
  // of the screen. Emoji are dropped from the name.
  var labels = Array.prototype.slice.call(document.querySelectorAll('.label'));
  if (labels.length && 'IntersectionObserver' in window) {
    var sections = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.unobserve(entry.target);
        track('case_section_view', {
          case_name: caseName,
          section: entry.target.textContent.replace(/[^\p{L}\p{N}\s·]/gu, '').replace(/\s+/g, ' ').trim(),
          section_index: labels.indexOf(entry.target) + 1
        });
      });
    }, { rootMargin: '0px 0px -50% 0px' });
    labels.forEach(function (label) { sections.observe(label); });
  }

  // Reading depth on the case pages, measured against the content above the
  // footer so that "100" means the reader reached the end of the case.
  var marks = [25, 50, 75, 100];
  var framePending = false;

  function checkDepth() {
    framePending = false;
    var footer = document.querySelector('.site-footer');
    var end = document.documentElement.scrollHeight - (footer ? footer.offsetHeight : 0);
    var seen = (window.scrollY + window.innerHeight) / end * 100;
    while (marks.length && seen >= marks[0] - 1) {
      track('case_read', { case_name: caseName, percent_scrolled: marks.shift() });
    }
    if (!marks.length) window.removeEventListener('scroll', onScroll);
  }

  function onScroll() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(checkDepth);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
