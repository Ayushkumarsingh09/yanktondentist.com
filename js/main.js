(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const stickyMobileCta = document.getElementById('stickyMobileCta');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const contactForm = document.getElementById('contactForm');

  /* Header scroll effect */
  let lastScroll = 0;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    stickyMobileCta.classList.toggle('visible', y > 400);
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function closeMenu() {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Smooth anchor scroll with header offset */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (history.replaceState) {
        history.replaceState(null, '', id);
      }
    });
  });

  /* Scroll to hash on load (e.g. index.html#team from footer) */
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.requestAnimationFrame(function () {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    }
  }

  /* Lightbox for office gallery */
  document.querySelectorAll('[data-lightbox]').forEach(function (item) {
    item.addEventListener('click', function () {
      const src = this.getAttribute('data-lightbox');
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      lightboxImg.src = '';
    }, 400);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMenu();
    }
  });

  /* Contact form — opens SMS/email as fallback for static hosting */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = fd.get('name') || '';
      const phone = fd.get('phone') || '';
      const email = fd.get('email') || '';
      const type = fd.get('type') || 'Appointment';
      const message = fd.get('message') || '';

      const body = encodeURIComponent(
        'Appointment Request from ' + name +
        '\nPhone: ' + phone +
        (email ? '\nEmail: ' + email : '') +
        '\nType: ' + type +
        (message ? '\nMessage: ' + message : '')
      );

      window.location.href = 'sms:+16056682273?&body=' + body;
    });
  }

  /* Gentle parallax on hero collage */
  const heroCollage = document.querySelector('.hero__collage');
  if (heroCollage && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroCollage.style.transform = 'translateY(' + y * 0.08 + 'px)';
      }
    }, { passive: true });
  }

  /* Hero entrance animation */
  window.addEventListener('load', function () {
    document.querySelectorAll('.hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  });
})();
