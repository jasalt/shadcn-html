// -- Color Picker ---------------------------------------------
// Syncs the hex value display with the color input.

function init() {
  document.querySelectorAll('.color-picker:not([data-shadcn-init])').forEach((picker) => {
  picker.dataset.shadcnInit = '';
  const input = picker.querySelector('input[type="color"]');
  const display = picker.querySelector('.color-picker-value');
  if (!input || !display) return;

  display.textContent = input.value;
  input.addEventListener('input', () => {
    display.textContent = input.value;
  });
});
}

init();
new MutationObserver(init).observe(document, { childList: true, subtree: true });
