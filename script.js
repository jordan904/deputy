/* ============================================
   Deputy Renovation Halifax - Scripts
   ============================================ */

(function () {
  'use strict';

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile Nav ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Scroll Reveal (IntersectionObserver) ----------
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    var fadeEls = document.querySelectorAll('.fade-in');

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;

          // Stagger siblings via JS setTimeout
          var parent = el.parentElement;
          var siblings = parent ? Array.from(parent.querySelectorAll('.fade-in')) : [];
          var index = siblings.indexOf(el);

          var delay = Math.min(index * 150, 600);
          setTimeout(function () {
            el.classList.add('visible');

            // Trigger icon pop on service cards
            var icon = el.querySelector('.service-icon');
            if (icon) icon.classList.add('animate');

            // Trigger star pop on testimonial cards
            var stars = el.querySelector('.testimonial-stars');
            if (stars) stars.classList.add('animate');

            // Trigger about image zoom
            if (el.classList.contains('about-image')) {
              el.classList.add('animate');
            }
          }, delay);

          revealObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---------- Stat Counter Animation ----------
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1200;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
        el.classList.add('bounce');
      }
    }

    if (prefersReducedMotion) {
      el.textContent = target;
    } else {
      requestAnimationFrame(step);
    }
  }

  if (statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var stats = document.querySelectorAll('.stat-number[data-target]');
          stats.forEach(function (stat, i) {
            setTimeout(function () {
              animateCounter(stat);
            }, i * 200);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(document.querySelector('.hero-stats'));
  }

  // ---------- Gallery Lightbox ----------
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = lightbox.querySelector('.lightbox-close');
  var lightboxPrev = lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox.querySelector('.lightbox-next');
  var currentIndex = 0;

  var galleryImages = Array.from(galleryItems).map(function (item) {
    var img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ---------- Contact Form ----------
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    var honeypot = contactForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value) return;

    // Clear previous errors
    contactForm.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
    contactForm.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
    });

    var valid = true;

    var name = contactForm.querySelector('#name');
    var email = contactForm.querySelector('#email');
    var phone = contactForm.querySelector('#phone');
    var message = contactForm.querySelector('#message');

    if (!name.value.trim()) {
      document.getElementById('nameError').textContent = 'Please enter your name';
      name.classList.add('error');
      name.setAttribute('aria-invalid', 'true');
      name.setAttribute('aria-describedby', 'nameError');
      valid = false;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email';
      email.classList.add('error');
      email.setAttribute('aria-invalid', 'true');
      email.setAttribute('aria-describedby', 'emailError');
      valid = false;
    }

    if (!phone.value.trim()) {
      document.getElementById('phoneError').textContent = 'Please enter your phone number';
      phone.classList.add('error');
      phone.setAttribute('aria-invalid', 'true');
      phone.setAttribute('aria-describedby', 'phoneError');
      valid = false;
    }

    if (!message.value.trim()) {
      document.getElementById('messageError').textContent = 'Please describe your project';
      message.classList.add('error');
      message.setAttribute('aria-invalid', 'true');
      message.setAttribute('aria-describedby', 'messageError');
      valid = false;
    }

    if (valid) {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }
  });
})();
