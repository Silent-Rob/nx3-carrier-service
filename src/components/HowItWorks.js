import { renderIcon, renderSectionIntro } from "../lib/render.js";

export function renderHowItWorks(data) {
  return `
    <section class="nx3-section nx3-process-section" id="${data.id}">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
          align: "center",
        })}
        <div class="nx3-process-grid">
          ${data.steps
            .map(
              (step, index) => `
                <article class="nx3-card nx3-process-card">
                  <div class="nx3-process-card__number">0${index + 1}</div>
                  <div class="nx3-card__icon">${renderIcon(step.icon)}</div>
                  <h3>${step.title}</h3>
                  <p>${step.copy}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
