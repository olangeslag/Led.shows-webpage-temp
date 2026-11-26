/* =====================================================================
   DJ OLAF / LED.SHOWS — SCRIPT
     1. Mobile menu
     2. Flip card (click/tap card, side switch, swipe)
     3. Contact form (pre-select type, temporary message)
     4. Scroll fade-in
     5. Year in footer
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MOBILE MENU ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- 2. FLIP CARD ---------- */
  const flip = document.querySelector('.flip');
  if (flip) {
    const buttons = document.querySelectorAll('.switch button');
    const panels  = document.querySelectorAll('[data-panel]');
    let side = 'dj';                       // start side: 'dj' or 'led'

    const show = s => {
      side = s;
      flip.classList.toggle('is-flipped', s === 'led');
      buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.side === s));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === s));
    };
    const other = () => show(side === 'dj' ? 'led' : 'dj');

    flip.addEventListener('click', other);                       // click/tap card
    flip.addEventListener('keydown', e => {                      // Enter/space
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); other(); }
    });
    buttons.forEach(b => b.addEventListener('click', () => show(b.dataset.side)));

    let startX = null;                                           // swipe
    flip.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    flip.addEventListener('touchend', e => {
      if (startX !== null && Math.abs(e.changedTouches[0].clientX - startX) > 50) other();
      startX = null;
    });

    show('dj');
  }

  /* ---------- 3. CONTACT FORM ----------
     contact.html?type=led pre-selects "LED-show".
     The form is not connected yet; replace the submit handler
     (or set action="https://formspree.io/f/XXXX") when ready.   */
  const form = document.querySelector('.form');
  if (form) {
    const type = new URLSearchParams(location.search).get('type');
    const select = form.querySelector('#type');
    if (type && select && [...select.options].some(o => o.value === type)) select.value = type;
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelector('.form__msg').textContent =
        'Bedankt! Het formulier is nog niet gekoppeld — stuur voorlopig een DM via Instagram @led.shows.';
    });
  }

  /* ---------- 4. SCROLL FADE-IN ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: .12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- 5. YEAR ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
