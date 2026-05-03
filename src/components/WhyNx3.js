import { renderSectionIntro } from "../lib/render.js";

export function renderWhyNx3(data) {
  return `
    <section class="nx3-section nx3-why-section">
      <div class="nx3-shell">
        ${renderSectionIntro({
          eyebrow: data.eyebrow,
          headline: data.headline,
          intro: data.intro,
        })}
        <div class="nx3-card-grid nx3-card-grid--why">
          ${data.items
            .map(
              (item) => `
                <article class="nx3-card nx3-why-card">
                  <h3>${item.title}</h3>
                  <div class="nx3-why-card__compare">
                    <div>
                      <span class="nx3-card-label">Manuell</span>
                      <p>${item.manual}</p>
                    </div>
                    <div>
                      <span class="nx3-card-label">NX3</span>
                      <p>${item.nx3}</p>
                    </div>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
