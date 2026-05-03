import { renderIcon, renderSectionIntro } from "../lib/render.js";

export function renderAudienceSplit(data) {
  return `
    <section class="nx3-section nx3-audience-section" id="${data.id}">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-audience-grid">
          ${data.items
            .map(
              (item) => `
                <article class="nx3-card nx3-audience-card">
                  <div class="nx3-card__icon">${renderIcon(item.icon)}</div>
                  <span class="nx3-card-label">${item.label}</span>
                  <h3>${item.title}</h3>
                  <p>${item.copy}</p>
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
