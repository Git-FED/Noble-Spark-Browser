(() => {
  "use strict";
  const key = "unlockedBrowserAgeConfirmed18";
  const gate = document.querySelector("[data-age-gate]");
  const protectedArea = document.querySelector("[data-payment-options]");
  if (!gate || !protectedArea) return;

  const allowed = sessionStorage.getItem(key) === "yes";
  gate.hidden = allowed;
  protectedArea.hidden = !allowed;
  if (!allowed) return;

  const page = document.body.dataset.paymentPage;
  if (page === "subscriptions") {
    mountPayPal();
    mountStripe();
  }
  mountGitHubSponsors();

  function addScript(src, onload, onerror) {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = onload;
    script.onerror = onerror || (() => {});
    document.head.appendChild(script);
    return script;
  }

  function mountPayPal() {
    const target = document.getElementById("paypal-button-container-P-4FD24238VX4902214NK2XP2Y");
    const status = document.getElementById("paypal-status");
    if (!target) return;
    const src = "https://www.paypal.com/sdk/js?client-id=BAA_ndqaWMyQwTnDZ0LXwLQ22jdJo9uxkeXYqmBbF-hD41HMiZ83mvOcx1Kti0b6ZfXfje7Q1ievNaS8Ok&vault=true&intent=subscription";
    addScript(src, () => {
      if (!window.paypal) { if (status) status.textContent = "PayPal checkout did not initialize. You can return to the support page."; return; }
      window.paypal.Buttons({
        style: { shape: "rect", color: "gold", layout: "vertical", label: "subscribe" },
        createSubscription: (data, actions) => actions.subscription.create({ plan_id: "P-4FD24238VX4902214NK2XP2Y", quantity: 1 }),
        onApprove: () => { window.location.href = "thank-you.html?source=paypal"; },
        onError: () => { if (status) status.textContent = "PayPal could not open. Refresh this page or return to support options."; }
      }).render("#paypal-button-container-P-4FD24238VX4902214NK2XP2Y");
    }, () => { if (status) status.textContent = "PayPal could not load. Refresh this page or return to support options."; });
  }

  function mountStripe() {
    const target = document.getElementById("stripe-buy-button-slot");
    const status = document.getElementById("stripe-status");
    if (!target) return;
    addScript("https://js.stripe.com/v3/buy-button.js", () => {
      const button = document.createElement("stripe-buy-button");
      button.setAttribute("buy-button-id", "buy_btn_1UJKaaJaRf233kfWKZ81fcIe");
      button.setAttribute("publishable-key", "pk_live_51UIdAGJaRf233kfWlFacR31IYVGdjCVAttNFzIgQGXQzrUdc894iJcBqamRZNwF11z2AN5kvjyzitor462f2egVI00UmKj0sd8");
      target.replaceChildren(button);
    }, () => { if (status) status.textContent = "Stripe checkout could not load. Return to support options or try again later."; });
  }

  function mountGitHubSponsors() {
    document.querySelectorAll("[data-github-sponsor]").forEach((slot) => {
      if (slot.dataset.mounted) return;
      const frame = document.createElement("iframe");
      frame.src = "https://github.com/sponsors/Git-FED/button";
      frame.title = "Sponsor Git-FED on GitHub";
      frame.width = "114";
      frame.height = "32";
      frame.loading = "lazy";
      frame.style.cssText = "display:block;width:114px;height:32px;max-width:100%;border:0;border-radius:6px;background:transparent";
      slot.replaceChildren(frame);
      slot.dataset.mounted = "true";
    });
  }
})();
