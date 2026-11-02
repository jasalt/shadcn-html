// -- Popover --------------------------------------------------
// CSS anchor positioning for popover components.

function init() {
  document.querySelectorAll('[popovertarget]:not([data-shadcn-init])').forEach((trigger) => {
  trigger.dataset.shadcnInit = '';
  const id = trigger.getAttribute('popovertarget');
  const popover = document.getElementById(id);
  if (!popover || !popover.classList.contains('popover')) return;

  // CSS anchor positioning - unique name per trigger-popover pair
  const anchorId = `--popover-${id}`;
  trigger.style.anchorName = anchorId;
  popover.style.positionAnchor = anchorId;
});
}

init();
new MutationObserver(init).observe(document, { childList: true, subtree: true });
