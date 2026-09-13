export class MotionEngine {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.easeEditorial = 'cubic-bezier(0.16, 1, 0.3, 1)';
    this.init();
  }

  init() {
    if (this.reducedMotion) return;
    this.animateHero();
    this.initScrollReveals();
  }

  animateHero() {
    const lines = document.querySelectorAll('#hero-title .hero-line');
    const subline = document.getElementById('hero-sub');
    const media = document.getElementById('hero-media');
    const actionGroup = document.querySelector('.hero-action-group');
    const badges = document.querySelector('.hero-badges');

    lines.forEach((line, i) => {
      line.animate([
        { opacity: 0, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 700,
        delay: 80 + i * 70,
        easing: this.easeEditorial,
        fill: 'both'
      });
    });

    if (subline) {
      subline.animate([
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 600,
        delay: 280,
        easing: this.easeEditorial,
        fill: 'both'
      });
    }

    if (actionGroup) {
      actionGroup.animate([
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 600,
        delay: 360,
        easing: this.easeEditorial,
        fill: 'both'
      });
    }

    if (badges) {
      badges.animate([
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 600,
        delay: 420,
        easing: this.easeEditorial,
        fill: 'both'
      });
    }

    if (media) {
      media.animate([
        { opacity: 0, transform: 'translateY(30px) scale(0.97)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], {
        duration: 800,
        delay: 180,
        easing: this.easeEditorial,
        fill: 'both'
      });
    }
  }

  initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        if (entry.target.id === 'services') {
          const rows = entry.target.querySelectorAll('.service-row');
          rows.forEach((row, idx) => {
            row.animate([
              { opacity: 0, transform: 'translateX(-10px)' },
              { opacity: 1, transform: 'translateX(0)' }
            ], {
              duration: 450,
              delay: idx * 35,
              easing: this.easeEditorial,
              fill: 'both'
            });
          });
        }

        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    const services = document.getElementById('services');
    if (services) observer.observe(services);
  }
}