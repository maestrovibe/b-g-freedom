document.addEventListener('DOMContentLoaded', function () {
  // Highlight the nav link matching the current page (fixes active-link
  // indicator only ever showing on Home)
  var currentPage = location.pathname.split('/').pop();
  if (currentPage === '') currentPage = 'index.html';
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Hero slideshow: crossfade between multiple background images.
  // The first slide's image loads immediately (it's in the initial HTML).
  // The rest are only fetched after window 'load', so they never compete
  // with critical page resources for bandwidth.
  var heroSlides = document.querySelectorAll('.hero-slideshow .hero-media');
  if (heroSlides.length > 1) {
    var startSlideshow = function () {
      var loadedCount = 0;
      var lazySlides = [];
      heroSlides.forEach(function (slide) {
        var src = slide.getAttribute('data-bg');
        if (src) lazySlides.push({ el: slide, src: src });
      });

      var applyBg = function (item) {
        item.el.style.backgroundImage = "url('" + item.src + "')";
      };

      if (lazySlides.length === 0) {
        runRotation();
        return;
      }

      lazySlides.forEach(function (item) {
        var img = new Image();
        img.onload = img.onerror = function () {
          applyBg(item);
          loadedCount++;
          if (loadedCount === lazySlides.length) runRotation();
        };
        img.src = item.src;
      });
    };

    var runRotation = function () {
      var currentSlide = 0;
      setInterval(function () {
        heroSlides[currentSlide].classList.remove('is-active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('is-active');
      }, 5000);
    };

    if (document.readyState === 'complete') {
      startSlideshow();
    } else {
      window.addEventListener('load', startSlideshow);
    }
  }

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-mobile');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.querySelector('.enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value.trim();
      var product = form.querySelector('#product').value;
      var message = form.querySelector('#message').value.trim();
      var text = 'Hello B&G Freedom, my name is ' + (name || 'a visitor') +
        '. I am interested in: ' + (product || 'general enquiry') +
        (message ? ('. ' + message) : '');
      var url = 'https://wa.me/2348034182374?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    });
  }
});
