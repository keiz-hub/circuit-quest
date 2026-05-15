window.CQUI = (() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  function screen(id) {
    $$('.screen').forEach((el) => el.classList.remove('active'));
    $(id).classList.add('active');
  }

  function toast(message, type = '') {
    const root = $('#toast');
    const item = document.createElement('div');
    item.className = `toast ${type}`.trim();
    item.textContent = message;
    root.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  function setSoundLabels(enabled) {
    const text = enabled ? 'Sound: On' : 'Sound: Off';
    const menu = $('#sound-toggle-menu');
    const game = $('#sound-toggle-game');
    if (menu) menu.textContent = text;
    if (game) game.textContent = text;
  }

  function confirm({ title, message, onConfirm }) {
    const root = $('#confirm');
    $('#confirm-title').textContent = title;
    $('#confirm-message').textContent = message;
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    const ok = $('#confirm-ok');
    const cancel = $('#confirm-cancel');
    const cleanup = () => {
      root.classList.remove('open');
      root.setAttribute('aria-hidden', 'true');
      ok.onclick = null;
      cancel.onclick = null;
    };
    ok.onclick = () => { cleanup(); onConfirm?.(); };
    cancel.onclick = cleanup;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  return { $, $$, screen, toast, setSoundLabels, confirm, escapeHtml };
})();
