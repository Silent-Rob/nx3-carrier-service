import { renderIcon, renderSectionIntro } from "../lib/render.js";

export function renderBenefitsGrid(data) {
  return `
    <section class="nx3-section nx3-benefits-section" id="${data.id}">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-card-grid nx3-card-grid--benefits">
          ${data.items
            .map(
              (item) => `
                <article class="nx3-card nx3-benefit-card">
                  <div class="nx3-card__icon">${renderIcon(item.icon)}</div>
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                  <ul class="nx3-mini-list">
                    ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
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
