document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Sprache: DE | EN, eine URL, beide Fassungen im HTML ----
  // Wie thomasmercantile.de, aber mit Deutsch als Grundsprache: Das Markup ist
  // deutsch, Englisch kommt aus data-en. Ohne gespeicherte Wahl bleibt DE stehen.
  const STORE_KEY = 'mestiere_lang';

  // Gespeichert wird nur, wenn jemand den Schalter selbst benutzt (kein Schreiben beim Laden).
  const applyLang = (lang, persist) => {
    const current = lang === 'en' ? 'en' : 'de';
    const root = document.documentElement;
    root.lang = current;
    const title = current === 'en' ? root.dataset.titleEn : root.dataset.titleDe;
    if (title) document.title = title;

    document.querySelectorAll('[data-de]').forEach((el) => {
      const value = el.dataset[current];
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-href-de]').forEach((el) => {
      const value = current === 'en' ? el.dataset.hrefEn : el.dataset.hrefDe;
      if (value !== undefined) el.setAttribute('href', value);
    });
    // Ganze Textblöcke (Rechtsseiten): <div data-lang-block="de|en">
    document.querySelectorAll('[data-lang-block]').forEach((el) => {
      el.hidden = el.dataset.langBlock !== current;
    });
    document.querySelectorAll('[data-aria-de]').forEach((el) => {
      const value = current === 'en' ? el.dataset.ariaEn : el.dataset.ariaDe;
      if (value !== undefined) el.setAttribute('aria-label', value);
    });
    document.querySelectorAll('.langtoggle button').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.lang === current ? 'true' : 'false');
    });

    if (persist) {
      try { localStorage.setItem(STORE_KEY, current); } catch (e) { /* Speicher gesperrt */ }
    }
  };

  const toggle = document.querySelector('.langtoggle');
  if (toggle) {
    toggle.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => applyLang(b.dataset.lang, true));
    });

    let initial = 'de';
    try { initial = localStorage.getItem(STORE_KEY) || 'de'; } catch (e) { /* Speicher gesperrt */ }
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'de') initial = fromUrl;
    applyLang(initial, false);
  }

  // ---- Sanftes Einblenden ----
  const items = document.querySelectorAll('[data-reveal]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  items.forEach((el) => io.observe(el));
});
