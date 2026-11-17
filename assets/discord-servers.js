(() => {
  "use strict";

  const trigger = document.getElementById("adult-server-button");
  const dialog = document.getElementById("adult-age-gate");
  const checkbox = document.getElementById("adult-age-check");
  const confirm = document.getElementById("adult-age-confirm");
  const cancel = document.getElementById("adult-age-cancel");
  const request = document.getElementById("nsfw-request");
  const error = document.getElementById("age-gate-error");

  if (!trigger || !dialog || !checkbox || !confirm || !cancel || !request) return;

  trigger.addEventListener("click", () => {
    checkbox.checked = false;
    confirm.disabled = true;
    error.hidden = true;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else {
      dialog.setAttribute("open", "");
      checkbox.focus();
    }
  });

  checkbox.addEventListener("change", () => {
    confirm.disabled = !checkbox.checked;
    error.hidden = true;
  });

  confirm.addEventListener("click", () => {
    if (!checkbox.checked) {
      error.hidden = false;
      checkbox.focus();
      return;
    }
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    request.hidden = false;
    request.focus({ preventScroll: true });
    request.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  });

  cancel.addEventListener("click", () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    trigger.focus();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      trigger.focus();
    }
  });

  dialog.addEventListener("close", () => {
    if (request.hidden) trigger.focus();
  });
})();
