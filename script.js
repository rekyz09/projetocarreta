/* ============================================================
   MINAS DAS MINAS — script.js
============================================================ */

(function () {
  'use strict';

  /* ── Menu hamburguer ──────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha menu ao clicar em um link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha menu ao clicar fora
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Link ativo no scroll ─────────────────────────────── */
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = Array.from(navLinks).map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  function updateActiveLink () {
    const scrollY = window.scrollY + 80;
    let currentId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Botão "Voltar ao topo" ───────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Filtro de minérios ───────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const minerioCards = document.querySelectorAll('.minerio-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      minerioCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);

        // Animação suave ao revelar
        if (show) {
          card.style.animation = 'fadeInCard .35s ease forwards';
        }
      });
    });
  });

  /* ── Formulário de contato ────────────────────────────── */
  const form      = document.getElementById('contatoForm');
  const formNote  = document.getElementById('formNote');

  if (form && formNote) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      formNote.textContent = '';
      formNote.className = 'form-note';

      // Validação básica
      const nome      = form.querySelector('#nome');
      const cidade    = form.querySelector('#cidade');
      const email     = form.querySelector('#email');
      const mensagem  = form.querySelector('#mensagem');
      let hasError    = false;

      [nome, cidade, email, mensagem].forEach(function (field) {
        field.classList.remove('error');
      });

      if (!nome.value.trim()) {
        nome.classList.add('error'); hasError = true;
      }
      if (!cidade.value.trim()) {
        cidade.classList.add('error'); hasError = true;
      }
      if (!email.value.trim() || !email.value.includes('@')) {
        email.classList.add('error'); hasError = true;
      }
      if (!mensagem.value.trim()) {
        mensagem.classList.add('error'); hasError = true;
      }

      if (hasError) {
        formNote.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        formNote.classList.add('error-note');
        return;
      }

      // Simula envio (sem backend neste protótipo)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(function () {
        form.reset();
        submitBtn.textContent = 'Enviar mensagem';
        submitBtn.disabled = false;
        formNote.textContent = '✓ Mensagem enviada! Entraremos em contato em breve.';
        formNote.className = 'form-note';
      }, 1200);
    });
  }

  /* ── Intersection Observer — animação ao rolar ────────── */
  const animTargets = document.querySelectorAll(
    '.agenda-card, .minerio-card, .impact-item, .feature-list li, .contato-item'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animTargets.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .45s ease ' + (i % 4 * 0.07) + 's, transform .45s ease ' + (i % 4 * 0.07) + 's';
      observer.observe(el);
    });

    document.addEventListener('animationend', function (e) {
      if (e.target.classList.contains('in-view')) {
        e.target.style.opacity = '';
        e.target.style.transform = '';
      }
    });
  }

  // Injeta a classe in-view via CSS quando visível
  const style = document.createElement('style');
  style.textContent = '.in-view { opacity: 1 !important; transform: none !important; } @keyframes fadeInCard { from { opacity: 0; transform: scale(.97) translateY(8px); } to { opacity: 1; transform: none; } }';
  document.head.appendChild(style);

})();
