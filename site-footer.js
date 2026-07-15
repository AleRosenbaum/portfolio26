(function () {
  if (document.querySelector('[data-site-footer]')) return;

  document.querySelectorAll('footer').forEach(function (footer) {
    footer.remove();
  });

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.setAttribute('data-site-footer', '');
  footer.innerHTML = [
    '<div class="site-footer__inner">',
    '<p class="site-footer__statement">Every product decision is a hypothesis<br class="site-footer__break">until users prove it otherwise.</p>',
    '<a class="site-footer__brand" href="/" aria-label="Ale Rosenbaum, home">',
    '<img src="/favicon.svg" alt="" width="36" height="27">',
    '</a>',
    '<div class="site-footer__actions">',
    '<nav class="site-footer__nav" aria-label="Footer navigation">',
    '<a href="/">Home</a>',
    '<a href="/">Work</a>',
    '</nav>',
    '<a class="site-footer__cta" href="https://www.linkedin.com/in/alerosenbaum/" target="_blank" rel="noopener noreferrer">Get in touch</a>',
    '</div>',
    '</div>'
  ].join('');

  document.body.appendChild(footer);
})();
