// -- Navigation Menu -----------------------------------------
// CSS anchor positioning for dropdown navigation menus.

function init() {
  document.querySelectorAll('.nav-menu:not([data-shadcn-init])').forEach((nav) => {
  nav.dataset.shadcnInit = '';
  nav.querySelectorAll('.nav-menu-trigger[popovertarget]').forEach((trigger) => {
    const id = trigger.getAttribute('popovertarget');
    const content = document.getElementById(id);
    if (!content) return;

    // CSS anchor positioning - unique name per trigger-content pair
    const anchorId = `--nav-menu-${id}`;
    trigger.style.anchorName = anchorId;
    content.style.positionAnchor = anchorId;
  });
});
}

init();
new MutationObserver(init).observe(document, { childList: true, subtree: true });
