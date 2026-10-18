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
    '<p class="site-footer__statement">Every product decision is a hypothesis until users prove it otherwise.</p>',
    '<a class="site-footer__brand" href="/" aria-label="Ale Rosenbaum, home">',
    '<img src="/logo.svg" alt="" width="36" height="27">',
    '</a>',
    '<a class="site-footer__cta" href="https://www.linkedin.com/in/alerosenbaum/" target="_blank" rel="noopener noreferrer">Get in touch</a>',
    '</div>'
  ].join('');

  document.body.appendChild(footer);
})();
