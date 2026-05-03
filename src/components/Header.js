import { renderButton } from "../lib/render.js";

export function renderHeader(data) {
  return `
    <header class="nx3-header" data-nx3-header>
      <div class="nx3-shell nx3-header__inner">
        <a class="nx3-brand" href="#top" aria-label="NX3 Carrier Service">
          <span class="nx3-brand__mark">${data.brand.name}</span>
          <span class="nx3-brand__subline">${data.brand.subline}</span>
        </a>
        <button
          class="nx3-nav-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="nx3-primary-navigation"
          data-nx3-nav-toggle
        >
          Menü
        </button>
        <nav class="nx3-nav" id="nx3-primary-navigation" data-nx3-nav>
          ${data.navItems
            .map((item) => `<a class="nx3-nav__link" href="${item.href}">${item.label}</a>`)
            .join("")}
        </nav>
        <div class="nx3-header__cta">
          ${renderButton(data.primaryCta)}
        </div>
      </div>
    </header>
  `;
}

export function initHeader(root) {
  const header = root.querySelector("[data-nx3-header]");
  const toggle = root.querySelector("[data-nx3-nav-toggle]");
  const nav = root.querySelector("[data-nx3-nav]");

  if (!header || !toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}
