// -- Sheet ----------------------------------------------------
// Wires [data-sheet-trigger] buttons to <dialog class="sheet"> elements.

function init() {
document.querySelectorAll('[data-sheet-trigger]:not([data-shadcn-init])').forEach((trigger) => {
  trigger.dataset.shadcnInit = '';
  const sheet = document.getElementById(trigger.dataset.sheetTrigger);
  if (!sheet) return;
  trigger.addEventListener('click', () => {
    sheet._trigger = trigger;
    sheet.showModal();
  });
});
document.querySelectorAll('dialog.sheet:not([data-shadcn-init])').forEach((sheet) => {
  sheet.dataset.shadcnInit = '';
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) sheet.close();
  });
  sheet.querySelectorAll('[data-sheet-close]').forEach((btn) => {
    btn.addEventListener('click', () => { sheet.close(); });
  });
  sheet.addEventListener('close', () => {
    if (sheet._trigger) sheet._trigger.focus();
  });
});
}

init();
new MutationObserver(init).observe(document, { childList: true, subtree: true });
