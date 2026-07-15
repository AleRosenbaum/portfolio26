(function () {
  if (document.querySelector('[data-floating-portfolio-nav]')) return;

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
