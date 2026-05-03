import { renderIcon, renderSectionIntro } from "../lib/render.js";

export function renderFeatureCards(data) {
  return `
    <section class="nx3-section nx3-feature-section">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-feature-mosaic">
          ${data.items
            .map(
              (item) => `
                <article class="nx3-card nx3-feature-card" data-size="${item.size}">
                  <div class="nx3-card__icon">${renderIcon(item.icon)}</div>
                  <span class="nx3-card-label">${item.label}</span>
                  <h3>${item.title}</h3>
                  <p>${item.copy}</p>
                  <ul class="nx3-mini-list">
                    ${item.facts.map((fact) => `<li>${fact}</li>`).join("")}
                  </ul>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
