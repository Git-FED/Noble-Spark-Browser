# Unlocked Browser — Nocturne Flow static-site bundle

A complete local-first static site bundle for the Unlocked Browser project. It includes a distinctive dark animated background, five original comic-style promo illustrations, an abstract symbol favicon plus SVG logo marks, a seamless animated GIF, real HTML destinations, a centered Discord widget, an advisory age gate for payment options, and deployment notes for GitHub Pages and Cloudflare Pages.

**No hosted site or Manus URL is created by this package.** It is plain HTML, CSS, JavaScript, SVG, WebP, and GIF. There is no build step or server requirement.

## Quick preview

Open `index.html` in a modern browser, or serve the package directory over a local static server. Some browser security features and third-party widgets work best from `http://localhost` rather than `file://`.

## File tree

```text
Unlocked-browser-dark-background/
├── index.html
├── support.html
├── donations.html
├── subscriptions.html
├── community-invite.html
├── discord-servers.html
├── age-confirmed.html
├── thank-you.html
├── leave.html
├── responsible-use.html
├── privacy.html
├── terms.html
├── 404.html
├── _headers
├── .nojekyll
├── .gitignore
├── README.md
├── DEPLOYMENT.md
├── assets/
│   ├── favicon.svg                 # abstract symbol; not a letter
│   ├── brand-mark.svg
│   ├── brand-lockup.svg
│   ├── site.css
│   ├── site.js
│   ├── flow-background.css
│   ├── flow-background.js
│   ├── payment-gate.js
│   ├── discord-servers.js
│   ├── discord-servers.css
│   └── art/
│       ├── hero-comic-banner.webp
│       ├── community-comic-card.webp
│       ├── support-comic-card.webp
│       ├── thankyou-comic-banner.webp
│       ├── tester-comic-card.webp
│       ├── signal-still.webp
│       └── signal-loop.gif
├── tools/
│   └── create_signal_loop.py
└── docs/
    └── ANTI-BLOCK.md
```

## Visual direction and effects

The background uses an original procedural Canvas animation: open, sweeping contours in deep charcoal, teal, and restrained violet. It is **not orbital**: no orbit paths, planets, rings, or starfield. The home page also has a seamless promo GIF, an infinitely looping scrolling header ticker, hover treatments, and reveal-on-scroll effects. Animations respect `prefers-reduced-motion`; the animated background pauses when a browser tab is hidden, and a static still replaces the GIF when reduced motion is requested. The favicon is an abstract fractured-ribbon symbol, not a letter.

The five comic-style promotional illustrations are original generated images, optimized as WebP for faster page loads. Headlines, labels, links, and navigation remain editable HTML. Two SVG brand files are included. No external font, stock-image URL, tracking pixel, or Ko-fi floating widget is included.

## Pages and working destinations

- `index.html` — project landing page.
- `support.html` — links to recurring subscriptions and one-time donations.
- `subscriptions.html` — PayPal subscription, Stripe buy button, and GitHub Sponsors.
- `donations.html` — Buy Me a Coffee, NOWPayments, and GitHub Sponsors.
- `community-invite.html` — responsive centered Discord widget, server-list link, and GitFed Substack signup.
- `discord-servers.html` — GitHub Coding and MuseAi invite buttons; the 18+ Patreon/NSFW option asks the visitor to email `museai@fedpromptly.com` after checkbox confirmation. It does not redirect to or expose the NSFW invite.
- `age-confirmed.html` — confirmation landing page; returns to the selected payment HTML page.
- `thank-you.html` and `leave.html` — local HTML destinations for success/decline flows.
- `responsible-use.html`, `privacy.html`, and `terms.html` — readable project guidance pages.
- `404.html` — static-hosting not-found page with working internal links.

Internal navigation targets real `.html` files. Checkout controls go to provider checkout pages/widgets; the providers handle payment and their terms. Stripe’s success/return URL is controlled in Stripe settings; this bundle includes `thank-you.html` as the local destination to select there.

## Advisory age gate

Both payment pages start with a self-attested 18+ confirmation and do not load provider payment widgets until confirmation. The choice is saved in `sessionStorage` for the current browser session. Declining leads to `leave.html`; confirming leads to `age-confirmed.html`, then to the selected payment page.

This is **only a front-end advisory gate**, not identity verification or legal-age verification. Client-side state can be changed and this gate does not replace payment-provider eligibility or legal compliance controls. Provider scripts/iframes are loaded only after local confirmation. See `privacy.html` and `terms.html`.

## Deployment

This folder is the static site root. Upload the files and folders without flattening the directory structure.

**GitHub Pages:** publish from the repository root (or deploy the contents of this folder as the published artifact). Relative links work under a repository subpath. GitHub Pages ignores the optional Cloudflare `_headers` file; it is harmless there. `.nojekyll` asks GitHub Pages to publish files unchanged.

**Cloudflare Pages:** use this folder as the build output directory, with no build command required. `_headers` applies basic response headers. If deploying through Wrangler, point the Pages/static-assets directory to this folder; a Worker runtime is not required for this static site.

Read [DEPLOYMENT.md](DEPLOYMENT.md) for setup steps. The community/payment/newsletter providers require network access; their widgets may not work from a direct `file://` open.

## Safety and external-service notes

The payment IDs and embed details on the subscription page use the values supplied in the project brief. They are present in frontend source; public checkout identifiers are intended for client-side use, but verify the checkout configuration, return page, account ownership, and compliance in each provider dashboard before publishing. The PayPal approval return goes to `thank-you.html`; receipts, payment status, renewals, and cancellations remain with the provider.

The project remains authorization-first. It does not defeat CAPTCHAs, access controls, rate limits, bot protections, or account security. Read `responsible-use.html` and `docs/ANTI-BLOCK.md` before using any browser-automation code.

The optional GIF source script is `tools/create_signal_loop.py`; rerunning it requires Pillow (`python3 -m pip install Pillow`). The finished GIF is included already, so Pillow is not needed to deploy or preview the site.
