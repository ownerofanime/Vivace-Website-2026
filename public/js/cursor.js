(() => {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer) return;

  const cursorSrc = '/assets/cursor_glove_cursor.png';
  const cursor = document.createElement('img');
  cursor.className = 'glove-cursor';
  cursor.src = cursorSrc;
  cursor.alt = '';
  cursor.draggable = false;
  cursor.setAttribute('aria-hidden', 'true');

  const preload = new Image();
  preload.onload = () => {
    document.body.appendChild(cursor);
    document.documentElement.classList.add('glove-cursor-ready');
  };
  preload.src = cursorSrc;

  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;

  function moveTo(x, y) {
    lastX = x;
    lastY = y;
    cursor.style.setProperty('--cursor-x', `${x}px`);
    cursor.style.setProperty('--cursor-y', `${y}px`);
    cursor.classList.add('is-visible');
  }

  function handleMouseEvent(event, callback) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    callback(event);
  }

  document.addEventListener('pointermove', event => {
    handleMouseEvent(event, () => moveTo(event.clientX, event.clientY));
  }, { passive: true });

  document.addEventListener('pointerdown', event => {
    handleMouseEvent(event, () => moveTo(event.clientX, event.clientY));
    cursor.classList.add('is-pressing');
  }, true);

  // Release implicit pointer capture AFTER it has been established.
  // (gotpointercapture fires after pointerdown's default behaviour sets it up.)
  // Without this, the captured element keeps the browser's native cursor
  // visible for the entire press duration, even with cursor:none on the page.
  document.addEventListener('gotpointercapture', event => {
    if (event.pointerType !== 'mouse') return;
    try {
      event.target.releasePointerCapture(event.pointerId);
    } catch (_) {}
  }, true);

  document.addEventListener('pointerup', () => {
    cursor.classList.remove('is-pressing');
  }, true);

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible', 'is-pressing');
  });

  window.addEventListener('blur', () => {
    cursor.classList.remove('is-visible', 'is-pressing');
  });

  window.addEventListener('hashchange', () => {
    cursor.style.setProperty('--cursor-x', `${lastX}px`);
    cursor.style.setProperty('--cursor-y', `${lastY}px`);
    cursor.classList.add('is-visible');
  });
})();
