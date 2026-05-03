import { renderIcon, renderSectionIntro, renderTagRow } from "../lib/render.js";

export function renderTrustBar(data) {
  return `
    <section class="nx3-section nx3-trust-bar">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-trust-bar__grid">
          ${data.trustItems
            .map(
              (item) => `
                <article class="nx3-card nx3-trust-card">
                  <div class="nx3-card__icon">${renderIcon(item.icon)}</div>
                  <h3>${item.title}</h3>
                  <p>${item.copy}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="nx3-trust-bar__roles">
          <span class="nx3-card-label">Relevante Rollen</span>
          ${renderTagRow(data.roles)}
        </div>
      </div>
    </section>
  `;
}
