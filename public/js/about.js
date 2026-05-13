'use strict';

(function () {
  const door    = document.getElementById('store-intro');
  const lines   = Array.from(document.querySelectorAll('.rl'));
  const cta     = document.getElementById('about-cta');
  const head    = document.getElementById('printer-head');
  const barcode = document.getElementById('receipt-barcode');
  const feed    = document.getElementById('receipt-feed');
  const wrap    = document.querySelector('.receipt-wrap');
  const led     = document.getElementById('rm-led');

  if (!door) return;

  createBarcodeBars();
  initTeamSlider();

  /* Reduced-motion: skip everything */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    door.remove();
    if (feed && wrap) {
      feed.style.transition = 'none';
      feed.style.height = wrap.offsetHeight + 'px';
      feed.classList.add('is-printed');
    }
    lines.forEach(l => l.classList.add('is-printed'));
    if (cta) cta.classList.add('is-visible');
    if (led) led.classList.add('is-done');
    drawBarcode(0);
    return;
  }

  /* Keep the viewport still while the paper is printing. */
  document.body.style.overflow = 'hidden';

  const DOOR_OPEN_DELAY = 700;   // pause before doors slide
  const DOOR_SWING_DUR  = 880;   // matches si-door .88s transition
  const DOOR_FADE_DELAY = DOOR_OPEN_DELAY + DOOR_SWING_DUR - 150; // start fading just before fully open
  const PRINT_START     = DOOR_OPEN_DELAY + 400; // start printing mid-slide
  const PRINT_DURATION  = Math.max(5200, lines.length * 72); // slow paper feed

  /* 1 — slide doors open */
  setTimeout(() => door.classList.add('si-opening'), DOOR_OPEN_DELAY);

  /* 2 — fade overlay out */
  setTimeout(() => {
    door.classList.add('si-exit');
  }, DOOR_FADE_DELAY);

  /* 3 — remove from DOM */
  setTimeout(() => door.remove(), DOOR_FADE_DELAY + 800);

  /* 4 — feed paper from the slot and start LED blinking */
  setTimeout(() => {
    const receiptHeight = wrap ? wrap.offsetHeight : 0;

    if (feed && receiptHeight) {
      feed.style.setProperty('--receipt-print-duration', PRINT_DURATION + 'ms');
      feed.classList.add('is-printing');
      feed.style.height = receiptHeight + 'px';
    }

    if (head) head.style.opacity = '1';
    if (led) led.classList.add('is-printing');
  }, PRINT_START);

  /* 5 — print from the receipt's end upward as the paper emerges */
  scheduleBottomUpPrint();

  /* 6 — after last line: stop LED, hide head, draw barcode, show CTA */
  const allDone = PRINT_START + PRINT_DURATION + 220;

  setTimeout(() => {
    if (head) head.style.opacity = '0';
    if (feed) {
      feed.classList.remove('is-printing');
      feed.classList.add('is-printed');
    }
    if (led) {
      led.classList.remove('is-printing');
      led.classList.add('is-done');
    }
    document.body.style.overflow = '';
  }, allDone);

  setTimeout(() => {
    if (cta) cta.classList.add('is-visible');
  }, allDone + 600);

  function scheduleBottomUpPrint() {
    if (!wrap) {
      lines.slice().reverse().forEach((line, i) => {
        setTimeout(() => line.classList.add('is-printed'), PRINT_START + i * 70);
      });
      return;
    }

    const receiptHeight = wrap.offsetHeight || 1;
    const wrapTop = wrap.getBoundingClientRect().top;

    lines.forEach((line) => {
      const lineRect = line.getBoundingClientRect();
      const lineBottom = lineRect.bottom - wrapTop;
      const distanceFromBottom = Math.max(0, receiptHeight - lineBottom);
      const progress = Math.min(1, distanceFromBottom / receiptHeight);
      const delay = PRINT_START + progress * PRINT_DURATION;

      setTimeout(() => {
        line.classList.add('is-printed');

        if (line.id === 'receipt-barcode-wrap') {
          drawBarcode(80);
        }
      }, delay);
    });
  }

  function createBarcodeBars() {
    if (!barcode || barcode.children.length) return;

    const widths = [2,1,3,1,2,1,4,1,1,3,2,1,2,1,3,1,1,4,2,1,3,1,2,1,1,3,1,2,4,1,2,1,3,1];
    widths.forEach((w) => {
      const bar = document.createElement('span');
      bar.style.width = (w * 3) + 'px';
      barcode.appendChild(bar);
    });
  }

  /* Generate barcode bars */
  function drawBarcode(startDelay) {
    if (!barcode) return;
    Array.from(barcode.children).forEach((bar, i) => {
      setTimeout(() => bar.classList.add('is-drawn'), startDelay + i * 35);
    });
  }

  function initTeamSlider() {
    const slider = document.getElementById('team-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('[data-team-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-team-dot]'));
    const prev = slider.querySelector('.team-slider-btn--prev');
    const next = slider.querySelector('.team-slider-btn--next');
    let activeIndex = 0;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === activeIndex);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    prev?.addEventListener('click', () => showSlide(activeIndex - 1));
    next?.addEventListener('click', () => showSlide(activeIndex + 1));
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });

    showSlide(0);
  }
}());
