// -- Avatar ---------------------------------------------------
// Hides broken avatar images and shows the fallback.

function init() {
  document.querySelectorAll('.avatar-image:not([data-shadcn-init])').forEach((img) => {
  img.dataset.shadcnInit = '';
  img.addEventListener('error', () => {
    img.setAttribute('data-error', '');
    img.style.display = 'none';
  });
});
}

init();
new MutationObserver(init).observe(document, { childList: true, subtree: true });
