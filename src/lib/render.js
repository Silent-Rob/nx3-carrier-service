const icons = {
  alert: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path>
    </svg>
  `,
  arrow: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14"></path>
      <path d="m13 5 7 7-7 7"></path>
    </svg>
  `,
  check: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m20 6-11 11-5-5"></path>
    </svg>
  `,
  clock: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <path d="M12 7v5l3 3"></path>
    </svg>
  `,
  database: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="7" ry="3"></ellipse>
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"></path>
      <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"></path>
    </svg>
  `,
  factory: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 21h18"></path>
      <path d="M5 21V8l5 3V8l5 3V4l4 2v15"></path>
    </svg>
  `,
  file: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <path d="M14 2v6h6"></path>
      <path d="M8 13h8"></path>
      <path d="M8 17h5"></path>
    </svg>
  `,
  layers: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12 3 9 4.5-9 4.5L3 7.5 12 3Z"></path>
      <path d="m3 12 9 4.5 9-4.5"></path>
      <path d="m3 16.5 9 4.5 9-4.5"></path>
    </svg>
  `,
  network: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="7" height="6" rx="1.5"></rect>
      <rect x="14" y="4" width="7" height="6" rx="1.5"></rect>
      <rect x="8.5" y="14" width="7" height="6" rx="1.5"></rect>
      <path d="M6.5 10v2.5h11V10"></path>
      <path d="M12 12.5V14"></path>
    </svg>
  `,
  radar: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 12 18 6"></path>
      <circle cx="18" cy="6" r="1.25" fill="currentColor" stroke="none"></circle>
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3 5 6v6c0 5 3.4 8.5 7 9 3.6-.5 7-4 7-9V6l-7-3Z"></path>
      <path d="m9.5 12 2 2 4-4"></path>
    </svg>
  `,
  spark: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12 3 1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3Z"></path>
      <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"></path>
    </svg>
  `,
  truck: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 7h11v8H3z"></path>
      <path d="M14 10h3l3 3v2h-6z"></path>
      <circle cx="7.5" cy="18" r="2"></circle>
      <circle cx="17.5" cy="18" r="2"></circle>
    </svg>
  `,
};

export function renderIcon(name) {
  return `<span class="nx3-icon" aria-hidden="true">${icons[name] || icons.spark}</span>`;
}

export function renderButton(cta, extraClass = "") {
  const variant = cta.variant ? `nx3-button--${cta.variant}` : "nx3-button--primary";
  const classes = ["nx3-button", variant, extraClass].filter(Boolean).join(" ");
  return `
    <a class="${classes}" href="${cta.href}">
      <span>${cta.label}</span>
      ${cta.showArrow ? renderIcon("arrow") : ""}
    </a>
  `;
}

export function renderSectionIntro({ eyebrow, headline, intro, align = "left" }) {
  return `
    <div class="nx3-section-intro nx3-section-intro--${align}">
      ${eyebrow ? `<p class="nx3-eyebrow">${eyebrow}</p>` : ""}
      ${headline ? `<h2 class="nx3-section-title">${headline}</h2>` : ""}
      ${intro ? `<p class="nx3-section-copy">${intro}</p>` : ""}
    </div>
  `;
}

export function renderChecklist(items, tone = "default") {
  return `
    <ul class="nx3-check-list nx3-check-list--${tone}">
      ${items
        .map(
          (item) => `
            <li>
              ${renderIcon("check")}
              <span>${item}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

export function renderInlineMeta(items) {
  return `
    <ul class="nx3-inline-meta">
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

export function renderTagRow(items) {
  return `
    <div class="nx3-tag-row">
      ${items.map((item) => `<span class="nx3-tag">${item}</span>`).join("")}
    </div>
  `;
}
