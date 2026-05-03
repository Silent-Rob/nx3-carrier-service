import { renderIcon, renderSectionIntro } from "../lib/render.js";

export function renderPainCards(data) {
  return `
    <section class="nx3-section nx3-pain-section">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-card-grid nx3-card-grid--pain">
          ${data.cards
            .map(
              (card) => `
                <article class="nx3-card nx3-pain-card">
                  <div class="nx3-card__icon nx3-card__icon--alert">${renderIcon(card.icon)}</div>
                  <h3>${card.title}</h3>
                  <p>${card.copy}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
