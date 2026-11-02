# Datastar-compatible starting point

This checkout keeps shadcn-html's vanilla components and CSS intact, with one
compatibility patch: component initialization uses `data-shadcn-init` /
`dataset.shadcnInit`, not `data-init` / `dataset.init`. The matching selectors,
documentation snippets, and maintainer instructions use the same name.

Datastar owns `data-init`: its value is an expression, not an empty marker.
Writing `data-init=""` from another library can raise `ValueRequired` during
binding and prevent unrelated Datastar behavior from initializing. Renaming
the marker avoids the collision without introducing a Datastar dependency into
the component library. Keep this patch when updating from upstream.

## Try it

Serve the repository over HTTP (for example `python3 -m http.server 3000`) and
open [`examples/datastar.html`](examples/datastar.html). It loads a pinned
Datastar Rocket bundle from a CDN; vendor that file for offline/production use.
The example combines a vanilla shadcn toggle, Datastar signals, and a CSS-only
toast using a real Datastar `data-init` expression.

Run `npm test` to check initialization markers and inline JS source snippets.
This is a source-level regression check, not a claim that every component has
been tested with every Datastar DOM patch strategy.

## Integration rules

- **Start with CSS.** Include the semantic tokens and only the component CSS
  you use. No Datastar-specific theme or CSS fork is needed. The Django
  application this integration came from vendors upstream CSS verbatim.
- **Prefer native HTML/CSS** for behavior (`<dialog>`, popovers, `<details>`,
  declarative command buttons). Load component JS only where needed.
- **Keep existing vanilla component JS.** Do not rewrite focus management,
  keyboard navigation, or ARIA behavior in Datastar just to use one runtime.
  The namespaced marker lets both libraries coexist.
- For **new application behavior**, prefer a Datastar attribute plugin when
  enhancing existing markup, or a Rocket component when creating a new widget.
  Use Rocket's `mode: 'light'` so shadcn's class-based CSS reaches its markup.
  Shadow DOM needs a separate styling/token bridge.
- **One owner per piece of state.** Vanilla JS may own a toggle's
  `aria-pressed`, for example; do not also bind it to a Datastar signal unless
  you deliberately implement synchronization. DOM attributes are not signals
  and are not automatically server-patchable state.
- **Quote string expressions.** Rocket's `html` interpolation does not add
  expression quotes: use `data-text="'${label}'"`, not
  `data-text="${label}"`. For ARIA use real strings, e.g.
  `data-attr="{'aria-expanded': $open ? 'true' : 'false'}"`; a boolean binding
  uses boolean-attribute semantics instead.

## Server rendering and DOM patches

Render stable IDs for regions Datastar patches. Component scripts already
observe child-list changes and initialize newly inserted matching elements.
The marker is runtime bookkeeping: **do not render it on the server**, and do
not clone marked nodes into a new subtree (attributes copy, listeners do not).

Morphing is not equivalent to fresh insertion. A surviving marked element may
keep listeners that captured its original children. Replacing children inside
an initialized tabs/combobox/etc. can therefore leave stale listeners even
though the marker collision is fixed. Replace the complete widget boundary
when its structure changes, or provide a component-specific lifecycle strategy;
do not strip markers from live nodes and blindly add duplicate listeners.

For feedback like a server-rendered toast, CSS plus native popover and Datastar
attributes can be enough; omit `toast.js` in that case. Give each message a new
ID when it should run `data-init` again. The example intentionally leaves the
toast open until dismissed; auto-dismiss is an application accessibility and
product decision, not part of the compatibility patch.

## Scope

No Django templates, request plugins, catalog layout, auth form adjustments,
Starbase theme bridge, or application CSS belongs in this base. Datastar remains
an optional consumer integration; shadcn-html itself stays dependency-free.
