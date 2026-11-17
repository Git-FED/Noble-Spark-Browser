# Static deployment notes

This package is a static site. It has no build step, server, database, API, or Manus hosting configuration. The payment and community integrations are browser-side links/widgets.

## GitHub Pages

1. Copy the package contents into the repository’s published root (or make these files the contents of the Pages build artifact).
2. Commit and push the files using your usual Git workflow.
3. In repository Settings → Pages, select the branch/folder or GitHub Actions workflow that publishes the repository root.
4. Confirm the root `index.html` is published and that `assets/` remains beside it.
5. Test `index.html`, `404.html`, internal `.html` links, favicon, responsive layout, and the Discord/payment widgets over HTTPS.

The links are relative, so a repository path such as `/project-name/` is supported when the package remains intact. Do not point a Pages source at only the `docs/` folder: the complete published folder here is the intended root.

## Cloudflare Pages

1. Create or select a Pages project connected to the repository.
2. Set the build command to none/blank and the output directory to the package root (the folder containing `index.html`).
3. Deploy. Cloudflare Pages serves `index.html` and `404.html` automatically and honors the `_headers` file.
4. If using Wrangler Pages deployment, upload this folder as the static output directory. A Worker script is not needed unless you separately choose to add server-side behavior.

## Before publishing payment pages

- Confirm PayPal plan `P-4FD24238VX4902214NK2XP2Y`, Stripe Buy Button ID, and all provider account settings are active and point to the desired success/return destinations.
- In Stripe’s dashboard, configure `thank-you.html` as the return/success page if the chosen Buy Button configuration supports a custom return URL.
- Confirm the GitHub Sponsors page and donation links are still controlled by the intended account.
- Review each provider’s current terms, regional eligibility, and required disclosure language.
- The 18+ gate here is session-only self-attestation. It does not verify age and is not a substitute for required provider/legal controls.
- Keep real private API secrets out of frontend files. The included public checkout identifiers are the ones supplied by the project owner.

## Local preview

Opening the HTML files directly works for the visual design, but browsers may block third-party scripts/widgets on `file://`. If Python 3 is available, from this folder run:

```bash
python3 -m http.server 8000
```

Then open the local `index.html` page at `http://localhost:8000/`. Stop the temporary server with Ctrl+C.
