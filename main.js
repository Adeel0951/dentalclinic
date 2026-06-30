(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const appointmentForm = document.getElementById('appointmentForm');
  const formNote = document.getElementById('formNote');
  const newsletterForm = document.getElementById('newsletterForm');
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  /* Header scroll effect */
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* Mobile navigation */
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Testimonials slider */
  var cards = track ? track.querySelectorAll('.testimonial-card') : [];
  var currentSlide = 0;
  var autoplayInterval;

  function goToSlide(index) {
    if (!cards.length) return;
    currentSlide = (index + cards.length) % cards.length;
    track.scrollTo({ left: cards[currentSlide].offsetLeft, behavior: 'smooth' });
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (cards.length && dotsContainer) {
    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () { goToSlide(i); resetAutoplay(); });
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); resetAutoplay(); });

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(function () { goToSlide(currentSlide + 1); }, 6000);
    }

    resetAutoplay();
  }

  /* Appointment form */
  if (appointmentForm) {
    var dateInput = document.getElementById('date');
    if (dateInput) {
      var today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formNote.className = 'form-note';
      formNote.textContent = '';

      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var email = document.getElementById('email');
      var service = document.getElementById('service');
      var date = document.getElementById('date');
      var valid = true;

      [name, phone, email, service, date].forEach(function (field) {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }

      if (!valid) {
        formNote.className = 'form-note error';
        formNote.textContent = 'Please fill in all required fields correctly.';
        return;
      }

      formNote.className = 'form-note success';
      formNote.textContent = 'Thank you! Your appointment request has been received. We will contact you within 24 hours.';
      appointmentForm.reset();
    });
  }

  /* Newsletter form */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = 'Subscribed! Thank you.';
        setTimeout(function () { input.placeholder = 'Your email'; }, 3000);
      }
    });
  }

  /* Fade-in on scroll */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.service-card, .doctor-card, .about-content, .section-header').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();
