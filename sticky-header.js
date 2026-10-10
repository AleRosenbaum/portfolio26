(function () {
  if (document.querySelector('[data-floating-portfolio-nav]')) return;

  // The case pages used to ship their own "Ale Rosenbaum / Case study · year"
  // bar above the hero. The floating nav replaces it, so drop it wherever it
  // still exists, including inside an already-encrypted case payload.
  document.querySelectorAll('nav').forEach(function (node) {
    if (/case study/i.test(node.textContent)) node.remove();
  });

  var nav = document.createElement('nav');
  nav.className = 'floating-portfolio-nav';
  nav.setAttribute('data-floating-portfolio-nav', '');
  nav.setAttribute('aria-label', 'Portfolio navigation');
  nav.innerHTML = [
    '<a class="floating-portfolio-nav__brand" href="/" aria-label="Ale Rosenbaum, home">',
    '<img src="/favicon.svg" alt="" width="20" height="20">',
    '<span>Ale Rosenbaum</span>',
    '</a>',
    '<div class="floating-portfolio-nav__actions">',
    '<a class="floating-portfolio-nav__link" href="/">Work</a>',
    '<a class="floating-portfolio-nav__cta" href="https://www.linkedin.com/in/alerosenbaum/" target="_blank" rel="noopener noreferrer">Get in touch</a>',
    '</div>'
  ].join('');

  document.body.appendChild(nav);

  // The nav is on from the first fold by default. index.html opts into the
  // scroll reveal with data-floating-nav="scroll" so the home hero stays clean.
  if (document.body.getAttribute('data-floating-nav') !== 'scroll') {
    document.body.classList.add('floating-nav-always', 'floating-nav-visible');
    nav.classList.add('is-visible');
    return;
  }

  var trigger = document.querySelector('[data-sticky-header-trigger]')
    || document.querySelector('.hero')
    || document.querySelector('figure');
  var contactPage = document.getElementById('pg-contact');
  var framePending = false;

  function updateVisibility() {
    framePending = false;
    var contactIsActive = contactPage && contactPage.classList.contains('active');
    var heroIsPast = trigger ? trigger.getBoundingClientRect().bottom <= 0 : true;
    var shouldShow = Boolean(contactIsActive || heroIsPast);

    nav.classList.toggle('is-visible', shouldShow);
    document.body.classList.toggle('floating-nav-visible', shouldShow);
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateVisibility);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);

  if (contactPage) {
    new MutationObserver(scheduleUpdate).observe(contactPage, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateVisibility();
  requestAnimationFrame(function () {
    requestAnimationFrame(updateVisibility);
  });
})();
